'use client'

import { IndexedDBStore } from './indexeddb'

export interface CatchLocation {
  lat: number
  lon: number
  label: string
}

export interface CatchWeather {
  temp: number
  conditions: string
  wind: string
  pressure?: number
}

export interface CatchGear {
  rod?: string
  reel?: string
  line?: string
  bait?: string
  technique?: string
}

export interface CatchWeight {
  lbs: number
  oz: number
}

export type CatchTag = 'pb' | 'released' | 'kept' | 'trophy' | 'night'

export interface CatchRecord {
  id: string
  species: string
  speciesId?: string
  photo?: string // base64 data URL
  date: string // ISO string
  location?: CatchLocation
  weather?: CatchWeather
  lengthIn?: number // inches
  weight?: CatchWeight
  gear?: CatchGear
  notes?: string
  tags: CatchTag[]
  createdAt: string // ISO string
}

const DB_NAME = 'castiq'
const STORE_NAME = 'catches'

let store: IndexedDBStore<CatchRecord> | null = null

function getStore(): IndexedDBStore<CatchRecord> {
  if (!store) {
    store = new IndexedDBStore<CatchRecord>(DB_NAME, STORE_NAME)
  }
  return store
}

export function generateId(): string {
  return `catch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export async function saveCatch(data: Omit<CatchRecord, 'id' | 'createdAt'>): Promise<CatchRecord> {
  const record: CatchRecord = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  await getStore().add(record)
  return record
}

export async function updateCatch(record: CatchRecord): Promise<CatchRecord> {
  await getStore().put(record)
  return record
}

export async function deleteCatch(id: string): Promise<void> {
  await getStore().delete(id)
}

export async function getCatch(id: string): Promise<CatchRecord | undefined> {
  return getStore().get(id)
}

export async function getAllCatches(): Promise<CatchRecord[]> {
  const all = await getStore().getAll()
  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getCatchCount(): Promise<number> {
  return getStore().count()
}

export interface CatchStats {
  total: number
  speciesCounts: Record<string, number>
  mostCaughtSpecies: string | null
  longestFish: { length: number; species: string } | null
  heaviestFish: { weight: CatchWeight; species: string } | null
  personalBests: number
  released: number
}

export async function getCatchStats(): Promise<CatchStats> {
  const catches = await getAllCatches()

  const speciesCounts: Record<string, number> = {}
  let longestFish: { length: number; species: string } | null = null
  let heaviestFish: { weight: CatchWeight; species: string } | null = null
  let personalBests = 0
  let released = 0

  for (const c of catches) {
    // Species counts
    const species = c.species || 'Unknown'
    speciesCounts[species] = (speciesCounts[species] || 0) + 1

    // Longest
    if (c.lengthIn) {
      if (!longestFish || c.lengthIn > longestFish.length) {
        longestFish = { length: c.lengthIn, species }
      }
    }

    // Heaviest
    if (c.weight) {
      const totalOz = c.weight.lbs * 16 + c.weight.oz
      if (!heaviestFish) {
        heaviestFish = { weight: c.weight, species }
      } else {
        const currentBest = heaviestFish.weight.lbs * 16 + heaviestFish.weight.oz
        if (totalOz > currentBest) {
          heaviestFish = { weight: c.weight, species }
        }
      }
    }

    if (c.tags.includes('pb')) personalBests++
    if (c.tags.includes('released')) released++
  }

  const mostCaughtSpecies = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  return {
    total: catches.length,
    speciesCounts,
    mostCaughtSpecies,
    longestFish,
    heaviestFish,
    personalBests,
    released,
  }
}

export function formatWeight(weight: CatchWeight): string {
  if (weight.lbs === 0) return `${weight.oz} oz`
  if (weight.oz === 0) return `${weight.lbs} lb`
  return `${weight.lbs} lb ${weight.oz} oz`
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const TAG_LABELS: Record<CatchTag, { label: string; color: string; emoji: string }> = {
  pb: { label: 'Personal Best', color: 'bg-hook-500/20 text-hook-300', emoji: '\u{1F3C6}' },
  released: { label: 'Released', color: 'bg-water-500/20 text-water-300', emoji: '\u{1F420}' },
  kept: { label: 'Kept', color: 'bg-depth-500/20 text-depth-300', emoji: '\u{1F37D}\uFE0F' },
  trophy: { label: 'Trophy', color: 'bg-yellow-500/20 text-yellow-300', emoji: '\u{1F947}' },
  night: { label: 'Night Fish', color: 'bg-dark-500/20 text-dark-300', emoji: '\u{1F319}' },
}
