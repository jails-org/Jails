const topics: any = {}
const _async: any = {}

export const publish = (name: string, params: any) => {
	_async[name] = Object.assign({}, _async[name], params)
	if (topics[name])
		topics[name].forEach(topic => topic(params))
}

export const subscribe = (name: string, method: Function) => {
	topics[name] = topics[name] || []
	topics[name].push(method)
	if (name in _async) {
		method(_async[name])
	}
}

export const unsubscribe = ( topic: any ) => {
	topics[topic.name] = (topics[topic.name] || [])
		.filter((t: any) => t != topic.method)
	if (!topics[topic.name].length) {
		delete topics[topic.name]
		delete _async[topic.name]
	}
}
