export interface Book {
  id: string;
  title: string;
  penName: string;
  genre: string;
  subGenre: string;
  tropes: string[];
  heatLevel: HeatLevel;
  synopsis: string;
  targetWordCount: number;
  currentWordCount: number;
  chapters: Chapter[];
  characters: Character[];
  coverImage?: string;
  coverPrompt?: string;
  metadata: BookMetadata;
  series?: SeriesInfo;
  backMatter?: BackMatter;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'writing' | 'editing' | 'complete' | 'published';
}

export interface SeriesInfo {
  name: string;
  bookNumber: number;
  totalPlanned: number;
  linkedBooks: string[]; // IDs of other books in series
}

export interface BackMatter {
  authorBio: string;
  otherBooks: OtherBook[];
  newsletter?: string;
  socialLinks?: Record<string, string>;
}

export interface OtherBook {
  title: string;
  link: string;
  coverImage?: string;
  blurb: string;
}

export interface Chapter {
  id: string;
  title: string;
  orderIndex: number;
  content: string;
  wordCount: number;
  outline: string;
  notes: string;
  status: 'outline' | 'draft' | 'revision' | 'complete';
}

export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'love-interest' | 'antagonist' | 'supporting';
  age: string;
  appearance: string;
  personality: string;
  background: string;
  desires: string;
  arc: string;
}

export interface BookMetadata {
  description: string;
  keywords: string[]; // 7 keywords, each up to 50 chars
  categories: string[];
  series?: string;
  seriesNumber?: number;
  price: number;
  enrollKU: boolean; // Kindle Unlimited
  asin?: string;
  isbn?: string;
  publishDate?: string;
  contentWarnings: string[];
  aiContentDisclosure?: boolean; // KDP requirement since 2024
}

export type HeatLevel = 'sweet' | 'sensual' | 'steamy' | 'scorching';

export interface StoryIdea {
  title: string;
  logline: string;
  genre: string;
  subGenre: string;
  tropes: string[];
  setting: string;
  conflict: string;
  heat: HeatLevel;
}

// ============================================
// STORY BIBLE & PIPELINE TYPES
// ============================================

export interface VoiceCard {
  characterName: string;
  sentenceLength: 'short' | 'varied' | 'long';
  innerMonologue: 'analytical' | 'emotional' | 'wry';
  humor: 'dry' | 'playful' | 'serious';
  metaphorPalette: {
    allowed: string[];
    forbidden: string[];
  };
  preferredVerbs: string[];
  avoidedAdjectives: string[];
  signatureTells: string[];
}

export interface StyleSafetyConfig {
  heatLevel: HeatLevel | 'none';
  violenceLevel: 'none' | 'low' | 'medium' | 'high';
  languageIntensity: 'clean' | 'moderate' | 'explicit';
  forbiddenContent: string[];
  tabooPhrases: string[];
  allowedMetaphors?: string[];
}

export interface CanonCharacter {
  name: string;
  voice: string;
  wounds: string[];
  desires: string[];
  boundaries: string[];
  tells: string[];
  uniquePhrases: string[];
  relationships: Record<string, string>;
  voiceCard?: VoiceCard;
}

export interface WorldRule {
  area: string;
  description: string;
}

export interface TimelineEvent {
  label: string;
  order: number;
  impact: string;
  timestamp?: string;
}

export interface StyleGuide {
  proseRules: string[];
  tabooPhrases: string[];
  allowedMetaphors: string[];
  pacingTargets: string[];
}

export interface StoryBible {
  characters: CanonCharacter[];
  worldRules: WorldRule[];
  timeline: TimelineEvent[];
  styleGuide: StyleGuide;
}

export interface SpecificityBudget {
  sensoryDetails: number;
  personalDetails: number;
  locationDetails?: number;
  artifactDetails?: number;
}

export interface BriefInterpretation {
  genre: string;
  tropes: string[];
  heatLevel: HeatLevel | 'none';
  pov: string;
  tone: string;
  targetLength: number;
  forbiddenElements: string[];
}

export interface SceneBeat {
  id: string;
  summary: string;
  tension: number;
  microGoal: string;
  specificityTargets: SpecificityBudget;
  hook?: {
    unresolvedQuestion: string;
    decision: string;
  };
}

export interface ScenePlan {
  beats: SceneBeat[];
  tensionCurve: number[];
  sceneGoals: string[];
}

export interface CriticFinding {
  type: 'cliche' | 'pacing' | 'voice' | 'specificity' | 'continuity';
  message: string;
  locationHint?: string;
}

