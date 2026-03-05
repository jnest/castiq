'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { WaterFeature, CastRecommendation } from '@/lib/ai/parse-analysis'

interface AnnotatedImageProps {
  imageDataUrl: string
  features: WaterFeature[]
  castSpots: CastRecommendation[]
  activeSpot?: number
  showOverlay?: boolean
  mode?: 'analyze' | 'fishread'
  fishreadAnnotations?: Array<{
    feature: string
    position: { x: number; y: number }
    label: string
    lesson: string
    difficulty: string
  }>
  onSpotClick?: (index: number) => void
}

const featureTypeColors: Record<string, string> = {
  pool: '#36a7f5',
  riffle: '#4ade80',
  run: '#7cc3fa',
  eddy: '#0c8de1',
  current_break: '#22c55e',
  structure: '#fb923c',
  shade: '#8b5cf6',
  undercut: '#ec4899',
  foam_line: '#f59e0b',
  drop_off: '#ef4444',
  weed_bed: '#84cc16',
  point: '#14b8a6',
  flat: '#6366f1',
  boulder: '#a78bfa',
  default: '#94a3b8',
}

const difficultyColors: Record<string, string> = {
  beginner: '#4ade80',
  intermediate: '#fb923c',
  advanced: '#ef4444',
}

export default function AnnotatedImage({
  imageDataUrl,
  features,
  castSpots,
  activeSpot,
  showOverlay = true,
  mode = 'analyze',
  fishreadAnnotations = [],
  onSpotClick,
}: AnnotatedImageProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  return (
    <div className="relative rounded-2xl overflow-hidden bg-dark-800">
      <img
        src={imageDataUrl}
        alt="Water analysis"
        className="w-full object-cover"
        style={{ maxHeight: '50vh' }}
      />

      {showOverlay && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'all' }}
        >
          {mode === 'analyze' ? (
            <>
              {/* Feature markers */}
              {features.map((feature, i) => {
                const color = featureTypeColors[feature.type] || featureTypeColors.default
                return (
                  <g key={`feature-${i}`}>
                    {/* Pulse ring */}
                    <circle
                      cx={feature.position.x}
                      cy={feature.position.y}
                      r="3"
                      fill="none"
                      stroke={color}
                      strokeWidth="0.3"
                      opacity="0.4"
                      style={{
                        animation: `ripple 2s ease-out ${i * 0.4}s infinite`,
                        transformOrigin: `${feature.position.x}% ${feature.position.y}%`,
                      }}
                    />
                    <circle
                      cx={feature.position.x}
                      cy={feature.position.y}
                      r="1.5"
                      fill={color}
                      fillOpacity="0.8"
                      stroke="white"
                      strokeWidth="0.2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setTooltip(tooltip?.text === feature.description ? null : {
                        text: feature.description,
                        x: feature.position.x,
                        y: feature.position.y,
                      })}
                    />
                    {/* Label */}
                    <text
                      x={feature.position.x}
                      y={feature.position.y - 2.5}
                      textAnchor="middle"
                      fontSize="2"
                      fill="white"
                      style={{ textShadow: '0 0 4px black', pointerEvents: 'none' }}
                    >
                      {feature.type.replace('_', ' ')}
                    </text>
                  </g>
                )
              })}

              {/* Cast spot markers */}
              {castSpots.map((spot, i) => (
                <g key={`cast-${i}`} style={{ cursor: 'pointer' }} onClick={() => onSpotClick?.(i)}>
                  {/* Target rings */}
                  {[5, 3.5, 2].map((r, ri) => (
                    <circle
                      key={ri}
                      cx={spot.position.x}
                      cy={spot.position.y}
                      r={r}
                      fill="none"
                      stroke={activeSpot === i ? '#f97316' : '#fb923c'}
                      strokeWidth="0.3"
                      opacity={activeSpot === i ? 0.8 - ri * 0.2 : 0.3 - ri * 0.1}
                    />
                  ))}
                  {/* Center dot */}
                  <circle
                    cx={spot.position.x}
                    cy={spot.position.y}
                    r="1.2"
                    fill={activeSpot === i ? '#f97316' : '#fb923c'}
                    stroke="white"
                    strokeWidth="0.3"
                  />
                  {/* Number badge */}
                  <circle
                    cx={spot.position.x + 3}
                    cy={spot.position.y - 3}
                    r="2"
                    fill={activeSpot === i ? '#f97316' : '#1e293b'}
                    stroke={activeSpot === i ? '#f97316' : '#fb923c'}
                    strokeWidth="0.3"
                  />
                  <text
                    x={spot.position.x + 3}
                    y={spot.position.y - 2.4}
                    textAnchor="middle"
                    fontSize="2"
                    fill="white"
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                  >
                    {i + 1}
                  </text>
                </g>
              ))}
            </>
          ) : (
            // FishRead annotations
            <>
              {fishreadAnnotations.map((ann, i) => {
                const color = difficultyColors[ann.difficulty] || '#94a3b8'
                return (
                  <g key={i}>
                    <circle
                      cx={ann.position.x}
                      cy={ann.position.y}
                      r="2.5"
                      fill={color}
                      fillOpacity="0.3"
                      stroke={color}
                      strokeWidth="0.4"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setTooltip(tooltip?.text === ann.lesson ? null : {
                        text: ann.lesson,
                        x: ann.position.x,
                        y: ann.position.y,
                      })}
                    />
                    <text
                      x={ann.position.x}
                      y={ann.position.y + 0.6}
                      textAnchor="middle"
                      fontSize="2"
                      fill="white"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {i + 1}
                    </text>
                    <text
                      x={ann.position.x}
                      y={ann.position.y - 3.5}
                      textAnchor="middle"
                      fontSize="1.8"
                      fill={color}
                      style={{ textShadow: '0 0 3px black', pointerEvents: 'none' }}
                    >
                      {ann.label}
                    </text>
                  </g>
                )
              })}
            </>
          )}

          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect
                x={Math.min(tooltip.x + 2, 60)}
                y={Math.min(tooltip.y + 2, 80)}
                width="35"
                height="10"
                rx="1"
                fill="#0f172a"
                fillOpacity="0.9"
                stroke="#334155"
                strokeWidth="0.2"
              />
              <foreignObject
                x={Math.min(tooltip.x + 2, 60)}
                y={Math.min(tooltip.y + 2, 80)}
                width="35"
                height="10"
              >
                <div style={{
                  color: '#e2e8f0',
                  fontSize: '2px',
                  padding: '1px 2px',
                  lineHeight: 1.4,
                }}>
                  {tooltip.text}
                </div>
              </foreignObject>
            </g>
          )}
        </svg>
      )}

      {/* Legend */}
      {showOverlay && mode === 'analyze' && (
        <div className="absolute bottom-2 left-2 flex gap-2">
          <div className="glass rounded-lg px-2 py-1 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-water-400" />
            <span className="text-[9px] text-white">Feature</span>
          </div>
          <div className="glass rounded-lg px-2 py-1 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-hook-400" />
            <span className="text-[9px] text-white">Cast Spot</span>
          </div>
        </div>
      )}
    </div>
  )
}
