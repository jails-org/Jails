
export const Scanner = {

	scan( node: HTMLElement, callback: VoidFunction ) {
		if( node.nodeType === 1 ) {
			const list : Array<HTMLElement> = Array.from( node.querySelectorAll('[data-component]') )
			const elements : Array<HTMLElement> = node.dataset.component? [node].concat(list) : list
			if( elements.length ) {
				elements.reverse().forEach( callback )
			}
		}
	},

	observe( target: HTMLElement, onAdd: VoidFunction, onRemove: VoidFunction  ) {
		const observer = new MutationObserver(mutations => mutations.forEach( mutation => {
			if (mutation.type === 'childList') {
				if (mutation.addedNodes.length) {
					Array.from( mutation.addedNodes ).forEach( node => Scanner.scan(node, onAdd) )
				} else if (mutation.removedNodes.length) {
					Array.from( mutation.removedNodes ).forEach( node => Scanner.scan(node, onRemove) )
				}
			}
		}))
		observer.observe(target, { childList: true, subtree: true })
	}
}
