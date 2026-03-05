'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, Wind, Droplets, Thermometer, Gauge, Sun, Moon, Clock, Star, ArrowUp, ArrowDown, Minus,
} from 'lucide-react'
import { fetchWeather, getFishingQualityScore, type WeatherData } from '@/lib/weather/open-meteo'
import {
  getSolunarData,
  getMoonPhase,
  formatSolunarTime,
  getSolunarRatingLabel,
  type SolunarData,
  type MoonPhaseData,
} from '@/lib/weather/solunar'
import { cn } from '@/lib/utils/cn'

function ScoreDial({ score }: { score: number }) {
  const color =
    score >= 8 ? 'text-depth-400' :
    score >= 6 ? 'text-water-400' :
    score >= 4 ? 'text-hook-400' :
    'text-dark-400'

  const label =
    score >= 8 ? 'Excellent' :
    score >= 6 ? 'Good' :
    score >= 4 ? 'Fair' :
    'Slow'

  const bars = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="glass rounded-2xl p-5 border border-dark-700/50">
      <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-3">Fishing Quality Score</p>
      <div className="flex items-end gap-1 mb-3">
        {bars.map(i => (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-sm transition-all',
              i <= score ? (
                score >= 8 ? 'bg-depth-400' :
                score >= 6 ? 'bg-water-400' :
                score >= 4 ? 'bg-hook-400' :
                'bg-dark-500'
              ) : 'bg-dark-700/50'
            )}
            style={{ height: `${8 + i * 3}px` }}
          />
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-4xl font-bold', color)}>{score}</span>
        <span className="text-dark-400 text-sm">/10</span>
        <span className={cn('ml-auto text-sm font-semibold', color)}>{label}</span>
      </div>
    </div>
  )
}

