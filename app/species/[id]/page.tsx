'use client'

import { use } from 'react'
import Link from 'next/link'
import { ChevronLeft, MapPin, Star, Leaf, Snowflake, Sun, Wind } from 'lucide-react'
import { getSpeciesById } from '@/lib/data/species'
import { cn } from '@/lib/utils/cn'

const SEASON_ICONS = {
  spring: <Leaf size={14} className="text-depth-400" />,
  summer: <Sun size={14} className="text-yellow-400" />,
  fall: <Wind size={14} className="text-hook-400" />,
  winter: <Snowflake size={14} className="text-water-400" />,
}

const SEASON_COLORS = {
  spring: 'bg-depth-500/10 border-depth-500/20',
  summer: 'bg-yellow-500/10 border-yellow-500/20',
  fall: 'bg-hook-500/10 border-hook-500/20',
  winter: 'bg-water-500/10 border-water-500/20',
}

const SEASON_TITLE_COLORS = {
  spring: 'text-depth-300',
  summer: 'text-yellow-300',
  fall: 'text-hook-300',
  winter: 'text-water-300',
}

const DIFFICULTY_CONFIG = {
  beginner: { color: 'bg-depth-500/20 text-depth-400 border-depth-500/30', label: 'Beginner Friendly' },
  intermediate: { color: 'bg-hook-500/20 text-hook-400 border-hook-500/30', label: 'Intermediate' },
  advanced: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Advanced' },
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('glass rounded-2xl p-4 border border-dark-700/50', className)}>
      <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  )
}

function RegBlock({ state, reg }: { state: string; reg: { sizeLimit: string; bagLimit: string; season: string; notes?: string } }) {
  return (
    <div className="rounded-xl bg-dark-800/60 p-3">
      <p className="text-xs font-bold text-water-400 mb-2">{state} Regulations</p>
      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="text-[9px] font-semibold text-dark-500 uppercase tracking-wider w-14 shrink-0 pt-0.5">Size</span>
          <span className="text-xs text-dark-200">{reg.sizeLimit}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[9px] font-semibold text-dark-500 uppercase tracking-wider w-14 shrink-0 pt-0.5">Bag</span>
          <span className="text-xs text-dark-200">{reg.bagLimit}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[9px] font-semibold text-dark-500 uppercase tracking-wider w-14 shrink-0 pt-0.5">Season</span>
          <span className="text-xs text-dark-200">{reg.season}</span>
        </div>
        {reg.notes && (
          <p className="text-[10px] text-dark-500 italic pt-1 border-t border-dark-700/30 leading-relaxed">{reg.notes}</p>
        )}
      </div>
    </div>
  )
}

export default function SpeciesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const species = getSpeciesById(id)

  if (!species) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🐟</p>
        <p className="text-dark-400 text-sm">Species not found</p>
        <Link href="/species" className="text-water-400 text-sm underline">Back to species list</Link>
      </div>
    )
  }

  const diffConfig = DIFFICULTY_CONFIG[species.difficulty]
  const seasons: ('spring' | 'summer' | 'fall' | 'winter')[] = ['spring', 'summer', 'fall', 'winter']

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-dark-700/50 safe-top">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/species" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors shrink-0">
            <ChevronLeft size={18} className="text-dark-400" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white truncate">{species.name}</h1>
            <p className="text-[10px] text-dark-500 italic truncate">{species.scientificName}</p>
          </div>
          <span className={cn('text-[9px] font-bold px-2 py-1 rounded-lg border shrink-0', diffConfig.color)}>
            {diffConfig.label}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Hero card */}
        <div className="glass rounded-2xl overflow-hidden border border-dark-700/50">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-dark-700/60 flex items-center justify-center text-5xl border border-dark-600/30 shrink-0">
                {species.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {species.states.map(s => (
                    <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-water-500/20 text-water-400">
                      {s}
                    </span>
                  ))}
                  {species.recordWeight && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                      <Star size={8} /> Record: {species.recordWeight}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {species.waterType.map(wt => (
                    <span key={wt} className="text-[9px] px-1.5 py-0.5 rounded-md bg-dark-700/60 text-dark-400 capitalize">
                      {wt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-dark-300 leading-relaxed mt-4">{species.description}</p>
          </div>
        </div>

        {/* Habitat */}
        <Section title="Habitat">
          <div className="flex flex-wrap gap-1.5">
            {species.habitat.map(h => (
              <span key={h} className="text-[10px] px-2 py-1 rounded-lg bg-dark-800/60 text-dark-300 border border-dark-700/30">
                {h}
              </span>
            ))}
          </div>
        </Section>

        {/* Seasonal behavior */}
        <Section title="Seasonal Behavior">
          <div className="space-y-2">
            {seasons.map(season => (
              <div key={season} className={cn('rounded-xl p-3 border', SEASON_COLORS[season])}>
                <div className="flex items-center gap-2 mb-1.5">
                  {SEASON_ICONS[season]}
                  <span className={cn('text-xs font-bold capitalize', SEASON_TITLE_COLORS[season])}>{season}</span>
                </div>
                <p className="text-[11px] text-dark-300 leading-relaxed">{species.seasonalBehavior[season]}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Preferred baits by season */}
        <Section title="Preferred Baits by Season">
          <div className="space-y-3">
            {seasons.map(season => (
              <div key={season}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {SEASON_ICONS[season]}
                  <span className={cn('text-[10px] font-semibold capitalize', SEASON_TITLE_COLORS[season])}>{season}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {species.preferredBaits[season].map(bait => (
                    <span key={bait} className="text-[10px] px-2 py-0.5 rounded-md bg-dark-800/60 text-dark-300">
                      {bait}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Regulations */}
        <Section title="Regulations">
          <div className="space-y-2">
            {species.regulations.GA && <RegBlock state="Georgia" reg={species.regulations.GA} />}
            {species.regulations.NC && <RegBlock state="North Carolina" reg={species.regulations.NC} />}
          </div>
          <p className="text-[10px] text-dark-500 italic mt-3 leading-relaxed">
            Always verify current regulations with your state DNR before fishing. Rules change seasonally.
          </p>
        </Section>

        {/* Top waters */}
        {(species.topWaters.GA?.length || species.topWaters.NC?.length) && (
          <Section title="Top Waters">
            <div className="space-y-2">
              {species.topWaters.GA && species.topWaters.GA.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-water-400 mb-1.5">Georgia</p>
                  <div className="flex flex-wrap gap-1.5">
                    {species.topWaters.GA.map(w => (
                      <span key={w} className="text-[10px] px-2 py-1 rounded-lg bg-dark-800/60 text-dark-300 flex items-center gap-1">
                        <MapPin size={9} className="text-water-500" /> {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {species.topWaters.NC && species.topWaters.NC.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-hook-400 mb-1.5">North Carolina</p>
                  <div className="flex flex-wrap gap-1.5">
                    {species.topWaters.NC.map(w => (
                      <span key={w} className="text-[10px] px-2 py-1 rounded-lg bg-dark-800/60 text-dark-300 flex items-center gap-1">
                        <MapPin size={9} className="text-hook-500" /> {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Fun facts */}
        <Section title="Fun Facts">
          <div className="space-y-2">
            {species.funFacts.map((fact, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-depth-400 font-bold text-xs mt-0.5 shrink-0">{i + 1}.</span>
                <p className="text-xs text-dark-300 leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
