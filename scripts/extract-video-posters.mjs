// Extrae el primer frame de cada MP4 en public/videos/web y lo guarda como
// póster WebP (y JPG si ya existía). Así al arrancar el vídeo no hay salto:
// el póster y el frame 0 son la misma imagen.
//
// Offline only: no forma parte de `pnpm build` ni del deploy.
// Requiere ffmpeg e ImageMagick 7 (`magick`) en el PATH.
//
// Uso: pnpm posters
import { execFileSync } from 'node:child_process'
import { readdir, rm, stat } from 'node:fs/promises'
import { basename, join } from 'node:path'

const DIR = 'public/videos/web'
const WEBP_QUALITY = 82
const JPEG_QUALITY = 85

function requireBin(bin, install) {
  try {
    execFileSync(bin, ['-version'], { stdio: 'ignore' })
  } catch {
    console.error(`[posters] Hace falta \`${bin}\` en el PATH.\n         ${install}`)
    process.exit(1)
  }
}

requireBin('ffmpeg', 'brew install ffmpeg')
requireBin('magick', 'brew install imagemagick')

const files = (await readdir(DIR)).filter((f) => f.endsWith('.mp4')).sort()

if (files.length === 0) {
  console.error(`[posters] no hay MP4 en ${DIR}`)
  process.exit(1)
}

for (const file of files) {
  // hero-sm.mp4 comparte el mismo clip que hero.mp4: el póster público es
  // hero.webp (un solo atributo `poster` en el <video> del hero).
  if (file === 'hero-sm.mp4') {
    console.log(`[posters] ${file} · omitido (usa hero.webp)`)
    continue
  }

  const mp4 = join(DIR, file)
  const base = file.replace(/\.mp4$/, '')
  const png = join(DIR, `${base}.poster-tmp.png`)
  const webp = join(DIR, `${base}.webp`)
  const jpg = join(DIR, `${base}.jpg`)

  // Primer frame decodificado, sin seek (evita keyframe anterior incorrecto)
  execFileSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      mp4,
      '-frames:v',
      '1',
      '-update',
      '1',
      png
    ],
    { stdio: 'inherit' }
  )

  execFileSync(
    'magick',
    [png, '-strip', '-quality', String(WEBP_QUALITY), webp],
    { stdio: 'inherit' }
  )

  // Si ya había JPG (legado), lo mantenemos sincronizado
  try {
    await stat(jpg)
    execFileSync(
      'magick',
      [png, '-strip', '-quality', String(JPEG_QUALITY), jpg],
      { stdio: 'inherit' }
    )
  } catch {
    // sin jpg previo: no hace falta
  }

  await rm(png, { force: true })

  const kb = Math.round((await stat(webp)).size / 1024)
  const size = execFileSync(
    'magick',
    ['identify', '-ping', '-format', '%wx%h', webp],
    { encoding: 'utf8' }
  ).trim()
  console.log(`[posters] ${base}.webp · ${size} · ${kb} KB (frame 0 de ${file})`)
}

console.log(`[posters] listo · ${files.filter((f) => f !== 'hero-sm.mp4').length} pósters`)
