//https://github.com/polleverywhere/hmr-custom-element

export const register = (module, tag, clazz) => {
	// when not in a HMR env, we should be doing the correct thing
	// and let the browser throw an error because we're importing this
	// more than once for some reason
	if (!module.hot) {
	  try {
		customElements.define(tag, clazz)
	  } catch (e) {
		console.error(`Failed to register element: ${tag}`, e)
	  }

	  return
	}
	// hot module reload the elements
	//
	// if we're in a HMR env, we're going to be reloaded so
	// don't register the elements again
	if (!customElements.get(tag)) {
	  try {
		customElements.define(tag, clazz)
	  } catch (e) {
		console.error(`Failed to register element in HMR environment: ${tag}`, e)
	  }
	}

	module.hot.accept((e) => {
	  console.error('HMR error', e)
	})

	if (module.hot.status && module.hot.status() === 'apply') {
	  // find each instance and swap the prototype for the new one and re-render
	  document.querySelectorAll(tag).forEach((node) => {
		// Swap prototype of instance with new one
		Object.setPrototypeOf(node, clazz.prototype)
		// re-render
		node.connectedCallback()
	  })
	}
  }
