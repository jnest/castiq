# CastIQ — AI Fishing Guide & Water Reading Coach
## Project Plan v1.0

### Vision
The app that teaches you to fish like a guide. Point your camera at water, get instant AI analysis of fishing potential, learn to read water like a pro, and build your fishing knowledge over time.

### Tech Stack
- **Frontend:** Next.js 14 (App Router) + React + TypeScript
- **UI:** Tailwind CSS + Shadcn/UI components
- **PWA:** next-pwa for offline support + installability
- **Camera:** Web Camera API (MediaDevices)
- **AI Vision:** Anthropic Claude API (claude-sonnet for speed, opus for deep analysis)
- **Maps:** Mapbox GL JS (free tier: 50k loads/mo)
- **Weather:** Open-Meteo API (free, no key needed)
- **Database:** SQLite via better-sqlite3 (local first) → Supabase later for cloud sync
- **State:** Zustand (lightweight, simple)
- **Storage:** IndexedDB for offline catch logs + photos

### Architecture Principles
- **Local-first:** Works offline, syncs when connected
- **API-agnostic AI:** Abstract the vision API so we can swap Claude/GPT/local models
- **Plugin-ready:** Gear recommendations, species data, regulations as swappable modules
- **Mobile-first responsive:** Designed for phones, works on desktop

---

## Feature Breakdown

### 1. Water Analysis (Core)
- Camera capture (photo or 3-5 sec video → key frames)
- Send to Claude Vision with structured prompt including:
  - GPS coordinates → waterway name, known species
  - Current weather/conditions
  - Time of day, season
  - User's experience level
- Returns structured JSON:
  - Identified features (pools, riffles, structure, shade, etc.)
  - Confidence scores
  - Recommended cast spots (relative positions)
  - Per-spot gear cards

### 2. FishRead Mode (Educational)
- Same camera input, different output framing
- Annotated image with labeled features:
  - "Current seam — food lane where fish wait"
  - "Undercut bank — cover for predators"
  - "Foam line — indicates depth transition"
- "Why it matters" explanations
- Difficulty rating (beginner/intermediate/advanced read)
- Share as annotated image (social media ready)

### 3. Gear Recommendations
- Per-spot gear cards:
  - Rig type (Carolina, Texas, drop shot, etc.)
  - Bait/lure (specific product suggestions)
  - Line (type + weight)
  - Hook (size + style)
  - Technique description
  - Alternative rigs
- Based on: species + conditions + water features + season
- Affiliate-ready product links (future)

### 4. Fish Species Database
- **Georgia waters:** Largemouth Bass, Spotted Bass, Striped Bass, Channel Catfish, Blue Catfish, Crappie, Bluegill, Brown Trout (N. GA), Rainbow Trout (N. GA), Shoal Bass, Walleye
- **North Carolina:** + Smallmouth Bass, Muskie, Brook Trout (mountains), Red Drum (coast), Flounder (coast)
- Per species:
  - Photo/illustration
  - Habitat preferences
  - Seasonal behavior patterns (spawn, feeding, migration)
  - Preferred baits by season
  - State regulations (size limits, bag limits, seasons)
  - Fun facts

### 5. Catch Log
- Photo + auto-detected species (future: species ID from photo)
- GPS location (auto)
- Weather conditions (auto-fetched)
- Gear used (from recommendation or manual entry)
- Fish size (length/weight)
- Notes
- Tags (personal best, released, kept)
- Export / share

### 6. Spot Map
- Map view of saved spots + catches
- Heat map of catch density
- Community spots (future: opt-in sharing)
- Waterway info overlay
- Satellite view for water depth estimation
- Filter by species, date range, season

### 7. Conditions Dashboard
- Current weather at location
- Water temperature (estimated from air temp + models)
- Moon phase + solunar data
- "Fishing quality" score for today
- Best times to fish (solunar theory)
- Wind speed/direction
- Barometric pressure trend

---