export interface RewriteInstruction {
  target: string;
  action: string;
  rationale?: string;
}

export interface ContinuityReport {
  povConsistent: boolean;
  timelineConsistent: boolean;
  namesConsistent: boolean;
  issues: string[];
}

export interface PipelineScores {
  clicheScore: number;
  specificityCount: number;
  continuityPass: boolean;
  dialogueRatio: number;
  readability: string;
  passed: boolean;
  failures: string[];
}

export interface StageArtifact {
  name: string;
  content: any;
  timestamp: string;
  promptVersion: string;
}

export interface ChapterPipelineRequest {
  brief: BriefInterpretation;
  storyBible?: StoryBible;
  chapterTitle: string;
  chapterSynopsis: string;
  seriesArcs?: string[];
  styleSafety?: StyleSafetyConfig;
  voiceCard?: VoiceCard;
  specificityBudget?: SpecificityBudget;
}

export interface ChapterPipelineResult {
  artifacts: StageArtifact[];
  storyBible: StoryBible;
  scores: PipelineScores;
  finalDraft: string;
  telemetry: {
    promptVersion: string;
    model: string;
    stages: StageArtifact[];
    scores: PipelineScores;
    userEdits?: string[];
  };
}

// ============================================
// PROFITABLE NICHES & TROPES DATABASE
// ============================================

export interface NicheData {
  name: string;
  popularity: 'trending' | 'stable' | 'growing' | 'saturated';
  competition: 'low' | 'medium' | 'high';
  avgPrice: number;
  recommendedWordCount: { min: number; max: number };
  kuPopular: boolean; // Popular in Kindle Unlimited
  tips: string[];
  topKeywords: string[];
}

