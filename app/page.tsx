'use client'

import Link from 'next/link'
import { Camera, BookOpen, Fish, Waves, ChevronRight, Droplets, Sun, Moon, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useState, useEffect } from 'react'

function getMoonPhase(): { phase: string; emoji: string } {
  const now = new Date()
  const date = now.getDate()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const lp = 2551443
  const newMoon = new Date(1970, 0, 7, 20, 35, 0)
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp
  const age = Math.floor(phase / (24 * 3600))
  if (age < 2) return { phase: 'New Moon', emoji: '🌑' }
  if (age < 7) return { phase: 'Waxing Crescent', emoji: '🌒' }
  if (age < 9) return { phase: 'First Quarter', emoji: '🌓' }
  if (age < 14) return { phase: 'Waxing Gibbous', emoji: '🌔' }
  if (age < 16) return { phase: 'Full Moon', emoji: '🌕' }
  if (age < 22) return { phase: 'Waning Gibbous', emoji: '🌖' }
  if (age < 24) return { phase: 'Last Quarter', emoji: '🌗' }
  return { phase: 'Waning Crescent', emoji: '🌘' }
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 5) return 'Night Fishing?'
  if (hour < 12) return 'Good Morning, Angler'
  if (hour < 17) return 'Good Afternoon, Angler'
  if (hour < 20) return 'Evening Bite Time'
  return 'Night Fishing?'
}

const quickActions = [
  {
    href: '/analyze',
    icon: Camera,
    title: 'Analyze Water',
    description: 'Point camera at water for instant AI fishing guide',
    color: 'from-hook-600 to-hook-700',
    borderColor: 'border-hook-500/30',
    iconBg: 'bg-hook-500/20',
    iconColor: 'text-hook-400',
    badge: 'AI Powered',
    badgeColor: 'bg-hook-500/20 text-hook-300',
    featured: true,
  },
  {
    href: '/fishread',
    icon: BookOpen,
    title: 'FishRead Mode',
    description: 'Learn to read water like a pro guide',
    color: 'from-water-700 to-water-800',
    borderColor: 'border-water-500/30',
    iconBg: 'bg-water-500/20',
    iconColor: 'text-water-400',
    badge: 'Educational',
    badgeColor: 'bg-water-500/20 text-water-300',
    featured: false,
  },
  {
    href: '/catches',
    icon: Fish,
    title: 'Log a Catch',
    description: 'Record your fish with photo, gear & conditions',
    color: 'from-depth-700 to-depth-800',
    borderColor: 'border-depth-500/30',
    iconBg: 'bg-depth-500/20',
    iconColor: 'text-depth-400',
    badge: 'Offline',
    badgeColor: 'bg-depth-500/20 text-depth-300',
    featured: false,
  },
  {
    href: '/conditions',
    icon: Waves,
    title: 'Today\'s Conditions',
    description: 'Weather, solunar & fishing quality score',
    color: 'from-dark-700 to-dark-800',
    borderColor: 'border-dark-500/30',
    iconBg: 'bg-dark-500/20',
    iconColor: 'text-dark-300',
    badge: 'Live',
    badgeColor: 'bg-dark-500/20 text-dark-300',
    featured: false,
  },
]

