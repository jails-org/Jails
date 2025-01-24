import { Idiomorph } from 'idiomorph/dist/idiomorph.esm'
import { safe } from './utils'

export const Component = ({ name, module, dependencies, node, templates }) => {

	const state 	= Object.assign({})
	const tplid 	= node.getAttribute('tplid')
	const tpl 		= templates[tplid]

	module.default({

		elm: node,
		dependencies,
		template: tpl.template,

		main(fn) {
			node.addEventListener('ready', fn)
		},

		state : {

			set( data ) {

				Object.assign(state, data)
				const dupdata = Object.assign({}, state)

				if( data.constructor === Function ) {
					data( dupdata )
				} else {
					Object.assign(dupdata, data)
				}

				const html = tpl.render.call( dupdata, node, safe )
				Idiomorph.morph( node, html, IdiomorphOptions(node) )
			},

			get() {
				return Object.assign({}, state)
			}
		}
	})
}

const IdiomorphOptions = ( parent ) => ({
	callbacks: {
		beforeNodeMorphed( node ) {
			if( node.nodeType === 1 ) {
				if( 'html-static' in node.attributes ) {
					return false
				}
				if( node.base && node !== parent ) {
					return false
				}
			}
		}
	}
})