export const PROFITABLE_NICHES: Record<string, NicheData> = {
  'Dark Romance': {
    name: 'Dark Romance',
    popularity: 'trending',
    competition: 'medium',
    avgPrice: 3.99,
    recommendedWordCount: { min: 50000, max: 80000 },
    kuPopular: true,
    tips: [
      'Include content warnings - readers expect them',
      'Anti-heroes with redemption arcs perform best',
      'Series format works extremely well',
      'Captive/possessive themes are hot',
    ],
    topKeywords: ['dark romance', 'anti hero', 'possessive alpha', 'morally gray', 'captive romance', 'obsessed hero', 'dark love'],
  },
  'Monster Romance': {
    name: 'Monster Romance',
    popularity: 'trending',
    competition: 'low',
    avgPrice: 4.99,
    recommendedWordCount: { min: 40000, max: 70000 },
    kuPopular: true,
    tips: [
      'Creative monster designs stand out',
      'Humor mixed with spice performs well',
      'Orc, dragon, and demon romances are hottest',
      'Size difference is a major selling point',
    ],
    topKeywords: ['monster romance', 'orc romance', 'dragon shifter', 'demon lover', 'fantasy romance', 'non human hero', 'size difference'],
  },
  'Why Choose / Reverse Harem': {
    name: 'Why Choose / Reverse Harem',
    popularity: 'growing',
    competition: 'medium',
    avgPrice: 4.99,
    recommendedWordCount: { min: 60000, max: 100000 },
    kuPopular: true,
    tips: [
      'Use "why choose" not "reverse harem" in marketing',
      '3-5 love interests is the sweet spot',
      'Each hero needs distinct personality',
      'Academy/college settings are popular',
    ],
    topKeywords: ['why choose romance', 'multiple love interests', 'reverse harem', 'polyamory romance', 'bully romance', 'academy romance', 'mmfm'],
  },
  'Billionaire Romance': {
    name: 'Billionaire Romance',
    popularity: 'stable',
    competition: 'high',
    avgPrice: 2.99,
    recommendedWordCount: { min: 40000, max: 60000 },
    kuPopular: true,
    tips: [
      'CEO/boss tropes still sell well',
      'Add unique twist to stand out',
      'Shorter books work well here',
      'Series with interconnected characters',
    ],
    topKeywords: ['billionaire romance', 'ceo romance', 'boss employee', 'alpha billionaire', 'luxury romance', 'wealthy hero', 'office romance'],
  },
  'Mafia Romance': {
    name: 'Mafia Romance',
    popularity: 'stable',
    competition: 'high',
    avgPrice: 3.99,
    recommendedWordCount: { min: 50000, max: 80000 },
    kuPopular: true,
    tips: [
      'Arranged marriage trope is evergreen',
      'Italian/Russian mafia both popular',
      'Bratva (Russian) slightly less saturated',
      'Family dynasty series perform well',
    ],
    topKeywords: ['mafia romance', 'arranged marriage', 'bratva romance', 'italian mafia', 'crime boss', 'forced proximity', 'dark mafia'],
  },
  'Alien Romance': {
    name: 'Alien Romance',
    popularity: 'growing',
    competition: 'low',
    avgPrice: 4.99,
    recommendedWordCount: { min: 50000, max: 80000 },
    kuPopular: true,
    tips: [
      'Creative alien biology is a selling point',
      'Fated mates trope works well',
      'Ice Planet Barbarians inspired subgenre',
      'Humor and fish-out-of-water scenarios',
    ],
    topKeywords: ['alien romance', 'sci fi romance', 'alien warrior', 'fated mates', 'space opera romance', 'alien abduction', 'interstellar romance'],
  },
  'Shifter Romance': {
    name: 'Shifter Romance',
    popularity: 'stable',
    competition: 'high',
    avgPrice: 3.99,
    recommendedWordCount: { min: 45000, max: 70000 },
    kuPopular: true,
    tips: [
      'Wolf shifters most popular but saturated',
      'Try unique animals: bears, dragons, big cats',
      'Pack dynamics are expected',
      'Fated mates is almost mandatory',
    ],
    topKeywords: ['shifter romance', 'wolf shifter', 'bear shifter', 'dragon shifter', 'fated mates', 'alpha shifter', 'paranormal romance'],
  },
  'Romantasy': {
    name: 'Romantasy (Fantasy Romance)',
    popularity: 'trending',
    competition: 'medium',
    avgPrice: 4.99,
    recommendedWordCount: { min: 80000, max: 120000 },
    kuPopular: true,
    tips: [
      'ACOTAR-inspired stories performing well',
      'Fae romance is extremely hot right now',
      'Enemies to lovers is essential',
      'Longer books acceptable in this genre',
    ],
    topKeywords: ['romantasy', 'fae romance', 'fantasy romance', 'enemies to lovers', 'dark fae', 'court intrigue', 'high fantasy romance'],
  },
  'MM Romance': {
    name: 'MM Romance',
    popularity: 'growing',
    competition: 'medium',
    avgPrice: 3.99,
    recommendedWordCount: { min: 50000, max: 80000 },
    kuPopular: true,
    tips: [
      'Sports romance (hockey) very popular',
      'Found family themes resonate',
      'Grumpy/sunshine dynamic sells well',
      'Age gap is popular trope',
    ],
    topKeywords: ['mm romance', 'gay romance', 'mlm romance', 'hockey romance', 'sports romance', 'found family', 'grumpy sunshine'],
  },
  'Age Gap Romance': {
    name: 'Age Gap Romance',
    popularity: 'stable',
    competition: 'medium',
    avgPrice: 3.99,
    recommendedWordCount: { min: 45000, max: 65000 },
    kuPopular: true,
    tips: [
      'Older man/younger woman most popular',
      'Dad\'s best friend is top trope',
      'Professor/student (college age) works',
      'Specify ages in description',
    ],
    topKeywords: ['age gap romance', 'older man younger woman', 'dads best friend', 'forbidden romance', 'silver fox', 'taboo romance', 'professor student'],
  },
  'Contemporary Romance': {
    name: 'Contemporary Romance',
    popularity: 'stable',
    competition: 'high',
    avgPrice: 2.99,
    recommendedWordCount: { min: 50000, max: 75000 },
    kuPopular: true,
    tips: [
      'Small town settings very popular',
      'Romantic comedy elements help stand out',
      'Single parent tropes have dedicated fans',
      'Second chance romance evergreen',
    ],
    topKeywords: ['contemporary romance', 'small town romance', 'romantic comedy', 'second chance', 'single parent', 'beach romance', 'friends to lovers'],
  },
  'Bully Romance': {
    name: 'Bully Romance',
    popularity: 'stable',
    competition: 'medium',
    avgPrice: 3.99,
    recommendedWordCount: { min: 50000, max: 80000 },
    kuPopular: true,
    tips: [
      'Academy/college settings essential',
      'Grovel and redemption arc required',
      'Series format (3-4 books) works best',
      'Content warnings expected',
    ],
    topKeywords: ['bully romance', 'academy romance', 'enemies to lovers', 'new adult romance', 'college romance', 'dark academia', 'high school romance'],
  },
};

