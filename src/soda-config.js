import sodajs from 'sodajs'

export const setSodaConfig = () => {

	sodajs.prefix('v-')

	sodajs.directive('repeat', {

		priority: 10,

		link({ scope, el, expression, getValue, compileNode }) {

			let itemName
			let valueName
			let trackName

			const trackReg = /\s+by\s+([^\s]+)$/
			const inReg = /([^\s]+)\s+in\s+([^\s]+)|\(([^,]+)\s*,\s*([^)]+)\)\s+in\s+([^\s]+)/

			const opt = expression.replace(trackReg, (item, $1) => {
				if ($1)
					trackName = ($1 || '').trim()
				return ''
			})

			const r = inReg.exec(opt)

			if (r) {
				if (r[1] && r[2]) {
					itemName = (r[1] || '').trim()
					valueName = (r[2] || '').trim()

					if (!(itemName && valueName)) {
						return
					}
				} else if (r[3] && r[4] && r[5]) {
					trackName = (r[3] || '').trim()
					itemName = (r[4] || '').trim()
					valueName = (r[5] || '').trim()
				}
			} else {
				return
			}

			trackName = trackName || '$index'

			const repeatObj = getValue(scope, valueName) || []

			const repeatFunc = (i) => {

				const itemNode = el.cloneNode(true)
				const itemScope = Object.create(scope)

				itemScope[trackName] = i
				itemScope[itemName] = repeatObj[i]

				itemNode.removeAttribute(`${this._prefix}repeat`)

				el.parentNode.insertBefore(itemNode, el)

				Array.from(itemNode.querySelectorAll('[data-component]'))
					.forEach( node => node.setAttribute('data-initial-state', JSON.stringify(itemScope)) )

				compileNode(itemNode, itemScope)
			}

			if ('length' in repeatObj) {
				for (var i = 0; i < repeatObj.length; i++) {
					repeatFunc(i)
				}
			} else {
				for (var i in repeatObj) {
					if (repeatObj.hasOwnProperty(i)) {
						repeatFunc(i)
					}
				}
			}

			el.parentNode.removeChild(el)

			if (el.childNodes && el.childNodes.length)
				el.innerHTML = ''
		}
	})

	return sodajs
}
