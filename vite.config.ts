import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
	define: {},
	build: {
		sourcemap:true,
		target: 'es2015',
		lib: {
			name: 'jails',
			entry: path.resolve('src', 'index.ts'),
			formats: ['umd'],
			fileName: format => `index.js`
		}
	}
})