// Popular tropes that sell
export const TROPES = {
  relationship: [
    'Enemies to Lovers',
    'Friends to Lovers', 
    'Fake Dating/Marriage',
    'Second Chance',
    'Forbidden Love',
    'Secret Relationship',
    'Marriage of Convenience',
    'Love Triangle',
    'Slow Burn',
    'Instalove',
  ],
  character: [
    'Grumpy/Sunshine',
    'Alpha Hero',
    'Bad Boy',
    'Morally Gray',
    'Cinnamon Roll Hero',
    'Strong Heroine',
    'Virgin Heroine',
    'Experienced Hero',
    'Touch Her and Die',
    'He Falls First',
    'She Falls First',
    'Only One Bed',
  ],
  situation: [
    'Forced Proximity',
    'Stuck Together',
    'Workplace Romance',
    'Boss/Employee',
    'Royal/Commoner',
    'Protector',
    'Bodyguard',
    'Captive',
    'Arranged Marriage',
    'Accidental Pregnancy',
    'Secret Baby',
    'Single Parent',
  ],
  fantasy: [
    'Fated Mates',
    'Soul Bond',
    'Chosen One',
    'Hidden Identity',
    'Dark Curse',
    'Magical Bond',
    'Size Difference',
    'Claiming/Marking',
    'Heat/Rut',
    'Pack Dynamics',
  ],
  spicy: [
    'Praise Kink',
    'Possessive Hero',
    'Breeding',
    'Dubcon',
    'Power Exchange',
    'Virgin/Experienced',
    'Age Gap',
    'Forbidden',
    'Public/Exhibition',
    'Voyeurism',
  ],
} as const;

export const GENRES = [
  'Dark Romance',
  'Monster Romance', 
  'Why Choose / Reverse Harem',
  'Billionaire Romance',
  'Mafia Romance',
  'Alien Romance',
  'Shifter Romance',
  'Romantasy',
  'MM Romance',
  'Age Gap Romance',
  'Contemporary Romance',
  'Bully Romance',
  'Paranormal Romance',
  'Historical Romance',
  'Romantic Suspense',
  'Sports Romance',
  'Military Romance',
  'Rockstar Romance',
  'MC Romance',
  'BDSM Romance',
] as const;

export const SUB_GENRES: Record<string, string[]> = {
  'Dark Romance': ['Captive', 'Stalker', 'Mafia', 'Cartel', 'MC', 'Obsession'],
  'Monster Romance': ['Orc', 'Dragon', 'Demon', 'Vampire', 'Minotaur', 'Alien', 'Tentacle'],
  'Why Choose / Reverse Harem': ['Academy', 'Paranormal', 'Mafia', 'MC', 'Fantasy', 'Sports'],
  'Shifter Romance': ['Wolf', 'Bear', 'Dragon', 'Lion', 'Panther', 'Multi-Shifter'],
  'Romantasy': ['Fae', 'Demon', 'Vampire', 'Witch', 'Dragon', 'Dark Court'],
  'Mafia Romance': ['Italian Mafia', 'Bratva', 'Cartel', 'Yakuza', 'Irish Mob'],
  'MM Romance': ['Hockey', 'Football', 'College', 'Military', 'Rockstar', 'Cowboy'],
  'Historical Romance': ['Regency', 'Victorian', 'Medieval', 'Western', 'Scottish'],
  'Paranormal Romance': ['Vampire', 'Werewolf', 'Ghost', 'Witch', 'Angel/Demon'],
};

export const CONTENT_WARNINGS = [
  'Adult Content 18+',
  'Explicit Sexual Content',
  'Dubious Consent',
  'Dark Themes',
  'Violence',
  'Strong Language',
  'Infidelity (not MCs)',
  'Pregnancy/Breeding',
  'Age Gap',
  'Power Imbalance',
  'BDSM Elements',
  'Captivity',
  'Stalking',
  'Obsessive Behavior',
  'Death (not MCs)',
  'Trauma/Abuse (past)',
  'Multiple Partners',
  'Public Acts',
  'Degradation',
  'Breath Play',
] as const;

