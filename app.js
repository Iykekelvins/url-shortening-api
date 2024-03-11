const statsInfoEl = document.querySelector('.stats-info')
const footerLinksEl = document.querySelector('.footer-main-links')
const linksContainerEl = document.querySelector('.link-container-links')

// links saved locally

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
	const linkHrefEl = document.createElement('a')
	const linkCopyBtn = document.createElement('button')

	linkDivider.classList.add('line')
	linkCopyDivEl.classList.add('copy')

	linkTitle.innerHTML = link
	linkHrefEl.innerHTML = shortLink
	linkHrefEl.href = shortLink
	linkHrefEl.target = '_blank'
	linkCopyBtn.innerHTML = 'Copy'

	linkCopyDivEl.append(...[linkHrefEl, linkCopyBtn])

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

	linkCopyBtn.addEventListener('click', handleCopyLink)

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
const fetchShortLink = async () => {
	try {
		// const response = await fetch('https://cleanuri.com/api/v1/shorten', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({
		// 		url: linkInputVal.value,
		// 	}),
		// })

		// if(response.ok)

		createLink(linkInputVal.value, 'https://rel.ink/k4lKyk')
		addLinkToLocalStorage(linkInputVal.value, 'https://rel.ink/k4lKyk')
	} catch (error) {
		console.log(error)
	}
}

const linkForm = document.querySelector('#link-form')

const handleLinkSubmit = (e) => {
	e.preventDefault()

	const errorMsg = linkForm.querySelector('p')

	if (linkInputVal.value === '') {
		linkInputVal.classList.add('error')
		errorMsg.style.opacity = 1
		linkForm.style.gap = '40px'
		return
	}

	fetchShortLink()
	linkInputVal.value = ''
	linkInputVal.classList.remove('error')
	errorMsg.style.opacity = 0
	linkForm.style.gap = ''
}

linkForm.addEventListener('submit', handleLinkSubmit)

window.onload = () => {
	const shortLinks = JSON.parse(localStorage.getItem('short-links'))

	if (shortLinks) {
		shortLinks.forEach((_shortLink) => {
			const { link, shortLink, id } = _shortLink

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
