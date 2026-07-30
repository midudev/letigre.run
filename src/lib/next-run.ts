import { CLUB, SPECIAL_RUNS, SKIPPED_RUNS } from '@/consts'

/** Zona horaria del club: la salida es a las 8:00 de El Prat, no del visitante */
const TZ = 'Europe/Madrid'

const SATURDAY = 6

export interface NextRun {
  /** Instante exacto de la salida */
  startsAt: Date
  /** `YYYY-MM-DD` de la salida en hora de Madrid */
  date: string
  /** `HH:MM` */
  time: string
  /** La salida es hoy */
  isToday: boolean
  /** Título de una salida especial, si lo tiene */
  title?: string
  /** Aviso extra de una salida especial */
  note?: string
  /** Punto de encuentro (las especiales pueden cambiarlo) */
  place: string
}

/** Componentes de calendario de un instante en la zona del club */
function partsInTz(timestamp: number) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hourCycle: 'h23'
  })

  const parts: Record<string, string> = {}
  for (const { type, value } of formatter.formatToParts(timestamp)) {
    parts[type] = value
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: weekdays.indexOf(parts.weekday ?? '')
  }
}

/** Desfase de la zona del club respecto a UTC en un instante dado */
function tzOffset(timestamp: number) {
  const { year, month, day, hour, minute, second } = partsInTz(timestamp)
  return Date.UTC(year, month - 1, day, hour, minute, second) - timestamp
}

/**
 * Convierte una fecha y hora locales de Madrid al instante real. Se calcula el
 * desfase dos veces porque el primer intento puede caer en el lado equivocado
 * de un cambio de hora.
 */
function tzToTimestamp(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
) {
  const naive = Date.UTC(year, month - 1, day, hour, minute)
  const guess = naive - tzOffset(naive)
  return naive - tzOffset(guess)
}

const isoDate = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

const parseTime = (time: string) => {
  const [hour, minute] = time.split(':').map(Number)
  return { hour, minute: minute || 0 }
}

/**
 * La próxima salida: por defecto el siguiente sábado a las 8:00, saltándose las
 * fechas de `SKIPPED_RUNS` y dando prioridad a lo que haya en `SPECIAL_RUNS`.
 * Se calcula igual en el servidor y en el navegador, así que el HTML estático
 * puede refrescarse en cliente sin que baile nada.
 */
export function getNextRun(now: Date = new Date()): NextRun {
  const timestamp = now.getTime()
  const today = partsInTz(timestamp)
  const { hour, minute } = parseTime(CLUB.time)

  // Salidas especiales que aún no han empezado
  const special = SPECIAL_RUNS.map((run) => {
    const [year, month, day] = run.date.split('-').map(Number)
    const runTime = parseTime(run.time ?? CLUB.time)

    return {
      run,
      startsAt: tzToTimestamp(year, month, day, runTime.hour, runTime.minute),
      time: run.time ?? CLUB.time
    }
  })
    .filter((entry) => entry.startsAt > timestamp)
    .sort((a, b) => a.startsAt - b.startsAt)
    .at(0)

  // Sábados a partir de hoy, descartando los que estén cancelados
  let candidate: { startsAt: number; date: string } | undefined

  for (let ahead = 0; ahead <= 60 && !candidate; ahead++) {
    const probe = partsInTz(
      Date.UTC(today.year, today.month - 1, today.day + ahead, 12)
    )

    if (probe.weekday !== SATURDAY) continue

    const date = isoDate(probe.year, probe.month, probe.day)
    if (SKIPPED_RUNS.some((skipped) => skipped.date === date)) continue

    const startsAt = tzToTimestamp(
      probe.year,
      probe.month,
      probe.day,
      hour,
      minute
    )

    // Un sábado a las 9:00 la salida de hoy ya ha pasado: toca la siguiente
    if (startsAt <= timestamp) continue

    candidate = { startsAt, date }
  }

  const useSpecial = special && (!candidate || special.startsAt < candidate.startsAt)

  const startsAt = useSpecial ? special.startsAt : candidate!.startsAt
  const chosen = partsInTz(startsAt)

  return {
    startsAt: new Date(startsAt),
    date: isoDate(chosen.year, chosen.month, chosen.day),
    time: useSpecial ? special.time : CLUB.time,
    isToday:
      chosen.year === today.year &&
      chosen.month === today.month &&
      chosen.day === today.day,
    title: useSpecial ? special.run.title : undefined,
    note: useSpecial ? special.run.note : undefined,
    place: (useSpecial ? special.run.place : undefined) ?? CLUB.meetingPoint
  }
}

/** `2026-08-01` -> `sábado 1 de agosto` */
export function formatRunDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date)
}

/** Cuánto falta, en unidades redondas: `3 días`, `5 horas`, `20 minutos` */
export function timeUntil(startsAt: Date, now: Date = new Date()) {
  const minutes = Math.max(
    0,
    Math.round((startsAt.getTime() - now.getTime()) / 60_000)
  )

  if (minutes < 60) {
    return { value: minutes, unit: minutes === 1 ? 'minuto' : 'minutos' }
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return { value: hours, unit: hours === 1 ? 'hora' : 'horas' }

  const days = Math.round(hours / 24)
  return { value: days, unit: days === 1 ? 'día' : 'días' }
}
