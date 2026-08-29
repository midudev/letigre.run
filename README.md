# Run with Le Tigre

Sitio de [Le Tigre Running Community](https://letigre.run): club de running del Prat de Llobregat. Landing estática con la próxima salida, el calendario de carreras, el punto de encuentro y las FAQ.

**Sábados 8:00** · Le Tigré Cakes · ritmos 5:30–5:45 min/km · sin cuotas.

[letigre.run](https://letigre.run) · [Instagram](https://www.instagram.com/run_with_letigre/) · [Strava](https://www.strava.com/clubs/1670299)

## Stack

- [Astro 7](https://astro.build) en modo estático (`output: 'static'`)
- [Tailwind CSS 4](https://tailwindcss.com) + GSAP
- Deploy en [Cloudflare Workers Assets](https://developers.cloudflare.com/workers/static-assets/) con Wrangler

Node `>=22.12` y [pnpm](https://pnpm.io).

## Arrancar

```sh
pnpm install
pnpm dev
```

El servidor local queda en `http://localhost:4321`.

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción en `dist/` |
| `pnpm preview` | Previsualiza el build |
| `pnpm deploy` | Build + `wrangler deploy` a Cloudflare |

## Contenido

Casi todo lo editable vive en [`src/consts.ts`](src/consts.ts):

| Constante | Uso |
| --- | --- |
| `SITE`, `CLUB`, `LINKS` | Nombre, horarios, dirección, redes |
| `RACES` | Calendario de carreras (se ocultan solas al pasar la fecha) |
| `SPECIAL_RUNS` | Salida con otra hora, sitio o título |
| `SKIPPED_RUNS` | Sábados sin salida (puentes, vacaciones) |
| `FAQ` | Preguntas de la landing |

La próxima salida se calcula en [`src/lib/next-run.ts`](src/lib/next-run.ts) con zona `Europe/Madrid`: el siguiente sábado a las 8:00, salvo que haya una especial antes o un sábado en `SKIPPED_RUNS`.

### Cancelar un sábado

```ts
export const SKIPPED_RUNS = [
  { date: '2026-12-26', reason: 'Puente de Navidad' }
]
```

### Salida especial

```ts
export const SPECIAL_RUNS = [
  {
    date: '2026-09-12',
    time: '7:30',
    title: 'Tirada larga por el Delta',
    note: 'Salimos media hora antes',
    place: 'Le Tigré Cakes'
  }
]
```

### Añadir una carrera

```ts
{
  date: '2026-10-04',
  name: 'Media de Logroño',
  km: 21,
  place: 'Logroño',
  blurb: 'Una frase que explique qué tiene de especial.',
  image: '/images/races/media-logrono.webp'
}
```

Cada carrera necesita una imagen distinta en `public/images/races/`. Si el cupo del grupo está lleno, añade `status: 'full'`.

## Assets

Las fotos, el mapa y los pósters de vídeo **no** se generan en el build. Se preparan offline, se commitean y Astro los sirve tal cual desde `public/`.

| Comando | Requiere | Qué hace |
| --- | --- | --- |
| `pnpm images` | ImageMagick 7 (`magick`) | Variantes AVIF / WebP / JPG en `public/images/` |
| `pnpm map` | ImageMagick 7 | Mapa estático del punto de encuentro (teselas CARTO) |
| `pnpm posters` | ffmpeg + ImageMagick | Primer frame de cada MP4 como póster |
| `pnpm logos` | SVGO | Optimiza los SVG de `src/assets/logos/` |

Tras cambiar el mapa: `pnpm map` y luego `pnpm images`.

Las fuentes originales que no van al sitio pueden vivir en `media/` (está en `.gitignore`).

## Deploy

```sh
pnpm deploy
```

Equivale a `astro build && wrangler deploy`. El Worker `letigre-run` sirve `dist/` como assets estáticos. Dominio: `https://letigre.run`.

Cabeceras de caché, HSTS y seguridad: [`public/_headers`](public/_headers). En el panel de Cloudflare hace falta **Always Use HTTPS** para redirigir HTTP → HTTPS.

## Estructura

```text
src/
  consts.ts              # contenido del club
  lib/next-run.ts        # próxima salida (Madrid)
  pages/index.astro      # landing
  components/            # hero, carreras, mapa, FAQ…
  layouts/Layout.astro   # meta, OG, JSON-LD
  styles/global.css
public/
  images/                # fotos ya optimizadas
  videos/web/            # MP4 + pósters
  _headers               # Cloudflare
scripts/                 # images, map, posters, logos
```
