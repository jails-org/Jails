const topics = {}
const _async = {}

export const publish = (name, params) => {
	if (!(name in topics))
		_async[name] = params
	else
		topics[name].forEach(topic => topic(params))
}

export const subscribe = (name, method) => {
	topics[name] = topics[name] || []
	topics[name].push(method)
	if (name in _async)
		topics[name].forEach(topic => topic(_async[name]))
}

export const unsubscribe = (topic) => {

	topics[topic.name] = (topics[topic.name] || [])
		.filter(t => t != topic.method)

	_async[topic.name] = (_async[topic.name] || [])
		.filter(t => t != topic.method)

	if (!topics[topic.name].length)
		delete topics[topic.name]

	if (!_async[topic.name].length)
		delete _async[topic.name]
}
