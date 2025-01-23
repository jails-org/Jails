export const Component = ({ name, module, dependencies, node }) => {

	const state = {}
	const tplid = node.getAttribute('tplid')

	module.default({

		elm: node,
		dependencies,

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
