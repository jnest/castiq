'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Fish, Target, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { CastRecommendation } from '@/lib/ai/parse-analysis'

interface GearCardProps {
  spot: CastRecommendation
  spotNumber: number
}

export default function GearCard({ spot, spotNumber }: GearCardProps) {
  const [showAlts, setShowAlts] = useState(false)

  const confidenceLabel = spot.confidence >= 9 ? 'Hot Spot' :
    spot.confidence >= 7 ? 'Good Bet' :
    spot.confidence >= 5 ? 'Worth Trying' : 'Long Shot'

  const confidenceColor = spot.confidence >= 9 ? 'text-depth-400 bg-depth-500/20 border-depth-500/30' :
    spot.confidence >= 7 ? 'text-water-400 bg-water-500/20 border-water-500/30' :
    spot.confidence >= 5 ? 'text-hook-400 bg-hook-500/20 border-hook-500/30' :
    'text-dark-400 bg-dark-700/50 border-dark-600'

  return (
    <div className="glass rounded-2xl overflow-hidden border border-dark-700/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-hook-600/20 to-dark-800/0 p-4 border-b border-dark-700/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-hook-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-hook-400 font-bold text-sm">{spotNumber}</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm leading-tight">{spot.spot_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {spot.target_species?.slice(0, 2).map((s, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-depth-500/10 text-depth-400 flex items-center gap-1">
                    <Fish size={8} /> {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={cn('px-2 py-1 rounded-lg border text-[10px] font-bold flex-shrink-0', confidenceColor)}>
            {confidenceLabel}
          </div>
        </div>

        <p className="text-xs text-dark-400 mt-2 leading-relaxed">{spot.reasoning}</p>
      </div>

      {/* Gear details */}
      <div className="p-4 space-y-3">
        {/* Primary gear row */}
        <div className="grid grid-cols-2 gap-2">
          <GearItem label="Rig" value={spot.gear.rig} icon="🎣" />
          <GearItem label="Bait/Lure" value={spot.gear.bait} icon="🪱" />
          <GearItem label="Line" value={spot.gear.line} icon="〰️" />
          <GearItem label="Hook" value={spot.gear.hook} icon="🪝" />
        </div>

        {/* Technique */}
        <div className="bg-dark-700/40 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={12} className="text-hook-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-hook-400">Technique</span>
          </div>
          <p className="text-xs text-dark-200 leading-relaxed">{spot.gear.technique}</p>
        </div>

        {/* Additional context */}
        {(spot.depth_estimate || spot.time_of_day_best) && (
          <div className="flex gap-2">
            {spot.depth_estimate && (
              <div className="flex-1 bg-dark-700/30 rounded-lg p-2 text-center">
                <p className="text-[10px] text-dark-400">Depth</p>
                <p className="text-xs font-medium text-white capitalize">{spot.depth_estimate}</p>
              </div>
            )}
            {spot.time_of_day_best && (
              <div className="flex-1 bg-dark-700/30 rounded-lg p-2 text-center">
                <p className="text-[10px] text-dark-400">Best Time</p>
                <p className="text-xs font-medium text-white capitalize">{spot.time_of_day_best}</p>
              </div>
            )}
          </div>
        )}

        {/* Alternatives */}
        {spot.gear.alternatives && spot.gear.alternatives.length > 0 && (
          <div>
            <button
              onClick={() => setShowAlts(v => !v)}
              className="flex items-center gap-1.5 text-xs text-water-400 hover:text-water-300"
            >
              {showAlts ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showAlts ? 'Hide' : 'Show'} alternatives ({spot.gear.alternatives.length})
            </button>
            {showAlts && (
              <div className="mt-2 space-y-1.5 animate-fadeIn">
                {spot.gear.alternatives.map((alt, i) => (
                  <div key={i} className="flex items-start gap-2 bg-dark-700/30 rounded-lg p-2">
                    <Target size={10} className="text-dark-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-dark-300">{alt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function GearItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-dark-700/40 rounded-lg p-2.5">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs">{icon}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-dark-400">{label}</span>
      </div>
      <p className="text-xs text-white leading-snug">{value}</p>
    </div>
  )
}
