'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, X, Trash2, Fish, Scale, Ruler, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import {
  getAllCatches,
  saveCatch,
  deleteCatch,
  getCatchStats,
  formatWeight,
  formatDate,
  TAG_LABELS,
  type CatchRecord,
  type CatchStats,
  type CatchTag,
} from '@/lib/storage/catches'
import { allSpecies } from '@/lib/data/species'
import { cn } from '@/lib/utils/cn'

const GEAR_OPTIONS = {
  rod: ['Spinning', 'Baitcasting', 'Fly rod', 'Ultralight', 'Heavy action'],
  reel: ['Spinning reel', 'Baitcaster', 'Fly reel'],
  line: ['6 lb mono', '8 lb mono', '10 lb mono', '12 lb mono', '20 lb braid', '30 lb braid', '50 lb braid', '4x fluoro', '5x fluoro'],
  bait: ['Plastic worm', 'Jig', 'Crankbait', 'Spinnerbait', 'Topwater', 'Live bait', 'Nightcrawler', 'Shad', 'Crawfish', 'Swimbait', 'Drop shot', 'Carolina rig', 'Ned rig'],
  technique: ['Bottom bouncing', 'Slow roll', 'Fast retrieve', 'Jigging', 'Dead drifting', 'Trolling', 'Topwater walk', 'Finesse'],
}

const ALL_TAGS: CatchTag[] = ['pb', 'released', 'kept', 'trophy', 'night']

const DIFFICULTY_COLORS = {
  beginner: 'text-depth-400',
  intermediate: 'text-hook-400',
  advanced: 'text-red-400',
}

function StatCard({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="glass rounded-xl p-3 text-center">
      <p className={cn('text-xl font-bold', color)}>{value}</p>
      <p className="text-[10px] text-dark-400 leading-tight mt-0.5">{label}</p>
    </div>
  )
}

