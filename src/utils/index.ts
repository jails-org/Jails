
export const g = {
	scope: {}
}

export const rAF = (fn) => {
	if (requestAnimationFrame)
		return requestAnimationFrame(fn)
	else
		return setTimeout(fn, 1000 / 60)
}

export const uuid = () => {
	return Math.random().toString(36).substring(2, 9)
}

export const dup = (o) => {
	return JSON.parse(JSON.stringify(o))
}

export const safe = (execute, val) => {
	try{
		return execute()
	}catch(err){
		return val || ''
	}
}
