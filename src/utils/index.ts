let textarea

export const g = {
	scope: {}
}

export const decodeHTML = (text) => {
	textarea = textarea || document.createElement('textarea')
	textarea.innerHTML = text
	return textarea.value
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
		const value = execute()
		return value !== undefined && value !== null ? value : val || ''
	}catch(err){
		return val || ''
	}
}