export default function HomePage() {
  const [moonData, setMoonData] = useState({ phase: 'Full Moon', emoji: '🌕' })
  const [greeting, setGreeting] = useState('Good Morning, Angler')
  const [time, setTime] = useState('')

  useEffect(() => {
    setMoonData(getMoonPhase())
    setGreeting(getGreeting())
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    setTime(fmt.format(new Date()))
  }, [])

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-water-950/80 via-dark-900/60 to-dark-950" />
        <div className="absolute inset-0 bg-glow-blue opacity-40" />

        {/* Animated water lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-water-500/20 to-transparent"
              style={{
                top: `${30 + i * 25}%`,
                width: '100%',
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
        </div>

        <div className="relative px-4 pt-14 pb-8 safe-top">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-depth-400 animate-pulse" />
                <span className="text-xs text-dark-400 font-medium">{date}</span>
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                {greeting}
              </h1>
              <p className="text-dark-400 text-sm mt-1">
                {time && `${time} · `}{moonData.emoji} {moonData.phase}
              </p>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-water-600 to-water-800 flex items-center justify-center glow-blue">
                  <Droplets size={20} className="text-water-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats bar */}
          <div className="mt-6 glass rounded-xl p-3">
            <div className="flex items-center justify-between divide-x divide-dark-700/50">
              <div className="flex flex-col items-center flex-1 px-2">
                <span className="text-xs text-dark-400">Season</span>
                <span className="text-sm font-semibold text-depth-400">
                  {(() => {
                    const m = new Date().getMonth()
                    if (m >= 2 && m <= 4) return '🌿 Spring'
                    if (m >= 5 && m <= 7) return '☀️ Summer'
                    if (m >= 8 && m <= 10) return '🍂 Fall'
                    return '❄️ Winter'
                  })()}
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 px-2">
                <span className="text-xs text-dark-400">Moon</span>
                <span className="text-sm font-semibold text-water-300">{moonData.emoji}</span>
              </div>
              <div className="flex flex-col items-center flex-1 px-2">
                <span className="text-xs text-dark-400">Region</span>
                <span className="text-sm font-semibold text-hook-400">GA / NC</span>
              </div>
              <div className="flex flex-col items-center flex-1 px-2">
                <span className="text-xs text-dark-400">AI Ready</span>
                <span className="text-sm font-semibold text-depth-400">✓ Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 pt-2 pb-4 space-y-3">
        {/* Featured action - Analyze */}
        <Link href="/analyze">
          <div className="relative overflow-hidden rounded-2xl border border-hook-500/30 bg-gradient-to-br from-dark-800 to-dark-900 group active:scale-[0.98] transition-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-hook-600/10 to-hook-800/5" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-hook-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-hook-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-hook-500/30 transition-colors">
                  <Camera size={26} className="text-hook-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-hook-500/20 text-hook-300">
                      AI Powered
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Analyze Water</h2>
                  <p className="text-sm text-dark-400 mt-0.5 leading-snug">
                    Point your camera at water for instant AI fishing guide with cast spot recommendations
                  </p>
                </div>
                <ChevronRight size={18} className="text-dark-500 group-hover:text-hook-400 transition-colors flex-shrink-0 mt-1" />
              </div>

              <div className="mt-4 flex gap-2">
                {['Pools', 'Eddies', 'Structure', 'Gear Recs'].map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-1 rounded-lg bg-dark-700/50 text-dark-400 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>

        {/* Secondary actions grid */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.slice(1).map(({ href, icon: Icon, title, description, borderColor, iconBg, iconColor, badge, badgeColor }) => (
            <Link key={href} href={href}>
              <div className={cn(
                'relative overflow-hidden rounded-2xl border bg-dark-800/60 group active:scale-[0.97] transition-transform h-full',
                borderColor
              )}>
                <div className="p-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', iconBg)}>
                    <Icon size={20} className={iconColor} />
                  </div>
                  <div className={cn('text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block mb-2', badgeColor)}>
                    {badge}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{title}</h3>
                  <p className="text-[11px] text-dark-400 mt-1 leading-snug">{description}</p>
                </div>
                <ChevronRight size={14} className={cn('absolute bottom-3 right-3 text-dark-600 group-hover:text-dark-300 transition-colors')} />
              </div>
            </Link>
          ))}
        </div>

        {/* Species preview teaser */}
        <Link href="/species">
          <div className="relative overflow-hidden rounded-2xl border border-dark-700/50 bg-dark-800/40 group active:scale-[0.98] transition-transform">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-dark-500">Species Database</span>
                  <h3 className="text-base font-bold text-white mt-0.5">GA & NC Fish Guide</h3>
                  <p className="text-xs text-dark-400 mt-0.5">20+ species · Regulations · Seasonal patterns</p>
                </div>
                <div className="flex -space-x-2">
                  {['🐟', '🎣', '🦈'].map((emoji, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-lg border-2 border-dark-800">
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Tips footer */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-depth-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={14} className="text-depth-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Pro Tip</h4>
              <p className="text-xs text-dark-400 mt-0.5 leading-relaxed">
                Fish are most active during solunar peaks — 2 hrs before sunrise and around sunset.
                Check the Conditions tab for today&apos;s best windows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
