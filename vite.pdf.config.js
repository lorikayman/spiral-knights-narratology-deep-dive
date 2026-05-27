import { defineConfig } from 'vite'
import { resolve } from 'node:path'

const PATH_TARGET_HTML = '/dist/burning_stars.html'
const PATH_WATCH_FULL_RELOAD = [resolve('dist/burning_stars.html')]

export default defineConfig({
  root: '.',
  publicDir: false,
  appType: 'mpa',
  server: {
    open: PATH_TARGET_HTML,
    fs: {
      allow: ['.'],
    },
    // default watch.ignored includes build.outDir = ./dist
    // redefine here
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
  plugins: [
    {
      name: 'source-hot-reload',
      configureServer(server) {
        server.watcher.add(PATH_WATCH_FULL_RELOAD)
        const reload = (file) => {
          if (PATH_WATCH_FULL_RELOAD.includes(file)) {
            server.ws.send({ type: 'full-reload', path: '*' })
          }
        }
        server.watcher.on('change', reload)
        server.watcher.on('add', reload)
        server.watcher.on('unlink', reload)
      },
    },
  ],
})
