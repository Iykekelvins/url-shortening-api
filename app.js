const statsInfoEl = document.querySelector('.stats-info')
const footerLinksEl = document.querySelector('.footer-main-links')

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
