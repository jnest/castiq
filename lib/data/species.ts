import { gaSpecies, type Species } from './species-ga'
import { ncSpecies } from './species-nc'

// Add GA regulations to species that exist in both states
const largemouthWithBoth: Species = {
  ...gaSpecies.find(s => s.id === 'largemouth-bass')!,
  states: ['GA', 'NC'],
}

export const allSpecies: Species[] = [
  largemouthWithBoth,
  ...gaSpecies.filter(s => s.id !== 'largemouth-bass'),
  ...ncSpecies,
]

export function getSpeciesById(id: string): Species | undefined {
  return allSpecies.find(s => s.id === id)
}

export function getSpeciesByState(state: 'GA' | 'NC'): Species[] {
  return allSpecies.filter(s => s.states.includes(state))
}

export function searchSpecies(query: string): Species[] {
  const q = query.toLowerCase()
  return allSpecies.filter(
    s =>
      s.name.toLowerCase().includes(q) ||
      s.scientificName.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q)) ||
      s.habitat.some(h => h.toLowerCase().includes(q))
  )
}

export type { Species }
export { gaSpecies, ncSpecies }
