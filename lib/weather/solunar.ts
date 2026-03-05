export interface MoonPhaseData {
  age: number // days since new moon (0-29.53)
  phase: string
  emoji: string
  illumination: number // 0-100%
  fishingRating: number // 1-10 based on phase
}

export interface SolunarPeriod {
  type: 'major' | 'minor'
  start: Date
  end: Date
  label: string
  isActive: boolean
  minutesUntil: number // negative if active or past
}

export interface SolunarData {
  moonPhase: MoonPhaseData
  periods: SolunarPeriod[]
  bestPeriod: SolunarPeriod | null
  nextPeriod: SolunarPeriod | null
  transitTime: Date
  underFootTime: Date
  rating: number // overall solunar rating 1-10
}

// Reference new moon: January 6, 2000 18:14 UTC
const NEW_MOON_REF = new Date(Date.UTC(2000, 0, 6, 18, 14, 0))
const SYNODIC_PERIOD = 29.530588853 // days

export function getMoonAge(date: Date = new Date()): number {
  const daysSinceRef = (date.getTime() - NEW_MOON_REF.getTime()) / (1000 * 60 * 60 * 24)
  const age = daysSinceRef % SYNODIC_PERIOD
  return age < 0 ? age + SYNODIC_PERIOD : age
}

export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  const age = getMoonAge(date)
  const illumination = Math.round((1 - Math.cos((age / SYNODIC_PERIOD) * 2 * Math.PI)) / 2 * 100)

  let phase: string
  let emoji: string
  let fishingRating: number

  if (age < 1.5) {
    phase = 'New Moon'; emoji = '\u{1F311}'; fishingRating = 9
  } else if (age < 7.4) {
    phase = 'Waxing Crescent'; emoji = '\u{1F312}'; fishingRating = 6
  } else if (age < 9.4) {
    phase = 'First Quarter'; emoji = '\u{1F313}'; fishingRating = 7
  } else if (age < 14.7) {
    phase = 'Waxing Gibbous'; emoji = '\u{1F314}'; fishingRating = 7
  } else if (age < 16.5) {
    phase = 'Full Moon'; emoji = '\u{1F315}'; fishingRating = 9
  } else if (age < 22.1) {
    phase = 'Waning Gibbous'; emoji = '\u{1F316}'; fishingRating = 7
  } else if (age < 24.1) {
    phase = 'Last Quarter'; emoji = '\u{1F317}'; fishingRating = 7
  } else {
    phase = 'Waning Crescent'; emoji = '\u{1F318}'; fishingRating = 6
  }

  return { age, phase, emoji, illumination, fishingRating }
}

// Calculate approximate moon transit time for a given date
// Returns hours (0-24) in local time when moon is at meridian
function getMoonTransitHour(date: Date): number {
  const age = getMoonAge(date)
  // At new moon (age=0), moon transits roughly at solar noon (12:00 local)
  // Each lunar day is ~24h50m, so transit time advances ~50 min/day
  const transitHour = (12 + (age * 24 / SYNODIC_PERIOD) * 24) % 24
  return transitHour
}

export function getSolunarData(date: Date = new Date()): SolunarData {
  const moonPhase = getMoonPhase(date)
  const transitHour = getMoonTransitHour(date)

  // Create dates for moon transit (overhead) and underfoot
  const dateStr = date.toDateString()
  const transitTime = new Date(dateStr)
  transitTime.setHours(Math.floor(transitHour), Math.round((transitHour % 1) * 60), 0, 0)

  const underFootHour = (transitHour + 12) % 24
  const underFootTime = new Date(dateStr)
  if (underFootHour < transitHour) {
    // Underfoot is next day
    underFootTime.setDate(underFootTime.getDate() + 1)
  }
  underFootTime.setHours(Math.floor(underFootHour), Math.round((underFootHour % 1) * 60), 0, 0)

  // Solunar periods (in hours offset from transit):
  // Major 1: transit (moon overhead) - 1 hour window each side
  // Minor 1: transit + 6.2 hours - 30 min window each side
  // Major 2: transit + 12.4 hours (moon underfoot) - 1 hour window each side
  // Minor 2: transit + 18.6 hours - 30 min window each side
  const periodDefs = [
    { offset: 0, type: 'major' as const, duration: 120, label: 'Major (Moon Overhead)' },
    { offset: 6.2, type: 'minor' as const, duration: 60, label: 'Minor (Moonrise)' },
    { offset: 12.4, type: 'major' as const, duration: 120, label: 'Major (Moon Underfoot)' },
    { offset: 18.6, type: 'minor' as const, duration: 60, label: 'Minor (Moonset)' },
  ]

  const now = new Date()

  const periods: SolunarPeriod[] = periodDefs.map(({ offset, type, duration, label }) => {
    const centerHour = (transitHour + offset) % 24
    const center = new Date(dateStr)

    // Handle day boundary
    if (centerHour < transitHour && offset > 0) {
      center.setDate(center.getDate() + 1)
    }
    center.setHours(Math.floor(centerHour), Math.round((centerHour % 1) * 60), 0, 0)

    const halfDuration = duration / 2
    const start = new Date(center.getTime() - halfDuration * 60 * 1000)
    const end = new Date(center.getTime() + halfDuration * 60 * 1000)

    const isActive = now >= start && now <= end
    const minutesUntil = isActive ? 0 : Math.round((start.getTime() - now.getTime()) / (1000 * 60))

    return { type, start, end, label, isActive, minutesUntil }
  })

  // Find best and next periods
  const futurePeriods = periods.filter(p => !p.isActive && p.minutesUntil > 0)
  const activePeriod = periods.find(p => p.isActive) || null
  const nextPeriod = futurePeriods.sort((a, b) => a.minutesUntil - b.minutesUntil)[0] || null
  const bestPeriod = activePeriod || (periods.find(p => p.type === 'major' && p.minutesUntil > 0)) || nextPeriod

  // Overall rating: blend moon phase rating with period timing
  const inMajor = periods.some(p => p.isActive && p.type === 'major')
  const inMinor = periods.some(p => p.isActive && p.type === 'minor')
  const nearMajor = periods.some(p => p.type === 'major' && p.minutesUntil > 0 && p.minutesUntil < 60)

  let rating = moonPhase.fishingRating
  if (inMajor) rating = Math.min(10, rating + 2)
  else if (inMinor) rating = Math.min(10, rating + 1)
  else if (nearMajor) rating = Math.min(10, rating + 1)

  return {
    moonPhase,
    periods,
    bestPeriod,
    nextPeriod,
    transitTime,
    underFootTime,
    rating,
  }
}

export function formatSolunarTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function getSolunarRatingLabel(rating: number): { label: string; color: string } {
  if (rating >= 9) return { label: 'Excellent', color: 'text-depth-400' }
  if (rating >= 7) return { label: 'Good', color: 'text-water-400' }
  if (rating >= 5) return { label: 'Fair', color: 'text-hook-400' }
  return { label: 'Slow', color: 'text-dark-400' }
}
