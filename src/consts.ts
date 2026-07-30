/**
 * Colores oficiales de Le Tigre Running Community.
 * Muestreados del logo de la camiseta (lima hue 79° sobre negro).
 * Escala completa disponible como utilidades Tailwind en `src/styles/global.css`.
 */
export const COLORS = {
  /** Lima principal del logo. Contraste 15.5:1 sobre `ink` */
  brand: '#B9F731',
  /** Lima oscuro — único usable como texto sobre blanco (7.1:1) */
  brandStrong: '#446105',
  /** Negro de la camiseta */
  ink: '#06030B'
} as const

export const SITE = {
  name: 'Run with Le Tigre',
  shortName: 'Le Tigre Run',
  title: 'Run with Le Tigre · Running Community del Prat de Llobregat',
  description:
    'Club de running del Prat de Llobregat. Salimos todos los sábados a las 8:00 desde Le Tigré Cakes. Ritmo 5:30-5:45 min/km. Café de especialidad antes de salir y croissants a la vuelta, cortesía de la casa.'
} as const

export const CLUB = {
  day: 'Sábados',
  time: '8:00',
  meetingPoint: 'Le Tigré Cakes',
  street: 'Passatge del Rector Martí i Piñol, 3',
  postalCode: '08820',
  city: 'El Prat de Llobregat',
  pace: '5:30 - 5:45',
  paceUnit: 'min/km',
  /** Coordenadas de la cafetería, punto de salida */
  coords: { lat: 41.3290122, lng: 2.0939926 }
} as const

export const LINKS = {
  instagram: 'https://www.instagram.com/run_with_letigre/',
  whatsapp: 'https://chat.whatsapp.com/B6AK3FQ1uRVLn1DNdku4zQ',
  strava: 'https://www.strava.com/clubs/1670299',
  /** Ficha del punto de encuentro en Google Maps */
  maps: 'https://maps.app.goo.gl/daj5PYf6BCS9gUDp6',
  /** Abre la navegación paso a paso hacia la cafetería */
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=41.3290122,2.0939926&destination_place_id=ChIJw0kJ8MSepBIR6qSOKT__c4I'
} as const

export interface Race {
  /** Fecha de la carrera en formato ISO (YYYY-MM-DD) */
  date: string
  name: string
  /** Distancia en kilómetros. `null` si depende del formato */
  km: number | null
  /** Ciudad o pueblo donde se corre */
  place: string
  /** Una frase que explique qué tiene de especial */
  blurb: string
  /** `full` cuando ya no quedan plazas para el grupo */
  status?: 'full'
}

export const RACES: Race[] = [
  {
    date: '2026-08-30',
    name: 'Cursa Maria Víctor',
    km: 7,
    place: 'Palau-solità i Plegamans',
    blurb:
      'Casi 7 km por el bosque de Can Pavana, dentro de la fiesta mayor del pueblo. Tierra, sombra y ambiente de verbena.'
  },
  {
    date: '2026-09-05',
    name: 'Prague Night Run',
    km: 10,
    place: 'Praga',
    blurb:
      '10K de noche por el centro histórico de Praga, con el casco antiguo iluminado y música en cada kilómetro.'
  },
  {
    date: '2026-09-18',
    name: 'Copenhagen 5K',
    km: 5,
    place: 'Copenhague',
    blurb:
      'El 5K de la víspera: sirve para soltar piernas y reconocer el ambiente antes del medio maratón del día siguiente.'
  },
  {
    date: '2026-09-19',
    name: '1/2 Copenhague',
    km: 21,
    place: 'Copenhague',
    blurb:
      'Uno de los medios maratones más rápidos del mundo: llano de principio a fin y con varios récords batidos en su asfalto.'
  },
  {
    date: '2026-10-04',
    name: 'Media de Logroño',
    km: 21,
    place: 'Logroño',
    blurb:
      'La media del Maratón Internacional de Logroño. Urbana, tranquila y con el mejor avituallamiento post-carrera de La Rioja.'
  },
  {
    date: '2026-10-18',
    name: 'Cursa Mercabarna',
    km: 10,
    place: 'Barcelona',
    blurb:
      'Se corre por dentro del mercado mayorista: calles, pabellones de frutas y hortalizas y la lonja del pescado. No se repite en ningún otro 10K.'
  },
  {
    date: '2026-10-25',
    name: '1/2 Valencia',
    km: 21,
    place: 'Valencia',
    blurb:
      'La media maratón más rápida del planeta. Circuito plano, público en todo el recorrido y marca personal casi garantizada.'
  },
  {
    date: '2026-11-08',
    name: 'Behobia - San Sebastián',
    km: 20,
    place: 'Guipúzcoa',
    blurb:
      'La clásica: 20 km de Behobia a Donosti con el Alto de Gaintxurizketa en medio y miles de personas animando en la carretera.'
  },
  {
    date: '2026-11-29',
    name: 'Jean Bouin',
    km: 10,
    place: 'Barcelona',
    blurb:
      'La carrera popular más antigua de España. 10K por Montjuïc y el centro de Barcelona con más de un siglo de historia.'
  },
  {
    date: '2026-12-06',
    name: 'Maratón Valencia',
    km: 42,
    place: 'Valencia',
    blurb:
      'El maratón del año: llano, rapidísimo y con meta flotando sobre la pasarela azul de la Ciudad de las Artes.'
  },
  {
    date: '2026-12-12',
    name: '24 Horas BCN',
    km: null,
    place: 'Barcelona',
    status: 'full',
    blurb:
      'Cupo lleno, pero el año que viene se puede repetir. Pregúntanos y te contamos qué tal es la experiencia de dar vueltas 24 horas seguidas.'
  },
  {
    date: '2026-12-31',
    name: 'Cursa dels Nassos',
    km: 10,
    place: 'Barcelona',
    blurb:
      'La San Silvestre de Barcelona: 10K el 31 de diciembre para despedir el año corriendo antes de la cena.'
  }
]

/** Carreras que aún no han pasado, ordenadas por fecha. */
export function upcomingRaces(now = new Date()): Race[] {
  const today = now.toISOString().slice(0, 10)
  return RACES.filter((race) => race.date >= today).sort((a, b) =>
    a.date.localeCompare(b.date)
  )
}

const MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic'
]

/** `2026-08-30` -> `{ day: '30', month: 'ago' }` */
export function formatRaceDate(date: string) {
  const [, month, day] = date.split('-')
  return { day, month: MONTHS[Number(month) - 1] }
}
