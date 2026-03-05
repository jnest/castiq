'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, Search, Filter, X, ChevronRight } from 'lucide-react'
import { allSpecies, type Species } from '@/lib/data/species'
import { cn } from '@/lib/utils/cn'

const DIFFICULTY_COLORS = {
  beginner: 'bg-depth-500/20 text-depth-400',
  intermediate: 'bg-hook-500/20 text-hook-400',
  advanced: 'bg-red-500/20 text-red-400',
}

const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

const WATER_TYPE_ICONS: Record<string, string> = {
  river: '🏞️',
  lake: '🌊',
  reservoir: '💧',
  stream: '💧',
  pond: '🌎',
  coastal: '🌊',
  'mountain stream': '⛰️',
}

function SpeciesCard({ species }: { species: Species }) {
  const stateLabel = species.states.length > 1
    ? 'GA & NC'
    : species.states[0]

  return (
    <Link href={`/species/${species.id}`}>
      <div className="relative overflow-hidden rounded-2xl border border-dark-700/50 bg-dark-800/60 group active:scale-[0.97] transition-all duration-200 h-full hover:border-water-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-water-900/0 to-water-900/0 group-hover:from-water-900/10 group-hover:to-water-900/5 transition-all duration-300" />

        <div className="p-4">
          {/* Emoji + State badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="w-14 h-14 rounded-xl bg-dark-700/60 flex items-center justify-center text-3xl border border-dark-600/30">
              {species.image}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-water-500/20 text-water-400">
                {stateLabel}
              </span>
              <span className={cn(
                'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                DIFFICULTY_COLORS[species.difficulty]
              )}>
                {DIFFICULTY_LABELS[species.difficulty]}
              </span>
            </div>
          </div>

          {/* Name */}
          <h3 className="text-sm font-bold text-white leading-tight">{species.name}</h3>
          <p className="text-[10px] text-dark-500 italic mt-0.5">{species.scientificName}</p>

          {/* Water types */}
          <div className="flex flex-wrap gap-1 mt-2">
            {species.waterType.slice(0, 2).map(wt => (
              <span key={wt} className="text-[9px] px-1.5 py-0.5 rounded-md bg-dark-700/60 text-dark-400 flex items-center gap-0.5">
                {WATER_TYPE_ICONS[wt] || '💧'} {wt}
              </span>
            ))}
          </div>

          {/* Habitat snippet */}
          <p className="text-[10px] text-dark-400 mt-2 leading-snug line-clamp-2">
            {species.habitat.slice(0, 2).join(' · ')}
          </p>
        </div>

        <ChevronRight size={14} className="absolute bottom-3 right-3 text-dark-600 group-hover:text-water-400 transition-colors" />
      </div>
    </Link>
  )
}

export default function SpeciesPage() {
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState<'all' | 'GA' | 'NC'>('all')
  const [habitatFilter, setHabitatFilter] = useState<'all' | 'freshwater' | 'saltwater'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return allSpecies.filter(s => {
      // Text search
      if (query) {
        const q = query.toLowerCase()
        const match = s.name.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q) ||
          s.tags.some(t => t.includes(q))
        if (!match) return false
      }

      // State filter
      if (stateFilter !== 'all' && !s.states.includes(stateFilter)) return false

      // Habitat filter
      if (habitatFilter === 'freshwater' && s.waterType.includes('coastal')) return false
      if (habitatFilter === 'saltwater' && !s.waterType.includes('coastal')) return false

      // Difficulty
      if (difficultyFilter !== 'all' && s.difficulty !== difficultyFilter) return false

      return true
    })
  }, [query, stateFilter, habitatFilter, difficultyFilter])

  const hasActiveFilters = stateFilter !== 'all' || habitatFilter !== 'all' || difficultyFilter !== 'all'

  const clearFilters = () => {
    setStateFilter('all')
    setHabitatFilter('all')
    setDifficultyFilter('all')
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-dark-700/50 safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors">
                <ChevronLeft size={18} className="text-dark-400" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-white">Species Guide</h1>
                <p className="text-[10px] text-dark-400">
                  {filtered.length} species · GA & NC waters
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                hasActiveFilters
                  ? 'bg-water-500/20 text-water-300 border border-water-500/30'
                  : 'bg-dark-700 text-dark-300'
              )}
            >
              <Filter size={12} />
              Filter
              {hasActiveFilters && (
                <span className="w-4 h-4 rounded-full bg-water-500 text-white text-[9px] flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search species..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-water-500/50 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="px-4 pb-3 space-y-3 border-t border-dark-700/30 pt-3 animate-fadeIn">
            {/* State filter */}
            <div>
              <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-1.5">State</p>
              <div className="flex gap-2">
                {(['all', 'GA', 'NC'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStateFilter(s)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      stateFilter === s
                        ? 'bg-water-500/20 text-water-300 border border-water-500/30'
                        : 'bg-dark-700 text-dark-400'
                    )}
                  >
                    {s === 'all' ? 'All States' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Habitat filter */}
            <div>
              <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-1.5">Habitat</p>
              <div className="flex gap-2">
                {(['all', 'freshwater', 'saltwater'] as const).map(h => (
                  <button
                    key={h}
                    onClick={() => setHabitatFilter(h)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                      habitatFilter === h
                        ? 'bg-depth-500/20 text-depth-300 border border-depth-500/30'
                        : 'bg-dark-700 text-dark-400'
                    )}
                  >
                    {h === 'all' ? 'All' : h}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
            <div>
              <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-1.5">Difficulty</p>
              <div className="flex gap-2">
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                      difficultyFilter === d
                        ? 'bg-hook-500/20 text-hook-300 border border-hook-500/30'
                        : 'bg-dark-700 text-dark-400'
                    )}
                  >
                    {d === 'all' ? 'All' : d}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-water-400 underline">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'GA Species', count: allSpecies.filter(s => s.states.includes('GA')).length, color: 'text-hook-400' },
            { label: 'NC Species', count: allSpecies.filter(s => s.states.includes('NC')).length, color: 'text-water-400' },
            { label: 'Total', count: allSpecies.length, color: 'text-depth-400' },
          ].map(({ label, count, color }) => (
            <div key={label} className="glass rounded-xl p-3 text-center">
              <p className={cn('text-xl font-bold', color)}>{count}</p>
              <p className="text-[10px] text-dark-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🐟</p>
            <p className="text-dark-400 text-sm">No species found</p>
            <button
              onClick={() => { setQuery(''); clearFilters() }}
              className="text-water-400 text-xs underline mt-2"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(species => (
              <SpeciesCard key={species.id} species={species} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

