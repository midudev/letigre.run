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
  street: 'Passatge Fermí Marimon, 3',
  postalCode: '08820',
  city: 'El Prat de Llobregat',
  /** Sin artículo, para frases del tipo «del Prat de Llobregat» */
  cityShort: 'Prat de Llobregat',
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

export interface SpecialRun {
  /** `YYYY-MM-DD` */
  date: string
  /** `HH:MM`. Si se omite se usa la hora habitual del club */
  time?: string
  title: string
  /** Aviso que se muestra bajo el título */
  note?: string
  /** Punto de encuentro distinto al habitual */
  place?: string
}

/**
 * Salidas que se salen de lo normal (otra hora, otro sitio, ruta especial).
 * Tienen prioridad sobre el sábado de siempre si caen antes.
 */
export const SPECIAL_RUNS: SpecialRun[] = []

/** Sábados en los que NO hay salida (puentes, vacaciones, carrera del grupo) */
export const SKIPPED_RUNS: { date: string; reason?: string }[] = []

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
  /** Fondo local de la tarjeta. Cada carrera debe usar una imagen distinta. */
  image: string
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
      'Casi 7 km por el bosque de Can Pavana, dentro de la fiesta mayor del pueblo. Tierra, sombra y ambiente de verbena.',
    image: '/images/races/cursa-maria-victor.webp'
  },
  {
    date: '2026-09-05',
    name: 'Prague Night Run',
    km: 10,
    place: 'Praga',
    blurb:
      '10K de noche por el centro histórico de Praga, con el casco antiguo iluminado y música en cada kilómetro.',
    image: '/images/races/prague-night-run.webp'
  },
  {
    date: '2026-09-18',
    name: 'Copenhagen 5K',
    km: 5,
    place: 'Copenhague',
    blurb:
      'El 5K de la víspera: sirve para soltar piernas y reconocer el ambiente antes del medio maratón del día siguiente.',
    image: '/images/races/copenhagen-5k.webp'
  },
  {
    date: '2026-09-19',
    name: '1/2 Copenhague',
    km: 21,
    place: 'Copenhague',
    blurb:
      'Uno de los medios maratones más rápidos del mundo: llano de principio a fin y con varios récords batidos en su asfalto.',
    image: '/images/races/copenhagen-half.webp'
  },
  {
    date: '2026-09-20',
    name: 'Cursa Popular del Prat',
    km: 10,
    place: 'El Prat de Llobregat',
    blurb:
      'La 10K de casa, dentro de la Festa Major del Prat. Una mañana para correr por nuestras calles con todo el ambiente del pueblo.',
    image: '/images/races/cursa-popular-prat.webp'
  },
  {
    date: '2026-10-04',
    name: 'Media de Logroño',
    km: 21,
    place: 'Logroño',
    blurb:
      'La media del Maratón Internacional de Logroño. Urbana, tranquila y con el mejor avituallamiento post-carrera de La Rioja.',
    image: '/images/races/media-logrono.webp'
  },
  {
    date: '2026-10-18',
    name: 'Cursa Mercabarna',
    km: 10,
    place: 'Barcelona',
    blurb:
      'Se corre por dentro del mercado mayorista: calles, pabellones de frutas y hortalizas y la lonja del pescado. No se repite en ningún otro 10K.',
    image: '/images/races/cursa-mercabarna.webp'
  },
  {
    date: '2026-10-25',
    name: '1/2 Valencia',
    km: 21,
    place: 'Valencia',
    blurb:
      'La media maratón más rápida del planeta. Circuito plano, público en todo el recorrido y marca personal casi garantizada.',
    image: '/images/races/valencia-half.webp'
  },
  {
    date: '2026-11-08',
    name: 'Behobia - San Sebastián',
    km: 20,
    place: 'Guipúzcoa',
    blurb:
      'La clásica: 20 km de Behobia a Donosti con el Alto de Gaintxurizketa en medio y miles de personas animando en la carretera.',
    image: '/images/races/behobia-san-sebastian.webp'
  },
  {
    date: '2026-11-29',
    name: 'Jean Bouin',
    km: 10,
    place: 'Barcelona',
    blurb:
      'La carrera popular más antigua de España. 10K por Montjuïc y el centro de Barcelona con más de un siglo de historia.',
    image: '/images/races/jean-bouin.webp'
  },
  {
    date: '2026-12-06',
    name: 'Maratón Valencia',
    km: 42,
    place: 'Valencia',
    blurb:
      'El maratón del año: llano, rapidísimo y con meta flotando sobre la pasarela azul de la Ciudad de las Artes.',
    image: '/images/races/valencia-marathon.webp'
  },
  {
    date: '2026-12-12',
    name: '24 Horas BCN',
    km: null,
    place: 'Barcelona',
    status: 'full',
    blurb:
      'Cupo lleno, pero el año que viene se puede repetir. Pregúntanos y te contamos qué tal es la experiencia de dar vueltas 24 horas seguidas.',
    image: '/images/races/barcelona-24h.webp'
  },
  {
    date: '2026-12-31',
    name: 'Cursa dels Nassos',
    km: 10,
    place: 'Barcelona',
    blurb:
      'La San Silvestre de Barcelona: 10K el 31 de diciembre para despedir el año corriendo antes de la cena.',
    image: '/images/races/cursa-dels-nassos.webp'
  }
]