## File Structure
```
castiq/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout + providers
│   ├── page.tsx            # Home / dashboard
│   ├── analyze/
│   │   └── page.tsx        # Camera + water analysis
│   ├── fishread/
│   │   └── page.tsx        # Educational water reading
│   ├── catches/
│   │   └── page.tsx        # Catch log
│   ├── spots/
│   │   └── page.tsx        # Map view
│   ├── species/
│   │   ├── page.tsx        # Species browser
│   │   └── [id]/page.tsx   # Species detail
│   ├── conditions/
│   │   └── page.tsx        # Weather + fishing conditions
│   └── api/
│       ├── analyze/route.ts    # Vision API proxy
│       ├── weather/route.ts    # Weather data
│       └── species/route.ts    # Species data
├── components/
│   ├── ui/                 # Shadcn components
│   ├── camera/
│   │   ├── CameraCapture.tsx
│   │   └── PhotoPreview.tsx
│   ├── analysis/
│   │   ├── WaterAnalysis.tsx
│   │   ├── CastSpots.tsx
│   │   ├── GearCard.tsx
│   │   └── FishReadAnnotation.tsx
│   ├── catches/
│   │   ├── CatchForm.tsx
│   │   └── CatchCard.tsx
│   ├── map/
│   │   └── SpotMap.tsx
│   └── shared/
│       ├── Navigation.tsx
│       ├── ConditionsBadge.tsx
│       └── SpeciesChip.tsx
├── lib/
│   ├── ai/
│   │   ├── provider.ts         # AI provider abstraction
│   │   ├── prompts.ts          # Structured prompts
│   │   └── parse-analysis.ts   # Response parsing
│   ├── data/
│   │   ├── species-ga.ts       # Georgia species database
│   │   ├── species-nc.ts       # North Carolina species
│   │   ├── regulations.ts      # Fishing regulations
│   │   ├── gear-database.ts    # Gear/rig knowledge base
│   │   └── waterways.ts        # Known waterways + info
│   ├── weather/
│   │   ├── open-meteo.ts       # Weather API client
│   │   └── solunar.ts          # Solunar calculations
│   ├── storage/
│   │   ├── catches.ts          # Catch log CRUD
│   │   ├── spots.ts            # Saved spots
│   │   └── indexeddb.ts        # IndexedDB wrapper
│   └── utils/
│       ├── geo.ts              # Geolocation helpers
│       ├── camera.ts           # Camera utilities
│       └── share.ts            # Social sharing
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   └── species/            # Species images
├── styles/
│   └── globals.css
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Build Order (Priority)
1. Project scaffold + core UI shell + navigation
2. Camera capture component
3. AI vision integration (analyze water photo)
4. Analysis results display + gear cards
5. FishRead educational mode
6. Species database (GA + NC)
7. Catch logging
8. Conditions dashboard
9. Spot map
10. PWA setup + offline support
11. Polish + deploy to Vercel

---

## AI Prompt Strategy

The key insight: We're not asking AI to do impossible things (see through water). We're asking it to do what it's great at — pattern recognition on visible features + knowledge synthesis.

### Water Analysis Prompt Template
```
You are an expert fishing guide analyzing a photo of a body of water.

Location: [waterway name], [state]
GPS: [lat, lon]
Date/Time: [datetime]
Weather: [conditions]
Known species: [list]
Season context: [pre-spawn/spawn/post-spawn/summer/fall/winter]

Analyze this image and return JSON:
{
  "water_type": "river|stream|lake|pond|reservoir|estuary",
  "water_clarity": "clear|stained|murky" + confidence,
  "flow": "still|slow|moderate|fast",
  "features": [
    {
      "type": "pool|riffle|run|eddy|current_break|structure|shade|undercut|foam_line|drop_off|weed_bed",
      "description": "human-readable description",
      "position": {"x": 0-100, "y": 0-100},  // relative % position in image
      "fishing_potential": 1-10,
      "why": "explanation of why this is good/bad for fishing"
    }
  ],
  "cast_recommendations": [
    {
      "spot_name": "descriptive name",
      "position": {"x": 0-100, "y": 0-100},
      "confidence": 1-10,
      "target_species": ["species"],
      "reasoning": "why cast here",
      "gear": {
        "rig": "name + description",
        "bait": "specific recommendation",
        "line": "type + weight",
        "hook": "size + style",
        "technique": "how to fish it",
        "alternatives": ["other options"]
      }
    }
  ],
  "overall_assessment": "paragraph summary",
  "fishread_annotations": [
    {
      "feature": "name",
      "position": {"x": 0-100, "y": 0-100},
      "lesson": "what this teaches about reading water",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}
```

This gives us structured data we can render beautifully in the UI.
