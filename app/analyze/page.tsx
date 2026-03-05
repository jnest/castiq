'use client'

import { useState, useEffect } from 'react'
import { Camera, MapPin, RefreshCw, AlertCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import CameraCapture from '@/components/camera/CameraCapture'
import WaterAnalysisResults from '@/components/analysis/WaterAnalysis'
import type { WaterAnalysis } from '@/lib/ai/parse-analysis'

interface LocationData {
  lat: number
  lon: number
  label: string
}

export default function AnalyzePage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [capturedMime, setCapturedMime] = useState<string>('image/jpeg')
  const [analysis, setAnalysis] = useState<WaterAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  useEffect(() => {
    requestLocation()
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) return
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°W`,
        })
        setLocationLoading(false)
      },
      () => {
        setLocationLoading(false)
      },
      { timeout: 8000 }
    )
  }

  const handleCapture = async (base64: string, mimeType: string) => {
    setCapturedImage(`data:${mimeType};base64,${base64}`)
    setCapturedMime(mimeType)
    setError(null)
    setAnalysis(null)
    setIsAnalyzing(true)

    try {
      const context = {
        lat: location?.lat,
        lon: location?.lon,
        datetime: new Date().toISOString(),
        weather: 'Current conditions unknown',
        mode: 'analyze' as const,
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          context,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Analysis failed')
      }

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
              <h1 className="text-base font-bold text-white">Water Analysis</h1>
              <div className="flex items-center gap-1.5">
                {locationLoading ? (
                  <span className="text-[10px] text-dark-500">Getting location...</span>
                ) : location ? (
                  <>
                    <MapPin size={10} className="text-depth-400" />
                    <span className="text-[10px] text-dark-400">{location.label}</span>
                  </>
                ) : (
                  <button onClick={requestLocation} className="text-[10px] text-water-400 flex items-center gap-1">
                    <MapPin size={10} />
                    Enable location
                  </button>
                )}
              </div>
            </div>
          </div>

          {(capturedImage || analysis) && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 text-dark-300 text-xs font-medium active:scale-95 transition-transform"
            >
              <RefreshCw size={12} />
              New
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Camera capture */}
        <CameraCapture
          onCapture={handleCapture}
          mode="analyze"
          isAnalyzing={isAnalyzing}
        />

        {/* Error state */}
        {error && (
          <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Analysis Failed</p>
              <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
              <button
                onClick={() => capturedImage && handleCapture(
                  capturedImage.split(',')[1],
                  capturedMime
                )}
                className="text-xs text-red-400 underline mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Analysis results */}
        {analysis && capturedImage && (
          <WaterAnalysisResults
            analysis={analysis}
            imageDataUrl={capturedImage}
          />
        )}

        {/* Empty state hints */}
        {!capturedImage && !isAnalyzing && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider">What AI analyzes</h3>
            {[
              { emoji: '🌊', label: 'Water features', desc: 'Pools, eddies, current seams, structure' },
              { emoji: '🎯', label: 'Cast spots', desc: 'Numbered spots with gear recommendations' },
              { emoji: '🐟', label: 'Target species', desc: 'Based on features, conditions & region' },
              { emoji: '🎣', label: 'Gear selection', desc: 'Specific rigs, baits, and techniques' },
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
