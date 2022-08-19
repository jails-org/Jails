const topics: any = {}
const _async: any = {}

export const publish = (name, params) => {
	_async[name] = Object.assign({}, _async[name], params)
	if (topics[name])
		topics[name].forEach(topic => topic(params))
}

export const subscribe = (name, method) => {
	topics[name] = topics[name] || []
	topics[name].push(method)
	if (name in _async) {
		method(_async[name])
	}
	return () => {
		topics[name] = topics[name].filter( fn => fn != method )
	}
}