const raceImages = RACES.map((race) => race.image)
if (new Set(raceImages).size !== raceImages.length) {
  throw new Error('Cada carrera debe tener una imagen de fondo distinta')
}

export interface FaqItem {
  question: string
  answer: string
}

export const FAQ: FaqItem[] = [
  {
    question: '¿Hace falta apuntarse antes?',
    answer:
      'No. Puedes aparecer el sábado sin avisar. Si es tu primera vez, conviene decirlo en el grupo de WhatsApp para que alguien vaya contigo.'
  },
  {
    question: '¿Hay cuota o hay que ser socio?',
    answer:
      'No. Sin cuotas, sin fichas y sin dorsales. Solo hay que aparecer.'
  },
  {
    question: '¿A qué hora hay que llegar?',
    answer:
      'La salida es a las 8:00. Conviene llegar un poco antes para el café, presentarte y dejar la ropa si la traes.'
  },
  {
    question: '¿Qué llevo?',
    answer:
      'Zapatillas de running, ropa cómoda y, si quieres, un bidón. El café de antes y los croissants de después corren de la casa.'
  },
  {
    question: '¿Solo corréis los sábados?',
    answer:
      'La salida fija es el sábado. Todos los domingos un grupo sale para hacer la tirada larga y siempre lo comentan en el grupo de WhatsApp, además de otras salidas especiales (montaña, bici, viajes a carreras…).'
  },
  {
    question: '¿Cuántos kilómetros se hacen?',
    answer:
      'Alrededor de 10 km, dependiendo de la ruta. Como máximo se hacen 12 km y como mínimo 9.'
  },
  {
    question: '¿Qué rutas se hacen?',
    answer:
      'Tenemos varias rutas que vamos tomando según el día: hacia la playa del Prat, el Delta del Llobregat y los campos cerca del río hacia Cornellà.'
  },
  {
    question: '¿Hacéis montaña?',
    answer:
      'De vez en cuando hay salidas especiales para hacer montaña, pero las salidas semanales son en plano.'
  },
  {
    question: '¿Se corre en serie o se puede ir charlando?',
    answer:
      'El ritmo (5:30–5:45 min/km) está pensado para ir hablando. No es un entreno de series: es una salida social.'
  },
  {
    question: '¿Y si voy más lento?',
    answer:
      '¡No pasa nada! Siempre intentamos adaptarnos a todos los ritmos. Alguien te acompañará o te esperaremos en los puntos acordados.'
  },
  {
    question: '¿Hay grupos por nivel?',
    answer:
      'No solemos partir en packs rígidos. Intentamos que nadie se quede solo y nos reagrupamos en los puntos de espera.'
  },
  {
    question: '¿Sirve si empiezo ahora o vuelvo de lesión?',
    answer:
      'Sí, siempre que puedas mantener un trote suave alrededor de 10 km. Si dudas, avisa en el grupo y te orientamos.'
  },
  {
    question: '¿Se para para beber?',
    answer:
      'Siempre, como mínimo, hacemos una parada y en algunas ocasiones dos y hasta tres. Siempre hay una parada en una fuente aproximadamente a mitad del recorrido, para que puedas hidratarte.'
  },
  {
    question: '¿Se puede dejar la ropa o algo?',
    answer:
      'Sí, totalmente gratis puedes dejar al llegar tus cosas en Le Tigré Cakes y recogerlas cuando volvamos (máximo una prenda o mochila). Ten en cuenta que no nos podemos responsabilizar si traes objetos de valor.'
  },
  {
    question: '¿Hay baño antes o después?',
    answer:
      'Sí, en la cafetería: es el punto de encuentro y también donde volvemos al terminar.'
  },
  {
    question: '¿Los croissants y el café son siempre gratis?',
    answer:
      'Sí. Si vienes a la salida del club, el café de especialidad de antes y los croissants de la vuelta son cortesía de la casa.'
  },
  {
    question: '¿Se cancela si llueve?',
    answer:
      'Nunca hemos cancelado por lluvia. Si algún día pasara, avisaremos por el grupo de WhatsApp y por las stories de Instagram antes de la salida.'
  },
  {
    question: '¿Dónde se aparca / cómo se llega?',
    answer:
      'Quedamos en Le Tigré Cakes (Passatge Fermí Marimon, 3, El Prat de Llobregat). En la web tienes el enlace a Google Maps con la ruta paso a paso.'
  },
  {
    question: '¿Hay que estar en el grupo de WhatsApp o de Strava?',
    answer:
      'No es obligatorio para venir a correr, pero el WhatsApp es donde se avisan cambios, tiradas del domingo y se organizan las carreras. Strava es opcional.'
  },
  {
    question: '¿Puedo venir solo o sola la primera vez?',
    answer:
      'Sí, y es lo habitual. Si avisas en el grupo, alguien te echa un cable para que no te sientas perdido.'
  },
  {
    question: '¿Hacéis carreras o solo salidas de sábado?',
    answer:
      'Las dos cosas: la salida semanal del sábado y un calendario de carreras en grupo (medias, 10K, clásicas…). Si te animas a alguna, lo dices en el WhatsApp y nos organizamos.'
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
