// Copia MapLibre (ESM + worker + CSS) a public/vendor.
//
// Por qué no se importa desde el componente: un `import` lo mete en el grafo de
// Vite, y entonces Astro tiene que generar un chunk y sacar el script de arranque
// a un archivo aparte (más una hoja de estilos bloqueante). Sirviéndolo desde
// una URL fija, el script del mapa puede quedarse en línea en el HTML y MapLibre
// se descarga sólo cuando el mapa entra en pantalla.
import { copyFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const dist = join(dirname(require.resolve('maplibre-gl/package.json')), 'dist')
const target = 'public/vendor'

const FILES = [
  'maplibre-gl.mjs',
  // Lo importa el módulo principal con una ruta relativa
  'maplibre-gl-shared.mjs',
  // Se instancia como Worker desde el módulo principal
  'maplibre-gl-worker.mjs',
  'maplibre-gl.css'
]

await mkdir(target, { recursive: true })

for (const file of FILES) {
  await copyFile(join(dist, file), join(target, file))
}

console.log(`[maplibre] ${FILES.length} archivos -> ${target}`)
