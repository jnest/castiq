'use client'

import { useState } from 'react'
import { Target, Layers, Star, ChevronDown, ChevronUp, Fish, Droplets, Wind, Eye } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { WaterAnalysis } from '@/lib/ai/parse-analysis'
import GearCard from './GearCard'
import AnnotatedImage from './AnnotatedImage'

interface WaterAnalysisResultsProps {
  analysis: WaterAnalysis
  imageDataUrl: string
}

const conditionColors: Record<string, string> = {
  excellent: 'text-depth-400 bg-depth-500/20 border-depth-500/30',
  good: 'text-water-400 bg-water-500/20 border-water-500/30',
  fair: 'text-hook-400 bg-hook-500/20 border-hook-500/30',
  poor: 'text-red-400 bg-red-500/20 border-red-500/30',
}

const clarityIcons: Record<string, string> = {
  clear: '💧',
  stained: '🟤',
  murky: '🌫️',
}

const flowIcons: Record<string, string> = {
  still: '🟰',
  slow: '〰️',
  moderate: '➡️',
  fast: '💨',
}

export default function WaterAnalysisResults({ analysis, imageDataUrl }: WaterAnalysisResultsProps) {
  const [activeSpot, setActiveSpot] = useState(0)
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)
  const [showAnnotated, setShowAnnotated] = useState(true)

  const conditionClass = conditionColors[analysis.overall_conditions] || conditionColors.fair
  const scorePercent = (analysis.conditions_score / 10) * 100

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Conditions Summary Header */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white">Water Analysis</h2>
            <p className="text-xs text-dark-400 mt-0.5 capitalize">
              {analysis.water_type.replace('_', ' ')} · {clarityIcons[analysis.water_clarity]} {analysis.water_clarity} · {flowIcons[analysis.flow]} {analysis.flow} flow
            </p>
          </div>
          <div className={cn('px-3 py-1.5 rounded-full border text-sm font-bold capitalize', conditionClass)}>
            {analysis.overall_conditions}
          </div>
        </div>

        {/* Score bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-dark-400">Fishing Score</span>
            <span className="text-xs font-bold text-white">{analysis.conditions_score}/10</span>
          </div>
          <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-water-600 to-depth-500 transition-all duration-1000"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 bg-dark-700/50 rounded-lg p-2">
            <Layers size={14} className="text-water-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-dark-400">Features</p>
              <p className="text-xs font-bold text-white">{analysis.features.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-dark-700/50 rounded-lg p-2">
            <Target size={14} className="text-hook-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-dark-400">Cast Spots</p>
              <p className="text-xs font-bold text-white">{analysis.cast_recommendations.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-dark-700/50 rounded-lg p-2">
            <Eye size={14} className="text-depth-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-dark-400">Clarity</p>
              <p className="text-xs font-bold text-white capitalize">{analysis.water_clarity}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-dark-300 mt-3 leading-relaxed">{analysis.overall_assessment}</p>
      </div>

      {/* Annotated Image */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-semibold text-white">Water Map</h3>
          <button
            onClick={() => setShowAnnotated(v => !v)}
            className="text-xs text-water-400 flex items-center gap-1"
          >
            {showAnnotated ? 'Hide overlay' : 'Show overlay'}
          </button>
        </div>
        <AnnotatedImage
          imageDataUrl={imageDataUrl}
          features={analysis.features}
          castSpots={analysis.cast_recommendations}
          activeSpot={activeSpot}
          showOverlay={showAnnotated}
          onSpotClick={setActiveSpot}
        />
      </div>

      {/* Cast Spot Selector */}
      {analysis.cast_recommendations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-2 px-1">
            Top Cast Spots
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {analysis.cast_recommendations.map((spot, i) => (
              <button
                key={i}
                onClick={() => setActiveSpot(i)}
                className={cn(
                  'flex-shrink-0 px-3 py-2 rounded-xl border text-left transition-all',
                  activeSpot === i
                    ? 'border-hook-500 bg-hook-500/10 text-white'
                    : 'border-dark-600 bg-dark-800 text-dark-400 hover:border-dark-500'
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn(
                    'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    activeSpot === i ? 'bg-hook-500 text-white' : 'bg-dark-600 text-dark-300'
                  )}>
                    {i + 1}
                  </span>
                  <span className="flex">
                    {[...Array(Math.min(3, Math.ceil(spot.confidence / 3.5)))].map((_, s) => (
                      <Star key={s} size={8} className="text-hook-400 fill-hook-400" />
                    ))}
                  </span>
                </div>
                <p className="text-xs font-medium whitespace-nowrap max-w-[120px] truncate">
                  {spot.spot_name}
                </p>
              </button>
            ))}
          </div>

          {/* Active Spot Gear Card */}
          {analysis.cast_recommendations[activeSpot] && (
            <div className="mt-3">
              <GearCard
                spot={analysis.cast_recommendations[activeSpot]}
                spotNumber={activeSpot + 1}
              />
            </div>
          )}
        </div>
      )}

      {/* Water Features */}
      {analysis.features.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-2 px-1">Water Features</h3>
          <div className="space-y-2">
            {analysis.features.map((feature, i) => (
              <div
                key={i}
                className="glass rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFeature(expandedFeature === i ? null : i)}
                  className="w-full p-3 flex items-center gap-3 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-water-500/20 flex items-center justify-center flex-shrink-0">
                    <Droplets size={14} className="text-water-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white capitalize">
                      {feature.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-dark-400 truncate">{feature.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-bold',
                      feature.fishing_potential >= 8 ? 'bg-depth-500/20 text-depth-400' :
                      feature.fishing_potential >= 6 ? 'bg-water-500/20 text-water-400' :
                      feature.fishing_potential >= 4 ? 'bg-hook-500/20 text-hook-400' :
                      'bg-dark-600 text-dark-400'
                    )}>
                      {feature.fishing_potential}/10
                    </div>
                    {expandedFeature === i ? (
                      <ChevronUp size={14} className="text-dark-500" />
                    ) : (
                      <ChevronDown size={14} className="text-dark-500" />
                    )}
                  </div>
                </button>

                {expandedFeature === i && (
                  <div className="px-3 pb-3 border-t border-dark-700/50">
                    <p className="text-sm text-dark-300 mt-2 leading-relaxed">{feature.why}</p>
                    {feature.best_for && feature.best_for.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Fish size={12} className="text-depth-400" />
                        <div className="flex gap-1 flex-wrap">
                          {feature.best_for.map((species, s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-depth-500/10 text-depth-400">
                              {species}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Time Window */}
      {analysis.best_time_window && (
        <div className="glass rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-hook-500/20 flex items-center justify-center flex-shrink-0">
              <Wind size={14} className="text-hook-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Best Time Window</h4>
              <p className="text-sm text-dark-300 mt-0.5 leading-relaxed">{analysis.best_time_window}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