function CatchCard({ record, onDelete }: { record: CatchRecord; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)

  const weightStr = record.weight ? formatWeight(record.weight) : null
  const lengthStr = record.lengthIn ? `${record.lengthIn}"` : null

  return (
    <div className="glass rounded-2xl overflow-hidden border border-dark-700/50">
      <button
        className="w-full text-left px-4 py-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-white truncate">{record.species}</span>
              {record.tags.map(tag => (
                <span key={tag} className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0', TAG_LABELS[tag].color)}>
                  {TAG_LABELS[tag].emoji}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-dark-400">{formatDate(record.date)}</p>
            <div className="flex items-center gap-3 mt-1.5">
              {lengthStr && (
                <span className="text-xs text-water-400 flex items-center gap-1">
                  <Ruler size={10} /> {lengthStr}
                </span>
              )}
              {weightStr && (
                <span className="text-xs text-hook-400 flex items-center gap-1">
                  <Scale size={10} /> {weightStr}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {expanded ? <ChevronUp size={14} className="text-dark-500" /> : <ChevronDown size={14} className="text-dark-500" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-dark-700/30 pt-3 space-y-2">
          {record.gear && Object.entries(record.gear).some(([, v]) => v) && (
            <div>
              <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-1">Gear</p>
              <div className="flex flex-wrap gap-1.5">
                {record.gear.bait && <span className="text-[10px] px-2 py-0.5 rounded-md bg-dark-700/60 text-dark-300">{record.gear.bait}</span>}
                {record.gear.technique && <span className="text-[10px] px-2 py-0.5 rounded-md bg-dark-700/60 text-dark-300">{record.gear.technique}</span>}
                {record.gear.line && <span className="text-[10px] px-2 py-0.5 rounded-md bg-dark-700/60 text-dark-300">{record.gear.line}</span>}
              </div>
            </div>
          )}
          {record.notes && (
            <div>
              <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-xs text-dark-300 leading-relaxed">{record.notes}</p>
            </div>
          )}
          <button
            onClick={() => onDelete(record.id)}
            className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors mt-2"
          >
            <Trash2 size={12} /> Delete catch
          </button>
        </div>
      )}
    </div>
  )
}

function LogForm({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [species, setSpecies] = useState('')
  const [speciesSearch, setSpeciesSearch] = useState('')
  const [showSpeciesList, setShowSpeciesList] = useState(false)
  const [lengthIn, setLengthIn] = useState('')
  const [weightLbs, setWeightLbs] = useState('')
  const [weightOz, setWeightOz] = useState('')
  const [bait, setBait] = useState('')
  const [technique, setTechnique] = useState('')
  const [line, setLine] = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState<CatchTag[]>([])
  const [saving, setSaving] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const filteredSpecies = speciesSearch
    ? allSpecies.filter(s => s.name.toLowerCase().includes(speciesSearch.toLowerCase()))
    : allSpecies.slice(0, 8)

  const toggleTag = (tag: CatchTag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSave = async () => {
    if (!species.trim()) return
    setSaving(true)
    try {
      const found = allSpecies.find(s => s.name.toLowerCase() === species.toLowerCase())
      await saveCatch({
        species: species.trim(),
        speciesId: found?.id,
        date: new Date(date).toISOString(),
        lengthIn: lengthIn ? parseFloat(lengthIn) : undefined,
        weight: weightLbs || weightOz ? {
          lbs: parseInt(weightLbs || '0', 10),
          oz: parseInt(weightOz || '0', 10),
        } : undefined,
        gear: {
          bait: bait || undefined,
          technique: technique || undefined,
          line: line || undefined,
        },
        notes: notes || undefined,
        tags,
      })
      onSave()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/95 overflow-y-auto safe-top safe-bottom">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Log a Catch</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center bg-dark-800 text-dark-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider block mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white focus:outline-none focus:border-water-500/50 transition-colors"
            />
          </div>

          {/* Species */}
          <div className="relative">
            <label className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider block mb-1.5">Species *</label>
            <input
              type="text"
              value={speciesSearch || species}
              onChange={e => {
                setSpeciesSearch(e.target.value)
                setSpecies(e.target.value)
                setShowSpeciesList(true)
              }}
              onFocus={() => setShowSpeciesList(true)}
              placeholder="Search species..."
              className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-water-500/50 transition-colors"
            />
            {showSpeciesList && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-dark-700/50 rounded-xl overflow-hidden z-10 max-h-48 overflow-y-auto">
                {filteredSpecies.map(s => (
                  <button
                    key={s.id}
                    className="w-full text-left px-3 py-2 text-sm text-dark-200 hover:bg-dark-700/50 flex items-center gap-2"
                    onClick={() => {
                      setSpecies(s.name)
                      setSpeciesSearch('')
                      setShowSpeciesList(false)
                    }}
                  >
                    <span>{s.image}</span>
                    <span>{s.name}</span>
                    <span className={cn('ml-auto text-[9px]', DIFFICULTY_COLORS[s.difficulty])}>{s.difficulty}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Size */}
          <div>
            <label className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider block mb-1.5">Size</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <input
                  type="number"
                  value={lengthIn}
                  onChange={e => setLengthIn(e.target.value)}
                  placeholder="Length"
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-water-500/50 transition-colors"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-dark-500">in</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={weightLbs}
                  onChange={e => setWeightLbs(e.target.value)}
                  placeholder="Weight"
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-water-500/50 transition-colors"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-dark-500">lb</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={weightOz}
                  onChange={e => setWeightOz(e.target.value)}
                  placeholder="Oz"
                  className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-water-500/50 transition-colors"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-dark-500">oz</span>
              </div>
            </div>
          </div>

          {/* Gear */}
          <div>
            <label className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider block mb-1.5">Gear</label>
            <div className="space-y-2">
              <select
                value={bait}
                onChange={e => setBait(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white focus:outline-none focus:border-water-500/50 transition-colors"
              >
                <option value="">Select bait / lure...</option>
                {GEAR_OPTIONS.bait.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select
                value={technique}
                onChange={e => setTechnique(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white focus:outline-none focus:border-water-500/50 transition-colors"
              >
                <option value="">Select technique...</option>
                {GEAR_OPTIONS.technique.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={line}
                onChange={e => setLine(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white focus:outline-none focus:border-water-500/50 transition-colors"
              >
                <option value="">Select line...</option>
                {GEAR_OPTIONS.line.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider block mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    tags.includes(tag)
                      ? cn(TAG_LABELS[tag].color, 'border-current/30')
                      : 'bg-dark-800 text-dark-400 border-dark-700/50'
                  )}
                >
                  {TAG_LABELS[tag].emoji} {TAG_LABELS[tag].label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider block mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Where'd you catch it? Weather conditions, what was working..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-dark-800/80 border border-dark-700/50 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-water-500/50 transition-colors resize-none"
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!species.trim() || saving}
            className="w-full py-3.5 rounded-xl bg-water-600 hover:bg-water-500 disabled:bg-dark-700 disabled:text-dark-500 text-white font-semibold text-sm transition-all active:scale-[0.98]"
          >
            {saving ? 'Saving...' : 'Save Catch'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CatchesPage() {
  const [catches, setCatches] = useState<CatchRecord[]>([])
  const [stats, setStats] = useState<CatchStats | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [all, s] = await Promise.all([getAllCatches(), getCatchStats()])
    setCatches(all)
    setStats(s)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id: string) => {
    await deleteCatch(id)
    load()
  }

  const handleSave = () => {
    setShowForm(false)
    load()
  }

  const speciesCount = stats ? Object.keys(stats.speciesCounts).length : 0
  const biggestFish = stats?.longestFish
    ? `${stats.longestFish.length}" ${stats.longestFish.species}`
    : stats?.heaviestFish
      ? `${formatWeight(stats.heaviestFish.weight)} ${stats.heaviestFish.species}`
      : '—'

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
              <h1 className="text-base font-bold text-white">Catch Log</h1>
              <p className="text-[10px] text-dark-400">{catches.length} catches recorded</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-water-600 hover:bg-water-500 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <Plus size={14} /> Log Catch
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <StatCard value={stats?.total ?? 0} label="Total Catches" color="text-water-400" />
          <StatCard value={speciesCount} label="Species" color="text-hook-400" />
          <StatCard value={stats?.personalBests ?? 0} label="Personal Bests" color="text-yellow-400" />
        </div>

        {/* Biggest fish banner */}
        {(stats?.longestFish || stats?.heaviestFish) && (
          <div className="glass rounded-2xl p-4 mb-5 border border-depth-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-depth-500/20 flex items-center justify-center shrink-0">
                <Fish size={20} className="text-depth-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider">Biggest Catch</p>
                <p className="text-sm font-bold text-white">{biggestFish}</p>
              </div>
            </div>
          </div>
        )}

        {/* Catch list */}
        {loading ? (
          <div className="text-center py-12 text-dark-500 text-sm">Loading...</div>
        ) : catches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎣</p>
            <p className="text-dark-400 text-sm font-medium">No catches yet</p>
            <p className="text-dark-500 text-xs mt-1">Tap "Log Catch" to record your first fish</p>
          </div>
        ) : (
          <div className="space-y-3">
            {catches.map(c => (
              <CatchCard key={c.id} record={c} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showForm && <LogForm onSave={handleSave} onClose={() => setShowForm(false)} />}
    </div>
  )
}
