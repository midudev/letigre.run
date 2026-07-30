// Copia el CSS de MapLibre a public/ para servirlo desde nuestro dominio.
// No se importa desde el componente a propósito: un `import` lo metería en el
// bundle de la página y añadiría 10 KB bloqueantes a la ruta crítica, cuando
// el mapa sólo se monta al hacer scroll.
import { copyFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const source = join(
  dirname(require.resolve('maplibre-gl/package.json')),
  'dist/maplibre-gl.css'
)
const target = 'public/vendor/maplibre-gl.css'

await mkdir(dirname(target), { recursive: true })
await copyFile(source, target)

console.log(`[maplibre] ${source} -> ${target}`)
