const statsInfoEl = document.querySelector('.stats-info')
const footerLinksEl = document.querySelector('.footer-main-links')
const linksContainerEl = document.querySelector('.link-container-links')
const toggleBtn = document.querySelector('.navbar-mobile-toggle')

const statsInfoArr = [
	{
		icon: '/images/icon-brand-recognition.svg',
		title: 'Brand Recognition',
		info: 'Boost your brand recognition with each click. Generic links don’t mean a thing. Branded links help instil confidence in your content.',
	},
	{
		icon: '/images/icon-detailed-records.svg',
		title: 'Detailed Records',
		info: 'Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform better decisions.',
	},
	{
		icon: '/images/icon-fully-customizable.svg',
		title: 'Fully Customizable',
		info: 'Improve brand awareness and content discoverability through customizable links, supercharging audience engagement.',
	},
]

const footerLinksArr = [
	['Features', 'Link Shortening', 'Branded Links', 'Analytics'],
	,
	['Resources', 'Blog', 'Developers', 'Support'],
	,
	['Company', 'About', 'Our Team', 'Careers', 'Contact'],
]

// create link
let linkInputVal = document.getElementById('link-input')

const addLinkToLocalStorage = (link, shortLink) => {
	// check if locally saved links exists
	const shortLinks = JSON.parse(localStorage.getItem('short-links'))

	if (!shortLinks) {
		localStorage.setItem(
			'short-links',
			JSON.stringify([
				{
					link,
					shortLink,
					id: !shortLinks ? 0 : shortLinks.length + 1,
				},
			])
		)

		return
	}
	shortLinks.push({
		link,
		shortLink,
		id: shortLinks.length + 1,
	})

	localStorage.setItem('short-links', JSON.stringify(shortLinks))
}

const createLink = (link, shortLink) => {
	const linkEl = document.createElement('li')
	const linkTitle = document.createElement('h4')
	const linkDivider = document.createElement('div')
	const linkCopyDivEl = document.createElement('div')
	const linkCopyRightDivEl = document.createElement('div')
	const linkHrefEl = document.createElement('a')
	const linkCopyBtn = document.createElement('button')
	const linkDelBtn = document.createElement('button')

	linkDivider.classList.add('line')
	linkCopyDivEl.classList.add('copy')
	linkCopyRightDivEl.classList.add('copy-right')
	linkCopyBtn.classList.add('copy-btn')
	linkDelBtn.classList.add('del-btn')

	linkTitle.innerHTML = link
	linkHrefEl.innerHTML = shortLink
	linkHrefEl.href = shortLink
	linkHrefEl.target = '_blank'
	linkCopyBtn.innerHTML = 'Copy'
	linkDelBtn.innerHTML = `	<svg
	xmlns="http://www.w3.org/2000/svg"
	width="32"
	height="32"
	viewBox="0 0 24 24"
	fill="none">
	<path
		d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"
		stroke="#F46363"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"></path>
</svg>`

	linkCopyRightDivEl.append(...[linkCopyBtn, linkDelBtn])
	linkCopyDivEl.append(...[linkHrefEl, linkCopyRightDivEl])

	linkEl.append(...[linkTitle, linkDivider, linkCopyDivEl])

	linksContainerEl.appendChild(linkEl)

	const handleCopyLink = () => {
		if (linkCopyBtn.innerHTML === 'Copy') {
			navigator.clipboard.writeText(shortLink)
			linkCopyBtn.innerHTML = 'Copied!'
			linkCopyBtn.style.backgroundColor = '#3A3054'
		}

		setTimeout(() => {
			linkCopyBtn.innerHTML = 'Copy'
			linkCopyBtn.style.backgroundColor = ''
		}, 1000)
	}

	const handleDeleteLink = () => {
		const shortLinks = JSON.parse(localStorage.getItem('short-links'))

		gsap.to(linkEl, {
			maxHeight: 0,
			padding: 0,
			marginTop: 0,
			ease: 'power4.out',
			duration: 0.5,
			onComplete: () => {
				localStorage.setItem(
					'short-links',
					JSON.stringify(shortLinks.filter((link) => link.shortLink !== shortLink))
				)
				linkEl.remove()
			},
		})
	}

	linkCopyBtn.addEventListener('click', handleCopyLink)
	linkDelBtn.addEventListener('click', handleDeleteLink)

	if (linkInputVal.value) {
		gsap.fromTo(
			linkEl,
			{
				y: -25,
				opacity: 0,
			},
			{
				y: 0,
				ease: 'power3.out',
				duration: 0.5,
				opacity: 1,
			}
		)
	}
}

// API for shortening input link

const linkForm = document.querySelector('#link-form')
const errorMsg = linkForm.querySelector('p')