function WeatherCard({ weather }: { weather: WeatherData }) {
  const trendIcon =
    weather.pressureTrend === 'rising' ? <ArrowUp size={12} className="text-depth-400" /> :
    weather.pressureTrend === 'falling' ? <ArrowDown size={12} className="text-red-400" /> :
    <Minus size={12} className="text-dark-400" />

  const trendColor =
    weather.pressureTrend === 'rising' ? 'text-depth-400' :
    weather.pressureTrend === 'falling' ? 'text-red-400' :
    'text-dark-400'

  return (
    <div className="glass rounded-2xl p-4 border border-dark-700/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-1">Current Conditions</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{weather.emoji}</span>
            <div>
              <p className="text-2xl font-bold text-white">{weather.temperatureF}°F</p>
              <p className="text-xs text-dark-400">{weather.description}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-dark-500">Hi / Lo</p>
          <p className="text-xs text-dark-300 font-medium">{weather.tempMax}° / {weather.tempMin}°</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-water-500/10 flex items-center justify-center shrink-0">
            <Droplets size={14} className="text-water-400" />
          </div>
          <div>
            <p className="text-[9px] text-dark-500 uppercase tracking-wider">Humidity</p>
            <p className="text-xs font-semibold text-dark-200">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-hook-500/10 flex items-center justify-center shrink-0">
            <Wind size={14} className="text-hook-400" />
          </div>
          <div>
            <p className="text-[9px] text-dark-500 uppercase tracking-wider">Wind</p>
            <p className="text-xs font-semibold text-dark-200">{weather.windSpeedMph} mph {weather.windDirectionLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-depth-500/10 flex items-center justify-center shrink-0">
            <Thermometer size={14} className="text-depth-400" />
          </div>
          <div>
            <p className="text-[9px] text-dark-500 uppercase tracking-wider">Water Temp (est)</p>
            <p className="text-xs font-semibold text-depth-300">{weather.estimatedWaterTempF}°F</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-dark-700/50 flex items-center justify-center shrink-0">
            <Gauge size={14} className="text-dark-300" />
          </div>
          <div>
            <p className="text-[9px] text-dark-500 uppercase tracking-wider">Pressure</p>
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-dark-200">{weather.pressure} hPa</p>
              {trendIcon}
              <span className={cn('text-[9px]', trendColor)}>{weather.pressureTrend}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700/30">
        <div className="flex items-center gap-1.5 text-xs text-dark-400">
          <Sun size={12} className="text-yellow-400" /> {weather.sunrise}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-dark-400">
          <Moon size={12} className="text-dark-300" /> {weather.sunset}
        </div>
      </div>
    </div>
  )
}

function MoonCard({ moonPhase }: { moonPhase: MoonPhaseData }) {
  const { label: ratingLabel, color: ratingColor } = getSolunarRatingLabel(moonPhase.fishingRating)

  return (
    <div className="glass rounded-2xl p-4 border border-dark-700/50">
      <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-3">Moon Phase</p>
      <div className="flex items-center gap-4">
        <span className="text-4xl">{moonPhase.emoji}</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{moonPhase.phase}</p>
          <p className="text-[10px] text-dark-400">{moonPhase.illumination}% illuminated</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Star size={10} className={ratingColor} />
            <span className={cn('text-xs font-semibold', ratingColor)}>{ratingLabel} fishing</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-water-400">{moonPhase.fishingRating}</p>
          <p className="text-[9px] text-dark-500">moon rating</p>
        </div>
      </div>

      {/* Illumination bar */}
      <div className="mt-3">
        <div className="h-1.5 rounded-full bg-dark-700/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-dark-500 to-yellow-300/60"
            style={{ width: `${moonPhase.illumination}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function SolunarCard({ solunar }: { solunar: SolunarData }) {
  const now = new Date()

  return (
    <div className="glass rounded-2xl p-4 border border-dark-700/50">
      <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-3">Solunar Feeding Periods</p>

      <div className="space-y-2">
        {solunar.periods.map((period, i) => {
          const isPast = period.end < now && !period.isActive
          return (
            <div
              key={i}
              className={cn(
                'rounded-xl px-3 py-2.5 flex items-center gap-3 transition-all',
                period.isActive
                  ? 'bg-depth-500/20 border border-depth-500/30'
                  : isPast
                    ? 'bg-dark-800/30 opacity-50'
                    : 'bg-dark-800/60'
              )}
            >
              <div className={cn(
                'w-2 h-2 rounded-full shrink-0',
                period.isActive ? 'bg-depth-400 shadow-lg shadow-depth-400/50' :
                period.type === 'major' ? 'bg-water-500' : 'bg-dark-500'
              )} />
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs font-semibold', period.isActive ? 'text-depth-300' : 'text-dark-300')}>
                  {period.type === 'major' ? 'Major' : 'Minor'}
                  {period.isActive && <span className="ml-2 text-[9px] font-bold text-depth-400 uppercase tracking-wider">ACTIVE NOW</span>}
                </p>
                <p className="text-[10px] text-dark-500 truncate">{period.label}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-medium text-dark-300">{formatSolunarTime(period.start)}</p>
                <p className="text-[9px] text-dark-500">to {formatSolunarTime(period.end)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {solunar.nextPeriod && (
        <div className="mt-3 pt-3 border-t border-dark-700/30 flex items-center gap-2">
          <Clock size={12} className="text-water-400 shrink-0" />
          <p className="text-xs text-dark-400">
            Next {solunar.nextPeriod.type}:{' '}
            <span className="text-water-400 font-medium">{formatSolunarTime(solunar.nextPeriod.start)}</span>
            {solunar.nextPeriod.minutesUntil > 0 && (
              <span className="text-dark-500"> ({Math.floor(solunar.nextPeriod.minutesUntil / 60)}h {solunar.nextPeriod.minutesUntil % 60}m away)</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

function BestTimesCard({ weather, solunar }: { weather: WeatherData; solunar: SolunarData }) {
  const times: { label: string; time: string; reason: string; strength: 'strong' | 'good' | 'fair' }[] = []

  const sunrise = weather.sunrise
  const sunset = weather.sunset

  times.push({ label: 'Dawn bite', time: sunrise, reason: 'Low light triggers surface feeding', strength: 'strong' })
  times.push({ label: 'Dusk bite', time: sunset, reason: 'Evening feeding flurry begins', strength: 'strong' })

  solunar.periods
    .filter(p => !p.isActive || p.minutesUntil > -60)
    .slice(0, 2)
    .forEach(p => {
      times.push({
        label: `${p.type === 'major' ? 'Major' : 'Minor'} solunar`,
        time: formatSolunarTime(p.start),
        reason: p.type === 'major' ? 'Peak lunar activity — prime feeding window' : 'Minor lunar activity — worth watching',
        strength: p.type === 'major' ? 'strong' : 'fair',
      })
    })

  const strengthColors = { strong: 'text-depth-400 bg-depth-500/20', good: 'text-water-400 bg-water-500/20', fair: 'text-hook-400 bg-hook-500/20' }

  return (
    <div className="glass rounded-2xl p-4 border border-dark-700/50">
      <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-3">Best Times Today</p>
      <div className="space-y-2">
        {times.map((t, i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0', strengthColors[t.strength])}>
              {t.strength}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-dark-200 truncate">{t.label}</p>
              <p className="text-[10px] text-dark-500 truncate">{t.reason}</p>
            </div>
            <span className="text-xs text-water-400 font-medium shrink-0">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ConditionsPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [solunar, setSolunar] = useState<SolunarData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationName, setLocationName] = useState('Current Location')

  useEffect(() => {
    const solunarData = getSolunarData()
    setSolunar(solunarData)

    if (!navigator.geolocation) {
      setError('Geolocation not available')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const data = await fetchWeather(lat, lon)
          setWeather(data)
        } catch (e) {
          setError('Could not load weather data')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Location permission denied — enable location for weather data')
        setLoading(false)
      },
      { timeout: 10000 }
    )
  }, [])

  const moonPhase = solunar?.moonPhase ?? getMoonPhase()
  const score = weather && solunar ? getFishingQualityScore(weather, solunar.rating) : null
  const { label: solunarLabel, color: solunarColor } = getSolunarRatingLabel(solunar?.rating ?? 5)

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-dark-700/50 safe-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors">
              <ChevronLeft size={18} className="text-dark-400" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white">Conditions</h1>
              <p className="text-[10px] text-dark-400">{locationName}</p>
            </div>
          </div>
          {solunar && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-800">
              <Star size={12} className={solunarColor} />
              <span className={cn('text-xs font-semibold', solunarColor)}>{solunarLabel}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading && (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-dark-400 text-sm animate-pulse">Fetching conditions...</p>
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-4 border border-red-500/20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Fishing score */}
        {score !== null && <ScoreDial score={score} />}

        {/* Weather */}
        {weather && <WeatherCard weather={weather} />}

        {/* Moon */}
        <MoonCard moonPhase={moonPhase} />

        {/* Solunar periods */}
        {solunar && <SolunarCard solunar={solunar} />}

        {/* Best times */}
        {weather && solunar && <BestTimesCard weather={weather} solunar={solunar} />}

        {/* Tip card */}
        <div className="glass rounded-2xl p-4 border border-water-500/10">
          <p className="text-[10px] font-semibold text-water-400 uppercase tracking-wider mb-1.5">Pro Tip</p>
          <p className="text-xs text-dark-300 leading-relaxed">
            {(score ?? 5) >= 7
              ? 'Conditions look prime! Focus on major solunar windows near dawn and dusk for the best action.'
              : (score ?? 5) >= 5
                ? 'Decent conditions — fish structure transitions during solunar periods for best results.'
                : 'Tough conditions today. Slow down presentations, fish deeper structure, and target major solunar windows only.'}
          </p>
        </div>
      </div>
    </div>
  )
}
