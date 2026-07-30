// Optimiza los SVG de marca en src/assets/logos.
//
// Offline only: no forma parte de `pnpm build` ni del deploy. Los logos
// ya optimizados viven en el repo; este script sólo se lanza a mano cuando
// se reexportan desde Illustrator.
//
// Requiere SVGO en el PATH (no es dependencia del proyecto):
//   brew install svgo
//   # o: npm install -g svgo
//
// Uso: pnpm logos
import { execFileSync } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const DIR = 'src/assets/logos'

try {
  execFileSync('svgo', ['--version'], { stdio: 'ignore' })
} catch {
  console.error(
    '[logos] Hace falta SVGO en el PATH (no se instala con el proyecto).\n' +
      '        brew install svgo'
  )
  process.exit(1)
}

const files = (await readdir(DIR)).filter((f) => f.endsWith('.svg'))
if (files.length === 0) {
  console.error(`[logos] no hay SVG en ${DIR}`)
  process.exit(1)
}

// Config inline: evita arrastrar un paquete `svgo` por el simple hecho de
// tener un svgo.config.mjs que alguien pueda confundir con dep del sitio.
const config = {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          convertPathData: { floatPrecision: 2, transformPrecision: 2 },
          cleanupNumericValues: { floatPrecision: 2 }
        }
      }
    },
    'removeDimensions',
    'sortAttrs'
  ]
}

const configPath = join(DIR, '.svgo-temp.config.json')
const { writeFile, unlink } = await import('node:fs/promises')
await writeFile(configPath, JSON.stringify(config))

try {
  execFileSync(
    'svgo',
    ['--config', configPath, ...files.map((f) => join(DIR, f))],
    { stdio: 'inherit' }
  )
  console.log(`[logos] ${files.length} SVG optimizados en ${DIR}/`)
} finally {
  await unlink(configPath).catch(() => {})
}