const fetchShortLink = async () => {
	const span = document.querySelector('.link-container span')
	const spinner = document.querySelector('.link-container .spinner')

	try {
		span.style.opacity = 0
		spinner.style.opacity = 1

		await fetch('https://tiny.cc/tiny/api/3/urls', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization:
					'Basic ' + 'aXlrZWtlbHZpbnM6N2FlM2IwOGQtNDU1NC00OGEwLWEzZTEtZDU4NWEyMzVmMzcx',
			},
			body: JSON.stringify({
				urls: [
					{
						long_url: linkInputVal.value,
					},
				],
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				const shortLink = data.urls[0].short_url_with_protocol
				const err = data.urls[0].error.message

				if (err !== '') {
					linkInputVal.classList.add('error')
					errorMsg.style.opacity = 1
					errorMsg.innerHTML = err
					linkForm.style.gap = '40px'
				} else {
					let newInputVal = !linkInputVal.value.includes('http')
						? `https://${linkInputVal.value}`
						: linkInputVal.value

					createLink(newInputVal, shortLink)
					addLinkToLocalStorage(newInputVal, shortLink)

					linkInputVal.classList.remove('error')
					errorMsg.style.opacity = 0
					linkForm.style.gap = ''
					linkInputVal.value = ''
				}

				span.style.opacity = 1
				spinner.style.opacity = 0
			})
	} catch (error) {
		console.log(error)

		span.style.opacity = 1
		spinner.style.opacity = 0
	}
}

const handleLinkSubmit = (e) => {
	e.preventDefault()

	if (linkInputVal.value === '') {
		linkInputVal.classList.add('error')
		errorMsg.style.opacity = 1
		errorMsg.innerHTML = 'Please add a link'
		linkForm.style.gap = '40px'
		return
	}

	fetchShortLink()
	linkInputVal.classList.remove('error')
	errorMsg.style.opacity = 0
	linkForm.style.gap = ''
}

linkForm.addEventListener('submit', handleLinkSubmit)

let isOpen

const tl = gsap.timeline({ paused: true })

const toggleMobileMenu = () => {
	const mobileMenu = document.querySelector('.navbar-mobile')
	const links = mobileMenu.querySelectorAll('li')
	const btns = mobileMenu.querySelectorAll('button')

	const line1 = toggleBtn.querySelector('.line-1')
	const line2 = toggleBtn.querySelector('.line-2')
	const line3 = toggleBtn.querySelector('.line-3')

	tl.to(line1, {
		display: 'none',
		duration: 0.2,
		ease: 'power3',
	})
		.to(line2, {
			rotate: '45deg',
			duration: 0.2,
			ease: 'power3',
		})
		.to(
			line3,
			{
				rotate: '-45deg',
				marginTop: '-7px',
				duration: 0.2,
				ease: 'power3',
			},
			'-=0.25'
		)
		.to(
			mobileMenu,
			{
				scale: 1,
				duration: 0.5,
				ease: 'power4.inOut',
			},
			'-=0.25'
		)
		.to([links, btns], {
			y: 0,
			opacity: 1,
			stagger: 0.1,
			ease: 'power3',
			delay: -0.15,
		})

	if (!isOpen) {
		tl.play()
		isOpen = true
	} else {
		tl.reverse()
		isOpen = undefined
	}
}

toggleBtn.addEventListener('click', toggleMobileMenu)

window.onload = () => {
	const shortLinks = JSON.parse(localStorage.getItem('short-links'))
	const mobileMenuLinks = document.querySelectorAll('.navbar-mobile li')
	const mobileMenuBtns = document.querySelectorAll('.navbar-mobile button')

	mobileMenuLinks.forEach((link) => {
		link.addEventListener('click', toggleMobileMenu)
	})

	mobileMenuBtns.forEach((link) => {
		link.addEventListener('click', toggleMobileMenu)
	})

	if (shortLinks) {
		shortLinks.forEach((_shortLink) => {
			const { link, shortLink } = _shortLink

			createLink(link, shortLink)
		})
	}
	statsInfoArr.forEach((info) => {
		const itemEl = document.createElement('li')
		const iconContainerEl = document.createElement('div')
		const iconEl = document.createElement('img')
		const titleEl = document.createElement('h4')
		const infoEl = document.createElement('p')

		iconEl.src = info.icon
		titleEl.innerHTML = info.title
		infoEl.innerHTML = info.info

		iconContainerEl.appendChild(iconEl)

		itemEl.append(...[iconContainerEl, titleEl, infoEl])

		statsInfoEl.appendChild(itemEl)
	})

	footerLinksArr.forEach((links) => {
		const parentLinksUl = document.createElement('ul')

		const titleLi = document.createElement('li')
		titleLi.innerHTML = links[0]

		parentLinksUl.appendChild(titleLi)

		links.slice(1).forEach((link) => {
			const childLinkLi = document.createElement('li')
			const childLink = document.createElement('a')

			childLink.innerHTML = link
			childLink.href = '#'
			childLinkLi.appendChild(childLink)

			parentLinksUl.appendChild(childLinkLi)
		})

		footerLinksEl.appendChild(parentLinksUl)
	})
}
