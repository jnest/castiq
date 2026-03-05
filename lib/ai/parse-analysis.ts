export interface WaterFeature {
  type: string
  description: string
  position: { x: number; y: number }
  size?: string
  fishing_potential: number
  why: string
  best_for?: string[]
}

export interface GearRecommendation {
  rig: string
  bait: string
  line: string
  hook: string
  technique: string
  retrieve?: string
  alternatives: string[]
}

export interface CastRecommendation {
  spot_name: string
  position: { x: number; y: number }
  confidence: number
  priority: number
  target_species: string[]
  reasoning: string
  depth_estimate?: string
  time_of_day_best?: string
  gear: GearRecommendation
}

export interface FishReadAnnotation {
  feature: string
  position: { x: number; y: number }
  label: string
  lesson: string
  why_fish_here?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface WaterAnalysis {
  water_type: string
  water_clarity: string
  clarity_confidence: number
  flow: string
  overall_conditions: string
  conditions_score: number
  features: WaterFeature[]
  cast_recommendations: CastRecommendation[]
  overall_assessment: string
  fishing_pressure?: string
  best_time_window?: string
  fishread_annotations: FishReadAnnotation[]
}

export function parseAnalysisResponse(text: string): WaterAnalysis {
  // Strip any markdown code fences
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  // Find JSON object
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('No valid JSON found in response')
  }

  const jsonStr = cleaned.slice(start, end + 1)
  const parsed = JSON.parse(jsonStr) as WaterAnalysis

  // Validate required fields
  if (!parsed.features || !Array.isArray(parsed.features)) {
    parsed.features = []
  }
  if (!parsed.cast_recommendations || !Array.isArray(parsed.cast_recommendations)) {
    parsed.cast_recommendations = []
  }
  if (!parsed.fishread_annotations || !Array.isArray(parsed.fishread_annotations)) {
    parsed.fishread_annotations = []
  }

  // Ensure positions are valid numbers
  parsed.features = parsed.features.map(f => ({
    ...f,
    position: {
      x: clamp(Number(f.position?.x) || 50, 5, 95),
      y: clamp(Number(f.position?.y) || 50, 5, 95),
    },
    fishing_potential: clamp(Number(f.fishing_potential) || 5, 1, 10),
  }))

  parsed.cast_recommendations = parsed.cast_recommendations
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .map((c, i) => ({
      ...c,
      position: {
        x: clamp(Number(c.position?.x) || 50, 5, 95),
        y: clamp(Number(c.position?.y) || 50, 5, 95),
      },
      confidence: clamp(Number(c.confidence) || 7, 1, 10),
      priority: c.priority || i + 1,
    }))

  parsed.fishread_annotations = parsed.fishread_annotations.map(a => ({
    ...a,
    position: {
      x: clamp(Number(a.position?.x) || 50, 5, 95),
      y: clamp(Number(a.position?.y) || 50, 5, 95),
    },
  }))

  return parsed
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}
