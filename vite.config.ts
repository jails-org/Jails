import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
	build: {
		sourcemap: true,
		target: 'es2015',
		minify: 'terser',
		lib: {
			name: 'jails',
			entry: path.resolve('src', 'index.ts'),
			formats: ['umd', 'es'],
			fileName: (format) => {
				return format == 'umd'? 'jails.js': 'index.js'
			}
		},
		rollupOptions: {
			output: {
				exports:'named'
			}
		}
	}
})
