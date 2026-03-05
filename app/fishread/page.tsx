'use client'

import { useState } from 'react'
import { BookOpen, RefreshCw, AlertCircle, ChevronLeft, Share2, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import CameraCapture from '@/components/camera/CameraCapture'
import AnnotatedImage from '@/components/analysis/AnnotatedImage'
import type { WaterAnalysis, FishReadAnnotation } from '@/lib/ai/parse-analysis'
import { cn } from '@/lib/utils/cn'

const difficultyConfig = {
  beginner: { color: 'bg-depth-500/20 text-depth-400 border-depth-500/30', label: 'Beginner', icon: '🟢' },
  intermediate: { color: 'bg-hook-500/20 text-hook-400 border-hook-500/30', label: 'Intermediate', icon: '🟡' },
  advanced: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Advanced', icon: '🔴' },
}

export default function FishReadPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<WaterAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(null)

  const handleCapture = async (base64: string, mimeType: string) => {
    setCapturedImage(`data:${mimeType};base64,${base64}`)
    setError(null)
    setAnalysis(null)
    setIsAnalyzing(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          context: { mode: 'fishread', datetime: new Date().toISOString() },
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Analysis failed')
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setCapturedImage(null)
    setAnalysis(null)
    setError(null)
    setIsAnalyzing(false)
    setSelectedAnnotation(null)
  }

  const annotations = analysis?.fishread_annotations || []
  const difficultyGroups = {
    beginner: annotations.filter(a => a.difficulty === 'beginner'),
    intermediate: annotations.filter(a => a.difficulty === 'intermediate'),
    advanced: annotations.filter(a => a.difficulty === 'advanced'),
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-dark-700/50 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors">
              <ChevronLeft size={18} className="text-dark-400" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen size={16} className="text-water-400" />
                FishRead Mode
              </h1>
              <p className="text-[10px] text-dark-400">Learn to read water like a pro</p>
            </div>
          </div>
          {capturedImage && (
            <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 text-dark-300 text-xs font-medium">
              <RefreshCw size={12} />
              New
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <CameraCapture
          onCapture={handleCapture}
          mode="fishread"
          isAnalyzing={isAnalyzing}
        />

        {error && (
          <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {analysis && capturedImage && (
          <div className="space-y-4 animate-fadeIn">
            {/* Annotated image */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-sm font-semibold text-white">Water Reading Map</h3>
                <div className="flex gap-2">
                  {Object.entries(difficultyConfig).map(([key, cfg]) => (
                    <span key={key} className="text-[9px] text-dark-400 flex items-center gap-0.5">
                      {cfg.icon} {cfg.label.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
              <AnnotatedImage
                imageDataUrl={capturedImage}
                features={[]}
                castSpots={[]}
                mode="fishread"
                fishreadAnnotations={annotations}
                showOverlay={true}
              />
            </div>

            {/* Difficulty breakdown */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <GraduationCap size={14} className="text-water-400" />
                Reading Difficulty
              </h3>
              <div className="flex gap-3">
                {Object.entries(difficultyGroups).map(([level, items]) => (
                  <div key={level} className="flex-1 text-center">
                    <div className={cn('rounded-lg py-2 border', difficultyConfig[level as keyof typeof difficultyConfig].color)}>
                      <p className="text-lg font-bold">{items.length}</p>
                      <p className="text-[9px] capitalize">{level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Annotation list */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white px-1">Water Reading Lessons</h3>
              {annotations.map((ann, i) => {
                const cfg = difficultyConfig[ann.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedAnnotation(selectedAnnotation === i ? null : i)}
                    className="w-full glass rounded-xl overflow-hidden text-left transition-all active:scale-[0.98]"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border', cfg.color)}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-white">{ann.feature}</h4>
                            <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full border', cfg.color)}>
                              {cfg.icon} {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-dark-400 font-medium">{ann.label}</p>
                          {selectedAnnotation === i && (
                            <div className="mt-2 animate-fadeIn">
                              <p className="text-xs text-dark-300 leading-relaxed">{ann.lesson}</p>
                              {ann.why_fish_here && (
                                <div className="mt-2 bg-water-500/10 rounded-lg p-2 border border-water-500/20">
                                  <p className="text-[10px] font-bold text-water-400 mb-1">🐟 Why fish are here:</p>
                                  <p className="text-xs text-dark-300 leading-relaxed">{ann.why_fish_here}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Overall assessment */}
            <div className="glass rounded-xl p-4 border border-water-500/20">
              <h3 className="text-sm font-bold text-white mb-2">Overall Assessment</h3>
              <p className="text-sm text-dark-300 leading-relaxed">{analysis.overall_assessment}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!capturedImage && !isAnalyzing && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider">What you'll learn</h3>
            {[
              { emoji: '🌀', label: 'Current seams', desc: 'Food lanes where fish wait and ambush' },
              { emoji: '🪨', label: 'Structure reading', desc: 'How rocks, logs and cover attract fish' },
              { emoji: '💧', label: 'Depth transitions', desc: 'Drop-offs, shelves and pools explained' },
              { emoji: '🌿', label: 'Vegetation clues', desc: 'What weed beds mean for fish behavior' },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="flex items-center gap-3 glass rounded-xl p-3">
                <span className="text-xl">{emoji}</span>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-dark-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
