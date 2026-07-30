// Genera variantes AVIF / WebP / JPG de las fotos del sitio en public/images.
//
// Offline only: no forma parte de `pnpm build` ni del deploy. Los resultados
// se commitean en public/images y Astro los sirve tal cual.
//
// Requiere ImageMagick 7 en el PATH (`magick`).
//   brew install imagemagick
//
// Uso: pnpm images
import { execFileSync } from 'node:child_process'
import { mkdir, rm, stat, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

/** @typedef {{ id: string, input: string, widths: number[] }} ImageJob */

/** @type {ImageJob[]} */
const IMAGES = [
  {
    id: 'avion',
    input: 'src/assets/letigre-avion.jpg',
    // Galería 4/5 a media columna: 420 móvil, 720 tablet, 1080 retina
    widths: [420, 720, 1080]
  },
  {
    id: 'playa',
    input: 'src/assets/letigre-playa.jpg',
    widths: [420, 720, 1080]
  },
  {
    id: 'tienda-2',
    input: 'src/assets/letigre-tienda-2.png',
    // Featured a ancho completo (~1024 CSS px)
    widths: [720, 1080, 1440]
  },
  {
    id: 'tienda',
    input: 'src/assets/letigre-tienda.png',
    // Miniatura del bocadillo del mapa (~200 CSS px)
    widths: [260, 520]
  },
  {
    id: 'map',
    input: 'src/assets/map-meeting-point.png',
    widths: [400, 600, 900, 1200]
  }
]

const OUT_ROOT = 'public/images'

/** Calidad por formato (ImageMagick `-quality`) */
const QUALITY = { avif: 50, webp: 78, jpg: 80 }

function requireMagick() {
  try {
    execFileSync('magick', ['-version'], { stdio: 'ignore' })
  } catch {
    console.error(
      '[images] Hace falta ImageMagick 7 (`magick` en el PATH).\n' +
        '         brew install imagemagick'
    )
    process.exit(1)
  }
}

/**
 * @param {string[]} args
 * @param {{ quiet?: boolean }} [opts]
 */
function magick(args, opts = {}) {
  execFileSync('magick', args, {
    stdio: opts.quiet ? 'ignore' : ['ignore', 'inherit', 'inherit']
  })
}

/** @param {string} file */
function identify(file) {
  const out = execFileSync(
    'magick',
    ['identify', '-ping', '-format', '%w %h', file],
    { encoding: 'utf8' }
  ).trim()
  const [w, h] = out.split(/\s+/).map(Number)
  return { width: w, height: h }
}

/**
 * @param {ImageJob} job
 */
async function optimize(job) {
  const outDir = join(OUT_ROOT, job.id)
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const { width: sourceWidth, height: sourceHeight } = identify(job.input)

  const widths = [...new Set(job.widths)]
    .filter((w) => w > 0)
    .sort((a, b) => a - b)
    .map((w) => Math.min(w, sourceWidth))
    .filter((w, i, all) => all.indexOf(w) === i)

  console.log(
    `[images] ${job.id} · ${sourceWidth}px → ${widths.join(', ')} (${basename(job.input)})`
  )

  for (const width of widths) {
    const base = join(outDir, `${job.id}-${width}`)
    // `widthx>` = sólo encoge, no agranda; auto-orient corrige EXIF
    const resize = `${width}x>`

    magick([
      job.input,
      '-auto-orient',
      '-resize',
      resize,
      '-quality',
      String(QUALITY.avif),
      `${base}.avif`
    ])

    magick([
      job.input,
      '-auto-orient',
      '-resize',
      resize,
      '-quality',
      String(QUALITY.webp),
      `${base}.webp`
    ])

    // Fondo opaco por si el PNG trae alpha (mapa, capturas)
    magick([
      job.input,
      '-auto-orient',
      '-resize',
      resize,
      '-background',
      '#06030b',
      '-alpha',
      'remove',
      '-alpha',
      'off',
      '-quality',
      String(QUALITY.jpg),
      `${base}.jpg`
    ])
  }

  return {
    id: job.id,
    width: sourceWidth,
    height: sourceHeight,
    widths
  }
}

requireMagick()

const results = []
for (const job of IMAGES) {
  results.push(await optimize(job))
}

// og.jpg: crawlers sociales no usan <picture>; se reencodea in-place
const ogIn = 'public/og.jpg'
const ogTmp = 'public/og.jpg.tmp'
magick([
  ogIn,
  '-auto-orient',
  '-resize',
  '1200x630^',
  '-gravity',
  'center',
  '-extent',
  '1200x630',
  '-quality',
  '82',
  ogTmp
])
const { rename } = await import('node:fs/promises')
await rename(ogTmp, ogIn)
const ogSize = Math.round((await stat(ogIn)).size / 1024)
console.log(`[images] og.jpg · ${ogSize} KB`)

const manifest = Object.fromEntries(
  results.map((r) => [
    r.id,
    { width: r.width, height: r.height, widths: r.widths }
  ])
)
await writeFile(
  join(OUT_ROOT, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`
)

console.log(`[images] listo · ${results.length} fotos en ${OUT_ROOT}/`)