export const KDP_CATEGORIES = [
  // Romance Categories
  'Kindle Store > Kindle eBooks > Romance > Contemporary',
  'Kindle Store > Kindle eBooks > Romance > Paranormal > Vampires',
  'Kindle Store > Kindle eBooks > Romance > Paranormal > Werewolves & Shifters',
  'Kindle Store > Kindle eBooks > Romance > Paranormal > Ghosts',
  'Kindle Store > Kindle eBooks > Romance > Paranormal > Demons & Devils',
  'Kindle Store > Kindle eBooks > Romance > Paranormal > Psychics',
  'Kindle Store > Kindle eBooks > Romance > Paranormal > Angels',
  'Kindle Store > Kindle eBooks > Romance > Fantasy',
  'Kindle Store > Kindle eBooks > Romance > Science Fiction',
  'Kindle Store > Kindle eBooks > Romance > Historical > Regency',
  'Kindle Store > Kindle eBooks > Romance > Historical > Victorian',
  'Kindle Store > Kindle eBooks > Romance > Historical > Medieval',
  'Kindle Store > Kindle eBooks > Romance > Romantic Suspense',
  'Kindle Store > Kindle eBooks > Romance > Romantic Comedy',
  'Kindle Store > Kindle eBooks > Romance > New Adult & College',
  'Kindle Store > Kindle eBooks > Romance > Sports',
  'Kindle Store > Kindle eBooks > Romance > Military',
  'Kindle Store > Kindle eBooks > Romance > Multicultural & Interracial',
  'Kindle Store > Kindle eBooks > Romance > LGBTQ+ > Gay Romance',
  'Kindle Store > Kindle eBooks > Romance > LGBTQ+ > Lesbian Romance',
  'Kindle Store > Kindle eBooks > Romance > LGBTQ+ > Bisexual Romance',
  // Erotica Categories  
  'Kindle Store > Kindle eBooks > Literature & Fiction > Erotica',
  'Kindle Store > Kindle eBooks > Literature & Fiction > Erotica > BDSM',
  'Kindle Store > Kindle eBooks > Literature & Fiction > Erotica > Paranormal',
  'Kindle Store > Kindle eBooks > Literature & Fiction > Erotica > Romantic Erotica',
  'Kindle Store > Kindle eBooks > Literature & Fiction > Erotica > Science Fiction',
  'Kindle Store > Kindle eBooks > Literature & Fiction > Erotica > Urban',
] as const;

// Pricing recommendations based on research
export const PRICING_GUIDE = {
  novella: { min: 0.99, recommended: 2.99, max: 3.99, wordCount: { min: 15000, max: 40000 } },
  shortNovel: { min: 2.99, recommended: 3.99, max: 4.99, wordCount: { min: 40000, max: 60000 } },
  novel: { min: 3.99, recommended: 4.99, max: 5.99, wordCount: { min: 60000, max: 80000 } },
  longNovel: { min: 4.99, recommended: 5.99, max: 6.99, wordCount: { min: 80000, max: 120000 } },
  kuBonus: 'Price at $2.99-$9.99 for 70% royalty. KU pays ~$0.004-0.005 per page read (KENP).',
} as const;

// Blurb formula templates
export interface BlurbFormula {
  name: string;
  structure: string[];
  example: string;
}

export const BLURB_FORMULAS: BlurbFormula[] = [
  {
    name: 'Classic Hook',
    structure: [
      'Hook line (provocative statement or question)',
      'Introduce protagonist + their problem',
      'Introduce love interest + conflict',
      'Stakes (what they stand to lose)',
      'Trope tags + heat warning',
      'Call to action',
    ],
    example: `He was never supposed to be mine.

[Protagonist name] has spent years avoiding [situation]. But when [inciting incident], she finds herself face to face with [love interest]—the one man who could destroy everything she's built.

[Love interest] doesn't do relationships. He doesn't do feelings. But something about [protagonist] makes him want to break every rule he's ever made.

When [conflict], they'll have to choose between [stakes].

This is a standalone [genre] featuring [tropes]. Contains mature content.`,
  },
  {
    name: 'Question Hook',
    structure: [
      'Provocative question',
      'Character + situation',
      'Love interest introduction',
      'Conflict escalation',
      'Tropes and warnings',
    ],
    example: `What would you do if the man you hate became the only one who could save you?

[Protagonist] never expected [situation]. And she definitely never expected [love interest], with his [description], to be the one standing between her and [threat].

He's [negative trait]. She's [opposite trait]. They're [forced situation].

But the fire between them? That's very, very real.

[Tropes]. Standalone. HEA guaranteed.`,
  },
  {
    name: 'Dual POV Tease',
    structure: [
      'Her perspective (2-3 lines)',
      'His perspective (2-3 lines)',
      'The conflict between them',
      'Trope tags',
    ],
    example: `HER: He's arrogant. Infuriating. And my new [situation]. I should hate him. I do hate him. So why can't I stop thinking about his hands on my—

HIM: She thinks she can resist me. She's wrong. I've wanted her since [moment], and now that she's [situation], nothing will stop me from making her mine.

[Trope] • [Trope] • [Trope]
Standalone with HEA • [Heat level]`,
  },
];
