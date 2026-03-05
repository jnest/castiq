export interface SeasonalBehavior {
  spring: string
  summer: string
  fall: string
  winter: string
}

export interface SpeciesRegulation {
  sizeLimit: string
  bagLimit: string
  season: string
  notes?: string
}

export interface Species {
  id: string
  name: string
  scientificName: string
  image: string
  description: string
  habitat: string[]
  waterType: ('river' | 'lake' | 'reservoir' | 'stream' | 'pond' | 'coastal' | 'mountain stream')[]
  states: ('GA' | 'NC')[]
  seasonalBehavior: SeasonalBehavior
  preferredBaits: {
    spring: string[]
    summer: string[]
    fall: string[]
    winter: string[]
  }
  regulations: {
    GA?: SpeciesRegulation
    NC?: SpeciesRegulation
  }
  funFacts: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  topWaters: {
    GA?: string[]
    NC?: string[]
  }
  recordWeight?: string
  tags: string[]
}

export const gaSpecies: Species[] = [
  {
    id: 'largemouth-bass',
    name: 'Largemouth Bass',
    scientificName: 'Micropterus salmoides',
    image: '\u{1F41F}',
    description: 'The king of freshwater sport fishing in Georgia. Known for aggressive strikes and spectacular jumps, the largemouth bass is the most sought-after game fish in the state. It thrives in warm, vegetated water and adapts well to lakes, ponds, reservoirs, and slow rivers.',
    habitat: ['Submerged vegetation', 'Laydowns and brush piles', 'Boat docks', 'Points and humps', 'Shallow coves', 'Creek channels'],
    waterType: ['lake', 'reservoir', 'pond', 'river'],
    states: ['GA', 'NC'],
    seasonalBehavior: {
      spring: 'Pre-spawn begins when water hits 55-60\u00b0F. Fish move shallow to spawning flats in 1-6 feet of water. Males build nests; females suspend nearby. Best fishing of the year around the spawn (60-65\u00b0F). Post-spawn bass feed aggressively to recover.',
      summer: 'Bass move deep to thermocline (12-25 ft) during midday heat. Best action is early morning and late evening in shallows. Look for bass relating to points, ledges, and creek channels. Night fishing produces big fish in summer.',
      fall: 'One of the best times to fish. Bass follow shad migrations into the backs of creeks and coves. Feeding aggressively to bulk up for winter. Topwater action can be phenomenal in the morning.',
      winter: 'Bass slow down significantly in cold water (below 50\u00b0F). School on deeper structures like points, channel swings, and humps. Slow presentations essential. Best on sunny afternoons when shallow water warms a few degrees.',
    },
    preferredBaits: {
      spring: ['Swimbaits', 'Jerkbaits', 'Jigs with crawfish trailers', 'Ned rigs', 'Finesse worms', 'Crankbaits (shad colors)', 'Topwater frogs (late spring)'],
      summer: ['Deep-diving crankbaits', 'Carolina rigs', 'Football jigs', 'Drop shots', 'Swimbait on deep ledges', 'Topwater poppers (dawn/dusk)', 'Flukes'],
      fall: ['Topwater walking baits', 'Spinnerbaits', 'Crankbaits (shad colors)', 'Lipless crankbaits', 'Swimbaits', 'Jigs', 'Buzzbaits'],
      winter: ['Blade baits', 'Jigs fished slowly', 'Shakey heads', 'Drop shots', 'Finesse worms', 'Suspending jerkbaits', 'Tubes'],
    },
    regulations: {
      GA: {
        sizeLimit: '12 inches',
        bagLimit: '10 per day (combined largemouth and spotted bass)',
        season: 'Year-round',
        notes: 'No size limit on lake Seminole and Lake Eufaula. Trophy regulations on some waters. Always verify current DNR rules.',
      },
      NC: {
        sizeLimit: '12 inches',
        bagLimit: '5 per day',
        season: 'Year-round',
        notes: 'Some mountain lakes have special regulations. Verify with NC Wildlife Resources Commission.',
      },
    },
    funFacts: [
      'Can detect vibrations with their lateral line up to 50 feet away',
      'Georgia state record is 22 lbs 4 oz, caught on Montgomery Lake in 1932',
      'Largemouth bass males guard the nest and fry aggressively - this is when topwater fishing is most exciting',
      'They can consume prey up to 25-35% of their own body length',
      'Can live up to 16 years in ideal conditions',
    ],
    difficulty: 'beginner',
    topWaters: {
      GA: ['Lake Seminole', 'West Point Lake', 'Lake Oconee', 'Lake Lanier', 'Walter F. George Reservoir', 'Lake Sinclair'],
      NC: ['Lake Norman', 'Jordan Lake', 'Falls Lake', 'Kerr Lake', 'Lake Gaston'],
    },
    recordWeight: '22 lbs 4 oz (World Record - GA)',
    tags: ['bass', 'freshwater', 'popular', 'sport fish'],
  },
  {
    id: 'spotted-bass',
    name: 'Spotted Bass',
    scientificName: 'Micropterus punctulatus',
    image: '\u{1F41F}',
    description: 'Often mistaken for largemouth, spotted bass (or "spots") have a distinctive spotted pattern below the lateral line and a small patch of teeth on their tongue. They prefer current and rocky structure, making them common in Georgia\'s rivers and tailwaters.',
    habitat: ['Rocky points', 'Gravel bars', 'Current seams', 'Rocky bluffs', 'Bridge pilings', 'Main lake points'],
    waterType: ['river', 'reservoir', 'lake'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Spawn slightly earlier than largemouth in the same waters. Prefer rocky gravel in 2-8 feet. Very aggressive during spawn. Pre-spawn fish stack up on points and channel edges.',
      summer: 'Hold to deep rocky structure, ledges, and main lake points. Often found suspended. More tolerant of current than largemouth. Schools often mix with stripers in open water.',
      fall: 'Excellent fall fishing near baitfish schools. Often found on main lake points, channel edges, and near dam tailraces. Follow shad tightly.',
      winter: 'Deeper than largemouth. Target 25-40 feet on main lake points, humps, and rocky structure near channels. Blade baits and jigging spoons excel.',
    },
    preferredBaits: {
      spring: ['Tube jigs', 'Grubs', 'Ned rigs', 'Jerkbaits', 'Finesse jigs', 'Crankbaits (crawfish colors)'],
      summer: ['Drop shots', 'Ned rigs', 'Shad-style swimbaits', 'Deep crankbaits', 'Football jigs', 'Jigging spoons'],
      fall: ['Swimbaits', 'Spinnerbaits', 'Crankbaits', 'Jigging spoons', 'Drop shots', 'Blade baits'],
      winter: ['Blade baits', 'Jigging spoons', 'Drop shots', 'Small jigs', 'Tubes', 'Finesse worms'],
    },
    regulations: {
      GA: {
        sizeLimit: '12 inches',
        bagLimit: '10 per day (combined with largemouth bass)',
        season: 'Year-round',
        notes: 'Counted in the same daily limit as largemouth bass.',
      },
    },
    funFacts: [
      'Has a small tooth patch on the tongue, unlike largemouth bass',
      'Often outperform largemouth in clear, rocky water fisheries',
      'Can hybridize with largemouth bass',
      'Georgia spotted bass world record stood for many years at over 8 lbs',
      'Prefer higher dissolved oxygen levels than largemouth',
    ],
    difficulty: 'intermediate',
    topWaters: {
      GA: ['Lake Lanier', 'Allatoona Lake', 'Chattooga River', 'Coosa River', 'Blue Ridge Lake', 'Carters Lake'],
    },
    recordWeight: '8+ lbs (GA waters)',
    tags: ['bass', 'freshwater', 'rocky structure', 'sport fish'],
  },
  {
    id: 'striped-bass',
    name: 'Striped Bass',
    scientificName: 'Morone saxatilis',
    image: '\u{1F988}',
    description: 'The striper is one of the most powerful freshwater game fish in Georgia. Introduced into inland reservoirs, they form landlocked populations that feed on open-water baitfish. Known for schooling on the surface and creating explosive feeding frenzies, stripers can reach trophy sizes.',
    habitat: ['Open water', 'Main lake basins', 'Creek channel points', 'Tailwater areas below dams', 'Open water over deep structure'],
    waterType: ['lake', 'reservoir', 'river'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Move upriver to spawn when water reaches 60-65\u00b0F. Excellent fishing in tailwaters below dams. Aggressively feed on shad. Surface schools become active.',
      summer: 'Follow shad schools into cooler, deeper water as temperatures rise above 80\u00b0F. Seek thermocline depth. Surface schools at dawn and dusk during baitfish busts.',
      fall: 'Most active period as water cools. Follow shad migrations. Surface feeding frenzies are spectacular. Best months are October-November.',
      winter: 'Move to deeper main lake areas. Less active but still catchable. Concentrate near dam areas and deep creek channels.',
    },
    preferredBaits: {
      spring: ['Live shad', 'White swimbaits', 'Topwater plugs', 'Large spinnerbaits', 'Umbrella rigs', 'Bucktail jigs'],
      summer: ['Live shad (night fishing)', 'Umbrella rigs', 'Downrigger presentations', 'Large swimbaits', 'Popper lures (dawn)'],
      fall: ['Topwater walk-the-dog baits', 'Large swimbaits', 'Umbrella rigs', 'Spinnerbaits', 'Live shad', 'Jigging spoons'],
      winter: ['Live herring', 'Large swimbaits', 'Jigging spoons', 'Deep-diving crankbaits', 'Umbrella rigs'],
    },
    regulations: {
      GA: {
        sizeLimit: '18 inches',
        bagLimit: '5 per day',
        season: 'Year-round on most waters; check tailwaters',
        notes: 'Hybrids (white bass x striped bass) also common in Georgia. Some tailwaters have special regulations during spawning runs.',
      },
    },
    funFacts: [
      'Can swim up to 30 mph in short bursts when chasing bait',
      'Landlocked stripers cannot reproduce naturally - populations maintained by stocking',
      'Surface "busts" occur when schools herd shad against the surface - often visible from a mile away',
      'World record landlocked striper was 67 lbs 8 oz',
      'Can live over 30 years in coastal populations',
    ],
    difficulty: 'intermediate',
    topWaters: {
      GA: ['Lake Lanier', 'Carters Lake', 'Lake Hartwell', 'West Point Lake', 'Lake Walter F. George', 'Clarks Hill Lake'],
    },
    recordWeight: '67 lbs 8 oz (World Record landlocked)',
    tags: ['striper', 'freshwater', 'open water', 'trophy'],
  },
  {
    id: 'channel-catfish',
    name: 'Channel Catfish',
    scientificName: 'Ictalurus punctatus',
    image: '\u{1F421}',
    description: 'The most widely distributed catfish species in Georgia, the channel cat is an excellent table fish and accessible to anglers of all skill levels. Found in virtually every reservoir, river, and pond across the state, they feed primarily on smell and taste using their sensitive barbels.',
    habitat: ['Sandy/gravel bottoms', 'Undercut banks', 'Deep holes', 'Riprap', 'Wing dams', 'Bridge pilings'],
    waterType: ['river', 'lake', 'reservoir', 'pond'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Begin moving into shallower water as temps warm. Pre-spawn feeding is excellent. Spawn in late spring when water hits 75\u00b0F, typically in hollow logs or undercut banks.',
      summer: 'Most active at night. Feed aggressively in warm water. Move to deeper holes during midday. Early morning and after dark are peak times.',
      fall: 'Excellent fall fishing as they bulk up for winter. Active through dusk. Good daytime fishing in rivers during cooler weather.',
      winter: 'Slow down considerably. Congregate in the deepest holes in rivers. Still catchable with slow presentations. Best on warm afternoons.',
    },
    preferredBaits: {
      spring: ['Worms', 'Cut bait (shad or bluegill)', 'Chicken liver', 'Stink bait', 'Minnows', 'Prepared catfish bait'],
      summer: ['Chicken liver', 'Cut shad', 'Stink bait', 'Hot dogs', 'Nightcrawlers', 'Prepared bait dough', 'Skipjack herring'],
      fall: ['Cut bait', 'Worms', 'Chicken liver', 'Shad gizzards', 'Prepared bait', 'Minnows'],
      winter: ['Fresh cut bait', 'Worms', 'Shrimp', 'Small live bream', 'Skipjack herring'],
    },
    regulations: {
      GA: {
        sizeLimit: 'No minimum',
        bagLimit: '25 per day',
        season: 'Year-round',
        notes: 'Combined limit for all catfish species is 25 per day. Some waters may have trophy regulations.',
      },
    },
    funFacts: [
      'Has over 27,000 taste buds - more than any other vertebrate',
      'Can detect scent molecules in water at concentrations as low as 1 part per billion',
      'Males guard eggs and fan them with their fins for 6-10 days until hatching',
      'Can navigate by detecting weak electrical currents in water',
      'State record in Georgia exceeds 44 lbs',
    ],
    difficulty: 'beginner',
    topWaters: {
      GA: ['Flint River', 'Chattahoochee River', 'West Point Lake', 'Lake Hartwell', 'Lake Walter F. George', 'Altamaha River'],
    },
    recordWeight: '58 lbs (World Record)',
    tags: ['catfish', 'freshwater', 'bottom feeder', 'beginner-friendly'],
  },
  {
    id: 'blue-catfish',
    name: 'Blue Catfish',
    scientificName: 'Ictalurus furcatus',
    image: '\u{1F421}',
    description: 'The largest catfish species in North America, the blue catfish inhabits Georgia\'s major rivers and reservoirs. Unlike channel cats, blues are active predators that chase live fish, making them more aggressive and harder-fighting. Trophy-sized fish exceeding 50 lbs are possible in Georgia waters.',
    habitat: ['Deep river channels', 'Below dams and rapids', 'Deep reservoir points', 'Humps and ledges', 'Sandy channel edges'],
    waterType: ['river', 'reservoir', 'lake'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Move upstream and into shallower areas to spawn. Spawn when water reaches 70-75\u00b0F in rocky or sandy areas. Feed heavily on shad in pre-spawn.',
      summer: 'Follow shad into open water. Often found at thermocline depth or near dam tailwaters where oxygenated water attracts baitfish. Night fishing excellent.',
      fall: 'Very aggressive in fall following shad migrations. Will school in river bends and below dam structures. Excellent time for trophy fish.',
      winter: 'Congregate in the deepest sections of river channels. Less active but can be caught with slow presentations near the bottom.',
    },
    preferredBaits: {
      spring: ['Live shad', 'Cut skipjack', 'Live bluegill', 'Cut carp', 'Large nightcrawlers'],
      summer: ['Fresh cut shad', 'Live skipjack herring', 'Cut carp', 'Live shad', 'Large nightcrawlers'],
      fall: ['Live shad', 'Cut shad', 'Skipjack herring', 'Large minnows', 'Cut carp'],
      winter: ['Fresh cut bait', 'Live shad', 'Large nightcrawlers', 'Skipjack herring'],
    },
    regulations: {
      GA: {
        sizeLimit: 'No minimum',
        bagLimit: '25 per day (combined with all catfish)',
        season: 'Year-round',
        notes: 'Check specific water body rules. Some tailwaters have special regulations.',
      },
    },
    funFacts: [
      'Can grow to over 150 lbs in optimal conditions',
      'Unlike channel cats, blues are primarily fish predators',
      'Have been known to live over 20 years',
      'Can detect underwater sounds with incredible precision',
      'The largest blue catfish ever recorded exceeded 140 lbs',
    ],
    difficulty: 'intermediate',
    topWaters: {
      GA: ['Savannah River', 'Chattahoochee River', 'Flint River', 'Altamaha River', 'West Point Lake', 'Clarks Hill Lake'],
    },
    recordWeight: '143 lbs (World Record)',
    tags: ['catfish', 'freshwater', 'trophy', 'predator'],
  },
  {
    id: 'flathead-catfish',
    name: 'Flathead Catfish',
    scientificName: 'Pylodictis olivaris',
    image: '\u{1F421}',
    description: 'The most predatory of Georgia\'s catfish, the flathead (also called "yellow cat" or "mud cat") is a nocturnal ambush predator that prefers live prey. With its distinctive flat head, mottled coloring, and powerful build, it\'s the most challenging catfish to target and can reach massive sizes.',
    habitat: ['Submerged logs and root wads', 'Deep river bends', 'Undercut banks', 'Rocky deep holes', 'Bridge pilings', 'Dense woody debris'],
    waterType: ['river', 'reservoir'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Become active as water warms. Spawn in late spring/early summer in natural cavities. Nest guarding males are very aggressive.',
      summer: 'Peak activity in summer. Strictly nocturnal. Move to shallow cover at night to ambush prey. Return to deep holes by day.',
      fall: 'Continue feeding heavily through fall. Excellent targeting at night near woody structure.',
      winter: 'Retreat to deepest holes. Very inactive in cold water. Rarely caught when water is below 45\u00b0F.',
    },
    preferredBaits: {
      spring: ['Live bluegill', 'Live perch', 'Live suckers', 'Large nightcrawlers'],
      summer: ['Live bluegill', 'Live carp', 'Live suckers', 'Large live shad', 'Live sunfish'],
      fall: ['Live bluegill', 'Live suckers', 'Live perch', 'Large live baitfish'],
      winter: ['Large fresh-dead baitfish', 'Live bluegill', 'Nightcrawlers'],
    },
    regulations: {
      GA: {
        sizeLimit: 'No minimum',
        bagLimit: '5 per day',
        season: 'Year-round',
        notes: 'Lower bag limit reflects conservation value. Only live or freshly killed natural bait recommended.',
      },
    },
    funFacts: [
      'The strictest live-bait specialist among catfish - rarely eats prepared bait',
      'Male flatheads are devoted parents, guarding nests for weeks',
      'Can live 20+ years and grow to 100+ lbs',
      'Often inhabit the same exact location for years',
      'The flattened head is an adaptation for ambushing prey from cover',
    ],
    difficulty: 'advanced',
    topWaters: {
      GA: ['Altamaha River', 'Oconee River', 'Ocmulgee River', 'Flint River', 'Chattahoochee River', 'Savannah River'],
    },
    recordWeight: '123 lbs (World Record)',
    tags: ['catfish', 'freshwater', 'nocturnal', 'trophy', 'predator'],
  },
  {
    id: 'black-crappie',
    name: 'Black Crappie',
    scientificName: 'Pomoxis nigromaculatus',
    image: '\u{1F420}',
    description: 'One of Georgia\'s most popular panfish, the black crappie is prized for its excellent table quality and the finesse technique required to target it. Found in clear water with aquatic vegetation, they school heavily and are often caught in large numbers when located.',
    habitat: ['Brush piles', 'Submerged timber', 'Aquatic vegetation', 'Bridge pilings', 'Dock structures', 'Deeper clear water coves'],
    waterType: ['lake', 'reservoir', 'river', 'pond'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Move shallow to spawn when water hits 62-68\u00b0F. Build nests in 2-6 feet of water near vegetation or brush. Most catchable during and around spawn.',
      summer: 'Move to deeper brush piles and structure (12-25 ft). Best in early morning or evening. Look for brush piles in 15-20 feet of water.',
      fall: 'Move somewhat shallower following baitfish. Excellent fall fishing near wood structure in 8-15 feet.',
      winter: 'Suspend in deeper water. Sluggish but catchable with slow vertical jigging presentations.',
    },
    preferredBaits: {
      spring: ['Small tubes', 'Jigs (1/32-1/16 oz)', 'Live minnows', 'Curly tail grubs', 'Small spinnerbaits'],
      summer: ['Live minnows', 'Small jigs', 'Vertical jigging spoons', 'Curly tail grubs', 'Small swimbaits'],
      fall: ['Small jigs', 'Live minnows', 'Small crankbaits', 'Curly tail grubs', 'Inline spinners'],
      winter: ['Live minnows (slow)', 'Small jigs fished slowly', 'Tiny vertical jigs', 'Maggots under a bobber'],
    },
    regulations: {
      GA: {
        sizeLimit: 'No minimum',
        bagLimit: '25 per day (combined black and white crappie)',
        season: 'Year-round',
        notes: 'Some waters have special size limits. Verify with GA DNR.',
      },
    },
    funFacts: [
      'Has a more random spot pattern than white crappie (which has vertical bars)',
      'Prefers clearer water than white crappie',
      'Can form schools of thousands of fish',
      'The name "crappie" comes from the Canadian French "crapet"',
      'World record black crappie was 6 lbs 5 oz',
    ],
    difficulty: 'beginner',
    topWaters: {
      GA: ['Lake Oconee', 'Lake Sinclair', 'Lake Hartwell', 'West Point Lake', 'Lake Lanier', 'Lake Seminole'],
    },
    recordWeight: '6 lbs 5 oz (World Record)',
    tags: ['panfish', 'crappie', 'freshwater', 'table fish', 'beginner-friendly'],
  },
  {
    id: 'white-crappie',
    name: 'White Crappie',
    scientificName: 'Pomoxis annularis',
    image: '\u{1F420}',
    description: 'The white crappie is slightly more tolerant of turbid water than its black counterpart and often found in more open water near the edges of brush. Distinguished from black crappie by 5-6 dorsal spines (vs 7-8) and vertical bar pattern. Excellent eating and fun to catch.',
    habitat: ['Brush piles', 'Standing timber', 'Weed edges', 'Dam faces', 'Open water over structure', 'Stained water coves'],
    waterType: ['lake', 'reservoir', 'river', 'pond'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Spawn slightly earlier than black crappie. Prefer shallower, murkier water for spawning. Very aggressive during spawn in 1-5 feet.',
      summer: 'Move to deeper brush and structure. Suspend more in open water than black crappie. Fish 10-18 feet near any structure.',
      fall: 'Excellent fall fishing as they follow baitfish. Found somewhat shallower than summer.',
      winter: 'Similar to black crappie - suspend in deep water and are sluggish. Slow vertical presentations.',
    },
    preferredBaits: {
      spring: ['Live minnows', 'Small jigs', 'Curly tail grubs', 'Small spinners', 'Tube jigs'],
      summer: ['Live minnows', 'Jigs (1/32-1/16 oz)', 'Vertical jigging spoons', 'Curly tails'],
      fall: ['Small jigs', 'Live minnows', 'Inline spinners', 'Crankbaits'],
      winter: ['Live minnows', 'Small vertical jigs', 'Maggots', 'Slow-sinking jigs'],
    },
    regulations: {
      GA: {
        sizeLimit: 'No minimum',
        bagLimit: '25 per day (combined with black crappie)',
        season: 'Year-round',
        notes: 'Combined crappie limit. Verify specific water regulations.',
      },
    },
    funFacts: [
      'More tolerant of turbidity and temperature extremes than black crappie',
      'Has vertical bars on its sides, unlike the random spots of black crappie',
      'Has 5-6 dorsal spines (black crappie has 7-8)',
      'Often found in the same waters as black crappie',
      'Can hybridize with black crappie',
    ],
    difficulty: 'beginner',
    topWaters: {
      GA: ['West Point Lake', 'Lake Walter F. George', 'Lake Seminole', 'Clarks Hill Lake', 'Lake Oconee'],
    },
    recordWeight: '5 lbs 3 oz (World Record)',
    tags: ['panfish', 'crappie', 'freshwater', 'table fish', 'beginner-friendly'],
  },
  {
    id: 'bluegill',
    name: 'Bluegill',
    scientificName: 'Lepomis macrochirus',
    image: '\u{1F420}',
    description: 'America\'s most popular panfish and the gateway fish for many young anglers. The bluegill is abundant in virtually every body of water in Georgia. While modest in size, their aggressive nature, willingness to bite almost anything, and outstanding flavor make them a beloved target.',
    habitat: ['Lily pads', 'Weed beds', 'Dock structures', 'Brush piles', 'Shallow warm coves', 'Log jams'],
    waterType: ['lake', 'pond', 'reservoir', 'river', 'stream'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Spawn in large colonies on sandy or gravel substrate in 1-4 feet of water. Multiple spawn cycles May through August. Males guard nests and bite aggressively.',
      summer: 'Most active in morning and evening. Relate to vegetation and structure. Excellent in ponds and small lakes. Midday move slightly deeper.',
      fall: 'Feed actively as water cools. Move slightly deeper but still accessible in shallows during warm afternoons.',
      winter: 'Slow down considerably. School in deepest available water. Still catchable with tiny jigs fished slowly.',
    },
    preferredBaits: {
      spring: ['Red worms', 'Small crickets', 'Tiny jigs', 'Wax worms', 'Small spinners', 'Small flies'],
      summer: ['Crickets', 'Red worms', 'Grasshoppers', 'Tiny poppers', 'Small rubber spiders', 'Bread balls'],
      fall: ['Worms', 'Crickets', 'Small jigs', 'Tiny spinners', 'Wax worms'],
      winter: ['Wax worms', 'Red worms (slow)', 'Tiny jigs', 'Maggots', 'Small grubs'],
    },
    regulations: {
      GA: {
        sizeLimit: 'No minimum',
        bagLimit: '50 per day',
        season: 'Year-round',
        notes: 'Generous limits reflect abundant population. Combined sunfish limit on some waters.',
      },
    },
    funFacts: [
      'Spawns multiple times per year - hence why populations stay high',
      'Can consume more than its body weight in insects in a single day during feeding frenzies',
      'Has brilliant, iridescent blue and orange coloring during spawn',
      'World record is over 4 lbs, but most fish are 1/2 to 3/4 lb',
      'Excellent fly fishing target - will take dry flies aggressively',
    ],
    difficulty: 'beginner',
    topWaters: {
      GA: ['Lake Oconee', 'Lake Sinclair', 'West Point Lake', 'Lake Hartwell', 'Countless ponds across GA'],
    },
    recordWeight: '4 lbs 12 oz (World Record)',
    tags: ['panfish', 'freshwater', 'beginner-friendly', 'table fish', 'abundant'],
  },
  {
    id: 'rainbow-trout',
    name: 'Rainbow Trout',
    scientificName: 'Oncorhynchus mykiss',
    image: '\u{1F41F}',
    description: 'The most common trout in North Georgia\'s cold mountain streams, the rainbow trout is both stocked extensively by GA DNR and found wild in higher-elevation streams. Known for beautiful coloring with a pink lateral band and black spots, they\'re the premier cold-water sport fish of the North Georgia mountains.',
    habitat: ['Cold mountain streams', 'Pools below riffles', 'Current seams', 'Behind boulders', 'Undercut banks', 'Deep pools'],
    waterType: ['mountain stream', 'stream', 'river'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Most active in spring as water temperatures hit ideal range (52-60\u00b0F). Spawn run in late winter/early spring. Heavy stocking by DNR in spring.',
      summer: 'Move to coldest sections - spring-fed pools, deep shaded runs. Most active early morning. Often found near springs. Difficult in warm water (above 68\u00b0F).',
      fall: 'Excellent fall fishing as water cools. Actively feed before winter. Good topwater/dry fly action on hatching insects.',
      winter: 'Active in properly cold streams (40-50\u00b0F). Feed on nymphs and small minnows. Stocked in some GA trout waters year-round.',
    },
    preferredBaits: {
      spring: ['Powerbait', 'Worms', 'Small spinners (Panther Martin)', 'Egg imitations', 'Minnow lures', 'Small spoons'],
      summer: ['Small dark nymphs', 'Small spinners', 'Worms (early AM)', 'Small dry flies on evening hatches', 'Live minnows'],
      fall: ['Small spinners', 'Spoons', 'Minnow lures', 'Worms', 'Dry flies on evening hatches', 'Streamers'],
      winter: ['Powerbait', 'Worms fished slowly', 'Small jigs', 'Egg patterns', 'Minnows', 'Small spoons'],
    },
    regulations: {
      GA: {
        sizeLimit: '7 inches (most trout waters)',
        bagLimit: '8 per day',
        season: 'Check GA DNR - some streams catch-and-release only; trophy sections exist',
        notes: 'Regulations vary significantly by stream section. Always check GA DNR Fishing Guide for specific stream regulations. Some streams are delayed-harvest or special regulation.',
      },
    },
    funFacts: [
      'Native to Pacific Coast rivers but widely introduced across the eastern US and Georgia',
      'Can detect dissolved oxygen levels with remarkable precision',
      'The pink lateral "rainbow" stripe intensifies dramatically in spawning males',
      'Require water temperature below 68\u00b0F to survive long-term',
      'Wild (non-stocked) rainbow trout in GA streams are called "wild bows" - highly prized by fly fishers',
    ],
    difficulty: 'intermediate',
    topWaters: {
      GA: ['Toccoa River', 'Chattahoochee River (above Helen)', 'Soque River', 'Dukes Creek', 'Cooper Creek', 'Rock Creek'],
    },
    recordWeight: '42 lbs 2 oz (World Record)',
    tags: ['trout', 'cold water', 'mountain', 'stocked', 'fly fishing'],
  },
  {
    id: 'brown-trout',
    name: 'Brown Trout',
    scientificName: 'Salmo trutta',
    image: '\u{1F41F}',
    description: 'The most wary and challenging trout species, brown trout have established wild reproducing populations in a handful of North Georgia\'s coldest streams. Larger and more selective than rainbow trout, they require more precise presentations and finer tackle. Catching a wild brown trout in Georgia is a genuine achievement.',
    habitat: ['Deep pools under overhanging banks', 'Log jams', 'Root systems', 'Deepest coldest pools', 'Near springs', 'Undercut shale banks'],
    waterType: ['mountain stream', 'stream'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Spawn in late fall/early winter, so spring fish are recovering. Feed actively as water warms from winter lows. Early season = streamer fishing.',
      summer: 'Become strictly nocturnal in warm months. Hide deep during day. Night fishing with large streamers or mice imitations is the summer tactic for big browns.',
      fall: 'Pre-spawn feeding frenzy in September-October. Most aggressive of the year before late November spawn. Best time to catch a trophy brown.',
      winter: 'Spawn November-January in gravel riffles. Post-spawn fish are in recovery. Catch-and-release recommended during spawn season.',
    },
    preferredBaits: {
      spring: ['Streamers (Woolly Bugger, Muddler)', 'Large minnow lures', 'Spinners', 'Crawfish patterns', 'Worms'],
      summer: ['Large streamers (night)', 'Mice imitations (night)', 'Large dry flies on evening hatches', 'Sculpin patterns'],
      fall: ['Large streamers', 'Minnow-imitating lures', 'Egg patterns', 'Large spinners', 'Rapala-style lures'],
      winter: ['Small nymphs', 'Egg patterns', 'Small streamers', 'Powerbait (stocked fish)'],
    },
    regulations: {
      GA: {
        sizeLimit: '7 inches (general); some special regulation streams have 12-15" limits',
        bagLimit: '8 per day (general); catch-and-release only on some trophy streams',
        season: 'Year-round on most streams; check stream-specific regulations carefully',
        notes: 'Brown trout regulations vary significantly by stream. Many quality streams require single hooks or fly-fishing only. Always consult the GA DNR Trout Regulations before fishing.',
      },
    },
    funFacts: [
      'Native to Europe, introduced to North America in 1883 and now widely established',
      'More selective and wary than rainbow trout - hence the saying "brown trout make you humble"',
      'Can reach 30+ lbs in prime tail-water fisheries',
      'The largest wild brown trout in Georgia rivers are measured in ounces, making them incredibly prized',
      'Feed almost exclusively at night when water temperatures exceed 65\u00b0F',
    ],
    difficulty: 'advanced',
    topWaters: {
      GA: ['Toccoa River', 'Upper Chattahoochee River', 'Soque River (trophy section)', 'Dukes Creek', 'Coleman River'],
    },
    recordWeight: '44 lbs 5 oz (World Record)',
    tags: ['trout', 'cold water', 'mountain', 'wild', 'fly fishing', 'advanced'],
  },
  {
    id: 'shoal-bass',
    name: 'Shoal Bass',
    scientificName: 'Micropterus cataractae',
    image: '\u{1F41F}',
    description: 'A Georgia native and one of the most regionally specific gamefish in North America. The shoal bass is found primarily in Georgia\'s Flint and Chattahoochee river systems, where it thrives in fast, rocky shoal habitat. Only recently recognized as a distinct species (1999), it\'s on every serious Georgia angler\'s bucket list.',
    habitat: ['Shoals and rapids', 'Rocky runs', 'Fast current near boulders', 'Eddies below shoals', 'Rocky river banks', 'Ledge rock outcroppings'],
    waterType: ['river', 'stream'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Most active during spring spawn (May-June) when water is 65-72\u00b0F. Males guard nests on gravel in moderate current. Aggressive strike zone.',
      summer: 'Prefer fast, well-oxygenated shoal water. Extremely active in summer - the best season for shoal bass. Feed actively during daylight in riffles.',
      fall: 'Excellent fall fishing as they feed aggressively. Follow baitfish into slower eddies. October is prime time.',
      winter: 'Move to deeper pools adjacent to shoals. Less active but still catchable with slower presentations near bottom.',
    },
    preferredBaits: {
      spring: ['Crawfish-colored crankbaits', 'Tube jigs', 'Topwater poppers', 'Inline spinners', 'Small swimbaits'],
      summer: ['Topwater lures (buzzbaits, poppers)', 'Inline spinners', 'Crankbaits', 'Ned rigs', 'Small streamers'],
      fall: ['Small crankbaits', 'Spinnerbaits', 'Topwater', 'Inline spinners', 'Swimbaits'],
      winter: ['Tubes', 'Jigs', 'Finesse worms', 'Small crankbaits (slow)'],
    },
    regulations: {
      GA: {
        sizeLimit: '12 inches',
        bagLimit: '5 per day',
        season: 'Year-round; verify current rules',
        notes: 'Lower bag limit reflects conservation importance of this Georgia-endemic species. Many anglers practice full catch-and-release.',
      },
    },
    funFacts: [
      'Was only scientifically recognized as a distinct species in 1999',
      'Endemic to portions of the Flint River and Chattahoochee River systems',
      'Listed as a species of concern due to habitat loss from river impoundment',
      'Will take flies and lures with equal enthusiasm in their shoal habitat',
      'The name "shoal bass" refers to their preference for shoal (rocky rapid) habitat',
    ],
    difficulty: 'intermediate',
    topWaters: {
      GA: ['Flint River (middle section)', 'Chattahoochee River (below Morgan Falls)', 'Ichawaynochaway Creek', 'Muckalee Creek'],
    },
    recordWeight: '8+ lbs',
    tags: ['bass', 'freshwater', 'georgia endemic', 'river fish', 'conservation'],
  },
  {
    id: 'walleye',
    name: 'Walleye',
    scientificName: 'Sander vitreus',
    image: '\u{1F41F}',
    description: 'Introduced into select Georgia reservoirs, walleye are prized for their excellent meat quality and the challenge they present to anglers. Named for their distinctive cloudy, reflective eyes (which give them superior low-light vision), they\'re most active at dawn, dusk, and night. A special catch in Georgia.',
    habitat: ['Main lake points', 'Rocky gravel bars', 'Ledges', 'Transition zones', 'Tributary mouths', 'Open water over structure'],
    waterType: ['lake', 'reservoir'],
    states: ['GA'],
    seasonalBehavior: {
      spring: 'Move into shallows at night to spawn on gravel or rocky substrate when water hits 45-55\u00b0F. Very active in early spring. Best night fishing of the year.',
      summer: 'Retreat to thermocline depth during day. Fish deep structure at night. Most active during low-light periods. Surface-to-bottom gradient important.',
      fall: 'Excellent fall fishing near baitfish. Move shallower at night. Aggressive feeding mode through November.',
      winter: 'Slowest season but still catchable. Target deeper structure during midday when light penetration is lowest. Very susceptible to jigging spoons.',
    },
    preferredBaits: {
      spring: ['Jigs with minnow tails', 'Live minnows under slip-float', 'Crankbaits (night)', 'Spinner rigs with night crawlers'],
      summer: ['Jigs fished at thermocline', 'Night fishing with crankbaits', 'Live minnows on spinner rigs', 'Vertical jigging spoons'],
      fall: ['Crankbaits', 'Jigs', 'Live minnows', 'Blade baits', 'Spinner rigs'],
      winter: ['Jigging spoons', 'Live minnows (slow)', 'Blade baits', 'Small jigs near bottom'],
    },
    regulations: {
      GA: {
        sizeLimit: '15 inches',
        bagLimit: '5 per day',
        season: 'Year-round on stocked waters',
        notes: 'Limited to specific stocked reservoirs in Georgia. Always verify walleye are present and legal in your target water.',
      },
    },
    funFacts: [
      'Their reflective tapetum lucidum (eye covering) makes them nearly blind in bright light',
      'This same feature gives them a huge advantage over prey at dawn, dusk, and night',
      '"Walleye chop" (slightly choppy surface) scatters light and triggers feeding',
      'Considered the best-tasting freshwater fish in North America by many anglers',
      'Canada\'s most popular sport fish, now successfully introduced in select GA waters',
    ],
    difficulty: 'advanced',
    topWaters: {
      GA: ['Carters Lake', 'Blue Ridge Lake', 'Lake Blue Ridge (seasonal stocking)'],
    },
    recordWeight: '25 lbs (World Record)',
    tags: ['walleye', 'freshwater', 'night fish', 'table fish', 'stocked'],
  },
]
