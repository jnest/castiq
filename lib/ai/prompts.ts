export interface AnalysisContext {
  lat?: number
  lon?: number
  waterway?: string
  state?: string
  datetime?: string
  weather?: string
  season?: string
  knownSpecies?: string[]
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced'
  mode?: 'analyze' | 'fishread'
}

export function buildWaterAnalysisPrompt(ctx: AnalysisContext): string {
  const {
    lat,
    lon,
    waterway = 'Unknown waterway',
    state = 'Georgia/North Carolina',
    datetime = new Date().toISOString(),
    weather = 'Unknown conditions',
    season = getSeason(),
    knownSpecies = [],
    experienceLevel = 'intermediate',
    mode = 'analyze',
  } = ctx

  const locationStr = lat && lon ? `GPS: ${lat.toFixed(4)}, ${lon.toFixed(4)}` : 'GPS: Not available'
  const speciesStr = knownSpecies.length > 0 ? knownSpecies.join(', ') : 'Largemouth Bass, Channel Catfish, Bluegill, Crappie'

  return `You are an expert fishing guide with 20+ years of experience reading water in ${state}. Analyze this photo of water and provide detailed fishing intelligence.

Location: ${waterway}, ${state}
${locationStr}
Date/Time: ${datetime}
Weather: ${weather}
Season: ${season}
Known species in area: ${speciesStr}
Angler experience: ${experienceLevel}

Analyze the visible water features and return ONLY valid JSON in exactly this format (no markdown, no explanation, just JSON):

{
  "water_type": "river|stream|lake|pond|reservoir|estuary|creek",
  "water_clarity": "clear|stained|murky",
  "clarity_confidence": 0.0-1.0,
  "flow": "still|slow|moderate|fast",
  "overall_conditions": "poor|fair|good|excellent",
  "conditions_score": 1-10,
  "features": [
    {
      "type": "pool|riffle|run|eddy|current_break|structure|shade|undercut|foam_line|drop_off|weed_bed|point|flat|boulder",
      "description": "specific description of what you see",
      "position": {"x": 0-100, "y": 0-100},
      "size": "small|medium|large",
      "fishing_potential": 1-10,
      "why": "detailed explanation of why this is good/bad for fishing",
      "best_for": ["species that favor this feature"]
    }
  ],
  "cast_recommendations": [
    {
      "spot_name": "descriptive name like 'upstream eddy pocket'",
      "position": {"x": 0-100, "y": 0-100},
      "confidence": 1-10,
      "priority": 1,
      "target_species": ["species"],
      "reasoning": "detailed why cast here explanation",
      "depth_estimate": "shallow|medium|deep",
      "time_of_day_best": "dawn|morning|midday|afternoon|dusk|night",
      "gear": {
        "rig": "rig name and brief description",
        "bait": "specific bait/lure recommendation with color/size",
        "line": "line type and weight e.g. 10lb fluorocarbon",
        "hook": "hook size and style e.g. #2 wide gap",
        "technique": "step by step technique description",
        "retrieve": "slow|medium|fast|erratic|paused",
        "alternatives": ["alternative rig 1", "alternative rig 2"]
      }
    }
  ],
  "overall_assessment": "2-3 sentence summary paragraph",
  "fishing_pressure": "low|medium|high",
  "best_time_window": "description of best time to fish this spot",
  "fishread_annotations": [
    {
      "feature": "feature name",
      "position": {"x": 0-100, "y": 0-100},
      "label": "short label for overlay",
      "lesson": "what this feature teaches about reading water",
      "why_fish_here": "biological/behavioral reason fish use this spot",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}`
}

function getSeason(): string {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'Spring (pre-spawn/spawn)'
  if (month >= 6 && month <= 8) return 'Summer'
  if (month >= 9 && month <= 11) return 'Fall (feeding season)'
  return 'Winter'
}
