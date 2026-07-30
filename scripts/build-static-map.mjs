// Genera la imagen del mapa del punto de encuentro a partir de las teselas de
// CARTO, para no tener que cargar MapLibre (~550 KB de JS) sólo para mostrar un
// mapa que nadie va a mover.
//
// Offline only: no forma parte de `pnpm build` ni del deploy.
// Requiere ImageMagick 7 (`magick` en el PATH): brew install imagemagick
//
// Uso: pnpm map
// El resultado va a src/assets/map-meeting-point.png; luego `pnpm images`
// genera las variantes AVIF/WebP/JPG en public/images/map/.
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const LAT = 41.3290122
const LNG = 2.0939926
const ZOOM = 16
/** Teselas @2x de CARTO: 512 px cada una */
const TILE = 512
/** Tamaño final de la imagen (2x para pantallas retina) */
const WIDTH = 1200
const HEIGHT = 1200
const OUTPUT = 'src/assets/map-meeting-point.png'

try {
  execFileSync('magick', ['-version'], { stdio: 'ignore' })
} catch {
  console.error(
    '[map] Hace falta ImageMagick 7 (`magick` en el PATH).\n' +
      '      brew install imagemagick'
  )
  process.exit(1)
}

/** Coordenada de tesela fraccionaria (Web Mercator) */
function toTileCoords(lat, lng, zoom) {
  const scale = 2 ** zoom
  const x = ((lng + 180) / 360) * scale
  const radians = (lat * Math.PI) / 180
  const y =
    ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) *
    scale
  return { x, y }
}

const center = toTileCoords(LAT, LNG, ZOOM)

// Píxel del centro dentro del mosaico completo del mundo
const centerPx = { x: center.x * TILE, y: center.y * TILE }

// Rectángulo que hay que cubrir y teselas que lo tocan
const left = centerPx.x - WIDTH / 2
const top = centerPx.y - HEIGHT / 2
const firstTileX = Math.floor(left / TILE)
const firstTileY = Math.floor(top / TILE)
const lastTileX = Math.floor((left + WIDTH - 1) / TILE)
const lastTileY = Math.floor((top + HEIGHT - 1) / TILE)

const columns = lastTileX - firstTileX + 1
const rows = lastTileY - firstTileY + 1

console.log(`[map] zoom ${ZOOM}, ${columns}x${rows} teselas`)

const workDir = await mkdtemp(join(tmpdir(), 'letigre-map-'))

try {
  /** @type {{ path: string, left: number, top: number }[]} */
  const tiles = []

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const tileX = firstTileX + column
      const tileY = firstTileY + row
      const subdomain = 'abc'[(tileX + tileY) % 3]
      const url = `https://${subdomain}.basemaps.cartocdn.com/dark_all/${ZOOM}/${tileX}/${tileY}@2x.png`
      const path = join(workDir, `${tileX}_${tileY}.png`)

      const response = await fetch(url, {
        headers: { 'User-Agent': 'letigre.run static map build' }
      })

      if (!response.ok) {
        throw new Error(`No se pudo descargar ${url}: ${response.status}`)
      }

      await writeFile(path, Buffer.from(await response.arrayBuffer()))
      tiles.push({
        path,
        left: column * TILE,
        top: row * TILE
      })
    }
  }

  const mosaicPath = join(workDir, 'mosaic.png')
  const cropLeft = Math.round(left - firstTileX * TILE)
  const cropTop = Math.round(top - firstTileY * TILE)

  // Compone el mosaico, recorta al punto, estira contraste y tiñe de marca.
  // Equivalente offline del pipeline que antes usaba sharp.
  const args = [
    '-size',
    `${columns * TILE}x${rows * TILE}`,
    `xc:#06030b`,
    ...tiles.flatMap((tile) => [
      tile.path,
      '-geometry',
      `+${tile.left}+${tile.top}`,
      '-compose',
      'over',
      '-composite'
    ]),
    '-crop',
    `${WIDTH}x${HEIGHT}+${cropLeft}+${cropTop}`,
    '+repage',
    // Las teselas `dark_all` no pasan de 50 de 255: `-level` estira ese rango
    // para que las calles se lean sin aclarar el fondo
    '-level',
    '4%,24%',
    // Duotono con una tabla de color (negro de marca -> lima). Con `-colorize`
    // el tinte se sumaba también a las sombras y el fondo salía verde oliva;
    // así el negro sigue siendo negro y el verde aparece sólo en las calles.
    '-colorspace',
    'Gray',
    '(',
    '-size',
    '1x256',
    'gradient:#c9f78a-#06030b',
    ')',
    '-clut',
    '-strip',
    mosaicPath
  ]

  execFileSync('magick', args, { stdio: ['ignore', 'inherit', 'inherit'] })

  await mkdir(dirname(OUTPUT), { recursive: true })
  // Reencode PNG final al destino del repo
  execFileSync(
    'magick',
    [mosaicPath, '-strip', '-define', 'png:compression-level=9', OUTPUT],
    { stdio: ['ignore', 'inherit', 'inherit'] }
  )

  const kb = Math.round((await stat(OUTPUT)).size / 1024)
  console.log(`[map] ${OUTPUT} (${kb} KB)`)
  console.log('[map] Siguiente paso: pnpm images')
} finally {
  await rm(workDir, { recursive: true, force: true })
}
