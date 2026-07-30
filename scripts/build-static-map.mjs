// Genera la imagen del mapa del punto de encuentro a partir de las teselas de
// CARTO, para no tener que cargar MapLibre (~550 KB de JS) sólo para mostrar un
// mapa que nadie va a mover.
//
// Uso: pnpm map
// El resultado va a src/assets/map-meeting-point.png y de ahí lo optimiza Astro.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import sharp from 'sharp'

const { coords } = await import('../src/consts.ts').then(
  (m) => m.CLUB,
  // `consts.ts` es TypeScript: si el runtime no lo entiende, se usan los valores
  // de referencia (mantener sincronizados con CLUB.coords si cambia la sede)
  () => ({ coords: { lat: 41.3290122, lng: 2.0939926 } })
)

const LAT = coords.lat
const LNG = coords.lng
const ZOOM = 16
/** Teselas @2x de CARTO: 512 px cada una */
const TILE = 512
/** Tamaño final de la imagen (2x para pantallas retina) */
const WIDTH = 1200
const HEIGHT = 1200
const OUTPUT = 'src/assets/map-meeting-point.png'

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

const tiles = []

for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    const tileX = firstTileX + column
    const tileY = firstTileY + row
    const subdomain = 'abc'[(tileX + tileY) % 3]
    const url = `https://${subdomain}.basemaps.cartocdn.com/dark_all/${ZOOM}/${tileX}/${tileY}@2x.png`

    const response = await fetch(url, {
      headers: { 'User-Agent': 'letigre.run static map build' }
    })

    if (!response.ok) {
      throw new Error(`No se pudo descargar ${url}: ${response.status}`)
    }

    tiles.push({
      input: Buffer.from(await response.arrayBuffer()),
      left: column * TILE,
      top: row * TILE
    })
  }
}

// Se compone el mosaico y se recorta para que el punto quede justo en el centro
const mosaic = await sharp({
  create: {
    width: columns * TILE,
    height: rows * TILE,
    channels: 3,
    background: '#06030b'
  }
})
  .composite(tiles)
  .png()
  .toBuffer()

const cropped = await sharp(mosaic)
  .extract({
    left: Math.round(left - firstTileX * TILE),
    top: Math.round(top - firstTileY * TILE),
    width: WIDTH,
    height: HEIGHT
  })
  // Las teselas oscuras de CARTO son gris azulado: se giran hacia el verde de
  // la marca, el mismo ajuste que hacía el filtro CSS sobre el mapa interactivo
  .modulate({ hue: -35, saturation: 0.65, brightness: 0.95 })
  .png({ compressionLevel: 9 })
  .toBuffer()

await mkdir(dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, cropped)

console.log(`[map] ${OUTPUT} (${Math.round(cropped.length / 1024)} KB)`)
