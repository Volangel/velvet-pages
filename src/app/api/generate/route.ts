import { NextRequest, NextResponse } from 'next/server';

// In production, you would integrate with OpenAI, Claude, or another LLM API
// For now, this provides sophisticated generation templates

// ============================================================================
// GOD-TIER WRITING SYSTEMS - What makes readers obsessed, not just satisfied
// ============================================================================

// ============================================================================
// VOICE BANKS - Each character has a UNIQUE way of thinking/speaking
// EXPANDED for variety across multiple generations
// ============================================================================

const HEROINE_VOICE = {
  // Scientific/analytical heroine voice - 20+ patterns for variety
  thoughtPatterns: [
    // Analytical processing
    'The logical part of her brain—the part that had earned three degrees and published countless papers—screamed that this was madness.',
    'She cataloged the sensation automatically: heart rate elevated, pupils dilated, skin flushed. Classic fight-or-flight. Except she didn\'t want to fight or flee.',
    'Her mind raced through possibilities like a search algorithm, discarding each one as more improbable than the last.',
    '*Analyze this later,* she told herself. *Survive it first.*',
    'The scientist in her demanded explanations. The woman in her had stopped caring about explanations.',
    // Self-aware struggle
    '*This is a terrible idea.* The thought was clear and rational. She ignored it completely.',
    'She\'d written her dissertation on risk assessment. Funny how none of that research seemed applicable now.',
    '*Stop overthinking,* she ordered herself. Her brain laughed at the suggestion.',
    'Her rational mind threw up warning flags. Her treacherous heart batted them down.',
    'She\'d always prided herself on her self-control. What a joke that seemed now.',
    // Emotional breakthrough
    'For the first time in her life, she didn\'t want to understand. She just wanted to *feel*.',
    'All her walls, all her defenses, all the careful distance—they meant nothing against this.',
    '*When did I become this person?* She wasn\'t sure she minded the answer.',
    'The woman she\'d been a week ago wouldn\'t recognize her now. That woman had never felt this alive.',
    'Logic had been her armor for so long. It felt strange to let it go. Strange, but not wrong.',
    // Conflict between head and heart
    '*Don\'t get attached,* her survival instincts warned. *Too late,* her heart replied.',
    'She\'d built her whole identity around being rational. But there was nothing rational about this.',
    'Her brain said *danger*. Her body said *more*.',
    '*Think, damn it.* But thinking was impossible when he was this close.',
    'Every instinct she\'d honed over years screamed at her. She didn\'t care.',
  ],
  speechPatterns: [
    'precise, clipped sentences when nervous',
    'rambling tangents when flustered',
    'sharp wit deployed as defense mechanism',
    'softening only when caught off-guard',
    'sarcasm masking vulnerability',
    'questions asked like investigations',
    'silence when processing strong emotions',
    'humor used to deflect intimacy',
  ],
  physicalTells: [
    'pushing her glasses up—a nervous habit',
    'tucking her hair behind her ear, then immediately untucking it',
    'biting her lower lip when deep in thought',
    'straightening her spine when challenged',
    'hands that wouldn\'t stop moving—fidgeting with anything nearby',
    'avoiding eye contact when lying to herself',
    'leaning unconsciously toward him',
    'her breath catching at inopportune moments',
    'color rising in her cheeks',
    'fidgeting with whatever was in reach',
    'wrapping her arms around herself like armor',
    'her fingers tracing nervous patterns on any surface',
  ],
};

const HERO_VOICE = {
  // Warrior/protector hero voice - 20+ patterns for variety
  thoughtPatterns: [
    // Ancient/eternal perspective
    'Three hundred years of discipline. Three hundred years of perfect control. And this small, fierce human was unraveling it all.',
    'He\'d faced armies. Conquered kingdoms. Held the line against horrors. None of it had prepared him for this.',
    'Centuries of existence, and he\'d never felt anything like this.',
    'Time meant nothing to his kind. Except now every moment without her felt like an eternity.',
    'He\'d outlived empires. Watched civilizations rise and fall. And somehow, she had become the center of his universe.',
    // Primal/possessive
    '*She is not yours,* he reminded himself for the hundredth time. His hands disagreed.',
    'The beast inside him recognized her. Claimed her. It didn\'t care about logic.',
    '*Mine.* The word pulsed through him with every heartbeat.',
    'Every instinct screamed at him to claim her. Make it so no other would dare approach.',
    'The civilized part of him knew he should keep his distance. The beast had other ideas.',
    // Vulnerability
    'He\'d built walls around his heart with the bodies of his enemies. She\'d walked through them like mist.',
    'Weakness was death in his world. But she made him want to be weak.',
    'He\'d never feared anything. Until now. Now he feared losing her.',
    'For the first time in centuries, he wanted something he might not be able to take by force.',
    'She terrified him in ways no enemy ever had.',
    // Protective instinct
    '*I will burn this world to ash before I let anything touch her.*',
    'His entire body oriented toward her like a compass finding north.',
    'He\'d killed for less than a threatening look in her direction.',
    'Every male within range was a potential threat. He cataloged them automatically.',
    'She had no idea how many times he\'d positioned himself between her and danger.',
    // Inner conflict
    '*Let her go,* his conscience demanded. *She deserves better.* His hands refused to release her.',
    'He should tell her what he was. What he\'d done. The blood on his hands. But the words wouldn\'t come.',
    'She looked at him like he was something good. He didn\'t have the strength to shatter that.',
    '*I am not worthy of her.* The thought was as constant as his heartbeat. It changed nothing.',
    'A better male would walk away. He\'d never claimed to be good.',
  ],
  speechPatterns: [
    'deliberate, weighted words—each one chosen with care',
    'dry humor that surprised even himself',
    'growls and rumbles underlying speech when emotional',
    'formal language softening into something raw when alone with her',
    'silences that spoke louder than words',
    'commands given with the expectation of obedience',
    'tenderness that emerged only when he forgot to guard it',
    'possessive endearments that slipped out unbidden',
  ],
  physicalTells: [
    'going completely still—the predator\'s response to anything important',
    'hands flexing at his sides, fighting the urge to reach for her',
    'a muscle ticking in his jaw when holding back',
    'leaning toward her unconsciously, as if she were gravity',
    'touching the battle scar over his heart when remembering his losses',
    'his gaze tracking her movements across any space',
    'tension coiling in his muscles whenever another male spoke to her',
    'the slight tremor in his hands when he touched her gently',
    'pupils dilating until gold was nearly swallowed by black',
    'chest expanding with a deep breath to capture her scent',
    'the way his whole body turned toward her',
    'fingers ghosting over where she\'d touched him',
  ],
};

// ============================================================================
// CONTENT USAGE TRACKER - Prevents repetition across chapters
// ============================================================================

// Track used content per book generation to avoid repetition
const usedContentTracker = {
  thoughts: new Set<number>(),
  physicalTells: new Set<number>(),
  sensoryDetails: new Set<number>(),
  transitions: new Set<number>(),
  
  getUnused<T>(array: T[], setName: 'thoughts' | 'physicalTells' | 'sensoryDetails' | 'transitions'): T {
    const tracker = this[setName];
    const unusedIndices = array.map((_, i) => i).filter(i => !tracker.has(i));
    if (unusedIndices.length === 0) {
      tracker.clear();
      return array[Math.floor(Math.random() * array.length)];
    }
    const idx = unusedIndices[Math.floor(Math.random() * unusedIndices.length)];
    tracker.add(idx);
    return array[idx];
  },
  
  reset() {
    this.thoughts.clear();
    this.physicalTells.clear();
    this.sensoryDetails.clear();
    this.transitions.clear();
  }
};

// ============================================================================
// BOOK MEMORY SYSTEM - God-tier consistency across chapters
// ============================================================================

interface Artifact {
  name: string;
  description: string;
  texture: string;
  significance: string;
  firstAppearance: number; // chapter number
  mentions: Array<{ chapter: number; context: string }>;
}

interface ThemeState {
  name: string;
  currentStage: number; // 1-5 progression
  expressions: string[]; // how it's been expressed so far
  nextEvolution: string; // what comes next
}

interface CharacterState {
  name: string;
  currentEmotionalState: string;
  growthMoments: string[];
  relationshipStage: number; // 1-10 scale
  recentActions: string[];
  internalJourney: string[];
}

interface SceneSummary {
  chapter: number;
  keyEvents: string[];
  emotionalBeats: string[];
  physicalIntimacy: number; // 1-10 scale
  conflictLevel: number; // 1-10 scale
  resolutionProgress: number; // 0-100%
}

const bookMemory = {
  // Artifacts tracking
  artifacts: [] as Artifact[],
  
  // Theme evolution
  themes: {
    trust: { name: 'trust', currentStage: 1, expressions: [], nextEvolution: 'first moment of vulnerability' } as ThemeState,
    fear: { name: 'fear', currentStage: 1, expressions: [], nextEvolution: 'acknowledging the fear exists' } as ThemeState,
    desire: { name: 'desire', currentStage: 1, expressions: [], nextEvolution: 'first physical awareness' } as ThemeState,
    belonging: { name: 'belonging', currentStage: 1, expressions: [], nextEvolution: 'feeling out of place' } as ThemeState,
    healing: { name: 'healing', currentStage: 1, expressions: [], nextEvolution: 'wound is acknowledged' } as ThemeState,
  },
  
  // Character states
  protagonistState: null as CharacterState | null,
  loveInterestState: null as CharacterState | null,
  
  // Scene history
  previousScenes: [] as SceneSummary[],
  
  // Used phrases (to avoid repetition)
  usedPhrases: new Set<string>(),
  usedDescriptions: new Set<string>(),
  usedMetaphors: new Set<string>(),
  usedDialogue: new Set<string>(),
  
  // Initialize for new book
  initializeBook(protagonistName: string, loveInterestName: string) {
    this.artifacts = [];
    this.previousScenes = [];
    this.usedPhrases.clear();
    this.usedDescriptions.clear();
    this.usedMetaphors.clear();
    this.usedDialogue.clear();
    
    // Reset themes
    this.themes = {
      trust: { name: 'trust', currentStage: 1, expressions: [], nextEvolution: 'first moment of vulnerability' },
      fear: { name: 'fear', currentStage: 1, expressions: [], nextEvolution: 'acknowledging the fear exists' },
      desire: { name: 'desire', currentStage: 1, expressions: [], nextEvolution: 'first physical awareness' },
      belonging: { name: 'belonging', currentStage: 1, expressions: [], nextEvolution: 'feeling out of place' },
      healing: { name: 'healing', currentStage: 1, expressions: [], nextEvolution: 'wound is acknowledged' },
    };
    
    // Initialize character states
    this.protagonistState = {
      name: protagonistName,
      currentEmotionalState: 'guarded, curious',
      growthMoments: [],
      relationshipStage: 1,
      recentActions: [],
      internalJourney: ['Walls firmly in place'],
    };
    
    this.loveInterestState = {
      name: loveInterestName,
      currentEmotionalState: 'intrigued, protective',
      growthMoments: [],
      relationshipStage: 1,
      recentActions: [],
      internalJourney: ['Ancient loneliness'],
    };
  },
  
  // Add an artifact
  addArtifact(artifact: Omit<Artifact, 'mentions'>) {
    this.artifacts.push({ ...artifact, mentions: [{ chapter: artifact.firstAppearance, context: 'introduced' }] });
  },
  
  // Get artifact for consistent description
  getArtifact(name: string): Artifact | undefined {
    return this.artifacts.find(a => a.name.toLowerCase() === name.toLowerCase());
  },
  
  // Record artifact mention
  mentionArtifact(name: string, chapter: number, context: string) {
    const artifact = this.getArtifact(name);
    if (artifact) {
      artifact.mentions.push({ chapter, context });
    }
  },
  
  // Evolve a theme (called after each chapter)
  evolveTheme(themeName: 'trust' | 'fear' | 'desire' | 'belonging' | 'healing', expression: string, chapterNumber: number) {
    const theme = this.themes[themeName];
    if (!theme) return;
    
    theme.expressions.push(expression);
    
    // Progress theme based on chapter position
    const THEME_EVOLUTION: Record<'trust' | 'fear' | 'desire' | 'belonging' | 'healing', string[]> = {
      trust: [
        'first moment of vulnerability',
        'testing the trust',
        'trust broken or tested',
        'choosing to trust despite fear',
        'complete trust established'
      ],
      fear: [
        'acknowledging the fear exists',
        'fear controlling decisions',
        'facing the fear',
        'fear losing power',
        'fear transformed into strength'
      ],
      desire: [
        'first physical awareness',
        'fighting the attraction',
        'giving in momentarily',
        'full surrender',
        'desire integrated with love'
      ],
      belonging: [
        'feeling out of place',
        'glimpses of belonging',
        'belonging threatened',
        'fighting for belonging',
        'home found'
      ],
      healing: [
        'wound is acknowledged',
        'wound affects current behavior',
        'healing begins',
        'setback in healing',
        'wound transformed into wisdom'
      ],
    };
    
    if (chapterNumber <= 2) theme.currentStage = 1;
    else if (chapterNumber <= 4) theme.currentStage = 2;
    else if (chapterNumber <= 6) theme.currentStage = 3;
    else if (chapterNumber <= 8) theme.currentStage = 4;
    else theme.currentStage = 5;
    
    theme.nextEvolution = THEME_EVOLUTION[themeName][Math.min(theme.currentStage, 4)];
  },
  
  // Get current theme guidance for chapter
  getThemeGuidance(chapterNumber: number): string {
    const guidance: string[] = [];
    for (const [name, theme] of Object.entries(this.themes)) {
      guidance.push(`${name}: Stage ${theme.currentStage}/5 - Next: "${theme.nextEvolution}"`);
    }
    return guidance.join('\n');
  },
  
  // Update character state after chapter
  updateCharacterState(
    character: 'protagonist' | 'loveInterest',
    emotionalState: string,
    growthMoment?: string,
    relationshipProgress?: number
  ) {
    const state = character === 'protagonist' ? this.protagonistState : this.loveInterestState;
    if (!state) return;
    
    state.currentEmotionalState = emotionalState;
    if (growthMoment) state.growthMoments.push(growthMoment);
    if (relationshipProgress) state.relationshipStage = Math.min(10, state.relationshipStage + relationshipProgress);
  },
  
  // Record scene summary
  recordScene(summary: SceneSummary) {
    this.previousScenes.push(summary);
    // Keep last 5 scenes in active memory
    if (this.previousScenes.length > 5) {
      this.previousScenes.shift();
    }
  },
  
  // Check if phrase/description was used
  wasUsed(content: string, type: 'phrase' | 'description' | 'metaphor' | 'dialogue'): boolean {
    const normalized = content.toLowerCase().substring(0, 50);
    const tracker = {
      phrase: this.usedPhrases,
      description: this.usedDescriptions,
      metaphor: this.usedMetaphors,
      dialogue: this.usedDialogue,
    }[type];
    return tracker.has(normalized);
  },
  
  // Mark content as used
  markUsed(content: string, type: 'phrase' | 'description' | 'metaphor' | 'dialogue') {
    const normalized = content.toLowerCase().substring(0, 50);
    const tracker = {
      phrase: this.usedPhrases,
      description: this.usedDescriptions,
      metaphor: this.usedMetaphors,
      dialogue: this.usedDialogue,
    }[type];
    tracker.add(normalized);
  },
  
  // Get context for current chapter
  getChapterContext(chapterNumber: number): string {
    const lastScene = this.previousScenes[this.previousScenes.length - 1];
    const protag = this.protagonistState;
    const love = this.loveInterestState;
    
    let context = `\n=== CHAPTER ${chapterNumber} MEMORY CONTEXT ===\n`;
    
    if (lastScene) {
      context += `\nPrevious Chapter:\n`;
      context += `- Key events: ${lastScene.keyEvents.join(', ')}\n`;
      context += `- Emotional beats: ${lastScene.emotionalBeats.join(', ')}\n`;
      context += `- Intimacy level: ${lastScene.physicalIntimacy}/10\n`;
      context += `- Conflict level: ${lastScene.conflictLevel}/10\n`;
    }
    
    if (protag) {
      context += `\n${protag.name}'s State:\n`;
      context += `- Emotional: ${protag.currentEmotionalState}\n`;
      context += `- Relationship stage: ${protag.relationshipStage}/10\n`;
      context += `- Journey so far: ${protag.internalJourney.slice(-2).join(' → ')}\n`;
    }
    
    if (love) {
      context += `\n${love.name}'s State:\n`;
      context += `- Emotional: ${love.currentEmotionalState}\n`;
      context += `- Relationship stage: ${love.relationshipStage}/10\n`;
    }
    
    if (this.artifacts.length > 0) {
      context += `\nKey Artifacts:\n`;
      for (const artifact of this.artifacts) {
        context += `- ${artifact.name}: ${artifact.description} (${artifact.significance})\n`;
      }
    }
    
    context += `\nTheme Guidance:\n${this.getThemeGuidance(chapterNumber)}\n`;
    
    return context;
  },
};

// ============================================================================
// ARTIFACT DEFINITIONS - Items that recur with consistent descriptions
// ============================================================================

const ARTIFACT_TEMPLATES: Record<string, Array<{name: string; description: string; texture: string; significance: string}>> = {
  'Monster Romance': [
    // BONDING & MATING ARTIFACTS
    { name: 'Bonding Necklace', description: 'A cord of braided leather holding a rough-cut moonstone that pulses with inner light', texture: 'smooth stone, rough leather, warm against skin', significance: 'Given to chosen mates; the stone glows brighter when near the giver' },
    { name: 'Claiming Mark', description: 'A bite scar on the shoulder, silvered with age or fresh and pink', texture: 'raised skin, tender, warm to the touch', significance: 'Permanent mark of mating bond; tingles when mate is near or in danger' },
    { name: 'Mating Furs', description: 'Thick pelts from the first hunt, spread before the fire in his private quarters', texture: 'impossibly soft, warm from the hearth, smelling of wood smoke and him', significance: 'Where bonds are consummated; sacred space no other may enter' },
    { name: 'Bonding Braids', description: 'Hair woven together from both mates, preserved in resin and worn as pendants', texture: 'smooth resin, slightly warm, containing two distinct colors intertwined', significance: 'A portable reminder of the bond; warriors touch them before battle' },
    { name: 'Scent Marking Oil', description: 'A thick, fragrant oil rubbed into the skin during mating rituals', texture: 'slick, warm, leaves skin tingling', significance: 'His scent on her skin tells all others she is claimed' },
    { name: 'The Mating Cave', description: 'A hidden grotto known only to the chieftain, filled with ancient paintings', texture: 'cool stone, phosphorescent moss, air thick with history', significance: 'Where all chieftains have bonded for a thousand years' },
    // CEREMONIAL & CULTURAL
    { name: 'War Paint', description: 'Ceremonial pigment made from crushed berries and ash, applied in spiral patterns', texture: 'thick, slightly gritty, smells of earth and iron', significance: 'Marks important occasions; different patterns for battle, bonding, mourning' },
    { name: 'Ancestor Blade', description: 'An ancient sword with a bone handle wrapped in worn leather, runes etched along the blade', texture: 'cold steel, warm bone, leather softened by generations of grip', significance: 'Passed down through chieftains; contains the spirits of those who wielded it' },
    { name: 'Spirit Drums', description: 'Massive drums made from hollowed tree trunks, animal hide stretched tight', texture: 'vibrations felt through the ground before heard', significance: 'Used for ceremonies, celebrations, and calling the clan together' },
    { name: 'Chieftain\'s Torc', description: 'A heavy neck ring of twisted gold and silver, ancient and powerful', texture: 'cold metal warming to skin, weight of responsibility', significance: 'Mark of leadership; never removed until death' },
    { name: 'Ancestral Skull', description: 'The preserved skull of the first chieftain, kept in the sacred cave', texture: 'smooth bone, cold, eye sockets seeming to watch', significance: 'Consulted before major decisions; some say it whispers guidance' },
    { name: 'Challenge Stones', description: 'Two flat river stones, painted with opposing clan symbols', texture: 'smooth, heavy, cool even in summer', significance: 'Thrown at a rival\'s feet to issue formal challenge' },
    { name: 'Mourning Ash', description: 'Gray powder kept in a small pouch, made from the funeral pyres of loved ones', texture: 'fine as flour, slightly warm, smells of smoke and memory', significance: 'Applied to forehead when grieving; connects living to dead' },
    { name: 'Victory Tusks', description: 'The tusks of defeated enemies, strung on leather cords', texture: 'smooth bone, clicking softly when walking', significance: 'Worn only by proven warriors; count the battles survived' },
    // HER ITEMS (HUMAN/OUTSIDER)
    { name: 'Her Research Journal', description: 'A leather-bound notebook, pages soft from use, filled with precise handwriting and pressed flowers', texture: 'supple leather, thick paper, ink slightly raised on the page', significance: 'Contains her life\'s work; he keeps it safe when she forgets it' },
    { name: 'Translation Stone', description: 'A small crystal worn around her neck that warms when she speaks, allowing understanding', texture: 'cool against skin, vibrates slightly when active', significance: 'His first gift to her; magic that lets them communicate beyond words' },
    { name: 'Her Glasses', description: 'Wire-framed spectacles, constantly sliding down her nose', texture: 'cold metal, smudged glass, familiar weight', significance: 'He learned to handle them gently; they remind him how fragile she seems' },
    { name: 'The First Flower', description: 'A pressed wildflower from the day they met, kept between pages', texture: 'paper-thin petals, brittle with age, still faintly fragrant', significance: 'She keeps it in her journal; he doesn\'t know she treasures it' },
    { name: 'Her Compass', description: 'A brass compass that led her into his territory', texture: 'warm metal, glass face scratched, needle trembling', significance: 'It stopped working the day she arrived; points only to him now' },
    { name: 'Survival Kit', description: 'A battered canvas bag containing her human world essentials', texture: 'worn canvas, mysterious contents, smell of antiseptic', significance: 'The last piece of her old life; she reaches for it less each day' },
    // MAGICAL & MYSTICAL
    { name: 'Soul Stone', description: 'A crystal that holds a piece of each mate\'s spirit, kept safe in a sacred place', texture: 'warm always, glows faintly, heavier than it should be', significance: 'If broken, both mates feel the loss; a weapon and a vulnerability' },
    { name: 'Dreaming Herbs', description: 'Dried plants burned to induce shared dreams between bonded mates', texture: 'crumbly, fragrant, smoke that tastes of starlight', significance: 'Allows communication across any distance while sleeping' },
    { name: 'The Seeing Pool', description: 'A natural spring in the sacred cave that shows visions', texture: 'water colder than ice, perfectly still until touched', significance: 'Reveals truths; not all who look can handle what they see' },
    { name: 'Elder\'s Staff', description: 'A gnarled walking stick carved with the history of the clan', texture: 'smooth from countless hands, warm as living wood', significance: 'Passed to each generation\'s keeper of stories' },
  ],
  'Dark Romance': [
    // POSSESSION & CLAIMING
    { name: 'His Signet Ring', description: 'A heavy platinum ring bearing the family crest, worn smooth on the inside', texture: 'cold metal, sharp edges of the crest, weight significant', significance: 'Mark of his position; given to her as protection or possession' },
    { name: 'The Collar', description: 'A delicate chain of white gold with a small lock, cold and elegant', texture: 'light as air, metal warming against her pulse', significance: 'Worn only for him; her choice to submit, his privilege to accept' },
    { name: 'His Black Card', description: 'A matte black credit card with no limit, her name embossed in silver', texture: 'smooth, slightly warm from his pocket when given', significance: 'Complete access to his world; freedom disguised as possession' },
    { name: 'Matching Bruises', description: 'Marks left intentionally, mapped in patterns only they understand', texture: 'tender skin, heat beneath the surface, ache of ownership', significance: 'His fingerprints on her body; she asked for each one' },
    { name: 'The Leash', description: 'Thin silver chain that clips to her collar, rarely used but always available', texture: 'cold links, slight weight, whisper of metal', significance: 'Symbol of her surrender; she holds it when she needs grounding' },
    { name: 'Ankle Bracelet', description: 'A thin gold chain with a single charm bearing his initial', texture: 'delicate metal, constant warmth, tiny weight she always feels', significance: 'Visible ownership hidden in plain sight; she never removes it' },
    // CONTROL & POWER
    { name: 'The Contract', description: 'Thick legal papers outlining their arrangement, her signature in blue ink', texture: 'heavy paper, official seals, ink that can\'t be undone', significance: 'What started as control became something neither expected' },
    { name: 'The Safe Word Note', description: 'A small piece of paper with a single word written in his hand', texture: 'crisp paper, pressed into her palm', significance: 'His promise of her power, even in their darkest games' },
    { name: 'The Penthouse Key', description: 'A simple brass key on a leather cord, old-fashioned for someone so modern', texture: 'worn edges, warm metal, leather soft from years of use', significance: 'Access to his private sanctuary; trust made tangible' },
    { name: 'His Phone', description: 'A device that controls empires, always face-down when she\'s there', texture: 'smooth glass, constant vibration, weight of the world', significance: 'For her, he ignores it; she\'s the only thing more important' },
    { name: 'The Blindfold', description: 'Black silk kept in the bedside drawer, well-worn and familiar', texture: 'smooth silk, slight scent of her perfume and his cologne', significance: 'Trust made physical; darkness where she feels safest' },
    { name: 'Red Room Key Card', description: 'A black card that accesses rooms not on any floor plan', texture: 'matte surface, electronic chip, weight of secrets', significance: 'Spaces designed for their games; she has her own now' },
    // WEAPONS & VIOLENCE
    { name: 'His Gun', description: 'A custom Glock, matte black, worn in a shoulder holster against his ribs', texture: 'cold steel, textured grip, heavier than she expected', significance: 'The violence he\'s capable of; he\'d empty it for her' },
    { name: 'Blood-Stained Shirt', description: 'A white dress shirt she found in his laundry, washed but marked', texture: 'soft cotton, faint rusty marks, familiar cologne', significance: 'Proof of what he does; she stopped asking whose' },
    { name: 'The Knife', description: 'A folding blade he gave her, pearl handle, sharp enough to shave', texture: 'smooth handle, cold blade, weight of protection', significance: 'For when he can\'t be there; she\'s had to use it' },
    { name: 'Brass Knuckles', description: 'Custom made, his initials engraved, kept in his desk', texture: 'cold metal, weight, smoothed by use', significance: 'From before he had men to do such things; he kept them' },
    // VULNERABILITY & HUMANITY
    { name: 'Sister\'s Ribbon', description: 'A faded pink ribbon, frayed at the edges, kept in his pocket always', texture: 'silk worn to cotton softness, edges ragged', significance: 'His dead sister\'s; the only soft thing he allows himself' },
    { name: 'The Photograph', description: 'A faded photo of a woman who looks like him, smiling, happy, alive', texture: 'worn edges, cracked from folding, protected in plastic', significance: 'His mother before the life took her; he shows no one' },
    { name: 'Childhood Bible', description: 'A worn book with his mother\'s handwriting in the margins', texture: 'cracked leather, soft pages, smell of age and incense', significance: 'Faith he lost but keeps anyway; she found it in his safe' },
    { name: 'Her Hairbrush', description: 'A simple brush left at his place, strands of her hair caught in bristles', texture: 'smooth handle, soft bristles, mundane intimacy', significance: 'First sign she was staying; he bought her a new one but kept this' },
    // LUXURY & LIFESTYLE
    { name: 'The Whiskey', description: 'A bottle of 50-year scotch, only opened for significant moments', texture: 'heavy crystal, amber liquid, warmth spreading from first sip', significance: 'They opened it the night she said yes' },
    { name: 'Matching Watches', description: 'His and hers Patek Philippes, synchronized to the second', texture: 'cold platinum, leather bands, quiet ticking', significance: 'Same time zone, always; wherever they are in the world' },
    { name: 'The Safe', description: 'A hidden compartment behind a painting, contains both their secrets', texture: 'cold metal, biometric lock, organized contents', significance: 'Both combinations, both trusts, both vulnerabilities' },
  ],
  'Mafia Romance': [
    // FAMILY & LEGACY
    { name: 'Family Ring', description: 'An antique gold ring with a blood-red ruby, passed down through generations', texture: 'warm gold, stone catching light like trapped fire', significance: 'Only worn by the Don\'s wife; a target and a shield' },
    { name: 'The Ledger', description: 'A leather-bound book filled with names, debts, and fates in coded shorthand', texture: 'cracked leather, yellowed pages, weight of lives', significance: 'Her father\'s debt recorded inside; her name beside it, crossed out in his hand' },
    { name: 'Family Crest', description: 'An ornate symbol carved in stone above the compound entrance', texture: 'cold stone, weathered edges, weight of generations', significance: 'Her new name, her new prison, her new protection' },
    { name: 'The Christening Gown', description: 'White lace yellowed with age, worn by every family heir', texture: 'delicate fabric, faint scent of cedar, history in threads', significance: 'Waiting for children she\'s not sure she wants to bring into this life' },
    { name: 'His Father\'s Gun', description: 'A vintage revolver, pearl handle, used to make him Don', texture: 'warm grip, cold barrel, weight of succession', significance: 'The gun that killed his father\'s killer; now in a glass case' },
    { name: 'The Family Bible', description: 'A massive tome recording births, deaths, and marriages for centuries', texture: 'cracked leather, gilt edges, ink faded to brown', significance: 'Her name written beside his in ink that never quite dried right' },
    // MARRIAGE & BOND
    { name: 'Wedding Bands', description: 'Matching platinum bands engraved inside with the date they met, not the wedding', texture: 'smooth metal, perfectly fitted, warm from constant wear', significance: 'The arranged marriage that became real; she chose to wear hers' },
    { name: 'His Mother\'s Rosary', description: 'Crystal beads worn smooth by decades of prayers, silver cross tarnished', texture: 'cool beads clicking softly, weight of faith and guilt', significance: 'The only thing he kept when she died; he gave it to protect her' },
    { name: 'The Wedding Dress', description: 'Designer couture she didn\'t choose, preserved in a closet she never opens', texture: 'heavy silk, beading sharp against fingers, scent of preservation', significance: 'She wore it like armor; he wants to see her happy in something else' },
    { name: 'Their Photograph', description: 'A candid shot from the reception, the only one where they\'re both laughing', texture: 'glossy print, silver frame, hidden in his office drawer', significance: 'Before they loved each other; proof they could smile together' },
    { name: 'Honeymoon Journal', description: 'A leather diary from their mandatory trip, entries growing warmer', texture: 'soft leather, pressed flowers between pages, her handwriting changing', significance: 'She started hating him; the last entry says something else entirely' },
    // PROTECTION & DANGER
    { name: 'The Armored Car', description: 'A black Mercedes with bulletproof glass and leather that\'s seen too much', texture: 'smooth leather, heavy doors, silence inside', significance: 'Her cage and her protection; he taught her to drive it' },
    { name: 'Hidden Blade', description: 'A slim knife strapped to her thigh, pearl handle catching light', texture: 'cold steel warming against skin, handle worn to her grip', significance: 'His wedding gift to her; she\'s had to use it twice' },
    { name: 'The Safe Room', description: 'A hidden chamber behind the bookshelf with supplies for a week', texture: 'steel walls, preserved air, silence absolute', significance: 'Where he sends her when danger comes; she waits alone' },
    { name: 'Panic Button', description: 'A small device disguised as a brooch, triggers immediate response', texture: 'light metal, smooth button, warmth against her collarbone', significance: 'She\'s never had to use it; knowing it\'s there is enough' },
    { name: 'The Bodyguard', description: 'A silent man who shadows her everywhere, name she finally learned', texture: 'presence more than touch, shadow she\'s grown used to', significance: 'She used to hate him; now she knows he\'d die for her' },
    { name: 'Burner Phones', description: 'A drawer of cheap phones, numbers memorized not stored', texture: 'cheap plastic, new phone smell, weight of paranoia', significance: 'One call away from him, always; she knows the protocol' },
    // POWER & BUSINESS
    { name: 'The Office', description: 'A room lined with history and power, where deals are made and broken', texture: 'leather chairs, mahogany desk, cigar smoke in the walls', significance: 'She\'s allowed in now; no other woman has been' },
    { name: 'Sunday Dinner Table', description: 'A massive oak table that seats twenty, her place at his right hand', texture: 'polished wood, linen napkins, silver that needs counting', significance: 'Business forbidden; the only time they\'re just family' },
    { name: 'The Wine Cellar', description: 'Bottles worth more than houses, one opened the night she forgave him', texture: 'cool air, dusty bottles, cobwebs undisturbed for decades', significance: 'He took her there first; said she should know all his secrets' },
    { name: 'His First Dollar', description: 'A worn bill framed on his office wall, earned legitimately at fourteen', texture: 'soft paper, faded ink, simple frame among expensive art', significance: 'Reminder of who he was before; she\'s the only one who knows the story' },
    // FAITH & GUILT
    { name: 'Church Pew', description: 'Their reserved seats at Sunday mass, worn by generations', texture: 'polished wood, kneelers softened by knees, smell of incense', significance: 'Where they perform piety; where he whispers confessions only she hears' },
    { name: 'Confession Booth', description: 'The place where sins are told and not forgiven, priest on payroll', texture: 'dark wood, velvet curtain, whispered secrets', significance: 'She found out he confesses her name; prayers for her safety' },
    { name: 'Votive Candles', description: 'Rows of flickering lights he funds, one for every life he\'s taken', texture: 'warm wax, small flames, smell of burning and prayer', significance: 'His penance that doesn\'t feel like enough; she lights them with him now' },
  ],
  'Billionaire Romance': [
    // HER HUMBLE ORIGINS
    { name: 'Grandmother\'s Necklace', description: 'A simple gold locket, dented and worn, containing a faded photo', texture: 'warm gold, chain thin from age, clasp tricky', significance: 'The only thing she has from before; he had the photo restored' },
    { name: 'Her Coffee Mug', description: 'A chipped ceramic mug from a gas station, kept in his pristine kitchen', texture: 'rough ceramic, chip on the handle, ordinary', significance: 'She left it; he couldn\'t throw it away. She never did get it back' },
    { name: 'Student Loan Letters', description: 'A stack of debt notices she keeps in a drawer, getting smaller', texture: 'thin paper, official fonts, red stamped warnings', significance: 'He offered to pay them; she refused. He respects her more for it' },
    { name: 'Thrift Store Dress', description: 'The dress she wore to their first meeting, vintage and twice-mended', texture: 'soft fabric, careful stitches, smell of vintage shops', significance: 'He had it professionally preserved; she doesn\'t know' },
    { name: 'Family Recipe Card', description: 'Her grandmother\'s handwriting, stained with years of use', texture: 'yellowed paper, grease spots, pencil faded', significance: 'She made him her grandma\'s soup when he was sick; he memorized it' },
    { name: 'Her First Paycheck', description: 'A photocopy of her first real paycheck, framed on her desk', texture: 'cheap frame, slightly crooked, amount modest', significance: 'She earned everything; he loves her more for that' },
    // HIS WEALTH & POWER
    { name: 'The Penthouse', description: 'Sixty floors above Manhattan, glass walls looking down on the world', texture: 'cold surfaces, warm lighting, silence money buys', significance: 'His fortress of solitude; she made it feel like home' },
    { name: 'His Watch', description: 'A vintage Patek Philippe, understated elegance worth more than her apartment', texture: 'cool metal, leather band softened by years, weight significant', significance: 'His grandfather\'s; he takes it off only for her' },
    { name: 'The Black Card', description: 'A Centurion card in her name, delivered without discussion', texture: 'heavy metal, smooth edges, power in a card', significance: 'His way of caring when words fail him' },
    { name: 'The Private Jet', description: 'A Gulfstream G700, her name added to the manifest permanently', texture: 'leather seats, quiet engines, champagne always ready', significance: 'He rerouted it to pick her up when she was stranded' },
    { name: 'The Island', description: 'Private land with nothing but them and the ocean', texture: 'warm sand, salt air, complete silence', significance: 'He bought it after she said she\'d never seen the ocean' },
    { name: 'Company Keys', description: 'A set of keys that access every building he owns', texture: 'heavy keyring, modern and antique mixed, weight of empire', significance: 'Given without ceremony; she now has access everywhere' },
    // EMOTIONAL BRIDGES
    { name: 'First Edition Book', description: 'A rare first edition of her favorite novel, found after months of searching', texture: 'aged paper, leather binding, inscription inside', significance: 'The first time she realized he listened' },
    { name: 'The Photo', description: 'A candid shot of her laughing, framed on his desk beside nothing else', texture: 'silver frame, glass over a private moment', significance: 'The first time he admitted it wasn\'t just business' },
    { name: 'Fortune Cookie Slip', description: 'A tiny paper reading "Your heart will find unexpected home"', texture: 'thin paper, crinkled, red ink faded', significance: 'From their first unofficial date; he keeps it in his wallet' },
    { name: 'The Painting', description: 'Art she mentioned once at a museum, now hanging in the penthouse', texture: 'canvas centuries old, frame worth more than the art', significance: 'He bought it at auction; she cried when she recognized it' },
    { name: 'Matching Robes', description: 'His and hers cashmere robes, hers appeared without comment', texture: 'impossibly soft, warm, smell of expensive things', significance: 'The first time his place felt like theirs' },
    { name: 'The Notebook', description: 'A leather journal where he writes things he can\'t say', texture: 'smooth leather, expensive paper, fountain pen ink', significance: 'She found it; he let her keep reading' },
    // MILESTONES
    { name: 'The Elevator Button', description: 'The button to his private floor, worn from her frequent pressing', texture: 'brushed metal, slight warmth, familiar click', significance: 'She remembers when pressing it terrified her' },
    { name: 'Her Toothbrush', description: 'The first thing she left, now joined by her whole life', texture: 'plastic handle, soft bristles, beside his', significance: 'The tiny invasion that became a complete takeover' },
    { name: 'His Company Stock', description: 'Shares transferred to her name without announcement', texture: 'digital ownership, paper meaningless, value immense', significance: 'She found out in a board meeting; she didn\'t speak for hours' },
    { name: 'The Closet', description: 'A walk-in space filled with clothes in her size, her taste', texture: 'silk, cotton, leather—all high quality, all her', significance: 'He had it filled by her favorite designer; she wept' },
    { name: 'Spare Key', description: 'A simple key to her old apartment, still on his keychain', texture: 'cheap metal, worn edges, past life', significance: 'From before she moved in; he keeps it like a memory' },
    { name: 'The Ring', description: 'Not the enormous diamond expected—her grandmother\'s stone, reset', texture: 'old gold, familiar diamond, new meaning', significance: 'He found it, bought it from her cousin, surprised her completely' },
  ],
  'Shifter Romance': [
    // MATING & BONDING
    { name: 'Mating Mark', description: 'A scar where canines pierced skin, silver-pink and permanent', texture: 'raised tissue, sensitive to touch, warm when mate is near', significance: 'Visible proof of the bond; throbs during the full moon' },
    { name: 'Alpha\'s Collar', description: 'A simple leather band with a moonstone clasp, worn only during ceremonies', texture: 'supple leather, stone cool against throat, weight of position', significance: 'Marks the alpha\'s mate; she wears his claim publicly' },
    { name: 'Mating Furs', description: 'Pelts from their first hunt together, kept in the private den', texture: 'thick fur, warmth, scent of both of them mingled', significance: 'Where bonds are consummated and renewed' },
    { name: 'Scent Glands', description: 'The spot on his neck he rubs against her, marking her daily', texture: 'warm skin, slightly rough, spicy masculine scent', significance: 'Involuntary claiming; he can\'t help himself' },
    { name: 'Bonding Bite', description: 'The mark she gave him in return, smaller but just as permanent', texture: 'raised scar, tender, pinkish silver', significance: 'Her claim on him; proof she chose back' },
    { name: 'Shared Heat', description: 'The fever that takes them both during her first cycle after turning', texture: 'burning skin, sweat, uncontrollable need', significance: 'Biology confirming the bond; they survived it together' },
    // PACK CULTURE
    { name: 'Pack Pendant', description: 'A silver wolf tooth on a leather cord, given at acceptance into pack', texture: 'smooth bone, leather soft from wear, weight of belonging', significance: 'Marks her as protected by the pack; she earned it' },
    { name: 'The Den', description: 'A cabin deep in the woods, hidden from human eyes, walls thick with memory', texture: 'rough wood, warm fires, blankets that smell like pine and wolf', significance: 'Where the pack gathers; where she was first brought after the bite' },
    { name: 'The Territory Map', description: 'A hand-drawn map marking pack boundaries, dangers, and safe places', texture: 'worn paper, coffee-stained, additions in different hands', significance: 'He added her cabin the day he decided she was his' },
    { name: 'Challenge Circle', description: 'A clearing marked with old blood and claw marks', texture: 'packed earth, energy thrumming, history in the soil', significance: 'Where he won his position; where he\'ll defend his claim on her' },
    { name: 'Moon Altar', description: 'A flat stone where the pack gathers during full moons', texture: 'cold stone, smooth from centuries of paws, silver light', significance: 'Where she first shifted; where they were bonded' },
    { name: 'Pack Howl Recording', description: 'A video on her phone of the pack howling in welcome', texture: 'digital but precious, played when she\'s homesick', significance: 'The night they accepted her; she cried watching it' },
    // SHIFTING LIFE
    { name: 'Shifting Clothes', description: 'A small bag of easily removed clothing, stashed throughout the territory', texture: 'soft cotton, practical, smelling of pine and anticipation', significance: 'The practical reality of their life; she learned to pack them too' },
    { name: 'First Kill', description: 'A polished claw from her first hunt, strung on silver', texture: 'curved bone, sharp edge, cold metal', significance: 'Proof she could survive this life; he wears it next to his heart' },
    { name: 'Shifting Stone', description: 'A crystal that helps focus during painful early transformations', texture: 'cool, pulsing slightly, warm when gripped', significance: 'He gave it to her during her first shift; she slept holding it' },
    { name: 'Wolf Fur Blanket', description: 'A blanket woven with fur from pack members, including both of them now', texture: 'impossibly soft, warm, smells like home', significance: 'Given to mated pairs; their contribution added last year' },
    { name: 'Run Route', description: 'A well-worn path through the forest, only visible to those who know', texture: 'soft pine needles, familiar scents, moonlit', significance: 'Their path; where they run together every full moon' },
    // PROTECTION & DANGER
    { name: 'Silver Bullet', description: 'A single round kept in a glass case, recovered from his body', texture: 'cold metal, deadly, near-miss', significance: 'The hunter that almost killed him before they met' },
    { name: 'Emergency Collar', description: 'A collar that prevents shifting, worn during her early days', texture: 'cold metal, uncomfortable, now hung on the wall', significance: 'She wore it until she had control; reminder of progress' },
    { name: 'Rogue Scar', description: 'A scar on his side from protecting her during a rogue attack', texture: 'raised tissue, silver-pink, mark of devotion', significance: 'He nearly died; she finished the rogue herself' },
    { name: 'Hunter\'s Trap', description: 'A deactivated trap mounted on the wall, taken from trespassers', texture: 'cold metal, sharp teeth, danger defused', significance: 'The world they protect her from; she\'s not afraid anymore' },
    // HUMANITY & INTEGRATION
    { name: 'Human Life Box', description: 'A box of items from before—photos, ID, trinkets from her old life', texture: 'cardboard, dust, memories', significance: 'She keeps it but opens it less; the wolf needs less' },
    { name: 'Pack Photo', description: 'A group photo of the pack in human form, her in the center', texture: 'glossy print, frame hand-carved by an elder', significance: 'First family photo that felt real' },
    { name: 'Mixed Playlist', description: 'Music that combines human songs with traditional pack chants', texture: 'digital, played during runs, bridges her two lives', significance: 'She made it; the pups request it now' },
  ],
  'Alien Romance': [
    // BONDING & MATING
    { name: 'Claiming Marks', description: 'Bioluminescent patterns that appeared on her skin after bonding', texture: 'slightly raised, warm, glow in the dark', significance: 'His species\' mark of mating; proves the bond to doubters' },
    { name: 'Mating Gift', description: 'A crystal containing captured starlight, unique to his world', texture: 'warm despite looking cold, light shifts inside', significance: 'Traditional proposal gift; light from stars now dead' },
    { name: 'Bond Bands', description: 'Matching metal circlets that sync with heartbeats across any distance', texture: 'warm metal, constant subtle pulse, weight of connection', significance: 'She feels his heartbeat; he feels hers. Always.' },
    { name: 'The Nest', description: 'A sleeping space he built combining his instincts and her preferences', texture: 'soft materials, warm, surrounded by his scent', significance: 'First place that felt like theirs; he added pillows after she complained' },
    { name: 'Bonding Pheromones', description: 'His species\' chemical signature that marked her permanently', texture: 'invisible but present, she smells it now', significance: 'His scent in her skin; other species can tell she\'s claimed' },
    { name: 'Mating Display Holovid', description: 'A recording of his species\' traditional mating dance, performed for her', texture: 'light and movement, embarrassingly beautiful', significance: 'He did the full ritual; she\'s the only human to see it' },
    // TECHNOLOGY & ADAPTATION
    { name: 'Translation Implant', description: 'A tiny device behind her ear, surgery performed while unconscious', texture: 'invisible now, sometimes buzzes with new languages', significance: 'Given without consent; became her lifeline to understanding him' },
    { name: 'His Ship', description: 'A vessel of dark metal and impossible curves, alive with humming systems', texture: 'warm walls that respond to touch, air that tastes different', significance: 'Their home between stars; she learned to pilot it' },
    { name: 'Survival Suit', description: 'A second-skin garment that regulates temperature and filters air', texture: 'impossibly thin, warm, moves like skin', significance: 'He gave it when her own suit failed; wearing his felt intimate' },
    { name: 'Communication Crystal', description: 'A small gem that allows instantaneous contact across any distance', texture: 'smooth, warm, pulses when message waits', significance: 'He gave it when they were separated; she never turns it off' },
    { name: 'Food Synthesizer Settings', description: 'A device programmed with Earth recipes she described from memory', texture: 'smooth panel, warm, hums when working', significance: 'He spent months perfecting her coffee; it still tastes wrong' },
    { name: 'Gravity Adjustment Bracelet', description: 'A band that lets her move in different gravities', texture: 'light metal, subtle hum, warmth against wrist', significance: 'So she can visit his home world without floating or being crushed' },
    { name: 'Air Filtration Necklace', description: 'A subtle device that lets her breathe in atmospheres lethal to humans', texture: 'light chain, small pendant, life support disguised as jewelry', significance: 'He had it custom made; she wears it always' },
    // MEMORIES & CONNECTION
    { name: 'Star Map', description: 'A holographic display of his home system, planets spinning in her palm', texture: 'light with weight, warmth without heat', significance: 'He showed her where he came from; asked if she\'d go with him' },
    { name: 'Earth Holovid', description: 'A recording of Earth he made for her, places she mentioned, now gone', texture: 'light and memory, painful and precious', significance: 'Her home preserved in alien technology; she can\'t watch it often' },
    { name: 'Memory Crystal', description: 'A gem that records experiences directly from the mind', texture: 'warm when active, holds moments perfectly', significance: 'They share memories they can\'t put into words' },
    { name: 'First Words Recording', description: 'A loop of her first attempts at his language, both of them laughing', texture: 'audio only, played on difficult days', significance: 'Proof of how far they\'ve come; her accent was terrible' },
    { name: 'Family Holograph', description: 'His parents, siblings, the family she\'ll never meet', texture: 'light and loss, faces she\'s memorized', significance: 'They died before she was born; he shared them anyway' },
    // CULTURAL EXCHANGE
    { name: 'Earth Artifact Box', description: 'A container of human items—photographs, trinkets, a teddy bear', texture: 'various, all irreplaceable, smell of home fading', significance: 'Everything she has from before; he guards it like treasure' },
    { name: 'Alien Cookbook', description: 'Her attempts to document recipes from his world in English', texture: 'digital journal, many failures noted, eventual successes', significance: 'She learned to cook his favorite; it took six months' },
    { name: 'Cultural Exchange Journal', description: 'A diary where they explain things to each other', texture: 'digital but illustrated, two languages intertwined', significance: 'Started as necessity; became love letters' },
    { name: 'First Gift', description: 'A simple rock from his home world, first thing he ever gave her', texture: 'smooth, slightly magnetic, wrong color', significance: 'She didn\'t know its value; it\'s sacred to his species' },
    // SURVIVAL & DANGER
    { name: 'Distress Beacon', description: 'A device that calls him from anywhere in the known universe', texture: 'small, cold, one button', significance: 'She\'s used it once; he arrived in impossible time' },
    { name: 'Escape Pod Key', description: 'Access to a pod always prepped for Earth-compatible atmosphere', texture: 'small chip, warm from her pocket', significance: 'His promise she can always leave; she never will' },
    { name: 'Species Guide', description: 'A holographic encyclopedia of dangerous species they might encounter', texture: 'light displays, updates constantly, her notes added', significance: 'He made her memorize the threats; she added the friendly ones' },
  ],
  'Romantasy': [
    // BARGAINS & BONDS
    { name: 'Bonding Tattoo', description: 'Magical ink that appeared on her wrist when the bargain was struck', texture: 'slightly raised, warm, shifts patterns when he\'s near', significance: 'Mark of their deal; burned when she tried to break it' },
    { name: 'The Bargain Scar', description: 'A thin silver line on both their palms from the blood oath', texture: 'slightly raised, warm when they\'re close, aches when apart', significance: 'What started as a deal became a bond neither expected' },
    { name: 'The True Name', description: 'His real name, whispered once, now kept secret in her heart', texture: 'words that felt like honey and thorns in her mouth', significance: 'Complete power over him, given freely; she\'s never used it' },
    { name: 'Debt Counter', description: 'A small hourglass that tracks what she owes him, sand running both ways now', texture: 'cool glass, silver sand, lighter each day', significance: 'Started as her prison; became proof of balance' },
    { name: 'Binding Ribbon', description: 'A red thread that connects them, invisible except in fae light', texture: 'silk that can\'t be cut, warm where it touches', significance: 'Neither can die while the other lives; blessing and curse' },
    { name: 'Promise Ring', description: 'A band of woven moonlight that proves words spoken are true', texture: 'cool light, substantial somehow, beautiful', significance: 'He gave it so she\'d believe his impossible words' },
    // POWER & POSITION
    { name: 'Crown of Shadows', description: 'A circlet of dark metal that seems to drink light, thorns and night', texture: 'cold, heavier than it looks, shadows move in peripheral vision', significance: 'Mark of his queen; she never wanted power, but he gave it anyway' },
    { name: 'Court Gown', description: 'A dress of midnight silk and woven starlight, impossibly beautiful', texture: 'light as air, cold as space, moves like water', significance: 'Made for her by the court tailors; armor disguised as beauty' },
    { name: 'Shadow Throne', description: 'A seat beside his, carved from the same dark stone', texture: 'cold stone, surprisingly comfortable, power humming', significance: 'No queen has sat there in millennia; she sits there now' },
    { name: 'Court Seal', description: 'Her own signet ring, mark of her authority in his court', texture: 'heavy metal, sharp edges, weight of responsibility', significance: 'He gave her power to match his own; the court noticed' },
    { name: 'Key to Nothing', description: 'A key that opens any door in any realm, even doors that don\'t exist', texture: 'wrong metal, warm always, impossible', significance: 'His most powerful artifact; she wears it openly now' },
    // MORTALITY & HUMANITY
    { name: 'Memory Stone', description: 'A smooth river rock containing her happiest human memory', texture: 'warm, weight of summers past, slightly luminescent', significance: 'Saved before she forgot; he watches her hold it when she\'s homesick' },
    { name: 'Mortal Token', description: 'A pressed flower from her human garden, preserved in crystal', texture: 'cool crystal, petals frozen in time', significance: 'The last piece of her old life; he keeps it safer than anything' },
    { name: 'Mirror of Memory', description: 'A looking glass that shows the human world as it is now', texture: 'cold glass, frame of living wood, images that hurt', significance: 'She stopped looking when she saw how time had passed' },
    { name: 'Age Illusion Charm', description: 'A pendant that makes her appear to age normally to mortal eyes', texture: 'cool stone, warm chain, weight of deception', significance: 'So she can visit human realms without questions' },
    { name: 'Last Human Meal', description: 'A preserved feast, magically kept fresh, from her goodbye dinner', texture: 'familiar smells, fading tastes, memory more than food', significance: 'She eats it on anniversaries; he watches without understanding' },
    // PROTECTION & WEAPONS
    { name: 'Iron Blade', description: 'A small dagger of pure iron, deadly to fae, hidden in her boot', texture: 'cold metal, rough leather wrap, weight of security', significance: 'Her only defense in his court; he taught her to use it' },
    { name: 'Glamour Pendant', description: 'A gem that can disguise her as any creature', texture: 'cool stone, warm when active, weight of possibilities', significance: 'For when being human would mean death' },
    { name: 'Shadow Cloak', description: 'A garment that lets her walk unseen in his court', texture: 'weightless darkness, whisper of movement, living fabric', significance: 'So she can move freely; she learned to spy with it' },
    { name: 'Fae Guard Ring', description: 'A band that warns of magical threats', texture: 'cold when safe, burning when danger approaches', significance: 'Saved her life three times; burns almost constantly in court' },
    { name: 'Truth Earrings', description: 'Jewelry that lets her know when she\'s being lied to', texture: 'sharp points, cold against skin, warmth when lies spoken', significance: 'Essential for surviving a court built on beautiful lies' },
    // LOVE & INTIMACY
    { name: 'Shared Dreams', description: 'A spell that lets them meet in sleep', texture: 'warmth of his presence, vividness of true dreams', significance: 'How they talk when separated; more real than waking' },
    { name: 'Constellation Map', description: 'Stars only they can see, marking places important to their story', texture: 'light in darkness, permanent, personal mythology', significance: 'He put them there; their love written in the sky' },
    { name: 'Eternal Flower', description: 'A rose that blooms forever, given on the anniversary of her arrival', texture: 'soft petals, impossibly perfect, faint warmth', significance: 'One petal falls when they\'re apart too long; none have fallen' },
    { name: 'His Heartbeat', description: 'A crystal that pulses with his heart, given so she\'d never doubt', texture: 'warm, constant rhythm, heavier when he\'s troubled', significance: 'She carries his heart literally; he trusts her completely' },
  ],
  'Why Choose / Reverse Harem': [
    // SYMBOLS OF UNITY
    { name: 'The Bracelet', description: 'A charm bracelet with four different charms, each from a different man', texture: 'silver chain, charms clinking softly, weight accumulating', significance: 'Each charm is a promise; she wears them all' },
    { name: 'Matching Rings', description: 'Five bands of different metals, designed to interlock', texture: 'varied metals warm against skin, puzzle that fits together', significance: 'Their commitment to each other, unconventional but real' },
    { name: 'Group Tattoo', description: 'A symbol each of them has, placed differently but identical', texture: 'raised ink, warm skin, permanent commitment', significance: 'Their secret mark; strangers don\'t know what it means' },
    { name: 'The Necklace', description: 'A chain with five pendants, each man\'s initial, hers in the center', texture: 'light metal, soft clinking, warmth against heart', significance: 'She never takes it off; everyone asks about it' },
    { name: 'Shared Lock Screen', description: 'The same photo on all five phones—them together, happy', texture: 'digital but meaningful, updated regularly', significance: 'Anyone who sees their phones knows they belong together' },
    // HOME & DOMESTIC
    { name: 'The House', description: 'A sprawling home with five bedrooms, one for each of them', texture: 'warm wood, mixed decorating styles, lived-in comfort', significance: 'What started as awkward became home; they built it together' },
    { name: 'The Bed', description: 'A custom king-plus mattress, ridiculously large, always warm', texture: 'expensive sheets, piled pillows, never enough room', significance: 'Where they come together; no one sleeps alone' },
    { name: 'The Calendar', description: 'A color-coded schedule on the kitchen wall, organizing their chaos', texture: 'marker on whiteboard, constantly updated, inside jokes', significance: 'Her system for making it work; they tease her but follow it' },
    { name: 'The Kitchen Table', description: 'A round table so no one sits at the head, six chairs always', texture: 'solid wood, worn from elbows, center of daily life', significance: 'Where they debate, laugh, plan, fight, and forgive' },
    { name: 'Movie Night Blanket', description: 'An enormous knitted throw, made from squares each contributed', texture: 'various yarns, different skill levels, imperfect perfection', significance: 'Made together one winter; big enough for everyone' },
    { name: 'Group Chat', description: 'A messaging thread that never stops, years of history', texture: 'digital but essential, notifications constant', significance: 'Inside jokes, schedule coordination, three-am confessions' },
    // MEMORIES & MILESTONES
    { name: 'Group Photo', description: 'A candid shot of all five of them, laughing at something off-camera', texture: 'glossy print, creased from being carried, edges soft', significance: 'Taken before anyone knew what they\'d become to each other' },
    { name: 'Proposal Video', description: 'A recording of all four of them asking, in their own ways', texture: 'digital memory, watched on anniversaries', significance: 'Four different styles, one answer—yes to all' },
    { name: 'First Dance Memory', description: 'A photo booth strip from the night everything changed', texture: 'worn edges, faded ink, four different expressions', significance: 'When friends became something else entirely' },
    { name: 'Anniversary Box', description: 'A container of items from important dates—tickets, receipts, notes', texture: 'overflowing, organized by her, added to constantly', significance: 'Their history in objects; they pull it out on bad days' },
    { name: 'The Playlist', description: 'A collaborative music collection with songs that mean something to them', texture: 'digital but precious, hours of memories', significance: 'Every addition requires a story; new songs spark old memories' },
    // INDIVIDUAL CONNECTIONS
    { name: 'Man One\'s Gift', description: 'The first thing he ever gave her, kept in a special place', texture: 'varies, always meaningful, often surprising', significance: 'Proof he saw her before anyone else did' },
    { name: 'Man Two\'s Book', description: 'A journal he keeps of their relationship, private until he shared it', texture: 'worn leather, messy handwriting, vulnerable', significance: 'His way of processing; she cried reading it' },
    { name: 'Man Three\'s Key', description: 'A key to a place that\'s just theirs, separate from the group', texture: 'simple metal, heavy meaning, privacy', significance: 'Where they go when they need just each other' },
    { name: 'Man Four\'s Promise', description: 'A letter he wrote before they were anything, found later', texture: 'old paper, faded ink, prophetic words', significance: 'He knew before anyone; he waited anyway' },
    // LOGISTICS & REALITY
    { name: 'The Spreadsheet', description: 'A document tracking everything—schedules, preferences, dates', texture: 'digital organization, constantly updated', significance: 'Her way of making sure no one feels forgotten' },
    { name: 'Emergency Protocols', description: 'A list on the fridge of who to call when, for what', texture: 'laminated paper, practical, essential', significance: 'They each have strengths; the list assigns problems' },
    { name: 'Vacation Fund Jar', description: 'A massive jar collecting funds for annual group trips', texture: 'glass, coins and bills, dream destination photos', significance: 'A trip every year; no one left behind' },
  ],
  'Bully Romance': [
    {
      name: 'The Photo',
      description: 'A hidden photo of her from before, kept in his wallet for years',
      texture: 'worn edges, crease from folding, glossy where his thumb rubs',
      significance: 'Proof he wanted her even when he was cruel',
    },
    {
      name: 'The Locker',
      description: 'Her old locker, dented where he slammed it, repainted but scarred',
      texture: 'cold metal, scratched surface, memories in paint',
      significance: 'Where it started; they go back sometimes, remembering',
    },
    {
      name: 'Apology Letter',
      description: 'Pages of his handwriting, crossed out and rewritten, never sent',
      texture: 'crumpled paper, ink smeared by tears (his)',
      significance: 'Found in his desk; proof the monster regretted everything',
    },
    {
      name: 'The Crown',
      description: 'A cheap plastic tiara from the dance he ruined for her',
      texture: 'plastic rhinestones, one missing, still sparkles',
      significance: 'She kept it; he found it in her room and wept',
    },
    {
      name: 'Matching Scars',
      description: 'Small marks on both their hands from the broken glass incident',
      texture: 'thin white lines, faded but visible',
      significance: 'From when he protected her after everything he\'d done',
    },
  ],
  'Age Gap Romance': [
    {
      name: 'His Record Collection',
      description: 'Vinyl albums from decades before she was born, played on Sunday mornings',
      texture: 'warm vinyl, scratchy sound, cardboard sleeves',
      significance: 'He teaches her about music; she makes him feel young',
    },
    {
      name: 'The First Gift',
      description: 'A first edition of a book she mentioned once, found after weeks of searching',
      texture: 'aged leather, foxed pages, inscription in his hand',
      significance: 'When she realized he actually listened',
    },
    {
      name: 'Photo Strip',
      description: 'A strip from a photo booth, four frames of them laughing and kissing',
      texture: 'glossy paper, slight curl, evidence of joy',
      significance: 'Taken at a fair; he keeps it in his wallet despite the risk',
    },
    {
      name: 'Her Hairbrush',
      description: 'A simple brush left at his place, strands of her hair still in it',
      texture: 'smooth handle, soft bristles, intimate in ordinary',
      significance: 'First sign she was staying; he never asked her to take it back',
    },
    {
      name: 'The Watch',
      description: 'An antique watch inherited from his father, given to her',
      texture: 'heavy gold, worn leather, time passing',
      significance: 'His most valuable possession; she\'s worth more to him',
    },
    {
      name: 'The Playlist',
      description: 'A carefully curated collection of songs from his era, made for her',
      texture: 'digital but deeply personal, each song a memory',
      significance: 'His way of sharing his past; she listens on repeat',
    },
    {
      name: 'His Reading Glasses',
      description: 'Wire-rimmed glasses that soften his severe features',
      texture: 'thin metal warm from his face, slight bend in one arm',
      significance: 'She borrows them to read; they smell like him',
    },
    {
      name: 'The Key',
      description: 'A spare key to his apartment, given without ceremony',
      texture: 'new-cut metal, cold in her palm, weight of invitation',
      significance: 'More commitment than any declaration could be',
    },
    {
      name: 'Anniversary Earrings',
      description: 'Simple diamond studs he gave her on their six-month anniversary',
      texture: 'cold stone, warm gold, weight of secrets',
      significance: 'Too expensive to explain; she wears them anyway',
    },
    {
      name: 'His Sweater',
      description: 'A worn cashmere sweater she claimed and never returned',
      texture: 'impossibly soft, stretched by her smaller frame, his cologne faded but present',
      significance: 'Her comfort when they\'re apart; he pretends not to notice',
    },
    {
      name: 'The Letters',
      description: 'Handwritten notes left on her pillow when he leaves early',
      texture: 'heavy paper, fountain pen ink, words carefully chosen',
      significance: 'Old-fashioned romance in a digital age; she keeps every one',
    },
    {
      name: 'Their Booth',
      description: 'The corner table at a restaurant where no one knows them',
      texture: 'worn leather seats, dim lighting, privacy',
      significance: 'Where they can just be; the waiter never asks questions',
    },
  ],
  // ============ ADDITIONAL MONSTER ROMANCE ARTIFACTS ============
  'Monster Romance Extended': [
    {
      name: 'Ceremonial Horns',
      description: 'Carved drinking horns passed during celebrations, etched with ancient symbols',
      texture: 'smooth bone worn by centuries, metal bands cold at the rim',
      significance: 'Drinking together seals agreements; she learned to stomach the mead',
    },
    {
      name: 'His Battle Armor',
      description: 'Leather and bone plates that have saved his life countless times',
      texture: 'worn leather, sharp bone edges, weight of survival',
      significance: 'He lets her touch it; no one else is allowed',
    },
    {
      name: 'The First Flower',
      description: 'A pressed flower from the day they met, preserved in a leather pouch',
      texture: 'papery petals, faded color, fragile memory',
      significance: 'He picked it for her before he knew what she\'d become to him',
    },
    {
      name: 'Healing Salve',
      description: 'A clay pot of green paste that smells of herbs and magic',
      texture: 'cool and slightly gritty, tingles on the skin',
      significance: 'He made it to heal her wounds; now she makes it for him',
    },
    {
      name: 'The Cave Paintings',
      description: 'Ancient drawings in his quarters depicting heroes and their mates',
      texture: 'rough stone walls, pigments that have lasted millennia',
      significance: 'He added her image beside his',
    },
    {
      name: 'Pregnancy Test',
      description: 'A small device she brought from home, still in its wrapper',
      texture: 'plastic and mystery, weight of possibility',
      significance: 'The question neither of them has asked yet',
    },
    {
      name: 'The Throne',
      description: 'A massive chair carved from the trunk of the oldest tree in the forest',
      texture: 'smooth wood worn by generations, power in every groove',
      significance: 'He pulled her onto it beside him; the clan watched in shock',
    },
    {
      name: 'Her Compass',
      description: 'The compass she brought from her old life, now useless but precious',
      texture: 'cold metal, glass face scratched, needle spinning wrong',
      significance: 'Doesn\'t work here but she keeps it; he understands',
    },
    {
      name: 'Mating Cloak',
      description: 'A heavy fur cloak meant to be shared between bonded mates',
      texture: 'impossibly warm, large enough for two, smells of both of them',
      significance: 'Wearing it publicly declared their bond',
    },
    {
      name: 'The Broken Blade',
      description: 'His first weapon, snapped in a battle that nearly killed him',
      texture: 'jagged metal, worn handle, weight of mortality',
      significance: 'He gave it to her as a reminder: he almost didn\'t exist',
    },
    {
      name: 'Her Wedding Ring',
      description: 'The ring from her human engagement, worn on a chain now',
      texture: 'cold gold, diamond that catches orc firelight',
      significance: 'A life she left; he never asks her to remove it',
    },
    {
      name: 'The Star Map',
      description: 'A tapestry showing orc constellations with human names added',
      texture: 'thick woven fabric, threads raised under fingertips',
      significance: 'She named new stars; he memorized every one',
    },
    {
      name: 'Fertility Beads',
      description: 'A string of carved wooden beads given by the clan elder',
      texture: 'smooth polished wood, clicking softly when she moves',
      significance: 'A blessing for many children; she wears them despite blushing',
    },
    {
      name: 'His Voice Box',
      description: 'A small carved box that plays orc lullabies when opened',
      texture: 'intricate carvings, warmth of the wood, haunting melody',
      significance: 'His mother made it; he gave it for their future children',
    },
  ],
  // ============ ADDITIONAL DARK ROMANCE ARTIFACTS ============
  'Dark Romance Extended': [
    {
      name: 'The Tracking Device',
      description: 'A small chip sewn into the lining of her bag',
      texture: 'tiny, invisible, weight of constant surveillance',
      significance: 'She found it; she didn\'t remove it',
    },
    {
      name: 'His First Letter',
      description: 'A note left on her pillow: "I\'m not done with you"',
      texture: 'expensive paper, black ink, threat or promise',
      significance: 'She should have burned it; she sleeps with it under her pillow',
    },
    {
      name: 'The Red Room Key',
      description: 'A ornate key to a room she pretends doesn\'t interest her',
      texture: 'heavy iron, cold metal, warmth of anticipation',
      significance: 'He gave it freely; the choice was always hers',
    },
    {
      name: 'Her Submission Collar',
      description: 'A velvet choker with a hidden D-ring, worn only in private',
      texture: 'soft velvet, cool metal, weight of trust',
      significance: 'Her choice to wear; his privilege to attach to',
    },
    {
      name: 'The Safe',
      description: 'A fireproof box containing documents she\'s never read',
      texture: 'cold steel, heavy lock, weight of secrets',
      significance: 'Her future if something happens to him; he made sure',
    },
    {
      name: 'His Dog Tags',
      description: 'Military identification from a life before this one',
      texture: 'worn metal, chain warm from her skin when she wears them',
      significance: 'The only proof he was ever someone else',
    },
    {
      name: 'The Burner Phone',
      description: 'A disposable phone with only his number programmed',
      texture: 'cheap plastic, small screen, direct line',
      significance: 'Emergency use only; she\'s never had to use it',
    },
    {
      name: 'Blood-Stained Shirt',
      description: 'The shirt he wore the night he saved her, never washed',
      texture: 'stiff cotton, rust-brown stains, evidence',
      significance: 'Proof he would kill for her; she keeps it hidden',
    },
    {
      name: 'His Cigarette Case',
      description: 'A silver case he fidgets with but never opens',
      texture: 'cold silver, worn edges, empty now',
      significance: 'He quit for her; keeps the case as a reminder',
    },
    {
      name: 'The Blindfold',
      description: 'Black silk that blocks all light, soft against her eyes',
      texture: 'smooth silk, elastic band, surrender made tangible',
      significance: 'Trust in darkness; her choice, always',
    },
    {
      name: 'Her Emergency Bag',
      description: 'A packed bag hidden in her closet: cash, passport, phone',
      texture: 'canvas strap, weight of preparation',
      significance: 'She keeps it; he pretends not to know',
    },
    {
      name: 'The Piano',
      description: 'A grand piano in his penthouse only she plays',
      texture: 'ivory keys cool under fingers, polished wood',
      significance: 'He bought it for her; she plays while he watches',
    },
    {
      name: 'His Cufflinks',
      description: 'Onyx cufflinks engraved with his family crest',
      texture: 'cold stone, heavy gold, weight of dynasty',
      significance: 'She helps him put them on; ritual intimacy',
    },
    {
      name: 'The Photograph',
      description: 'A candid shot of her sleeping, taken without her knowing',
      texture: 'glossy print, creased from being carried',
      significance: 'Stalker or protector; she\'s stopped asking which',
    },
  ],
  // ============ ADDITIONAL MAFIA ROMANCE ARTIFACTS ============
  'Mafia Romance Extended': [
    {
      name: 'The Confession Box',
      description: 'A wooden box containing confessions written but never burned',
      texture: 'old wood, papers soft with age, sins catalogued',
      significance: 'Everyone has one; she found his',
    },
    {
      name: 'Wedding Veil',
      description: 'Antique lace worn by generations of family brides',
      texture: 'delicate threads, yellowed with time, weight of tradition',
      significance: 'Not for love, for alliance; she wore it anyway',
    },
    {
      name: 'His Pocket Watch',
      description: 'A gold watch that belonged to his grandfather, a founding member',
      texture: 'heavy gold, chain warm, time stopped at 3:47—when he died',
      significance: 'He winds it but never resets it',
    },
    {
      name: 'The Nursery',
      description: 'A room prepared for children, decorated but empty',
      texture: 'soft fabrics, mobile untouched, hope and pressure',
      significance: 'The heir they\'re expected to produce; neither enters alone',
    },
    {
      name: 'Her Father\'s Debt',
      description: 'A ledger entry that cost her everything',
      texture: 'paper and ink, numbers that became her life',
      significance: 'He bought the debt; she became the payment',
    },
    {
      name: 'The Panic Room',
      description: 'A reinforced room behind the bookshelf, stocked for siege',
      texture: 'steel walls, recycled air, silence',
      significance: 'Where he sends her during trouble; she waits alone',
    },
    {
      name: 'Grandmother\'s Lasagna Recipe',
      description: 'A handwritten card, stained with sauce, in his nonna\'s writing',
      texture: 'thin paper, faded ink, tomato stains',
      significance: 'She learned to make it; he cried the first time she served it',
    },
    {
      name: 'The Vineyard Deed',
      description: 'Ownership papers for a small vineyard in Sicily',
      texture: 'legal paper, stamps and seals, legacy',
      significance: 'He put it in her name; escape route disguised as romance',
    },
    {
      name: 'Her Panic Button',
      description: 'A small device hidden in her bracelet, connects to his men',
      texture: 'warm metal against skin, button impossible to press accidentally',
      significance: 'He tested it once; they arrived in ninety seconds',
    },
    {
      name: 'The Anniversary Gun',
      description: 'A pearl-handled pistol given on their first anniversary',
      texture: 'cool mother-of-pearl, steel warming in her hand',
      significance: 'Beautiful and deadly; just like she\'s become',
    },
    {
      name: 'Confession Rosary',
      description: 'The rosary he\'s prayed since childhood, beads worn smooth',
      texture: 'cool glass, silver tarnished, prayers and sins',
      significance: 'He prays for her soul now; she didn\'t ask him to',
    },
    {
      name: 'The Cabin',
      description: 'A simple house in the mountains, known only to them',
      texture: 'rough wood, soft blankets, peace',
      significance: 'Where they go to forget what they are',
    },
  ],
  // ============ ADDITIONAL BILLIONAIRE ARTIFACTS ============
  'Billionaire Romance Extended': [
    {
      name: 'The NDA',
      description: 'A thick document she signed before knowing what she\'d feel',
      texture: 'legal paper, her signature in blue ink',
      significance: 'She could break it now; she never will',
    },
    {
      name: 'The Company',
      description: 'Shares in his corporation, transferred without her knowledge',
      texture: 'digital ownership, abstract wealth',
      significance: 'Security disguised as gesture; she hasn\'t cashed them',
    },
    {
      name: 'Her Student Loans',
      description: 'Debt papers marked "Paid in Full" in a drawer',
      texture: 'official documents, freedom on paper',
      significance: 'He did it without asking; she fought him for a week',
    },
    {
      name: 'The Foundation',
      description: 'A charitable organization in her mother\'s name',
      texture: 'official letterhead, good works',
      significance: 'He created it after she mentioned her mother once',
    },
    {
      name: 'Their Apartment',
      description: 'A modest place across town where no one looks for them',
      texture: 'IKEA furniture, takeout containers, normal',
      significance: 'Where they go to pretend they\'re ordinary',
    },
    {
      name: 'His Scars',
      description: 'Faint lines on his back from a father no one discusses',
      texture: 'raised skin, old pain, hidden under custom shirts',
      significance: 'She\'s the only one who knows; she kisses them',
    },
    {
      name: 'The Painting',
      description: 'A piece of art he bought for her, worth more than her education',
      texture: 'oil on canvas, colors she loves, investment and gift',
      significance: 'She cried; he didn\'t understand why',
    },
    {
      name: 'Staff Confidentiality',
      description: 'Agreements signed by every employee in the house',
      texture: 'legal bonds, professional silence',
      significance: 'They see everything; they say nothing',
    },
    {
      name: 'The Island',
      description: 'A private island in the Caribbean, bought on impulse',
      texture: 'sand, sea, absolute privacy',
      significance: 'Where he took her when the press got too close',
    },
    {
      name: 'Her Blog',
      description: 'An anonymous corner of the internet where she writes',
      texture: 'words on screen, followers who don\'t know',
      significance: 'Where she tells the truth; he reads every post',
    },
    {
      name: 'The Ring Box',
      description: 'A velvet box in his office drawer, waiting',
      texture: 'soft velvet, hard diamond, question unasked',
      significance: 'She found it by accident; she put it back',
    },
    {
      name: 'His Childhood Photo',
      description: 'A single picture of him as a boy, serious even then',
      texture: 'old photograph, edges soft, rare vulnerability',
      significance: 'She found it hidden; she framed it',
    },
  ],
  // ============ ADDITIONAL SHIFTER ARTIFACTS ============
  'Shifter Romance Extended': [
    {
      name: 'Shift Sickness Medicine',
      description: 'A small vial of herbs that eases the pain of transformation',
      texture: 'cool glass, bitter liquid, relief',
      significance: 'He makes it for her while she learns control',
    },
    {
      name: 'Pack Tattoo',
      description: 'An ink design that marks belonging, worn by all members',
      texture: 'raised ink on skin, pattern unique to the pack',
      significance: 'She chose to take it; she chose them',
    },
    {
      name: 'The Moonstone Ring',
      description: 'A ring that glows during the full moon, helps sense the change',
      texture: 'cool stone, silver band, pulse of moon',
      significance: 'His mother wore it; now she does',
    },
    {
      name: 'Human Clothes Stash',
      description: 'A waterproof bag of clothes hidden throughout the territory',
      texture: 'practical cotton, quick to pull on',
      significance: 'The reality of their life; she helps him hide them',
    },
    {
      name: 'Challenge Scars',
      description: 'Marks on his body from fights for his position',
      texture: 'raised tissue, maps of violence, proof of strength',
      significance: 'She traces them at night; he tells her the stories',
    },
    {
      name: 'The Pup',
      description: 'A small shifter child, orphaned and placed in their care',
      texture: 'small hands, wolf eyes, furry at unexpected moments',
      significance: 'Their first child, in a way; chosen family',
    },
    {
      name: 'Her Human Family Photo',
      description: 'A picture of a family she can\'t visit anymore',
      texture: 'glossy print, edges worn from holding',
      significance: 'The life she left; he never asks her to forget',
    },
    {
      name: 'Full Moon Calendar',
      description: 'A simple calendar with moons marked, three days circled',
      texture: 'paper, pen marks, planning',
      significance: 'When neither can be trusted; when they stay together anyway',
    },
    {
      name: 'The Hunt Trophy',
      description: 'A set of antlers from their first hunt together',
      texture: 'smooth bone, mounted on wood',
      significance: 'The night she stopped being prey',
    },
    {
      name: 'Silver Jewelry Locked Away',
      description: 'A box containing her mother\'s silver necklace',
      texture: 'metal that burns now, love preserved in pain',
      significance: 'The price of her new life; she never opens the box',
    },
    {
      name: 'The Alpha Throne',
      description: 'A large chair carved from pack history',
      texture: 'worn wood, power',
      significance: 'He sits; she stands beside him. Partners, not subjects',
    },
    {
      name: 'Mating Run Trophy',
      description: 'A ribbon from the tree where he caught her',
      texture: 'fabric softened by weather',
      significance: 'The night she stopped running from him',
    },
  ],
  // ============ ADDITIONAL ALIEN ARTIFACTS ============
  'Alien Romance Extended': [
    {
      name: 'Universal Translator',
      description: 'A device implanted behind her ear, surgery performed without consent',
      texture: 'invisible now, hums with new languages',
      significance: 'Violation became salvation; she understands everything',
    },
    {
      name: 'His Species Bible',
      description: 'A text explaining his people\'s customs, translated for her',
      texture: 'flexible material, words that shift, alien paper',
      significance: 'He made it so she could understand; months of work',
    },
    {
      name: 'The Nest',
      description: 'A sleeping area he built from salvaged human comforts and alien tradition',
      texture: 'soft fabrics, strange materials, compromise',
      significance: 'Neither culture, both cultures; theirs',
    },
    {
      name: 'Her Phone',
      description: 'A dead smartphone she couldn\'t charge but won\'t discard',
      texture: 'cold glass, useless now, photos inside',
      significance: 'Her old life, frozen; he found a way to power it',
    },
    {
      name: 'Species Compatibility Study',
      description: 'Medical files confirming they can reproduce',
      texture: 'alien data, confusing charts, hope',
      significance: 'The answer to a question neither dared ask',
    },
    {
      name: 'His Homeworld Soil',
      description: 'A small container of dirt from a planet that no longer exists',
      texture: 'strange earth, wrong color, last connection',
      significance: 'All that remains; he showed her his grief',
    },
    {
      name: 'The Star They Named',
      description: 'A coordinate in space, officially registered to them both',
      texture: 'light years away, legally theirs',
      significance: 'She joked about it; he made it happen',
    },
    {
      name: 'Her Oxygen Pendant',
      description: 'A device that lets her breathe on his world',
      texture: 'warm metal, slight hiss of air',
      significance: 'He designed it so she could see his home',
    },
    {
      name: 'Mating Bonds',
      description: 'Matching marks that appeared after their first joining',
      texture: 'bioluminescent, warm, pulse in sync',
      significance: 'His species bonds for life; she didn\'t know until after',
    },
    {
      name: 'The Escape Pod',
      description: 'A small vessel programmed for Earth, kept charged',
      texture: 'cramped space, cold metal, option',
      significance: 'He maintains it for her; she\'s never considered using it',
    },
    {
      name: 'Human Meal Synthesizer',
      description: 'A device that creates food that tastes like Earth',
      texture: 'cold machine, buttons she\'s memorized',
      significance: 'He programmed her favorites; she taught it her mother\'s recipes',
    },
    {
      name: 'The Pregnancy Scan',
      description: 'An alien medical image showing something impossible',
      texture: 'holographic, two heartbeats, terrifying hope',
      significance: 'Neither knew it was possible; both want it anyway',
    },
  ],
  // ============ ADDITIONAL ROMANTASY ARTIFACTS ============
  'Romantasy Extended': [
    {
      name: 'The Blood Oath Knife',
      description: 'A silver blade used for their bargain, still stained',
      texture: 'cold metal, sharp edge, weight of magic',
      significance: 'The deal that started everything',
    },
    {
      name: 'Iron Earrings',
      description: 'Simple studs that burn her now-fae ears',
      texture: 'metal that hurts, human connection',
      significance: 'Proof of what she was; she still wears them occasionally',
    },
    {
      name: 'The Mortal Clock',
      description: 'A timepiece that counts her remaining human years',
      texture: 'ticking, slowing, weight of mortality',
      significance: 'She\'s changing; neither knows what she\'ll become',
    },
    {
      name: 'His Crown',
      description: 'A circlet of dark metal that drinks light',
      texture: 'cold, heavier than it looks, power incarnate',
      significance: 'He offered to share it; she hasn\'t decided',
    },
    {
      name: 'Fae Wine Collection',
      description: 'Bottles containing memories she shouldn\'t drink',
      texture: 'glass cool against palms, liquid that glows',
      significance: 'Each bottle is someone\'s happiness; she never drinks',
    },
    {
      name: 'The True Name Scroll',
      description: 'A scroll containing his real name, hidden in her chambers',
      texture: 'ancient paper, ink that shifts, ultimate power',
      significance: 'Complete control over him; she\'s never used it',
    },
    {
      name: 'Her Iron Necklace',
      description: 'A simple chain that burns fae skin, now stored away',
      texture: 'cold metal she can\'t touch anymore',
      significance: 'Protection she no longer needs; change made tangible',
    },
    {
      name: 'The Bargain Scar',
      description: 'A silver line on both their palms from the blood oath',
      texture: 'raised tissue, warm when close, aches when apart',
      significance: 'The deal that became love',
    },
    {
      name: 'Court Gossip Scrolls',
      description: 'Reports on what the court says about her',
      texture: 'thin paper, cruel words, dangerous information',
      significance: 'He reads them to know her enemies',
    },
    {
      name: 'The Stolen Kiss',
      description: 'A small crystal containing a memory of their first kiss',
      texture: 'warm glass, replay of joy',
      significance: 'Fae can store moments; this is his most precious',
    },
    {
      name: 'Her Mortality Hourglass',
      description: 'Sand that measures her human years, running out',
      texture: 'glass warm in hands, sand slowing',
      significance: 'She\'s becoming something else; neither knows what',
    },
    {
      name: 'The Peace Treaty',
      description: 'A document signed by their marriage, ending a war',
      texture: 'ancient vellum, multiple seals, weight of nations',
      significance: 'Politics made them meet; choice made them stay',
    },
  ],
  // ============ ADDITIONAL WHY CHOOSE ARTIFACTS ============
  'Why Choose Extended': [
    {
      name: 'The Schedule',
      description: 'A color-coded calendar managing their complicated life',
      texture: 'marker on whiteboard, constantly updated',
      significance: 'Organization that makes the impossible work',
    },
    {
      name: 'Matching Tattoos',
      description: 'Different symbols that connect into one design when together',
      texture: 'ink on skin, puzzle pieces',
      significance: 'Permanent commitment from all five',
    },
    {
      name: 'The Original Photo',
      description: 'The first picture taken of all five of them',
      texture: 'glossy paper, before everything changed',
      significance: 'When they were just friends; proof of the beginning',
    },
    {
      name: 'Her Room',
      description: 'A bedroom that\'s hers alone, decorated her way',
      texture: 'personal space, retreat',
      significance: 'Her space in their shared life; boundaries respected',
    },
    {
      name: 'The Veto System',
      description: 'A small box with tokens, used for major decisions',
      texture: 'wooden tokens, carved initials',
      significance: 'Democracy in love; everyone has equal voice',
    },
    {
      name: 'Anniversary Rings',
      description: 'Five rings in different metals, designed to interlock',
      texture: 'warm metal, puzzle that fits',
      significance: 'Commitment ceremony they designed themselves',
    },
    {
      name: 'The Couch',
      description: 'A massive sectional that fits everyone',
      texture: 'soft cushions, familiar dents',
      significance: 'Movie nights, arguments, make-ups; it\'s seen everything',
    },
    {
      name: 'Group Chat',
      description: 'A text thread with thousands of messages',
      texture: 'digital connection, constant communication',
      significance: 'Where they plan, argue, and say I love you',
    },
    {
      name: 'The First Meal',
      description: 'The recipe from the first dinner they cooked together',
      texture: 'stained paper, notes in five handwritings',
      significance: 'Disaster that became tradition',
    },
    {
      name: 'Custody Agreement',
      description: 'A document written by lawyers who didn\'t understand',
      texture: 'legal paper, unconventional terms',
      significance: 'Protecting the family they\'ve built',
    },
    {
      name: 'The Guest Room',
      description: 'A room kept empty for when anyone needs space',
      texture: 'neutral decor, fresh sheets',
      significance: 'Permission to need alone time',
    },
    {
      name: 'Their Song',
      description: 'A song that played the night everything changed',
      texture: 'notes and melody, shared memory',
      significance: 'They can\'t hear it without smiling',
    },
  ],
};

// ============================================================================
// STRUCTURAL CLARITY - Scene transitions and pacing guides
// ============================================================================

const SCENE_TRANSITIONS = {
  // Time passage markers
  timePassing: [
    'Hours passed like water through her fingers.',
    'The sun climbed higher, unnoticed.',
    'Time lost all meaning.',
    'She couldn\'t have said how long they stayed like that.',
    'The moons had shifted position when she finally looked up.',
    'Dawn was a distant memory.',
    'The fire had burned down to embers.',
    'Somewhere, a clock chimed midnight.',
    'Minutes stretched into hours she\'d never get back.',
    'The world outside continued without them.',
    'Night gave way to morning before either noticed.',
    'She\'d lost track of days.',
    'Time moved differently here.',
    'The afternoon had aged into evening.',
    'Another day passed in the strange rhythm of their life.',
    'She marked the passage of time by his breathing.',
    'The seasons were shifting; she hadn\'t noticed.',
    'Later—much later—she would try to reconstruct how they got here.',
    'Time stopped mattering somewhere between his third story and her second glass of wine.',
    'The clock on the wall had stopped. Neither cared to fix it.',
    'They existed outside of time. Or that\'s how it felt.',
    'Days blurred into each other, soft-edged and warm.',
    'The urgency faded, replaced by something slower.',
    'They had time now. All the time in the world.',
  ],
  // Location change markers
  locationShift: [
    'The clearing gave way to denser forest.',
    'The cave opened into something unexpected.',
    'She followed him deeper into the territory.',
    'The path wound upward, ever upward.',
    'They emerged into a hidden valley.',
    'The world shifted around them.',
    'Stone walls replaced the open sky.',
    'The trees thinned, revealing...',
    'She found herself in a room she\'d never seen.',
    'The scenery changed, but her thoughts remained.',
    'They left the main hall for somewhere more private.',
    'The door closed behind them with finality.',
    'Stairs led down into darkness.',
    'The forest opened into a meadow.',
    'She stepped through the threshold into another world.',
    'The corridor seemed to go on forever.',
    'They reached his private quarters.',
    'The city fell away as they drove.',
    'The penthouse elevator opened to silence.',
    'She found herself on the roof, stars overhead.',
    'The path led somewhere she hadn\'t expected.',
    'Behind the waterfall, a cave waited.',
    'The garden was a maze; she was lost.',
    'He led her through secret passages.',
  ],
  // Emotional shift markers
  moodChange: [
    'Something shifted between them.',
    'The air changed.',
    'A new tension entered the space.',
    'The easy atmosphere evaporated.',
    'Everything was different now.',
    'She felt the moment everything changed.',
    'Nothing would be the same after this.',
    'A line had been crossed.',
    'The playfulness drained from his expression.',
    'Her defenses crumbled without warning.',
    'The careful distance she\'d maintained collapsed.',
    'Something broke open inside her.',
    'The pretense fell away.',
    'Fear became something else entirely.',
    'Anger transformed into want.',
    'The game stopped being a game.',
    'Reality crashed back.',
    'The spell shattered.',
    'He saw her—really saw her—for the first time.',
    'She stopped pretending.',
    'The truth hung in the air, unavoidable.',
    'Everything she thought she knew rearranged itself.',
    'He let his guard down. Just for a moment.',
    'She realized she\'d been holding her breath for weeks.',
  ],
  // Conflict escalation
  conflictRising: [
    'The argument had been building for days.',
    'She couldn\'t keep quiet anymore.',
    'Something snapped.',
    'The words she\'d been swallowing finally escaped.',
    'He pushed too far.',
    'She met his anger with her own.',
    'The fragile peace they\'d built began to crack.',
    'All the unspoken things demanded voice.',
    'Neither would back down. Neither could.',
    'The fight had been inevitable. She saw that now.',
    'Years of silence broke like a dam.',
    'She said things she couldn\'t take back.',
    'His control finally failed.',
  ],
  // Resolution/peace
  tensionEasing: [
    'The fight went out of her.',
    'Exhaustion replaced anger.',
    'She sagged against the wall, empty.',
    'The storm passed, leaving strange calm.',
    'He reached for her. She let him.',
    'Forgiveness came easier than she expected.',
    'The argument ended not with resolution but surrender.',
    'They chose peace over being right.',
    'She let go of the anger. It wasn\'t worth carrying.',
    'Understanding replaced frustration.',
    'They found their way back to each other.',
    'The distance between them finally closed.',
    'She exhaled years of tension.',
  ],
  // Physical intimacy transitions
  heatBuilding: [
    'The air between them changed.',
    'She became aware of every inch of space separating them.',
    'His gaze dropped. Lingered. Returned to her eyes with heat.',
    'The conversation had stopped being about words.',
    'She leaned closer without deciding to.',
    'His hand found hers. Simple. Electric.',
    'The touch was barely there—and it was everything.',
    'She forgot what she\'d been saying.',
    'His proximity made thinking impossible.',
    'The room shrank to just the two of them.',
    'Something hungry woke in his expression.',
    'Her breath caught. He noticed.',
    'The pretense of polite distance burned away.',
  ],
  // Morning after / post-intimacy
  afterIntimacy: [
    'Morning light showed everything differently.',
    'She woke to the unfamiliar warmth of another body.',
    'The night came back in fragments.',
    'She wasn\'t sure what came next.',
    'He was watching her. Had been for a while.',
    'The awkwardness didn\'t come. Neither expected that.',
    'Reality intruded slowly.',
    'They lay in comfortable silence.',
    'She traced patterns on his skin while he slept.',
    'The morning didn\'t erase the night. It confirmed it.',
    'He made coffee without asking how she took it. He knew.',
    'She wore his shirt. He pretended not to notice.',
    'Neither wanted to break the spell.',
  ],
};

// ============================================================================
// SENSORY SPECIFICITY - Not "she felt heat" but PRECISE, UNIQUE details
// ============================================================================

const SENSORY_BANK = {
  sight: {
    moonlight: [
      'moonlight catching the edge of his tusk like a blade',
      'silver light pooling in the hollows of his collarbones',
      'shadows that shifted across his features like living things',
      'his eyes reflecting the moons—twin golden coins in the darkness',
      'moonbeams tracing the scars that mapped his chest',
      'pale light making his green skin shimmer like dark jade',
      'twin moons casting double shadows at their feet',
      'silver radiance highlighting the sharp angles of his jaw',
    ],
    firelight: [
      'flames painting his green skin in shades of amber and shadow',
      'the way firelight softened the harsh planes of his face',
      'sparks ascending like earthbound stars',
      'his shadow on the cave wall—massive, monstrous, somehow protective',
      'ember light dancing in the gold of his eyes',
      'firelight catching the ceremonial scars across his shoulders',
      'the warm glow turning his tusks to ivory',
      'flames reflected in his gaze like captured starlight',
    ],
    daylight: [
      'sunlight turning the tattoos on his skin into living artwork',
      'the way his tusks gleamed white against his dark green lips',
      'forest light dappling across his massive shoulders',
      'morning sun revealing colors in his skin she\'d never noticed',
      'daylight softening features that seemed carved from stone',
      'golden afternoon light making him look almost... gentle',
      'the way the sun caught the gray streaks in his hair',
    ],
  },
  sound: {
    voice: [
      'his voice—a bass rumble that she felt in her bones',
      'a growl that wasn\'t quite human, vibrating against her ear',
      'his laugh—rare and rough and utterly devastating',
      'the way he said her name, like it was something sacred',
      'his voice dropping to a dangerous whisper',
      'words roughened by three centuries of disuse',
      'a purr that resonated through her entire body',
      'the catch in his breath when she touched him',
    ],
    environment: [
      'the forest breathing around them',
      'distant drums matching her racing heart',
      'crystalline silence broken only by their breathing',
      'night birds calling warnings she didn\'t understand',
      'leaves rustling with secrets',
      'water tumbling over ancient stones nearby',
      'thunder rolling across distant mountains',
      'the crackle and pop of the dying fire',
      'wind sighing through the valley like a living thing',
      'insects singing their nighttime chorus',
    ],
  },
  touch: {
    temperature: [
      'his warmth bleeding through her thin clothes',
      'the contrast—her cold fingers against his furnace-hot skin',
      'heat where their breath mingled in the cool night air',
    ],
    texture: [
      'the surprising softness of his skin beneath her fingertips',
      'calluses that told stories of a thousand battles',
      'the velvet roughness of his scarred palm against her cheek',
      'tribal tattoos she could feel—raised ridges beneath her touch',
    ],
  },
  scent: [
    'woodsmoke and pine and something uniquely him—like storms approaching',
    'the green, growing smell of the forest he carried with him',
    'underneath the wilderness: something warm, something male, something that made her mouth water',
    'leather and metal and the mineral tang of old battle scars',
  ],
  taste: [
    'the taste of magic on her tongue—like lightning and honey',
    'something wild when their lips met—forests and freedom and the edge of a blade',
    'the salt of her own tears when he finally pulled away',
  ],
};

// ============================================================================
// EMOTIONAL LAYERING - Multiple emotions at once (real emotions are complex)
// ============================================================================

const EMOTIONAL_LAYERS = {
  attraction: [
    'Want. Fear. Defiance. The unholy trinity of emotions she couldn\'t untangle.',
    'Desire pooled low in her belly, mixed with terror, topped with a desperate kind of hope.',
    'She wanted him. She feared wanting him. She feared that the fear wasn\'t enough to stop the wanting.',
    'Relief and disappointment warred in her chest—relief that he\'d stopped, disappointment that he\'d stopped.',
    'Her body sang with awareness. Her mind screamed warnings. Neither seemed to be winning.',
    'Heat. Longing. The ache of something she\'d never let herself want.',
    'Every nerve ending was awake now. Every inch of her skin remembered his touch.',
    'She burned. There was no other word for it. She simply burned.',
    'The air between them had weight. Texture. It pressed against her skin like a promise.',
    'Her heart didn\'t beat—it pounded. Demanding. Reckless. Entirely out of her control.',
    'She was acutely aware of every breath he took. Every shift of his body. Every time his gaze dropped to her mouth.',
    'The want was a living thing now. Clawing at her. Demanding to be acknowledged.',
    'She\'d never felt hunger like this. Soul-deep. Bone-aching. Relentless.',
    'Her body had developed a mind of its own. It leaned toward him without her permission.',
    'The chemistry between them was combustible. She was terrified of the explosion.',
    'He was a craving she couldn\'t shake. A need she couldn\'t logic away.',
    'Every accidental touch left echoes on her skin. She kept replaying them.',
    'She dreamed of him now. Woke up flushed and wanting and furious at herself.',
    'Attraction had become obsession. She wasn\'t sure when the line blurred.',
    'Her whole body oriented toward him like a compass to north.',
    'She was intoxicated. Drunk on his presence. Addicted already.',
    'The tension was unbearable. Something had to break. Probably her.',
    'She wanted to devour him. Be devoured. The violence of the wanting scared her.',
    'Logic said run. Every other part of her said stay.',
  ],
  vulnerability: [
    'The urge to run. The urge to stay. Both at war inside her chest.',
    'Trust and terror, dancing together in her ribcage.',
    'She felt cracked open—exposed in ways that had nothing to do with clothing.',
    'Grief for the woman she\'d been. Fear of the woman she was becoming.',
    'This feeling—this raw, terrifying openness—was unlike anything she\'d allowed herself before.',
    'Her armor had cracks now. He\'d found every single one.',
    'She\'d spent years building walls. He\'d walked through them without trying.',
    'Naked. Not physically—worse. Emotionally stripped bare.',
    'Every defense she\'d cultivated was useless against the way he looked at her.',
    'She was coming undone. Thread by thread. And she couldn\'t make herself care.',
    'The shield she\'d carried for years suddenly felt impossibly heavy.',
    'She\'d shown him her soft underbelly. Now she waited to see if he\'d strike.',
    'Being known was terrifying. Being unknown was worse.',
    'She was learning to exist without armor. It felt like learning to breathe underwater.',
    'He\'d seen the ugly parts of her. He hadn\'t left. She wasn\'t sure how to process that.',
    'The walls she\'d built weren\'t protection anymore. They were prison bars.',
    'Letting someone in felt like handing them a loaded gun.',
    'She\'d always confused vulnerability with weakness. He was teaching her the difference.',
    'To be truly seen was to be truly terrified. She was both.',
    'She\'d hidden for so long. Being found was overwhelming.',
    'The exhaustion of constant defense finally caught up with her.',
    'She was tired of being strong. Just this once, she wanted to be held.',
    'Trusting him felt like falling. No guarantee of being caught.',
    'She gave him a piece of herself she\'d never given anyone. It left her shaking.',
  ],
  connection: [
    'Wonder. Possession. Tenderness. The urge to protect something that could destroy her.',
    'She felt seen. Truly seen. It was the most terrifying thing that had ever happened.',
    'The strange alchemy of being simultaneously safer and more endangered than ever.',
    'Something clicked into place. Like a key in a lock she\'d forgotten existed.',
    'Home. He felt like home. How was that possible?',
    'She recognized something in him. Something broken. Something that matched her own damage perfectly.',
    'Two wounded creatures, circling each other. Afraid to trust. More afraid to walk away.',
    'This wasn\'t just attraction. It was recognition.',
    'He looked at her like she was the answer to a question he\'d been asking for centuries.',
    'In his eyes, she saw her own lonely reflection finally finding its match.',
    'They fit. Imperfectly, impossibly, but they fit.',
    'She\'d found her person. The thought was terrifying and wonderful in equal measure.',
    'With him, she could simply exist. No performance required.',
    'He understood her silences. That was worth more than understanding her words.',
    'She\'d been alone in crowded rooms her whole life. With him, even empty space felt full.',
    'They were both broken. But maybe broken pieces could build something new.',
    'She\'d never believed in soulmates. She was reconsidering.',
    'He was the first person who made loneliness seem optional.',
    'They\'d found each other in the dark. Now neither wanted to let go.',
    'With him, she didn\'t have to explain herself. He just... knew.',
    'She\'d stopped looking for someone to complete her. Then he showed up.',
    'Two halves of a conversation that had been waiting years to happen.',
    'He made sense of her chaos. She brought color to his gray.',
    'She\'d never understood the fuss about love. Now she wondered how she\'d lived without this.',
  ],
  conflict: [
    'Anger burned through her, hot and righteous and completely useless.',
    'She wanted to scream. Cry. Hit something. Probably him.',
    'The betrayal was a knife in her gut. She couldn\'t tell if she was breathing.',
    'Trust, once broken, made the most terrible sound.',
    'She felt stupid. That was the worst part. So fucking stupid for believing.',
    'The fight they needed to have had been building for weeks.',
    'Words she\'d swallowed for days finally erupted.',
    'She was too angry for tears. Too hurt for anger. Suspended in something in between.',
    'The love didn\'t go away. That was the problem. It just hurt more.',
    'She\'d never hated anyone the way she hated him right now. Because she still loved him.',
    'Disappointment was heavier than anger. It pressed down on her chest.',
    'She\'d expected this. That almost made it worse.',
    'The argument had teeth. It drew blood.',
    'She watched him become a stranger. It happened in slow motion.',
    'They were saying things they couldn\'t take back. Neither could stop.',
    'Her heart was breaking in real time. She could feel each crack.',
    'The silence after the fight was worse than the screaming.',
    'She wanted to hate him. Hating would be so much easier.',
    'The man she loved and the man in front of her felt like two different people.',
    'She\'d trusted him with her whole heart. He\'d dropped it.',
    'Fury and grief, tangled together until she couldn\'t tell which was which.',
    'The realization dawned slowly: they might not survive this.',
    'She was mourning something that wasn\'t dead yet.',
    'The words hung in the air, sharp and final.',
  ],
  hope: [
    'Something fragile uncurled in her chest. She was afraid to look at it directly.',
    'Hope felt dangerous. She\'d been burned before.',
    'Maybe. It was the most terrifying word in any language.',
    'She allowed herself to imagine a future that included him. Just for a moment.',
    'The possibility of happiness was almost too bright to look at.',
    'She\'d forgotten what anticipation felt like. This must be it.',
    'A small, stubborn flame refused to go out no matter how she tried to smother it.',
    'She was building sandcastles again. Knowing the tide would come.',
    'The future suddenly had color. Had possibility. Had him.',
    'She caught herself planning. That was dangerous.',
    'Hope crept in through the cracks in her cynicism.',
    'She wanted things now. That was new. That was terrifying.',
    'The wall around her heart had a door now. She wasn\'t sure when that happened.',
    'She was starting to believe. And belief was the first step toward devastation.',
    'The voice that said "what if it works?" was getting louder.',
    'She let herself want. Just a little. Just this once.',
    'Tomorrow felt possible in a way it hadn\'t in years.',
    'She was cautiously optimistic. Cautiously being the key word.',
  ],
  grief: [
    'The loss hit her in waves. Just when she thought she could breathe...',
    'Grief had no schedule. It came when it wanted.',
    'She\'d learned to function around the hole in her chest. It never filled.',
    'Missing him was physical. An ache in her bones.',
    'The world kept moving. She wasn\'t sure how.',
    'She found his shirt and couldn\'t let go for hours.',
    'Firsts were the hardest. First morning. First meal. First time reaching for someone who wasn\'t there.',
    'She was haunted by all the things left unsaid.',
    'The grief came disguised as anger sometimes. Sometimes as numbness. Sometimes as choking sobs.',
    'She\'d thought she understood loss. She\'d been wrong.',
    'There were ghosts everywhere. Every song. Every smell. Every corner.',
    'She\'d give anything for one more conversation.',
    'The worst part was the forgetting. The moments she didn\'t miss him. Then the guilt.',
    'She wore her grief like a second skin. Invisible to others. Heavy to her.',
    'Some losses you survive. You don\'t recover from them.',
    'She was hollowed out. A walking wound.',
  ],
  joy: [
    'Happiness bubbled up without permission. She\'d forgotten this feeling.',
    'She was laughing. Actually laughing. When had that stopped being strange?',
    'Joy felt illegal. Like she was getting away with something.',
    'She caught herself humming. She never hummed.',
    'Contentment settled over her like a warm blanket.',
    'She was happy. Not "fine." Not "okay." Actually, genuinely happy.',
    'The world had color again. When had everything been so gray?',
    'She woke up looking forward to the day. That was new.',
    'Lightness. That was the word. She felt light.',
    'She was surprised by her own smile. It came easier now.',
    'Happiness didn\'t feel like a betrayal anymore.',
    'She\'d forgotten what it felt like to be excited about something.',
    'The present moment was actually worth living in.',
    'She felt like herself. Maybe for the first time.',
    'Life tasted different. Sweeter. More vivid.',
    'She was okay. More than okay. She was good.',
  ],
};

// ============================================================================
// SHOW-DON'T-TELL ACTION BEATS - Actions that reveal emotions without stating them
// ============================================================================

const SHOW_DONT_TELL = {
  // Instead of "she was nervous"
  nervous: [
    'Her hands found something to do—adjusting her collar, smoothing her already-smooth hair.',
    'She talked too fast, words tumbling over each other like they were trying to escape.',
    'Her laugh came out too bright, too sharp, too desperate to be casual.',
    'She couldn\'t seem to find a comfortable position. Crossed her arms. Uncrossed them. Clasped her hands.',
    'Her voice pitched higher than normal, that telltale sign she\'d never been able to control.',
    'She was acutely aware of her hands—too big, too awkward, with nowhere safe to put them.',
    'The hem of her sleeve had become fascinating. She couldn\'t stop worrying at it.',
    'She\'d chewed her lip raw without noticing. Tasted copper when she finally stopped.',
  ],
  // Instead of "he wanted her"
  desire: [
    'His hands curled into fists at his sides. It was that or reach for her.',
    'He stepped back—not because he wanted to, but because every muscle screamed at him to step closer.',
    'His gaze dropped to her mouth. Lingered. Dragged itself away with visible effort.',
    'A growl escaped before he could stop it—low, possessive, more animal than man.',
    'His nostrils flared. Catching her scent. Memorizing it. Wanting more.',
    'The tendons in his neck stood out like cables, the effort of not moving toward her.',
    'His jaw worked, grinding words to dust before they could escape.',
    'He breathed her in like oxygen. Like he\'d been drowning and she was air.',
    'His pupils had swallowed nearly all the gold. Dark. Hungry. Fixed on her.',
    'Every inch of distance between them felt like a personal insult.',
  ],
  // Instead of "she was falling for him"
  fallingInLove: [
    'She caught herself smiling at nothing. At everything. At the memory of his voice.',
    'His absence felt louder than his presence ever had.',
    'She\'d started mentally rehearsing conversations with him. Planning what she\'d say next.',
    'The world had rearranged itself. He was the center now. Everything else orbited him.',
    'She found herself looking for him in every room she entered. Disappointed when he wasn\'t there.',
    'His laugh had lodged itself in her chest. She kept replaying it like a favorite song.',
    'She\'d stopped noticing other men existed. The world had narrowed to just him.',
    'Small things reminded her of him now. A color. A smell. The shape of a shadow.',
    'She caught herself doodling his name in the margins of her notes. Like a lovesick teenager.',
    'The future had started including him. Without permission. Without her consent.',
  ],
  // Instead of "he was scared"
  fear: [
    'His stillness was complete—the predator\'s response to threats he couldn\'t fight with fists.',
    'Something cracked in his expression. A fissure in the stone.',
    'His voice came out rough, scraped raw by something he wouldn\'t name.',
    'For the first time, his hands shook. He hid them behind his back.',
    'The warrior in him wanted to fight. But there was nothing to fight. Only her. Only losing her.',
    'He flinched. Actually flinched. She\'d never seen him flinch from anything.',
    'His breath caught—a hitch he couldn\'t hide. Vulnerability he\'d sworn never to show.',
    'He wouldn\'t meet her eyes. Couldn\'t. What she\'d see there would destroy him.',
  ],
  // Instead of "she was angry"
  anger: [
    'Her spine straightened. Her chin lifted. The softness drained from her expression like water from a broken vessel.',
    'Her words came out precise. Clipped. Each one a blade wrapped in silk.',
    'She smiled. It didn\'t reach her eyes. It wasn\'t meant to.',
    'Her hands trembled—not from fear, but from the effort of not throwing something.',
    'She was too quiet. The dangerous kind of quiet. The kind that came before storms.',
    'Her jaw ached from clenching. She couldn\'t seem to make herself stop.',
  ],
  // Instead of "he was protective"
  protective: [
    'He\'d positioned himself between her and the door without thinking. Instinct. Reflex.',
    'His hand found the small of her back. Guiding. Grounding. Claiming.',
    'He cataloged every exit, every threat, every male who looked at her too long.',
    'The growl was barely audible. A warning to anyone who might be listening.',
    'She was behind him before she\'d even registered him moving.',
    'His body curved around hers like a shield. Like armor. Like home.',
  ],
};

// ============================================================================
// FRESH METAPHORS - No clichés, unique comparisons that surprise
// ============================================================================

const FRESH_METAPHORS = {
  attraction: [
    'He looked at her the way a starving man looks at a feast—knowing he shouldn\'t touch, couldn\'t stop staring.',
    'She was a theorem he couldn\'t solve, an equation that broke all his rules.',
    'He moved through her defenses like water through a cracked dam—patient, relentless, inevitable.',
    'She felt like a compass that had finally found north. Disoriented. Terrified. Absolutely certain.',
    'His attention was a physical weight—gravity doubled, pressing her into herself.',
    'He watched her like she was a flame and he was a moth who\'d finally decided burning was worth it.',
    'She orbited him without meaning to. Gravity in human form.',
    'He was a drug she\'d never known existed. Now she couldn\'t imagine living without the high.',
    'She felt like a lock finally meeting its key. Something clicked into place she\'d never known was misaligned.',
    'He pulled at her like the moon pulls at the tide—a force she couldn\'t see but couldn\'t resist.',
    'Her awareness of him was a constant hum beneath her thoughts. White noise she couldn\'t tune out.',
    'He looked at her like she was a map to somewhere he\'d been trying to find his whole life.',
  ],
  beauty: [
    'She wasn\'t beautiful in the human way. She was beautiful the way a storm was beautiful—devastating, dangerous.',
    'He was carved from violence and softened only at the edges. A weapon learning to be gentle.',
    'Her smile was sunrise after a year of darkness. He\'d forgotten what warmth felt like.',
    'She glowed. Not literally—but something in her radiated. Made everything around her seem dull.',
    'He was beautiful the way mountains are beautiful—terrifying up close, magnificent from any distance.',
    'She moved like music. He\'d never thought of motion as melody before.',
    'His face told stories in scars. She wanted to read every one.',
    'She was art he didn\'t deserve to touch. A masterpiece in a gallery he\'d broken into.',
    'He was darkness made flesh, and she\'d never been so drawn to shadows.',
  ],
  emotion: [
    'The feeling crept up on her like fog—imperceptible until suddenly she couldn\'t see the shore.',
    'Hope flickered in her chest—a match struck in the dark. Fragile. Determined. Refusing to go out.',
    'Fear had teeth. It bit down on her heart and refused to let go.',
    'Love didn\'t arrive. It invaded. Occupied. Claimed territory she\'d thought was unclaimable.',
    'Grief sat in her chest like a stone. Heavy. Permanent. Reshaping everything around it.',
    'Joy bubbled up without permission—champagne after years of tap water.',
    'Anger was a wildfire. It burned through everything in its path, leaving her hollow.',
    'Longing had a shape now. His shape. It carved itself into her bones.',
    'Peace settled over her like a blanket. She\'d forgotten what it felt like to not be at war.',
    'Desire coiled in her belly—a snake waiting to strike.',
    'Trust was a muscle she\'d let atrophy. Using it again felt like physical therapy. Painful. Necessary.',
  ],
  connection: [
    'They fit together like broken pieces of the same plate—jagged edges interlocking into something whole.',
    'Talking to her was like speaking his native language after years in exile.',
    'She was the answer to a question he\'d stopped asking years ago.',
    'They were two halves of a conversation the universe had been waiting to finish.',
    'He felt like coming home. Except she\'d never had a home that felt like this.',
    'Their damage matched. Not perfectly—but close enough. Like scars that tessellate.',
    'He understood her silences. That was the miracle. The words were easy. The quiet was hard.',
    'She\'d found her person. The one who made the world make sense.',
    'They were binary stars—forever orbiting, never colliding, unable to escape each other\'s gravity.',
    'He was her missing piece. The one she\'d stopped believing existed.',
  ],
  time: [
    'Minutes stretched like taffy. Or collapsed like dying stars. Time had stopped meaning anything.',
    'Hours slipped past like water through fingers—too precious to hold, impossible to stop.',
    'The night compressed into a single crystalline moment. Perfect. Eternal. Already fading.',
    'Time had different rules around him. Days felt like hours. Moments felt like years.',
  ],
  touch: [
    'His touch rewrote her nervous system. Before him. After him. Two different people.',
    'Her skin remembered his hands. Ghost touches that haunted her in the dark.',
    'His fingers mapped her like territory to be claimed. Thorough. Possessive. Reverent.',
    'She felt branded where he\'d touched her. Marked in ways that would never fade.',
    'His warmth bled into her bones. She\'d been cold so long she\'d forgotten what warm felt like.',
  ],
};

// ============================================================================
// CHARACTER VARIETY BANKS - Expanded options for every character element
// ============================================================================

const CHARACTER_VARIETY: Record<string, Record<string, string[]>> = {
  // ============ SHARED HEROINE FEATURES ============
  'shared': {
    heroineEyes: [
      'honey-gold that caught the light like amber', 'storm-gray that shifted with her mood',
      'green as spring leaves after rain', 'warm brown flecked with gold',
      'blue-gray like the sea before a storm', 'hazel that couldn\'t decide between brown and green',
      'dark brown, nearly black, impossibly deep', 'pale blue like winter ice',
      'violet-tinged gray—unusual, striking, unforgettable', 'copper-brown that glowed in firelight',
    ],
    heroineHair: [
      'wild auburn curls she\'d given up trying to tame', 'straight black hair that fell like silk',
      'honey-blonde waves perpetually escaping her braid', 'dark brown with natural copper highlights',
      'silver-blonde that caught the moonlight', 'deep red that looked like fire in sunlight',
      'jet black cropped short for practicality', 'chestnut waves she hid her face behind',
      'strawberry blonde tangles she\'d stopped apologizing for', 'brown with gray streaks she\'d earned',
    ],
    heroineMarks: [
      'a thin scar on her collarbone—she never talked about it', 'ink-stained fingers that never quite came clean',
      'calluses on her palms from years of hard work', 'a birthmark shaped like a crescent moon',
      'burn scars on her forearms—old, faded, painful', 'a crooked finger, broken and never properly set',
      'freckles scattered like constellations across her cheeks', 'a scar through her eyebrow from childhood',
      'hands that trembled when she was tired', 'a faint tan line where a ring used to be',
    ],
  },
  
  // ============ MONSTER ROMANCE ============
  'Monster Romance': {
    heroSkinTones: [
      'deep forest green, nearly black in shadow', 'bright jade green that gleamed in sunlight',
      'olive-green tinged with gray', 'emerald dark as ancient forests',
      'pale green like new growth', 'moss-green mottled with darker patches',
      'dark green with bronze undertones', 'gray-green like weathered stone',
    ],
    heroTusks: [
      'tusks capped with silver that chimed when he spoke', 'broken tusks—war wounds he refused to discuss',
      'tusks carved with runes of protection', 'short tusks, barely visible, a mark of his northern clan',
      'massive tusks decorated with gold bands', 'tusks filed sharp—a warrior\'s choice',
      'ivory tusks that caught the light', 'one tusk chipped, the other perfect',
    ],
    heroTattoos: [
      'tribal tattoos telling his clan\'s history', 'battle scars turned into ceremonial art',
      'geometric patterns that marked his rank', 'swirling designs that moved in firelight',
      'tattoos that mapped the stars his people navigated by', 'ritual scarification in precise patterns',
      'ink that told the story of his mother\'s death', 'marks earned through blood and battle',
    ],
    heroMarks: [
      'a scar bisecting his face—a reminder of the war that took everything', 
      'claw marks across his chest from battles with beasts',
      'burn scars on his hands from pulling his warriors from fire',
      'a missing piece of one ear, bitten off in combat',
      'scars that mapped three centuries of violence across his skin',
      'ritual scars in patterns only his clan understood',
      'a brand on his shoulder—the mark of a slave, long ago',
      'hands gnarled from breaks that healed wrong',
    ],
    heroEyes: [
      'golden eyes that glowed in darkness', 'amber eyes that saw through every lie',
      'molten gold that darkened with emotion', 'eyes like ancient coins—valuable, watching',
      'burnished gold rimmed with darker brown', 'yellow-gold that turned predatory when angry',
    ],
  },
  
  // ============ DARK ROMANCE ============
  'Dark Romance': {
    heroEyes: [
      'eyes like black ice—cold, depthless, dangerous', 'gray eyes that revealed nothing and saw everything',
      'dark brown eyes that warmed only for her', 'cold blue eyes that assessed and calculated',
      'green eyes with a predatory gleam', 'nearly black eyes that reflected no light',
    ],
    heroFeatures: [
      'a jaw that could cut glass', 'cheekbones sharp enough to wound',
      'a face designed for boardrooms and bad decisions', 'classically handsome in a ruthless way',
      'a cruel mouth that softened only for her', 'features that belonged on Roman coins',
    ],
    heroTattoos: [
      'ink disappearing beneath his collar—promises of more', 'a family crest on his shoulder',
      'tattoos that mapped his empire', 'Latin words across his ribs',
      'sleeves he hid beneath expensive suits', 'a single rose with thorns over his heart',
    ],
    heroMarks: [
      'a scar across his knuckles from his first fight', 'a bullet scar on his shoulder',
      'a thin scar through his eyebrow—knife fight', 'burn marks on his wrists, never explained',
      'hands that had done terrible things', 'a body that was a weapon before anything else',
    ],
    heroineMarks: [
      'bruises that have since faded', 'eyes that had seen too much',
      'hands that shook sometimes', 'scars she kept hidden',
      'a wariness in her posture', 'a flinch she couldn\'t quite control',
    ],
  },
  
  // ============ MAFIA ROMANCE ============
  'Mafia Romance': {
    heroEyes: [
      'dark Italian eyes that promised sin', 'cold Russian gray that calculated',
      'warm brown that turned deadly in anger', 'green eyes that belonged to his Irish mother',
      'eyes that had watched men die without flinching', 'black eyes that softened only in private',
    ],
    heroFeatures: [
      'a face that belonged on Renaissance paintings', 'sharp features carved by generations of power',
      'a nose broken twice and never fixed—a point of pride', 'features that commanded rooms without trying',
      'a smile that never reached his eyes—except with her', 'the face of an angel and the soul of a devil',
    ],
    heroTattoos: [
      'the family crest over his heart', 'Russian prison tattoos he\'d earned young',
      'a sleeve of religious imagery—saints and sinners', 'his mother\'s name in elegant script',
      'stars on his shoulders marking his rank', 'ink that told his criminal history',
    ],
    heroMarks: [
      'hands with split knuckles—frequently', 'a scar from a bullet meant for his father',
      'burns from interrogations he survived', 'a ring of scar tissue around his wrist—rope',
      'the calluses of someone who knew guns intimately', 'a body that was evidence of survival',
    ],
    heroineMarks: [
      'hands that had learned to hold a gun', 'a scar from the night her life changed',
      'stress lines she tried to hide', 'eyes that had seen too much too young',
      'the posture of someone always ready to run', 'a wedding ring she couldn\'t take off',
    ],
  },
  
  // ============ BILLIONAIRE ROMANCE ============
  'Billionaire Romance': {
    heroEyes: [
      'blue eyes that assessed worth in seconds', 'gray eyes that revealed nothing',
      'brown eyes unexpectedly warm', 'green eyes that belonged in magazines',
      'eyes that made billion-dollar decisions without blinking', 'steel-blue eyes that softened only in private',
    ],
    heroFeatures: [
      'a face that graced magazine covers', 'chiseled features that looked designed',
      'sharp jaw perpetually tense', 'features that screamed old money and new power',
      'a face that made people step aside', 'classically handsome in an intimidating way',
    ],
    heroStyle: [
      'bespoke suits that cost more than her rent', 'a watch worth more than her car',
      'sleeves rolled to reveal powerful forearms', 'casual elegance that took effort to achieve',
      'designer everything without trying', 'money visible in every invisible detail',
    ],
    heroMarks: [
      'hands too smooth—someone else did the hard work', 'a callus from gripping a pen too tightly',
      'tension in his shoulders he never released', 'a body maintained by expensive trainers',
      'premature gray at his temples—earned through stress', 'a watch tan line when he finally took it off',
    ],
    heroineMarks: [
      'hands that had worked for everything', 'clothes that didn\'t quite fit this world',
      'a confidence that had nothing to do with money', 'calluses from real work',
      'a wardrobe of black because it was practical', 'eyes that saw through bullshit',
    ],
  },
  
  // ============ SHIFTER ROMANCE ============
  'Shifter Romance': {
    heroEyes: [
      'gold wolf eyes that flashed in his human face', 'amber eyes that reflected the moon',
      'eyes that shifted between human and beast', 'predator eyes that tracked every movement',
      'yellow-gold that belonged to something not quite human', 'eyes that glowed when the wolf rose',
    ],
    heroFeatures: [
      'features that blurred between handsome and feral', 'a face that looked carved by wilderness',
      'something inhuman lurking beneath handsome features', 'a jaw that could shift into something else',
      'sharp canines visible when he smiled', 'features that seemed to ripple with another face beneath',
    ],
    heroBody: [
      'muscles that moved wrong—too fluid, too predatory', 'a body that ran hotter than human',
      'hair on his arms that could become fur', 'scars from challenges won and lost',
      'a body built for hunting', 'the restless energy of something caged',
    ],
    heroMarks: [
      'scars from pack challenges', 'the alpha mark on his shoulder',
      'claw marks from his first shift', 'a bite scar from his making',
      'the wear of someone who spent time in animal form', 'marks that told pack history',
    ],
    heroineMarks: [
      'the bite scar from her turning', 'new scars since the change',
      'a body she was still learning', 'hands that didn\'t quite remember being claws',
      'eyes that had started shifting color', 'the restless feeling of something new inside',
    ],
  },
  
  // ============ ALIEN ROMANCE ============
  'Alien Romance': {
    heroFeatures: [
      'features that were almost human—almost', 'bone structure that didn\'t quite match Earth',
      'too perfect, like a painting come to life', 'strange beauty that hurt to look at',
      'features that shifted subtly with emotion', 'a face that would haunt her forever',
    ],
    heroSkin: [
      'skin that shimmered with bioluminescence', 'blue-gray skin cool to the touch',
      'pale lavender skin that darkened with emotion', 'silver-tinged skin that caught the starlight',
      'skin covered in subtle ridges and patterns', 'skin that changed color with his mood',
    ],
    heroBody: [
      'taller than any human, broader, more', 'proportions that weren\'t quite right—better',
      'extra appendages she was still getting used to', 'a body built for a different gravity',
      'ridges and plates where humans had smooth skin', 'a form that was weapon and lover both',
    ],
    heroMarks: [
      'bioluminescent markings that showed his status', 'scars from wars on distant planets',
      'implants visible beneath his skin', 'the marks of his species\' bonding',
      'patterns that told his rank and history', 'scales in patterns unique to him',
    ],
    heroineMarks: [
      'new scars from adapting to space', 'the translator implant behind her ear',
      'tan lines from artificial sun', 'calluses from learning new tools',
      'his marks appearing on her skin—the bond', 'changes she couldn\'t explain yet',
    ],
  },
  
  // ============ ROMANTASY ============
  'Romantasy': {
    heroEyes: [
      'fae eyes that held starlight captive', 'eyes older than human civilization',
      'inhuman beauty in an almost-human face', 'colors that didn\'t exist in mortal spectrum',
      'eyes that had watched empires rise and fall', 'ageless eyes that saw too much',
    ],
    heroFeatures: [
      'too beautiful—dangerously so', 'features that inspired worship and fear',
      'cruel beauty that cut like knives', 'the face of every dark fairy tale',
      'elegance that was weapon and armor', 'beauty that was almost painful to witness',
    ],
    heroBody: [
      'a body that had never known aging', 'lithe strength that belied his power',
      'grace that mocked human clumsiness', 'a form unchanged for centuries',
      'immortality worn like expensive clothes', 'power visible in every movement',
    ],
    heroMarks: [
      'the iron burn that marked his exile', 'scars from the last war between courts',
      'marks from a lover centuries dead', 'the weight of his crown invisible but present',
      'battle wounds that should have killed', 'the evidence of bargains made and kept',
    ],
    heroineMarks: [
      'the bargain mark that bound her', 'iron burns from her first days here',
      'a body changed by fae food', 'mortal marks fading slowly',
      'new abilities visible in her eyes', 'the weight of a crown she never wanted',
    ],
  },
};

// ============================================================================
// BACKSTORY VARIETY - Different wounds, lies, fears
// ============================================================================

const BACKSTORY_VARIETY: Record<string, {
  heroineWounds: Array<{wound: string; ghost: string}>;
  heroineLies: string[];
  heroWounds: Array<{wound: string; ghost: string}>;
  heroLies: string[];
}> = {
  // ============ MONSTER ROMANCE ============
  'Monster Romance': {
    heroineWounds: [
      { wound: 'abandoned by mother at seven', ghost: 'waking to empty closets and a cold breakfast' },
      { wound: 'raised by a father who wanted a son', ghost: 'the disappointment in his eyes when she was born' },
      { wound: 'mocked for her beliefs in the impossible', ghost: 'colleagues laughing at her "fairy tales"' },
      { wound: 'lost her research partner in the field', ghost: 'his scream as something dragged him into the darkness' },
      { wound: 'grew up on stories of monsters that took her grandmother', ghost: 'fear and fascination in equal measure' },
      { wound: 'escaped an academic scandal she didn\'t cause', ghost: 'her name in headlines, her career in ruins' },
    ],
    heroineLies: [
      'Love is just another word for eventual abandonment.',
      'Science is the only thing that can\'t leave her.',
      'Needing people is weakness. Facts don\'t disappoint.',
      'She\'s only worth what she can discover, prove, document.',
      'Monsters exist—in human hearts, not in the flesh.',
    ],
    heroWounds: [
      { wound: 'watched his mother die and ran', ghost: 'her smile as she told him to flee, the smell of smoke' },
      { wound: 'failed to protect his clan from massacre', ghost: 'the screams, the blood, his own helpless rage' },
      { wound: 'born different, smaller, marked as weak', ghost: 'the mockery of other orc children, proving them wrong' },
      { wound: 'lost his mate centuries ago', ghost: 'her face fading from memory, the fear of forgetting' },
      { wound: 'made a deal with humans that destroyed his tribe', ghost: 'the trust in their eyes before the betrayal' },
    ],
    heroLies: [
      'Softness is death. Love is vulnerability that gets people killed.',
      'He\'s a monster. He doesn\'t deserve gentleness.',
      'Humans are treacherous. They always betray.',
      'The only thing he\'s good for is violence.',
      'His mother\'s death was his fault for running.',
    ],
  },
  
  // ============ DARK ROMANCE ============
  'Dark Romance': {
    heroineWounds: [
      { wound: 'sold to pay family debts', ghost: 'her father\'s refusal to meet her eyes as money changed hands' },
      { wound: 'escaped an abusive marriage', ghost: 'the click of the lock, his footsteps on the stairs' },
      { wound: 'witness to a crime she couldn\'t report', ghost: 'the body, the blood, the man who saw her see' },
      { wound: 'raised in the system, no one\'s first choice', ghost: 'foster homes that weren\'t home, faces that blurred' },
      { wound: 'survived something she\'s never told anyone', ghost: 'the basement, the darkness, the counting of days' },
      { wound: 'her mother\'s addiction stole her childhood', ghost: 'finding her mother unconscious, being eight years old' },
    ],
    heroineLies: [
      'She\'s only worth what someone will pay for her.',
      'Love is a transaction. Everyone wants something.',
      'Trust is suicide. Everyone betrays eventually.',
      'She doesn\'t deserve safety. She attracts danger.',
      'If she\'s small enough, quiet enough, maybe she\'ll survive.',
    ],
    heroWounds: [
      { wound: 'his younger sister murdered by rivals', ghost: 'her pink ribbon in the blood, his screams' },
      { wound: 'forced to kill his first man at twelve', ghost: 'the weight of the gun, the spray of red' },
      { wound: 'betrayed by his father to enemies', ghost: 'torture, darkness, learning to feel nothing' },
      { wound: 'watched his empire burn because he trusted', ghost: 'the woman he loved lighting the match' },
      { wound: 'raised to be a weapon, not a person', ghost: 'no birthdays, no mercy, only training' },
    ],
    heroLies: [
      'Control is the only safety. Power is the only shield.',
      'He\'s incapable of love. He was made wrong.',
      'Caring about anyone makes them a target.',
      'If he\'s ruthless enough, no one else will die.',
      'Emotion is weakness his enemies will exploit.',
    ],
  },
  
  // ============ MAFIA ROMANCE ============
  'Mafia Romance': {
    heroineWounds: [
      { wound: 'her father gambled her away', ghost: 'his signature on the contract, her life in the balance' },
      { wound: 'witnessed her mother\'s murder by the family', ghost: 'the red spreading across white marble floors' },
      { wound: 'promised to one man, given to another', ghost: 'her fiancé\'s body at her feet, his brother\'s ring on her finger' },
      { wound: 'grew up princess of a fallen dynasty', ghost: 'luxury to poverty overnight, lessons in survival' },
      { wound: 'her brother joined the family business and vanished', ghost: 'his empty room, her unanswered questions' },
    ],
    heroineLies: [
      'She\'s a pawn. She\'s always been a pawn.',
      'Love is weakness the family will exploit.',
      'The only way out is escape or death.',
      'She can\'t trust anyone, especially not him.',
      'The moment she shows weakness, she dies.',
    ],
    heroWounds: [
      { wound: 'became the don at sixteen when his father was killed', ghost: 'blood on his hands, crown on his head' },
      { wound: 'ordered to kill his best friend for betrayal', ghost: 'the bullet, the betrayal, the brother lost' },
      { wound: 'his mother died cursing his life choices', ghost: 'her last words were disappointment' },
      { wound: 'forced to marry for alliance, lost her to childbirth', ghost: 'the son who lived, the wife who didn\'t' },
      { wound: 'discovered his mentor was his father\'s killer', ghost: 'trust shattered, revenge too hollow' },
    ],
    heroLies: [
      'He\'s a monster born of monsters. This is all he can be.',
      'Love is leverage. He can\'t afford weakness.',
      'The family is all. Personal desires mean death.',
      'He doesn\'t deserve redemption. His hands are too bloody.',
      'If he lets himself feel, the empire crumbles.',
    ],
  },
  
  // ============ BILLIONAIRE ROMANCE ============
  'Billionaire Romance': {
    heroineWounds: [
      { wound: 'worked three jobs to survive college', ghost: 'the hunger, the exhaustion, the rich kids laughing' },
      { wound: 'parents lost everything to medical debt', ghost: 'her mother dying without proper care' },
      { wound: 'dated a man who used her for a bet', ghost: 'his friends laughing, her heart shattering' },
      { wound: 'raised by her grandmother after parents chose addiction', ghost: 'the fights, the broken promises, the grandmother who was enough' },
      { wound: 'clawed her way up only to be passed over', ghost: 'the promotion given to someone\'s son, her work stolen' },
    ],
    heroineLies: [
      'She\'ll never be good enough for their world.',
      'Money corrupts. Rich people are heartless.',
      'Love is for people who can afford to fail.',
      'She has to prove her worth. Every single day.',
      'The moment she relaxes, she loses everything.',
    ],
    heroWounds: [
      { wound: 'born with everything except a parent\'s love', ghost: 'the nanny who raised him, the parents who ignored him' },
      { wound: 'lost his brother to suicide no one saw coming', ghost: 'the note, the blame, the questions that never stop' },
      { wound: 'his first love sold his secrets to the press', ghost: 'his private pain as headlines' },
      { wound: 'forced to watch his father destroy the company, then fix it', ghost: 'the betrayal by blood' },
      { wound: 'grew up as a merger, not a son', ghost: 'the contract, the arrangement, the business deal that made him' },
    ],
    heroLies: [
      'Everyone wants something. Usually his money.',
      'Love is a fairy tale for people with nothing to lose.',
      'He can\'t trust anyone who isn\'t on his payroll.',
      'Work is worth. Everything else is distraction.',
      'If he stops moving, the emptiness catches up.',
    ],
  },
  
  // ============ SHIFTER ROMANCE ============
  'Shifter Romance': {
    heroineWounds: [
      { wound: 'bitten against her will, humanity stolen', ghost: 'the teeth, the pain, waking up as something else' },
      { wound: 'rejected by her mate publicly', ghost: 'his words, the pack\'s laughter, the exile' },
      { wound: 'raised human, discovered the truth too late', ghost: 'the shift that killed someone she loved' },
      { wound: 'her pack was slaughtered, she survived', ghost: 'running while they screamed, the silence after' },
      { wound: 'half-blood, belonging nowhere fully', ghost: 'too human for wolves, too wolf for humans' },
    ],
    heroineLies: [
      'She\'s an abomination. She never chose this.',
      'The wolf inside is the enemy.',
      'She doesn\'t deserve a mate. She\'s damaged.',
      'Her pack died because she wasn\'t there. Wasn\'t enough.',
      'If she keeps running, she won\'t get attached.',
    ],
    heroWounds: [
      { wound: 'killed his father to become alpha', ghost: 'the challenge, the blood, his father\'s pride' },
      { wound: 'his mate died before he could claim her', ghost: 'her scent fading, the bond that never was' },
      { wound: 'exiled from his birth pack for mercy shown', ghost: 'the rogue he spared, the punishment for compassion' },
      { wound: 'watched hunters kill his pups', ghost: 'their small bodies, his inability to save them' },
      { wound: 'born alpha to a pack that didn\'t want him', ghost: 'the challenges, the blood, earning every inch' },
    ],
    heroLies: [
      'The alpha can\'t show weakness. Ever.',
      'Mates are vulnerability. His pack comes first.',
      'He\'s too broken for a bond. It would only hurt her.',
      'His wolf is too wild. Too dangerous for love.',
      'The pack needs a leader, not a lover.',
    ],
  },
  
  // ============ ALIEN ROMANCE ============
  'Alien Romance': {
    heroineWounds: [
      { wound: 'abducted from Earth, never to return', ghost: 'the last glimpse of her planet through the viewport' },
      { wound: 'sold at auction, treated as livestock', ghost: 'the cage, the buyers, the price she fetched' },
      { wound: 'crash-landed alone, survived against odds', ghost: 'the wreckage, the cold, the days of counting' },
      { wound: 'volunteered for colony that was attacked', ghost: 'everyone she came with, dead or scattered' },
      { wound: 'escaped Earth dying, found herself more alone', ghost: 'the planet burning behind her, survivor\'s guilt' },
    ],
    heroineLies: [
      'She\'ll never see home again.',
      'She\'s property now. Not a person.',
      'Trust an alien and die. Simple.',
      'Love across species is impossible. Biology wins.',
      'She has to survive. Nothing else matters.',
    ],
    heroWounds: [
      { wound: 'last of his kind after war destroyed his people', ghost: 'empty cities, silent ships, no one left' },
      { wound: 'born for war, never knew anything else', ghost: 'the first battle, the last friend, the empty after' },
      { wound: 'banished for refusing a dishonorable order', ghost: 'the shame, the exile, the home lost' },
      { wound: 'bonded once before, lost her to the void', ghost: 'her hand slipping from his, the airlock, the stars' },
      { wound: 'raised as specimen, not son', ghost: 'tests, needles, the day he escaped' },
    ],
    heroLies: [
      'His species wasn\'t meant to bond. He\'s defective.',
      'Humans are too fragile. He\'d break her.',
      'Love is a weakness enemies will exploit.',
      'He\'s too alien for her. Too wrong.',
      'The last time he loved, she died. Never again.',
    ],
  },
  
  // ============ ROMANTASY ============
  'Romantasy': {
    heroineWounds: [
      { wound: 'stolen from her human family as a child', ghost: 'her mother\'s screams, the glamour that hid them' },
      { wound: 'bargained away for power she didn\'t want', ghost: 'the deal her parents made, the price she pays' },
      { wound: 'discovered her magic by accidentally hurting someone', ghost: 'the fire, the screams, the running' },
      { wound: 'the prophecy named her destroyer, not savior', ghost: 'the fear in their eyes, the hate she didn\'t earn' },
      { wound: 'half-fae, accepted by neither court', ghost: 'the slurs, the tests, the belonging nowhere' },
    ],
    heroineLies: [
      'She\'s a mortal in a world of immortals. She doesn\'t belong.',
      'Magic corrupts. The more power, the less humanity.',
      'The fae are beautiful monsters. Trust means death.',
      'Her heart is the weapon they\'ll use against her.',
      'If the prophecy is true, loving her dooms him.',
    ],
    heroWounds: [
      { wound: 'cursed by his own mother for love', ghost: 'her words, the magic that bound him, the betrayal' },
      { wound: 'killed his brother for the throne, regrets every day', ghost: 'the duel, the crown, the empty seat beside him' },
      { wound: 'watched his court fall to iron and humans', ghost: 'the burning, the screaming, the survivors he couldn\'t save' },
      { wound: 'born of both courts, trusted by neither', ghost: 'the assassination attempts, the constant watching' },
      { wound: 'made a deal for power, lost his heart literally', ghost: 'the box where it beats, the creature who holds it' },
    ],
    heroLies: [
      'Love is weakness the court will exploit.',
      'He\'s been cruel too long to be anything else.',
      'Mortals are brief candles. He can\'t watch her die.',
      'His curse would only spread to her.',
      'The kingdom needs a king, not a lovesick fool.',
    ],
  },
  
  // ============ WHY CHOOSE / REVERSE HAREM ============
  'Why Choose / Reverse Harem': {
    heroineWounds: [
      { wound: 'told she was too much, always too much', ghost: 'every boyfriend who couldn\'t handle her' },
      { wound: 'learned love was conditional on perfection', ghost: 'her mother\'s criticism, never enough' },
      { wound: 'heart broken by the one she thought was forever', ghost: 'the other woman, the lies, the shattering' },
      { wound: 'never felt whole with just one person', ghost: 'the guilt, the confusion, the feeling wrong' },
      { wound: 'used and discarded by men who wanted pieces', ghost: 'the empty promises, the pattern she couldn\'t break' },
    ],
    heroineLies: [
      'She wants too much. Needs too much.',
      'Love means choosing. She\'s broken for wanting more.',
      'They\'ll realize she\'s not worth the trouble.',
      'This can\'t work. Society won\'t allow it.',
      'She doesn\'t deserve to have everything.',
    ],
    heroWounds: [
      { wound: 'grew up sharing everything with brothers', ghost: 'the bond forged in survival' },
      { wound: 'lost the woman they all loved before', ghost: 'her death, their grief, the vow to never again' },
      { wound: 'raised to compete, learned to cooperate', ghost: 'the father who set them against each other' },
      { wound: 'pack mentality was all they knew', ghost: 'the orphanage, the survival, the family they made' },
    ],
    heroLies: [
      'Sharing means no one gets hurt.',
      'They\'re too broken individually to be enough.',
      'This is easier than risking loss alone.',
      'They don\'t deserve her. None of them do.',
    ],
  },
};

// ============================================================================
// CULTURAL DETAILS - World-building variety
// ============================================================================

const CULTURAL_VARIETY: Record<string, Record<string, string[]>> = {
  // ============ MONSTER ROMANCE ============
  'Monster Romance': {
    traditions: [
      'the bonding ceremony under the twin moons', 'the warrior\'s trial of blood and stone',
      'the naming ritual where the ancestors speak', 'the death chant that guides souls home',
      'the first kill feast, marking passage to adulthood', 'the treaty circle where no weapons may be drawn',
      'the mourning period of seven silent days', 'the fertility dance performed only at harvest',
      'the choosing ceremony where mates are blessed', 'the exile ritual that strips name and clan',
      'the blood brotherhood pact between warriors', 'the elder council that settles disputes',
      'the coming-of-age hunt where younglings prove worth', 'the scar ceremony marking great deeds',
      'the seasonal migration to ancestral grounds', 'the night of stories when histories are shared',
      'the fire walk that purifies before battle', 'the dream quest to find one\'s totem',
      'the gift exchange that begins courting', 'the trial by combat to prove worth as mate',
      'the marking ritual where mates share scars', 'the feast of the fallen to honor the dead',
      'the claiming run where she is chased (consensually)', 'the presentation before the ancestors\' altar',
    ],
    endearments: [
      'little one', 'fierce heart', 'my soul\'s match', 'bright eyes',
      'stubborn creature', 'troublesome female', 'precious one', 'my choosing',
      'star-walker', 'clan-breaker', 'heart-thief', 'soul-bond',
      'little flame', 'moonlight', 'my weakness', 'keeper of my peace',
      'fire-starter', 'trouble-bringer', 'soft one', 'my light',
      'sharp-tongue', 'brave-heart', 'chosen', 'claimed',
      'little scientist', 'curious one', 'fearless', 'mate-to-be',
      'treasure', 'gift', 'my finding', 'unexpected blessing',
      'little thorn', 'sweet disturbance', 'my undoing', 'peace-bringer',
      'soft warrior', 'gentle storm', 'my home', 'heart-keeper',
    ],
    curses: [
      'by the ancestors\' bones', 'spirits take me', 'blood and battle',
      'may the moons never rise for you', 'darkness devour you',
      'may your tusks rot in your skull', 'cursed be your clan\'s memory',
      'by the old forest', 'ancestors witness my oath', 'blood-sworn',
      'may you die without honor', 'no warrior will sing your death',
      'may your mate never know you', 'clan-forsaken', 'oath-breaker',
    ],
    settings: [
      'ancient trees that had witnessed the birth of kingdoms', 'moss that glowed faintly in the dark',
      'streams that sang in languages older than speech', 'clearings where the barrier between worlds thinned',
      'flowers that bloomed only under the full moons', 'shadows that moved against the wind',
      'air thick with magic that tingled on human skin', 'paths that shifted when you weren\'t looking',
      'caves adorned with ancient paintings', 'hot springs sacred to the clan',
      'burial grounds where ancestors slept', 'the great hall where feasts were held',
      'training grounds worn smooth by generations', 'the border where monster and human lands met',
      'the chieftain\'s longhouse with its fire never extinguished', 'the crafting caves where weapons were forged',
      'mushroom circles where offerings were left', 'the mating cliffs where bonds were witnessed',
      'rivers that ran warm with mineral springs', 'the market where clans traded in peace',
    ],
    dailyLife: [
      'waking to the smell of meat over fire', 'morning training before the sun rose',
      'the communal breakfast where gossip flowed', 'the hunt that fed the clan',
      'midday rest in the hottest hours', 'the evening gathering around the central fire',
      'stories told by elders as children slept', 'the night patrols that kept the border safe',
      'the weekly market where news was exchanged', 'the monthly clan meeting by moonlight',
    ],
    foodAndDrink: [
      'roasted meat pulled from the bone', 'fermented berry mead that burned sweetly',
      'honeycomb gathered from giant bees', 'blood sausage only warriors ate',
      'flat bread baked on hot stones', 'mushroom stew spiced with forest herbs',
      'smoked fish from the cold streams', 'berry wine reserved for celebrations',
      'the bitter tea that kept warriors alert', 'the sweet drink given to new mothers',
    ],
  },
  
  // ============ DARK ROMANCE ============
  'Dark Romance': {
    traditions: [
      'the blood oath sworn in candlelight', 'the initiation that breaks before rebuilding',
      'the silence after punishment', 'the reward system that blurs pleasure and control',
      'the public claiming that marks ownership', 'the private moments of unexpected tenderness',
      'the test of loyalty through fire', 'the ritual of submission freely given',
      'the negotiation of limits before play', 'the aftercare that follows intensity',
      'the contract that defines their dynamic', 'the collar ceremony when submission deepens',
      'the secret signals in public spaces', 'the debriefing after difficult scenes',
      'the anniversary of her surrender', 'the release ritual when she needs normalcy',
      'the check-in that proves he cares', 'the reward for being brave',
    ],
    endearments: [
      'little bird', 'mine', 'good girl', 'precious thing', 'my obsession',
      'sweet torment', 'beautiful wreck', 'pet', 'trouble', 'angel',
      'darling', 'sweetheart (when angry)', 'my ruin', 'weakness',
      'little lamb', 'pretty thing', 'sweet girl', 'my captive',
      'dove', 'kitten', 'princess', 'prey', 'love', 'baby',
      'my possession', 'treasure', 'little fool', 'stubborn woman',
      'my everything', 'only one', 'reason', 'salvation', 'damnation',
      'little rebel', 'fighter', 'survivor', 'brave one', 'my light',
    ],
    curses: [
      'God help anyone who touches her', 'I\'ll burn it all down',
      'They\'ll never find the body', 'This ends one way',
      'I\'ve killed for less', 'Don\'t test me', 'You have no idea what I\'m capable of',
      'Cross that line and see what happens', 'I\'ll ruin everything you love',
      'There\'s nowhere you can hide', 'You don\'t want to know what happens next',
      'That was your last mistake', 'Remember who you\'re talking to',
    ],
    settings: [
      'penthouse views that made the world feel small', 'silk sheets stained with secrets',
      'underground clubs where rules didn\'t exist', 'private jets with soundproof walls',
      'abandoned warehouses repurposed for darker needs', 'safe rooms with supplies for weeks',
      'wine cellars that held more than wine', 'boardrooms where empires rose and fell',
      'the panic room only they know about', 'basement playrooms with specialized equipment',
      'hotel suites booked under false names', 'the cabin where no one can hear',
      'converted churches where sin felt holy', 'parking garages in the small hours',
      'expensive restaurants where deals were made', 'private clubs with strict membership',
      'the back office where he conducted business', 'rooftops where they watched the city burn',
    ],
    powerDynamics: [
      'the look that meant kneel', 'the snap that summoned her',
      'the raised eyebrow that questioned', 'the smile that promised punishment',
      'the touch that grounded her', 'the distance that made her ache',
      'the praise that made her glow', 'the disapproval that cut deep',
      'the control he wielded like a weapon', 'the surrender she gave like a gift',
    ],
    safetyElements: [
      'the safe word that stopped everything', 'the tap that meant slow down',
      'the color system that communicated limits', 'the aftercare box kept bedside',
      'the blanket reserved for coming down', 'the check-ins that felt like love',
      'the negotiation before anything new', 'the veto power she always held',
      'the times he stopped because she needed', 'the respect beneath the control',
    ],
  },
  
  // ============ MAFIA ROMANCE ============
  'Mafia Romance': {
    traditions: [
      'the kiss of loyalty', 'the blood oath that bound families', 'the sit-down where wars ended or began',
      'the wedding that sealed alliances', 'the funeral rites that honored fallen soldiers',
      'Sunday dinner where business was forbidden', 'the making ceremony that created made men',
      'the code of silence that protected all', 'the debt that could never be forgiven',
      'the coming out party that introduced her to society', 'the first dance that marked her as his',
      'the baby shower that proved the family would continue', 'the christening where godparents were chosen',
      'the anniversary mass that blessed their union', 'the vendetta that passed between generations',
      'the respect kiss given to the Don', 'the envelope passed at weddings',
      'the tribute paid monthly to the family', 'the sit-down that negotiated territory',
    ],
    endearments: [
      // Italian
      'bella', 'tesoro', 'principessa', 'mia vita', 'amore', 'cucciola', 'dolcezza',
      'stellina', 'cuore mio', 'piccola', 'cara mia', 'angelo', 'vita mia',
      'anima mia', 'bellissima', 'gioia', 'luce mia', 'regina',
      // Russian
      'malyshka', 'kotyonok', 'zvyozdochka', 'solnyshko', 'krasavitsa',
      'dorogaya', 'lyubimaya', 'zolotse', 'milaya', 'kiska',
      // Irish
      'mo chroí', 'a stór', 'mo ghrá', 'darlin\'', 'love',
      // English
      'sweetheart', 'beautiful', 'doll', 'baby', 'angel',
    ],
    curses: [
      // Italian
      'mannaggia', 'cazzo', 'figlio di puttana', 'affanculo', 'vaffanculo',
      'porca miseria', 'merda', 'stronzo', 'che cazzo',
      // Russian
      'blyad', 'suka', 'yob tvoyu mat', 'pizdets', 'mudak', 'chert',
      // General threats
      'You\'re a dead man', 'I\'ll bury you', 'Your family will mourn',
      'Consider yourself warned', 'That was your last mistake',
    ],
    settings: [
      'the family compound where guards walked the walls', 'Italian restaurants with back rooms',
      'churches where confessions were made and deals struck', 'the docks at midnight',
      'penthouse offices overlooking empires', 'safe houses in every borough',
      'the cemetery where respect was paid', 'velvet-lined private rooms',
      'the vineyard that hid other business', 'the strip club that laundered money',
      'the warehouse where meetings happened', 'the construction site owned by the family',
      'the bakery that was the legitimate front', 'the parking garage where deals were made',
      'the boat where bodies disappeared', 'the basement no one talked about',
      'the family mansion with its hidden rooms', 'the jewelry store that moved diamonds',
    ],
    familyRoles: [
      'the Don who commanded everything', 'the underboss who handled daily operations',
      'the consigliere who gave counsel', 'the capo who ran the crew',
      'the soldier who did the work', 'the associate who wanted to be made',
      'the wife who ran the household', 'the daughter who was protected',
      'the son who would inherit', 'the grandmother everyone respected',
    ],
    businessTerms: [
      'making a collection', 'going to the mattresses', 'sleeping with the fishes',
      'taking a meeting', 'making an offer', 'showing respect',
      'paying tribute', 'settling a debt', 'calling in a favor',
      'getting clipped', 'being made', 'taking an oath',
    ],
  },
  
  // ============ BILLIONAIRE ROMANCE ============
  'Billionaire Romance': {
    traditions: [
      'the gala that determined social standing', 'the board meeting that made or broke careers',
      'the charity auction where egos competed', 'the private club where deals were made',
      'the family foundation that demanded heirs', 'the prenup that protected nothing that mattered',
    ],
    endearments: [
      'sweetheart', 'beautiful', 'my heart', 'darling', 'angel',
      'baby', 'love', 'gorgeous', 'babe', 'sweetheart',
    ],
    curses: [
      'I could buy this building', 'Do you know who I am',
      'My lawyers will bury you', 'One phone call',
    ],
    settings: [
      'floor-to-ceiling windows watching the city sleep', 'private islands with no paparazzi',
      'company jets with bedrooms', 'Michelin-starred restaurants with private rooms',
      'penthouses above the clouds', 'yachts that were floating mansions',
      'corner offices with authority in every surface', 'rooftop gardens in concrete jungles',
    ],
  },
  
  // ============ SHIFTER ROMANCE ============
  'Shifter Romance': {
    traditions: [
      'the full moon run where the pack hunts as one', 'the claiming bite that marks forever',
      'the alpha challenge that could dethrone rulers', 'the mating ceremony under the blood moon',
      'the first shift witnessed by pack elders', 'the mourning howl that reaches miles',
      'the scent marking that claims territory', 'the submission display that ends conflicts',
      'the pack acceptance ritual for new members', 'the hierarchy display at pack gatherings',
      'the hunt that feeds the pack\'s vulnerable', 'the pup presentation to the alpha',
      'the seasonal gathering of all local packs', 'the solstice celebration with bonfire and hunt',
      'the rogue tribunal that judges intruders', 'the mating heat that brings bonds',
      'the pack birthday where aging is honored', 'the memorial run for fallen pack',
      'the territory patrol that marks boundaries', 'the welcome run for new mates',
    ],
    endearments: [
      'mate', 'little wolf', 'omega', 'my heart', 'pack',
      'cub', 'beloved', 'precious', 'mine (growled)', 'home',
      'pup', 'little one', 'sweet one', 'my she-wolf', 'bond',
      'scent-match', 'soul-mate', 'chosen', 'claimed', 'kept',
      'treasure', 'moonbeam', 'starlight', 'heart-song', 'den-mate',
      'little human', 'fierce one', 'brave pup', 'my marking', 'forever',
    ],
    curses: [
      'moon forsaken', 'rogue blood', 'packless cur',
      'may your wolf abandon you', 'feral filth',
      'lone wolf (insult)', 'omega (derogatory)', 'unscented',
      'may you never find your mate', 'may your shift fail',
      'bloodless coward', 'prey-minded', 'weak-jawed',
    ],
    settings: [
      'the den carved into the mountainside', 'territory borders marked in scent and blood',
      'the clearing where challenges were settled', 'the alpha\'s cabin at the center of pack lands',
      'the run path worn smooth by generations', 'the gathering rock where councils met',
      'the mating meadow blessed by the moon', 'the punishment grounds where exiles were made',
      'the nursery den where pups were raised', 'the hunting grounds that fed the pack',
      'the pack house with its endless bedrooms', 'the kitchen that fed dozens',
      'the basement reinforced for difficult shifts', 'the forest that felt like home',
      'the lake where they swam as wolves', 'the caves that hid during hunts',
      'the training grounds where young wolves learned', 'the border watchtowers staffed always',
    ],
    packStructure: [
      'the alpha who led with strength', 'the alpha mate who led with wisdom',
      'the beta who served as second', 'the gamma who trained warriors',
      'the delta who managed the pack', 'the omega who kept peace',
      'the sentinels who guarded borders', 'the hunters who fed the pack',
      'the healers who mended wounds', 'the elders who advised all',
    ],
    wolfBehaviors: [
      'the scenting that recognized pack', 'the nuzzle that showed affection',
      'the growl that warned threats', 'the whine that expressed need',
      'the play bow that invited fun', 'the rolled belly that showed trust',
      'the raised hackles that showed aggression', 'the tucked tail that showed submission',
      'the howl that communicated across miles', 'the purr-growl of contentment',
    ],
  },
  
  // ============ ALIEN ROMANCE ============
  'Alien Romance': {
    traditions: [
      'the mating ritual of his people', 'the claiming marks that prove the bond',
      'the translation of star songs', 'the exchange of home-scents',
      'the meeting of family ships', 'the sharing of memory crystals',
      'the bonding flight through asteroid fields', 'the vow under alien constellations',
      'the presentation to his species\' elders', 'the gift of his most treasured possession',
      'the learning of each other\'s languages', 'the adaptation period for her biology',
      'the nest-building that preceded formal bonding', 'the approval seeking from his clan',
      'the marking ceremony visible to all species', 'the celebration feast with alien delicacies',
      'the shared dreaming his species performed', 'the bonding that made them feel each other',
      'the Earth tribute he created for her comfort', 'the star-naming to mark their meeting',
    ],
    endearments: [
      'my star', 'precious one', 'little human', 'bond-mate', 'heart of my hearts',
      'claimed one', 'treasure', 'my everything', 'small fierce one', 'beloved',
      'small soft one', 'warm-blood', 'my finding', 'home-bringer', 'light-maker',
      'gentle creature', 'stubborn human', 'my choice', 'soul-keeper', 'life-giver',
      'fragile precious', 'brave small one', 'my Earth', 'center', 'anchor',
      'translation-needed', 'new-home', 'unexpected gift', 'fated one', 'chosen',
    ],
    curses: [
      'by the void', 'stars consume you', 'may your ship drift forever',
      'empty space take you', 'lightless death await you',
      'may your engines fail in the black', 'cold-death take you',
      'atmosphereless end to you', 'singularity swallow you',
      'may you never reach home', 'drift-destined', 'star-lost',
      'by the first planet', 'ancient cold witness', 'darkness-bound',
    ],
    settings: [
      'the bio-luminescent corridors of his ship', 'the viewing deck where galaxies swirled',
      'the nest he built from scraps of both their worlds', 'the ice caves of his frozen planet',
      'the translation matrix where words became feelings', 'the healing pool with restorative waters',
      'the pilot\'s seat she learned to occupy', 'the stars that looked different from his home',
      'the hydroponics bay where he grew her Earth plants', 'the gravity room adjusted for her comfort',
      'the sleeping pod modified for two', 'the weapons bay where he trained her',
      'the engine room that hummed like a heartbeat', 'the observation deck for first contact',
      'the escape pod outfitted for her survival', 'the communication array connecting her to nothing',
      'the airlock that separated safety from void', 'his home planet\'s strange beauty',
    ],
    speciesTraits: [
      'bioluminescent markings that showed emotion', 'skin that changed color with mood',
      'multiple hearts that beat for her', 'eyes that saw spectrums she couldn\'t',
      'strength that could crush but never did', 'purring that vibrated through her',
      'scenting that recognized her anywhere', 'protective instincts that overwhelmed',
      'possessiveness built into his DNA', 'bonding that was permanent for his species',
    ],
    spaceReality: [
      'the recycled air she\'d stopped noticing', 'artificial gravity that sometimes failed',
      'the silence of space outside thin walls', 'food that never quite tasted right',
      'the stars that were different from Earth\'s sky', 'time zones that no longer made sense',
      'sleep cycles adjusted to ship\'s rhythm', 'communication delays across light years',
      'danger that lurked in every unknown', 'the vastness that humbled her',
    ],
  },
  
  // ============ ROMANTASY ============
  'Romantasy': {
    traditions: [
      'the bargain sealed in blood and magic', 'the court presentation before the throne',
      'the solstice ball where alliances shifted', 'the trial by elements that proved worth',
      'the naming ceremony that granted fae citizenship', 'the death duel for honor',
      'the wild hunt that claimed the unworthy', 'the exchange of true names',
      'the blood-debt that bound through generations', 'the power test before the council',
      'the feast where poison was entertainment', 'the dance that determined hierarchy',
      'the challenge that could change succession', 'the prophecy reading at equinox',
      'the tithe to the mortal world', 'the masquerade where identities shifted',
      'the binding ceremony for political unions', 'the midnight court where secrets traded',
      'the honor duel that settled disputes', 'the crowning that needed blood',
    ],
    endearments: [
      'little mortal', 'my heart\'s bane', 'sweet trouble', 'precious torment',
      'starlight', 'moonbeam', 'thorn in my crown', 'beloved enemy',
      'my ruin', 'sweet poison', 'darling menace', 'cursed gift',
      'pet', 'treasure', 'little thorn', 'pretty disaster', 'chaos-bringer',
      'mortal mine', 'stolen thing', 'claimed', 'kept', 'found one',
      'light-holder', 'darkness-tamer', 'queen-to-be', 'my undoing', 'fate',
      'stubborn creature', 'impossible thing', 'my match', 'equal', 'worthy',
    ],
    curses: [
      'iron take you', 'may the courts forsake you', 'nameless forever',
      'by the old gods', 'void swallow your shadow',
      'may you never cross the threshold home', 'forgotten by all who knew you',
      'bound to bargains unfulfilled', 'cursed to truth-speaking', 'named your doom',
      'stars deny you', 'magic abandon you', 'glamour-stripped', 'oath-broken',
      'may time steal your beauty', 'iron in your veins',
    ],
    settings: [
      'crystal palaces that shifted with their master\'s mood', 'the in-between place where worlds touched',
      'courts of eternal night or endless day', 'gardens where flowers were deadly beautiful',
      'the mortal world that felt gray after fae colors', 'throne rooms carved from living trees',
      'bedchambers draped in starlight and shadows', 'the border between courts, belonging to neither',
      'libraries with books that rewrote themselves', 'dungeons that were almost pleasant',
      'healing springs with questionable side effects', 'training grounds for magic users',
      'the Void where banished went', 'feast halls that seated thousands',
      'private gardens where truth grew', 'the portal room connecting realms',
      'armories with weapons that chose wielders', 'galleries of captured mortal dreams',
    ],
    courtDynamics: [
      'the games that determined favor', 'the alliances shifting daily',
      'the betrayals expected and planned', 'the compliments that were weapons',
      'the fashion that signaled allegiance', 'the gifts that were obligations',
      'the debts accumulated strategically', 'the information that was currency',
      'the appearances that mattered more than truth', 'the power that flickered with words',
    ],
    magicSystem: [
      'glamour that hid and revealed', 'bargains bound by blood and word',
      'true names that granted control', 'debts that magic enforced',
      'iron that burned immortal flesh', 'salt that marked boundaries',
      'rowan that protected the vulnerable', 'silver that reflected true form',
      'moonlight that powered rituals', 'starlight that preserved memory',
    ],
    mortalFaeRelations: [
      'the changelings left in cribs', 'the mortals stolen for amusement',
      'the time difference that killed love', 'the food that trapped forever',
      'the deals that seemed fair but weren\'t', 'the beauty that faded in fae company',
      'the mortality that fascinated immortals', 'the passion that burned brighter brief',
      'the children born of mixed blood', 'the humans who chose to stay',
    ],
  },
  
  // ============ WHY CHOOSE / REVERSE HAREM ============
  'Why Choose / Reverse Harem': {
    traditions: [
      'the group meeting to discuss problems', 'date nights rotated fairly',
      'the yearly anniversary trip', 'morning coffee order that never changes',
      'the Sunday family dinner', 'the shared calendar that runs their lives',
      'conflict resolution by voting', 'the signal when she needs space',
    ],
    endearments: [
      'princess', 'baby girl', 'sweetheart', 'ours', 'beloved',
      'trouble', 'angel', 'beautiful', 'heart', 'everything',
    ],
    curses: [
      'touch her and deal with all of us', 'we share everything except her with others',
      'hurt her once, never breathe again',
    ],
    settings: [
      'the house that fits all five of them', 'the California king that still isn\'t big enough',
      'the kitchen where they cook together', 'the couch built for group movie nights',
      'the garage where they work on projects', 'the backyard where they built her a garden',
    ],
  },
  
  // ============ BULLY ROMANCE ============
  'Bully Romance': {
    traditions: [
      'the hierarchy of the elite', 'the hazing that breaks or bonds',
      'the party where everything changed', 'the public humiliation and its aftermath',
      'the apology that took years to mean', 'the reconciliation that rebuilt everything',
    ],
    endearments: [
      'princess (once mocking, now tender)', 'baby (earned after everything)',
      'mine (possessive, protective now)', 'sweetheart', 'my girl',
    ],
    curses: [
      'I was such a bastard', 'I can\'t take it back but I\'ll spend forever trying',
      'I hate who I was', 'If I could go back...',
    ],
    settings: [
      'the hallways that used to terrify her', 'the locker bay where it started',
      'the parking lot where things changed', 'the graduation where they left it behind',
      'the reunion where they faced it together', 'the new beginning in a new place',
    ],
  },
};

// ============================================================================
// DIALOGUE VARIETY - Banter, conflict, tenderness
// ============================================================================

const DIALOGUE_VARIETY: Record<string, {banter: string[][]; conflict: string[][]; tender: string[][]; heat: string[][]}> = {
  // ============ MONSTER ROMANCE ============
  'Monster Romance': {
    banter: [
      ['"You\'re staring."', '"You\'re worth staring at."'],
      ['"Are all orcs this stubborn?"', '"Are all humans this infuriating?"'],
      ['"I\'m not afraid of you."', '"Perhaps you should be."', '"Perhaps. But I\'m not."'],
      ['"Stop hovering."', '"I\'m not hovering. I\'m... strategically positioning."'],
      ['"Your people have strange customs."', '"So do yours. You cover your tusks."', '"I don\'t have tusks."', '"My point exactly. Strange."'],
      ['"You growled at me."', '"You startled me."', '"I sneezed."', '"Aggressively."'],
      ['"Is that supposed to be intimidating?"', '"Is it working?"', '"...No."', '"Liar."'],
      ['"You can\'t just claim people."', '"I didn\'t claim people. I claimed you."'],
    ],
    conflict: [
      ['"You should have told me."', '"Would you have stayed?"', '"We\'ll never know now."'],
      ['"I don\'t know who you are anymore."', '"I\'m the same. You just see more now."'],
      ['"Your people killed my grandmother."', '"My people were hunted by yours first."', '"That doesn\'t—"', '"It doesn\'t. But it\'s true."'],
      ['"I can\'t be your mate."', '"You already are."', '"I don\'t belong here."', '"Then I\'ll belong nowhere too."'],
      ['"Let me go."', '"To where? Back to people who don\'t see you?"', '"At least they\'re human."', '"Is that enough?"'],
    ],
    tender: [
      ['"Sleep."', '"You\'ll stay?"', '"Until the mountains fall."'],
      ['"Why me?"', '"Why not you?"', '"I\'m human."', '"You\'re mine."'],
      ['"Tell me something true."', '"I\'ve never wanted anything the way I want you."'],
      ['"Does this frighten you?"', '"Everything about you frightens me."', '"And yet..."', '"And yet."'],
      ['"Your people would never accept me."', '"Then they would lose their chieftain."', '"You can\'t mean that."', '"I mean everything I say to you."'],
      ['"I never thought I could feel this."', '"Neither did I."', '"Three hundred years..."', '"Worth waiting."'],
    ],
    heat: [
      ['"Tell me to stop."', '"No."', '"Tell me you want this."', '"I want... everything."'],
      ['"Gentle."', '"I can\'t—"', '"For now. Later... don\'t be."'],
      ['"More."', '"Greedy little mate."', '"Yes."'],
      ['"I should be afraid of how much you want me."', '"Are you?"', '"I\'m afraid of how much I want you back."'],
    ],
  },
  
  // ============ DARK ROMANCE ============
  'Dark Romance': {
    banter: [
      ['"You can\'t keep me here."', '"Can\'t I?"'],
      ['"I hate you."', '"Your pulse says otherwise."'],
      ['"You\'re a monster."', '"Yes."', '"That wasn\'t a compliment."', '"I know."'],
      ['"Let me go."', '"You\'re free to leave. The door\'s right there."', '"..."', '"That\'s what I thought."'],
      ['"Stop looking at me like that."', '"Like what?"', '"Like I belong to you."', '"You do."'],
      ['"This is kidnapping."', '"This is protection."', '"What\'s the difference?"', '"My intentions."'],
    ],
    conflict: [
      ['"You killed him."', '"He touched you."', '"That doesn\'t mean—"', '"It means exactly that."'],
      ['"I never asked for this."', '"And yet here you are. Still."'],
      ['"I can\'t love a murderer."', '"Then don\'t. Just stay."', '"It\'s not that simple."', '"It is. Everything else is noise."'],
      ['"You lied to me."', '"I protected you."', '"From what? Yourself?"', '"From everything."'],
      ['"I want to hate you."', '"You should."', '"I can\'t."', '"I know. I\'m sorry."'],
    ],
    tender: [
      ['"Why do you stay?"', '"Because you\'d burn the world for me."', '"That terrifies you."', '"No. It terrifies me that I like it."'],
      ['"Sleep."', '"Will you be here?"', '"Always."'],
      ['"I don\'t deserve you."', '"No."', '"Then why?"', '"Because you\'d let me go if I asked."'],
      ['"You\'re different with me."', '"Only with you."', '"Why?"', '"I don\'t know. You broke something. Fixed something. Both."'],
      ['"I want to see you. The real you."', '"You might not like what you find."', '"Try me."'],
    ],
    heat: [
      ['"Ask nicely."', '"Please."', '"Better."'],
      ['"You\'re mine."', '"Prove it."'],
      ['"Tell me who you belong to."', '"You know."', '"Say it."'],
      ['"Harder."', '"You sure?"', '"Show me I\'m alive."'],
    ],
  },
  
  // ============ MAFIA ROMANCE ============
  'Mafia Romance': {
    banter: [
      ['"You\'re buying my silence with pasta?"', '"Is it working?"', '"...The sauce is good."'],
      ['"You don\'t scare me."', '"I should."', '"But you don\'t. What does that say about me?"'],
      ['"I\'m not some trophy wife."', '"No. You\'re much more dangerous than that."'],
      ['"Don\'t \'principessa\' me."', '"Would you prefer \'wife\'?"', '"I\'d prefer my name."', '"I know. That\'s why I won\'t use it."'],
      ['"Is this a threat or a proposal?"', '"Can\'t it be both?"'],
    ],
    conflict: [
      ['"You married me for alliance."', '"I married you because my hands shook when I signed the contract."'],
      ['"He was my friend."', '"He was a threat."', '"To who?"', '"To you. That\'s all that matters."'],
      ['"I didn\'t choose this life."', '"Neither did I."', '"Liar. You were born to this."', '"Born, yes. Chose? Never."'],
      ['"Your family destroyed mine."', '"I know."', '"And you expect me to love you?"', '"I expect nothing. I hope for everything."'],
    ],
    tender: [
      ['"Eat."', '"I\'m not hungry."', '"When did you last eat?"', '"..."', '"That\'s what I thought. Eat."'],
      ['"Stay in tonight."', '"Why?"', '"Because I asked."', '"...Okay."', '"That simple?"', '"When you ask like that? Yes."'],
      ['"You\'re safe here."', '"I know."', '"Do you?"', '"You\'d burn down the city for me. I know."'],
      ['"Teach me to shoot."', '"Why?"', '"Because I\'m tired of being protected. I want to protect myself."', '"...Okay."'],
    ],
    heat: [
      ['"Here? Anyone could see."', '"Let them."'],
      ['"Say you\'re mine."', '"I\'m yours."', '"Again."'],
      ['"I need—"', '"I know what you need."'],
      ['"We should stop."', '"Should we?"', '"...No."'],
    ],
  },
  
  // ============ BILLIONAIRE ROMANCE ============
  'Billionaire Romance': {
    banter: [
      ['"You can\'t buy everything."', '"I haven\'t tried to buy you."', '"Yet."', '"Ever."'],
      ['"This is too much."', '"It\'s a coffee maker."', '"It costs more than my car."', '"Your car is a safety hazard."'],
      ['"I don\'t need your money."', '"I know. That\'s why I want to give it to you."'],
      ['"Stop buying me things."', '"Stop looking beautiful in them."'],
      ['"You\'re used to getting what you want."', '"Yes."', '"I\'m not for sale."', '"I know. That\'s why you\'re priceless."'],
    ],
    conflict: [
      ['"I saw the prenup."', '"You were never supposed to—"', '"What, see what you really think of me?"'],
      ['"You\'re ashamed of me."', '"Never."', '"Then why hide us?"', '"Because they\'ll try to destroy you. I won\'t allow it."'],
      ['"This isn\'t my world."', '"It could be."', '"I don\'t want it."', '"Then we\'ll build our own."'],
      ['"You\'re still her."', '"The assistant you didn\'t see for three years?"', '"The woman I couldn\'t look at because I\'d forget how to breathe."'],
    ],
    tender: [
      ['"Stay the weekend."', '"I have laundry."', '"I\'ll buy you new clothes."', '"That\'s not the point."', '"Then what is?"', '"...I want you to ask because you want me here."', '"I want you here. Always. Please stay."'],
      ['"You remembered."', '"Of course."', '"It was one conversation."', '"Every conversation with you is important."'],
      ['"I don\'t need a hero."', '"I know. But can I be one anyway? Just for you?"'],
    ],
    heat: [
      ['"Clear my schedule."', '"For how long?"', '"Until I can\'t remember my own name."'],
      ['"Here? It\'s glass."', '"No one can see at this height."', '"You can see everything."', '"That\'s the point."'],
      ['"We should be professional."', '"I\'m being very professional."', '"That doesn\'t feel professional."', '"You\'re right. It feels essential."'],
    ],
  },
  
  // ============ SHIFTER ROMANCE ============
  'Shifter Romance': {
    banter: [
      ['"You purred."', '"I did not."', '"My whole bed vibrated."', '"...Wolves don\'t purr."', '"Tell that to the purring."'],
      ['"You sniffed me."', '"You smell good."', '"That\'s not normal."', '"It is for me."'],
      ['"Did you just growl at that waiter?"', '"He looked at you."', '"He was taking my order!"', '"Aggressively."'],
      ['"I\'m not pack."', '"Yet."', '"That wasn\'t an invitation."', '"It wasn\'t a refusal either."'],
    ],
    conflict: [
      ['"You bit me."', '"I marked you."', '"Without asking!"', '"My wolf knew. I should have."'],
      ['"I can\'t just become this."', '"You already are."', '"I didn\'t choose it."', '"Neither did I. Fate doesn\'t ask."'],
      ['"Your pack doesn\'t want me."', '"My pack wants what I want."', '"And if you\'re wrong?"', '"Then they\'ll learn."'],
      ['"I won\'t be owned."', '"Mated isn\'t owned. It\'s... claimed. Chosen. Forever."', '"Forever is a long time."', '"Not long enough."'],
    ],
    tender: [
      ['"The moon\'s beautiful."', '"Not compared to you."', '"Does that line work on all your mates?"', '"I don\'t know. You\'re my first. My only."'],
      ['"I feel it. The bond."', '"I\'ve felt it since I first scented you."', '"How do you stand it?"', '"I don\'t. I just survive until I\'m near you again."'],
      ['"Run with me."', '"I\'m not fast enough."', '"I\'ll wait."', '"You\'ll always be waiting."', '"I\'m good at waiting for you."'],
    ],
    heat: [
      ['"Mine."', '"Yours."'],
      ['"Your eyes changed."', '"You do that to me."', '"I like it."', '"You\'ll like what comes next more."'],
      ['"Slower."', '"I can\'t. Not with you. Not anymore."', '"Then don\'t."'],
    ],
  },
  
  // ============ ALIEN ROMANCE ============
  'Alien Romance': {
    banter: [
      ['"You abducted me."', '"I rescued you."', '"From what?"', '"A dying planet. You\'re welcome."'],
      ['"Is that... a purr?"', '"My species does not purr."', '"Then what is that sound?"', '"...Contentment vibration."'],
      ['"Why are you warm?"', '"Elevated blood temperature in proximity to mate."', '"I\'m not—"', '"Your species lies often. Fascinating."'],
      ['"You\'re staring."', '"I am studying."', '"Studying what?"', '"The way your anger makes you more beautiful."'],
    ],
    conflict: [
      ['"I want to go home."', '"Home is debris now."', '"You could have saved them."', '"I saved you. I could only save one."'],
      ['"I didn\'t ask for this bond."', '"Neither did I."', '"Then undo it."', '"I would die. Would you have me die?"'],
      ['"Your people killed mine."', '"My people are dead too."', '"..."', '"We are what\'s left. Is that not enough to build on?"'],
    ],
    tender: [
      ['"Teach me your word for love."', '"We don\'t have one."', '"Then what is this?"', '"Everything. We just call it everything."'],
      ['"You changed the stars in the viewport."', '"I mapped Earth\'s constellations."', '"Why?"', '"So you would have something of home."'],
      ['"I dreamed of Earth."', '"Was it beautiful?"', '"It was dying. But yes."', '"We will find somewhere new. Together."'],
    ],
    heat: [
      ['"Your markings are glowing."', '"They do that near you."', '"All the time?"', '"Only when I want you. So yes. All the time."'],
      ['"Show me."', '"Show you what?"', '"Everything your species does differently."', '"That could take a while."', '"We have time."'],
    ],
  },
  
  // ============ ROMANTASY ============
  'Romantasy': {
    banter: [
      ['"You tricked me."', '"I\'m fae. It\'s what we do."', '"Is that supposed to make it better?"', '"It\'s supposed to make it expected."'],
      ['"I don\'t trust you."', '"Good. That makes you smarter than most."'],
      ['"You\'re insufferable."', '"And yet you\'re still here."', '"I\'m bound by magic."', '"Are you? Or do you choose to be?"'],
      ['"Stop with the riddles."', '"Where would be the fun in clarity?"'],
    ],
    conflict: [
      ['"You never told me your true name."', '"Names have power."', '"You don\'t trust me."', '"I don\'t trust myself with you."'],
      ['"The court wants me dead."', '"The court can burn."', '"You can\'t destroy your own people."', '"Watch me."'],
      ['"This bargain has to end."', '"It ended months ago."', '"Then why am I still here?"', '"Because you want to be."'],
    ],
    tender: [
      ['"You kept my flower."', '"It\'s dying."', '"Everything mortal dies."', '"I know. That\'s why I keep it."'],
      ['"How old are you?"', '"Old enough to have given up hope."', '"And now?"', '"Now hope has a name. Your name."'],
      ['"I could give you immortality."', '"I don\'t want to outlive everyone I love."', '"You wouldn\'t. I\'d be there."', '"That\'s worse. Watching me forget who I was."', '"Then I\'ll remind you. Every day. Forever."'],
    ],
    heat: [
      ['"This is forbidden."', '"Everything worth wanting is."'],
      ['"The court will talk."', '"Let them. They\'ll be too busy to plot."'],
      ['"Mortal."', '"Fae."', '"We shouldn\'t—"', '"We\'re going to anyway."'],
    ],
  },
  
  // ============ DEFAULT (FALLBACK) ============
  'default': {
    banter: [
      ['"You\'re staring."', '"You\'re worth staring at."'],
      ['"This is insane."', '"Yes."', '"We barely know each other."', '"Also yes."'],
      ['"I don\'t need help."', '"I know. I\'m offering anyway."'],
    ],
    conflict: [
      ['"You lied."', '"I protected you."', '"They\'re not the same."'],
      ['"I trusted you."', '"I know."', '"Do you understand what that cost me?"'],
    ],
    tender: [
      ['"Stay."', '"I wasn\'t leaving."'],
      ['"Why me?"', '"Why not you?"'],
      ['"I\'m scared."', '"So am I."', '"You don\'t look scared."', '"I\'m terrified. Just not of this."'],
    ],
    heat: [
      ['"Tell me to stop."', '"No."'],
      ['"More."', '"Greedy."', '"Yes."'],
    ],
  },
};

// ============================================================================
// CHAPTER-SPECIFIC UNIQUE SCENES - Content that can ONLY appear once
// ============================================================================

const UNIQUE_CHAPTER_CONTENT = {
  // Chapter 1: First meeting magic
  ch1_firstSight: (pName: string, liName: string) => `
The moment their eyes met, something shifted.

Not in the dramatic way of storybooks—no lightning, no celestial choirs, no instant recognition of soulmates. This was subtler. Deeper. Like a key turning in a lock she hadn\'t known existed.

${pName}\'s brain, that reliable engine of logic and reason, simply... stopped. For three heartbeats—she counted them later, replaying the moment until it wore grooves in her memory—she existed in a space outside thought. Outside fear. Outside everything but the golden intensity of his gaze.

*He sees me,* she realized. Not the degrees. Not the defenses. Not the carefully constructed walls. *He sees ME.*

The thought terrified her.

The terror wasn\'t enough to make her look away.`,

  // Chapter 2: Hero's perspective on first meeting
  ch2_heroPOV: (pName: string, liName: string) => `
${liName} had known warriors. Had trained them, led them, buried them. He knew courage when he saw it.

This small human—fragile and fierce and utterly, impossibly foolish—had more courage in her trembling fingers than most soldiers had in their entire bodies.

*She should be afraid of me,* he thought, watching her chin lift in defiance despite the fear he could smell on her skin. *Every survival instinct she possesses should be screaming.*

Instead, she challenged him. Questioned him. Looked at him like he was a puzzle to be solved rather than a monster to be fled.

Something ancient stirred in his chest. Something that had been sleeping for so long he\'d forgotten it existed.

*Dangerous,* that sleeping thing whispered. *She is dangerous.*

But not in any way he knew how to defend against.`,

  // Chapter 3: First meaningful conversation
  ch3_realTalk: (pName: string, liName: string) => `
"Why botany?" ${liName} asked one evening, genuine curiosity roughening his voice.

${pName} blinked, thrown by the question. No one asked why. People asked what, asked how, asked *when will you be finished?* and *is there money in that?* and *wouldn\'t medicine be more practical?*

No one asked why.

"Because plants don\'t lie," she heard herself say. "They don\'t pretend. They don\'t promise things they can\'t deliver. They just... exist. Honestly. Completely. A flower doesn\'t perform for attention. It simply is what it is."

She felt exposed by the admission. Raw. She hadn\'t meant to say so much.

${liName} was quiet for a long moment. Then: "And people lie?"

The laugh that escaped her was bitter. "People do nothing but lie. To others. To themselves. They promise forever and mean *until something better comes along*. They say *I love you* when they mean *I need you* or *I\'m afraid to be alone* or *you\'re convenient for now.*"

She\'d said too much. Way too much. She could feel the weight of her history pressing against her teeth, demanding release.

"Your mother," he said softly. Not a question.

"Yes." The word came out cracked. "And my father. And every person I\'ve ever—" She stopped. Swallowed. "Plants don\'t leave."

${liName}\'s hand found hers in the darkness. Engulfed it. Held it like something precious.

"I don\'t leave either," he said.

She wanted to believe him. She was terrified of how much she wanted to believe him.`,

  // Chapter 4: Walls cracking
  ch4_wallsCracking: (pName: string, liName: string) => `
The nightmare woke her gasping.

She was seven again, standing in her mother\'s empty closet, the note crumpling in her small fist. *You\'ll understand when you\'re older.* Twenty years later, she still didn\'t understand. Twenty years later, it still hurt like a fresh wound.

"${pName}."

His voice cut through the panic. She turned to find ${liName} at the cave entrance, massive frame silhouetted against the moonlight, uncertainty written in the set of his shoulders.

"I heard—" He stopped. Swallowed. "I can leave. If you want to be alone."

*Yes,* she should say. *Please go. I can\'t let you see me like this.*

"Stay." The word escaped before she could stop it. Small. Broken. Honest.

He crossed to her in two strides. Didn\'t touch her—as if he knew, somehow, that touch would shatter what remained of her control. Simply sat beside her, close enough that she could feel his heat, his presence, the silent offer of safety.

"You don\'t have to tell me," he said quietly. "But I\'ll listen if you want to."

So she told him. About the closet. The note. The years of wondering what she\'d done wrong, what fundamental flaw in her had driven her mother away. The wall she\'d built against ever being left again—so high, so thick, she\'d almost convinced herself it didn\'t hurt anymore.

He listened without interrupting. Without offering platitudes or solutions. Just... witnessed her pain.

When she finished, hollowed out and oddly lighter, he said: "Her leaving had nothing to do with your worth. Some people are too broken to love properly. That\'s their failure. Not yours."

Simple words. She\'d told herself the same thing a thousand times.

But hearing it from him—in that rough, certain voice—something cracked in her chest.

Not broke. Cracked. Let a little light in.`,

  // Chapter 5: First kiss build-up
  ch5_almostKiss: (pName: string, liName: string) => `
The almost-kiss haunted her for days.

She replayed it constantly—the way his eyes had darkened, the way his head had lowered, the way she\'d felt herself rising to meet him like something magnetic and inevitable. The bird that had interrupted. The way they\'d sprung apart, breathing hard, not meeting each other\'s eyes.

What would have happened if they hadn\'t been interrupted?

She knew. That was the terrifying part. She knew exactly what would have happened, and she\'d wanted it with a desperation that frightened her.

*This isn\'t me,* she tried to tell herself. *I don\'t lose control. I don\'t want things I can\'t analyze and categorize and safely file away.*

But she did want. She wanted with an intensity that made her previous understanding of the word seem laughably inadequate.

The next time she saw him, the air between them was electric. Charged. The memory of the almost-kiss hung between them like a held breath.

"We should talk about—" she started.

"Yes," he agreed, at the same moment she said "no."

They stared at each other. The tension ratcheted higher.

"I don\'t know how to do this," she admitted finally. "I don\'t have a framework. A methodology. I can\'t analyze my way through wanting you, and it\'s driving me insane."

Something flickered in his eyes. "You want me?"

"Obviously." She threw her hands up in frustration. "It\'s obvious. It\'s been obvious for weeks. I\'ve tried to ignore it, tried to explain it away, tried to convince myself it\'s just hormones and proximity and some kind of interspecies response I can document and dismiss—"

"${pName}."

"—but I can\'t dismiss it because every time I see you I forget how to breathe and when you\'re not here I\'m counting the hours until—"

"${pName}."

"—and I hate it, I hate feeling this out of control, I hate that you\'ve taken up residence in my head and I can\'t evict you—"

"*${pName}.*"

She stopped. Looked at him. Really looked.

"I want you too," he said quietly. "Every hour. Every minute. Every breath."

The admission hung between them. An offering. A surrender.

This time, when he stepped closer, nothing interrupted.`,

  // Chapter 6: After first intimacy
  ch6_afterIntimacy: (pName: string, liName: string) => `
Afterward, she waited for the regret to come.

It always came, with other people. The morning-after clarity that revealed exactly why this had been a mistake, why she never should have let her guard down, why emotions were just chemicals and connection was just neuroscience and none of it meant anything real.

She waited.

And waited.

And instead of regret, she felt... peace. A bone-deep contentment she didn\'t have a name for. ${liName}\'s arm heavy across her waist, his breath warm against her hair, his heartbeat steady beneath her ear.

*This is different,* she realized. *This has always been different.*

"I can hear you thinking." His voice was rough with sleep. "The forest is quieter than your mind."

"Sorry." She wasn\'t sorry. "I\'m cataloging."

"Cataloging?"

"The way this feels. I want to remember it. In case—" She stopped. In case it doesn\'t last. In case you leave. In case I wake up and this was all a dream.

He tightened his arm around her. "I\'m not going anywhere."

"People say that."

"I\'m not people."

She laughed despite herself. "No. No, you\'re definitely not."

"Tell me what you\'re cataloging."

She considered. "The weight of your arm. The sound of your heartbeat. The way you smell—like forests and something else I can\'t identify. The temperature differential between us. The texture of your skin." She paused. "The fact that I don\'t want to leave. I always want to leave. After. Before. During, sometimes."

"But not now?"

"Not now," she confirmed. "Now I want to stay forever, and it\'s terrifying, and I don\'t know what to do with that."

He was quiet for a long moment. Then: "You don\'t have to do anything with it. You can just... feel it. Let it exist."

"That\'s not how my brain works."

"Maybe," he said, pressing a kiss to the top of her head, "you could try anyway."

She was still trying to formulate a response when she fell asleep.

It was the first dreamless sleep she\'d had in years.`,
};

// ============================================================================
// BESTSELLER WRITING SYSTEMS - What separates amateur books from 5-star sellers
// ============================================================================

// 1. DUAL POV SYSTEM - Alternating perspectives increase reader engagement 30%+
// Readers LOVE getting inside BOTH characters' heads
const POV_SCHEDULE = {
  1: 'heroine', // Hook in her voice
  2: 'hero',    // His first impression of her
  3: 'heroine', // Growing attraction
  4: 'hero',    // His struggle to resist
  5: 'heroine', // First kiss from her POV
  6: 'hero',    // His thoughts after intimacy
  7: 'heroine', // Deepening feelings
  8: 'hero',    // His realization of love
  9: 'heroine', // The crisis hits
  10: 'hero',   // His dark moment
  11: 'heroine', // Her sacrifice/choice
  12: 'hero',   // Grand gesture POV
  13: 'heroine', // Resolution
  14: 'hero',   // Epilogue/HEA
  15: 'heroine', // Bonus epilogue
};

// 2. CHAPTER HOOKS - Every chapter MUST end with a compelling hook
// This is what creates "just one more chapter" addiction
const CHAPTER_HOOK_TYPES = {
  revelation: 'A shocking truth is revealed',
  danger: 'Physical threat appears',
  emotional: 'Heart-wrenching emotional moment',
  cliffhanger: 'Story cuts at peak tension',
  question: 'A mystery/question demands answers',
  arrival: 'Someone unexpected appears',
  confession: 'A secret is about to be revealed',
  decision: 'Character faces impossible choice',
  kiss: 'Romantic tension reaches breaking point',
  betrayal: 'Trust is shattered',
};

// Hook templates that end chapters with punch
const CHAPTER_HOOKS: Record<string, string[]> = {
  revelation: [
    'And then she saw it—the truth she\'d been too blind to notice. Everything she believed was a lie.',
    'The words hung in the air between them, detonating like a bomb she\'d never seen coming.',
    '"There\'s something I need to tell you," he said. And from the look in his eyes, she knew nothing would ever be the same.',
  ],
  danger: [
    'The sound of footsteps behind her. Heavy. Purposeful. Getting closer.',
    'She turned to run—and froze. There was no way out. They\'d been found.',
    'The growl that echoed through the darkness wasn\'t from anything she\'d ever heard before.',
  ],
  emotional: [
    'She felt something crack inside her chest. A wall she\'d spent years building, crumbling into dust.',
    'And in that moment, watching him walk away, she realized the truth she\'d been denying: she loved him. God help her, she loved him.',
    'The tears came then—hot and fast and impossible to stop. For the first time in years, she let herself break.',
  ],
  cliffhanger: [
    'His lips were inches from hers when the door burst open.',
    'She opened her mouth to say yes—and then she saw who was standing behind him.',
    '"Wait," she said. "Did you just say... mate?"',
  ],
  kiss: [
    'And then he kissed her, and the world stopped making sense.',
    'When their lips finally met, she understood why people wrote songs about this. Why they started wars over it.',
    'The kiss wasn\'t gentle. It was a claiming. A promise. A warning of everything to come.',
  ],
  confession: [
    '"I wasn\'t supposed to fall for you," he said, his voice raw. "But I did. I fell so damn hard."',
    'The three words she never thought she\'d hear—not from him, not from anyone—hung in the air between them.',
    '"I love you." The admission seemed to surprise him as much as it did her.',
  ],
};

// 3. TOUCH LADDER - Physical intimacy MUST escalate gradually
// This builds anticipation and makes payoff more satisfying
const TOUCH_LADDER = [
  { stage: 1, contact: 'accidental brush', intensity: 'electric awareness' },
  { stage: 2, contact: 'deliberate hand touch', intensity: 'lingering warmth' },
  { stage: 3, contact: 'face/hair touch', intensity: 'intimate and tender' },
  { stage: 4, contact: 'embrace/holding', intensity: 'overwhelming need' },
  { stage: 5, contact: 'almost-kiss', intensity: 'unbearable tension' },
  { stage: 6, contact: 'first kiss', intensity: 'world-shattering' },
  { stage: 7, contact: 'passionate making out', intensity: 'desperate hunger' },
  { stage: 8, contact: 'intimate touching', intensity: 'surrendering control' },
  { stage: 9, contact: 'full intimacy', intensity: 'complete claiming' },
];

// 4. INTERNAL THOUGHT BANK - Italicized thoughts readers RELATE to
// These create intimacy and often humor
const INTERNAL_THOUGHTS = {
  attraction: [
    '*This is a terrible idea.* She knew it. So why couldn\'t she stop staring at his mouth?',
    '*Down, girl.* Her hormones clearly hadn\'t gotten the memo about self-preservation.',
    '*He\'s looking at me like that again. Like I\'m something he wants to devour.*',
    '*Why did he have to smell so good? It was deeply unfair.*',
    '*Bad idea. Terrible idea. The worst idea she\'d ever had.* She stepped closer anyway.',
    '*Stop looking at his arms. Stop looking at his arms. Stop—too late.*',
    '*Breathing. Remember breathing? That thing you need to do to live?*',
    '*Just... one more look. For scientific purposes.*',
    '*He probably makes everyone feel this way. It\'s not special. It\'s just... chemistry.*',
    '*I wonder if he kisses like he fights—all in, no mercy.*',
  ],
  denial: [
    '*This isn\'t attraction. It\'s just... biology. Pheromones. Something scientific.*',
    '*I don\'t like him. I just... temporarily find him aesthetically pleasing.*',
    '*My heart is NOT racing because of him. I probably just need more cardio.*',
    '*This fluttery feeling is anxiety. Definitely anxiety. Not butterflies.*',
    '*I\'m a grown woman. I don\'t get crushes. This is professional interest.*',
    '*Temporary insanity. That\'s all this is. Altitude. Stress. Something.*',
    '*I absolutely do not care what he thinks of me. Not at all.*',
    '*The fact that I noticed his hands means nothing. I notice lots of things.*',
  ],
  conflict: [
    '*Why does doing the right thing have to hurt so much?*',
    '*She should walk away. Should run. Should protect what was left of her heart.*',
    '*Every smart decision she\'d ever made was screaming at her to stop.*',
    '*The brave choice and the wise choice had never felt so far apart.*',
    '*Her head knew the truth. Her heart refused to listen.*',
    '*This was going to hurt. The only question was when, and how badly.*',
    '*She\'d built her whole life around not needing anyone. And now...*',
    '*The worst part? She\'d do it all again. Every moment.*',
  ],
  surrender: [
    '*Screw it.* Some mistakes were worth making.',
    '*Maybe she was tired of being careful. Maybe she wanted to burn.*',
    '*If this destroyed her, at least she\'d have this moment. This man. This feeling.*',
  ],
  humor: [
    '*Note to self: giant monster men have excellent hearing. Stop talking to yourself.*',
    '*Her brain: Run! Her body: But have you SEEN him?*',
    '*She was a scientist, damn it. She was supposed to be smart about things. Apparently not about green-skinned warriors with devastating smiles.*',
  ],
};

// 5. DIALOGUE BEATS - Physical actions between dialogue create tension
// What characters DO between speaking matters as much as what they SAY
const DIALOGUE_BEATS = {
  tension: [
    'His jaw tightened.',
    'A muscle ticked in his cheek.',
    'His hands clenched at his sides.',
    'She watched him fight for control.',
    'The silence stretched, electric and dangerous.',
  ],
  attraction: [
    'His eyes dropped to her mouth.',
    'She watched his throat work as he swallowed.',
    'He stepped closer—close enough that she could feel his heat.',
    'Her breath caught.',
    'Something flickered in his eyes. Something hungry.',
  ],
  vulnerability: [
    'His voice cracked.',
    'She saw the mask slip, just for an instant.',
    'His hand trembled as it reached for her.',
    'The raw honesty in his eyes broke something inside her.',
    'He looked away, but not before she saw the pain.',
  ],
};

// ============================================================================
// MEANINGFUL LENGTH SYSTEM - Every word serves a purpose
// The secret: SEQUEL SCENES (emotional processing after action)
// ============================================================================

// 7. CHAPTER STRUCTURE - 2,500 words through purposeful scenes
// Professional romance structure: Scene → Sequel → Scene → Hook
// Scene = Goal → Conflict → Disaster (ACTION)
// Sequel = Emotion → Thought → Decision → Action (REACTION)
const CHAPTER_STRUCTURE = {
  // Each chapter has 2-3 scenes with emotional processing between them
  targetWords: 2500,
  structure: [
    { type: 'opening_hook', words: 150, purpose: 'Grab reader attention' },
    { type: 'scene_1', words: 700, purpose: 'Main action/interaction' },
    { type: 'sequel_1', words: 400, purpose: 'Emotional processing' },
    { type: 'scene_2', words: 600, purpose: 'Complication or deepening' },
    { type: 'sequel_2', words: 300, purpose: 'Internal conflict/decision' },
    { type: 'scene_3', words: 250, purpose: 'Bridge to next chapter' },
    { type: 'chapter_hook', words: 100, purpose: 'Compelling ending' },
  ],
};

// 8. SEQUEL GENERATORS - The "missing" content that makes books feel deep
// Amateur writers skip emotional processing. Bestsellers LINGER on it.
const SEQUEL_TEMPLATES = {
  // After intense moment: Emotion → Thought → Decision → Action
  afterKiss: (pName: string, liName: string, wound: string) => `
${pName}'s legs gave out. She sank onto the nearest surface—a fallen log, a rock, she didn't even register what—and pressed her fingers to her lips. They were still tingling. Still felt the ghost of his mouth on hers.

*What just happened?*

Her heart was pounding so hard she could hear it in her ears. Her hands were shaking. Her entire body felt like it had been rewired, every nerve ending suddenly aware of things she'd trained herself to ignore.

She'd kissed him. Or he'd kissed her. Did it matter? The result was the same: the careful walls she'd spent years building had crumbled like they were made of sand.

*${wound}* The old fear whispered through her mind, cold and familiar. *This is how it starts. This is how you get hurt.*

But for once, the fear felt distant. Muted. Drowned out by the memory of his hands in her hair, his growl of need against her mouth, the way he'd held her like she was something precious and fragile and absolutely essential to his survival.

No one had ever held her like that. No one had ever *wanted* her like that—with that kind of desperate, uncontrollable hunger.

*So what do I do now?*

The question hung in the air, unanswered. She could run. Could pack up her samples and her notebooks and flee back to the safety of the human world, where monsters were just stories and her heart was protected by distance and denial.

Or she could stay. Could see where this impossible thing led. Could, for once in her careful life, take a risk that had nothing to do with science and everything to do with feeling.

The choice should have been obvious. Every survival instinct she possessed screamed at her to run.

But when she thought about never seeing him again—never feeling his arms around her, never hearing that low rumble of his voice, never watching his golden eyes soften when he looked at her...

*I can't,* she realized. *I can't walk away. Not now. Maybe not ever.*

The realization should have terrified her. Instead, it felt like the first honest thing she'd admitted to herself in years.`,

  afterConflict: (pName: string, liName: string, lieTheyBelieve: string) => `
The silence after he left was deafening.

${pName} stood frozen in place, replaying every word, every expression, every moment of the argument that had just torn through her like a hurricane. Her chest ached. Her eyes burned with tears she refused to let fall.

*He doesn't understand,* she told herself. *He can't understand.*

But even as she thought it, she knew it wasn't entirely true. The problem wasn't that he didn't understand. The problem was that he understood *too well*—saw past all her defenses to the fear she'd spent her whole life hiding.

${lieTheyBelieve}

The belief had been her armor for so long she'd forgotten it was armor at all. It had just become... truth. Fact. The way the world worked.

But the look in his eyes when he'd called her on it—the mixture of frustration and tenderness and something that looked heartbreakingly like love...

*What if I'm wrong?*

The thought was terrifying. If she was wrong about this—this fundamental thing she'd built her entire worldview around—then what else was she wrong about? What other walls were built on foundations of sand?

She sank down to the ground, wrapping her arms around her knees, and let herself feel the full weight of the question.

Maybe being wrong wouldn't be the worst thing in the world.

Maybe being wrong would set her free.`,

  afterRevelation: (pName: string, truthRevealed: string) => `
The world tilted on its axis.

${pName} heard the words, processed them, understood their meaning—but some part of her brain simply refused to accept them. As if by rejecting the truth, she could make it untrue.

*${truthRevealed}*

She'd suspected. On some level, she'd known. But knowing and *knowing* were different things, and the reality of it crashed over her like a wave, leaving her gasping for air.

Everything she thought she understood—about him, about this situation, about herself—rearranged itself in her mind. Pieces she hadn't even known were missing suddenly clicked into place, forming a picture she wasn't sure she was ready to see.

"How long?" Her voice came out hoarse. "How long have you known?"

The answer, when it came, only deepened the ache in her chest.

All this time. All this time she'd been operating on incomplete information, making decisions based on half-truths and assumptions. And now...

*Now everything changes.*

She didn't know yet if it changed for better or worse. All she knew was that there was no going back. No pretending she hadn't heard. No returning to the comfortable ignorance of before.

The only way out was through.`,

  afterIntimacy: (pName: string, liName: string, heatLevel: string) => `
Afterward, they lay tangled together in the darkness, their breathing slowly returning to normal. ${pName} traced lazy patterns on his chest, marveling at the contrast—his green skin against her pale fingers, his massive frame curled protectively around her smaller one.

She should feel... something. Regret, maybe. Or fear. Or the creeping sense of vulnerability that usually followed moments of intimacy.

Instead, she felt strangely at peace.

"What are you thinking?" His voice was a low rumble against her ear, vibrating through her body in ways that made her shiver.

*That I've never felt this safe. That I've never felt this seen. That I'm absolutely terrified of how much you've come to mean to me.*

"Nothing," she lied.

His laugh was soft, knowing. "You're thinking so loud I can almost hear it."

She smiled despite herself. "Fine. I'm thinking that this was either the best decision I've ever made or the worst."

"Which one are you leaning toward?"

She tilted her head up to meet his eyes—those golden eyes that had become more familiar to her than her own reflection. "Ask me again in the morning."

"And if I ask you now?"

"Now..." She pressed a kiss to his chest, right over his heart. "Now I'm thinking I don't want to think at all. I just want to feel."

His arms tightened around her. "That," he said, "I can help with."`,
};

// 9. FLASHBACK TRIGGERS - Reveal backstory at emotional moments
// Don't info-dump. Let current events trigger memories organically.
const FLASHBACK_TEMPLATES = {
  heroineAbandonment: (pName: string, triggerMoment: string) => `
${triggerMoment}

The memory hit her without warning.

*She was seven years old, standing in the kitchen doorway in her pajamas, rubbing sleep from her eyes. The house was too quiet. Wrong-quiet. The kind of quiet that happened when something important was missing.*

*"Mommy?"*

*No answer. Her bare feet padded across cold tiles—why were the tiles cold? Mommy always had the heat on—to the bedroom door. It was open. The bed was made, which was strange because Mommy never made the bed.*

*And the closet...*

*The closet was empty.*

*Not emptied-to-clean empty. Empty-forever empty. The hangers that usually held her mother's dresses swung in some invisible breeze, clinking together like the saddest wind chimes in the world.*

*On the pillow—her mother's pillow—was a note. Three words that would define the next twenty years of her life:*

*"You'll understand someday."*

*She never did.*

${pName} wrenched herself back to the present, her breath coming in sharp gasps. Her hands were shaking. Her chest felt like someone had reached inside and squeezed.

*Not now,* she told herself fiercely. *Not here.*

But the memory lingered, a shadow behind her eyes, coloring everything with the certainty she'd carried since childhood:

Everyone leaves. Sooner or later, everyone leaves.`,

  heroTrauma: (liName: string, triggerMoment: string) => `
${triggerMoment}

The scent triggered it. That particular combination of woodsmoke and fear that dragged him back three hundred years in a single heartbeat.

*The village was burning.*

*He was twelve years old, gangly with youth, tusks barely emerged, watching his world turn to ash. The human raiders had come at dawn, when the warriors were hunting, when only the old and the young remained to defend.*

*His mother pushed him toward the hidden tunnel behind the granary. "Run," she said. "Run and don't look back."*

*"I won't leave you."*

*"You will." Her hands cupped his face—the same face he saw now in every polished surface, decades older but carrying the same shape, the same bones. "You will survive. You will grow strong. You will protect our people when I cannot."*

*"Mother—"*

*"GO!"*

*He ran. Behind him, he heard her battle cry—that fierce, defiant roar that haunted his dreams to this day. He ran until his lungs burned and his legs gave out, until the smell of smoke faded to memory.*

*He never saw her again.*

${liName} forced himself to breathe. To remember where he was. When he was.

Three hundred years. Three hundred years of fighting, of leading, of forging himself into a weapon that could never be broken.

And still, some nights, he woke up reaching for her hand.`,
};

// 10. INTERNAL CONFLICT EXPANSION - Characters argue with themselves
// This creates tension AND adds meaningful words
const INTERNAL_CONFLICT_TEMPLATES = {
  resistingAttraction: (pName: string, lieTheyBelieve: string) => `
*Stop it,* ${pName} told herself firmly. *Stop looking at him like that.*

But her eyes refused to cooperate. They traced the line of his jaw, the curve of his shoulder, the way his hands moved with such precise, controlled strength. Every part of him was designed for violence, yet he touched her like she was made of glass.

*This is a terrible idea.*

The rational part of her brain—the part that had earned three degrees and published countless papers and built a career on careful, methodical analysis—was screaming at her to step back. To maintain distance. To remember every hard lesson she'd learned about the danger of wanting things she couldn't have.

${lieTheyBelieve} The belief had been her shield for so long she'd forgotten what it was like to live without it.

*But what if...*

No. She couldn't afford "what ifs." What ifs were for people who hadn't learned better. People who still believed in happy endings and true love and all the fairytale nonsense she'd abandoned years ago.

She was a scientist. She dealt in facts, not feelings.

The fact was, getting attached would only end in pain.

The fact was, her track record with relationships could be charitably described as "catastrophic."

The fact was...

The fact was, he was looking at her right now with those golden eyes, and every carefully constructed argument in her head was dissolving like sugar in rain.

*I'm in so much trouble.*`,

  trustingAgain: (liName: string, wound: string) => `
${liName} stood at the edge of the clearing, watching her from a distance, and wrestled with the war inside his chest.

Every instinct honed over centuries of survival screamed at him to stay back. To maintain the walls he'd built between himself and... anything that might make him weak.

*${wound}*

He'd learned that lesson. Paid for it in blood and grief and years of hollow emptiness. Opening himself up—truly letting someone in—was an invitation to devastation.

And yet.

And yet this small, fierce, impossible female had somehow slipped past every defense. She hadn't stormed his walls or demanded entry. She'd simply... existed. Been herself. Been brave and stubborn and brilliant in ways that left him speechless.

*You're the chieftain,* he reminded himself. *You don't get to be weak.*

But was it weakness, wanting her? Or was it something else—something his mother had tried to tell him about before the fire took her?

*Love isn't weakness,* she used to say. *Love is the reason we fight. Without something to protect, what's the point of strength?*

He'd dismissed the words then, a child who didn't understand. Now, watching the firelight play across the face of the woman who had upended his entire existence...

Now he wondered if his mother had been trying to save him all along.

Not from the humans. Not from the fire.

From himself.`,
};

// Helper function to get word count
function getWordCount(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// 11. ADDITIONAL SEQUEL TEMPLATES - More options for meaningful expansion
const ADDITIONAL_SEQUELS = {
  processingAttraction: (pName: string, liName: string) => `
Later, alone with her thoughts, ${pName} tried to make sense of what was happening to her.

She was a rational person. She believed in evidence, in logic, in the scientific method. Feelings were just chemical reactions—dopamine, oxytocin, adrenaline. They could be analyzed. Understood. Controlled.

At least, that's what she'd always told herself.

But nothing about ${liName} fit into her neat categories. He defied every assumption she'd made about his kind. He was supposed to be a monster, yet he touched her with more gentleness than any human she'd known. He was supposed to be primitive, yet he spoke with a wisdom that made her university education feel incomplete.

And the way he looked at her...

*Stop it,* she told herself firmly. *This isn't productive.*

But her mind kept circling back to the same questions. What did he see when he looked at her? What made him keep coming back, day after day, when he had an entire clan to lead? Why did her heart race every time she heard his footsteps approaching?

And the most dangerous question of all: *What happens next?*

She didn't have answers. For someone who had built her life on finding answers, the uncertainty should have been maddening.

Instead, it felt strangely like freedom.`,

  afterFirstTouch: (pName: string, liName: string) => `
The place where his skin had touched hers still tingled, minutes—hours?—later.

${pName} kept pressing her fingers to the spot, as if she could preserve the sensation. As if his touch had left some physical mark, invisible but indelible.

*It was just a touch,* she reasoned. *People touch each other all the time. It doesn't mean anything.*

But it hadn't felt like "just a touch." It had felt like a claiming. A promise. A question she wasn't sure she was ready to answer.

What struck her most wasn't the electricity that had sparked between them—though that was notable enough—but the look in his eyes afterward. As if he'd felt it too. As if something fundamental had shifted in the universe, and neither of them could pretend it hadn't.

She thought about her life before she'd stumbled into this forest. The loneliness she'd grown so accustomed to she'd stopped noticing it. The walls she'd built so high she'd forgotten they were walls at all.

One touch from him, and those walls had started to crack.

*Is that what I want?* she asked herself. *To let the walls fall?*

The question terrified her.

The answer terrified her more.

Because somewhere, in the deepest part of her heart, she knew: the walls weren't protecting her anymore. They were imprisoning her.

And maybe—just maybe—it was time to be free.`,

  morningAfter: (pName: string, liName: string, heatLevel: string) => `
Dawn light filtered through the cave entrance, painting the stone walls in shades of gold and rose.

${pName} woke slowly, luxuriously, awareness returning in pieces: the warmth surrounding her, the steady heartbeat beneath her ear, the pleasant ache in muscles she hadn't used in far too long.

${liName}.

She was in ${liName}'s arms.

The memories of the night before flooded back—tender moments and passionate ones, whispered confessions and wordless promises. She felt heat rise to her cheeks, but it wasn't embarrassment. It was something closer to wonder.

*This is real,* she thought. *This actually happened.*

She'd half-expected to feel regret in the light of day. That cold, creeping sense of "what have I done" that had followed every previous relationship mistake.

But looking up at his sleeping face—softer now, younger, all the burden of leadership smoothed away by rest—she felt nothing but a fierce, unexpected tenderness.

*I did this,* she thought. *I made him look like this. Peaceful. Content.*

The responsibility of it should have scared her. Instead, it filled her with a warmth that had nothing to do with his body heat.

His arm tightened around her, and she realized he was awake. Those golden eyes blinked open, found her face, and softened with an expression that made her breath catch.

"Good morning," he rumbled, his voice rough with sleep.

"Good morning." She smiled, surprising herself with how easy it felt. How *right*.

"Regrets?"

The question was casual, but she heard the vulnerability underneath. Even now, after everything, he was bracing for rejection.

"None," she said firmly. "You?"

His answer was a kiss—slow and thorough and full of promise.

No regrets. Not now. Maybe not ever.`,

  confrontingFear: (pName: string, fear: string) => `
The fear came for her in the quiet moments.

When ${pName} was busy—cataloging specimens, learning new words in his language, exploring the wonders of this impossible place—she could ignore it. Could pretend it didn't exist.

But in the spaces between activity, it crept back. Cold and familiar and utterly relentless.

*${fear}*

She'd carried this fear so long it had become part of her. A weight so constant she'd stopped noticing it, like gravity or the need to breathe. It was just... there. Always. Coloring every choice, every relationship, every moment of happiness with the certainty that it wouldn't last.

*Nothing lasts,* the fear whispered. *Everyone leaves. Sooner or later, you'll be alone again.*

She knew, intellectually, that not everyone leaves. That some relationships lasted. That love could be permanent, if you were brave enough to hold onto it.

But knowing and believing were different things.

And believing—truly believing, in her bones, in her heart, in the core of who she was—that someone could choose her and keep choosing her, day after day, year after year...

That felt impossible.

*But what if it isn't?* A small voice asked. *What if the fear is lying to you? What if you're so busy protecting yourself from pain that you're missing out on joy?*

${pName} closed her eyes and let herself imagine it. A future where she wasn't alone. Where someone looked at her the way he did—with wonder and wanting and something that looked terrifyingly like forever.

The fear screamed at her to stop. To run. To protect herself before it was too late.

But for the first time in her life, she was tired of listening.

*Maybe,* she thought, *it's time to be brave.*`,
};

// 12. SENSORY EXPANSION - Rich, purposeful world-building
const SENSORY_EXPANSION = {
  forestNight: () => `
The forest came alive at night in ways daylight never revealed.

Bioluminescent mushrooms lined the path, pulsing with soft blue light that made the ancient trees look like they were breathing. Somewhere in the darkness, night birds called to each other in haunting melodies she couldn't identify. The air itself felt different—thicker, charged with something that might have been magic or might have been possibility.

She tilted her head back and watched the stars wheel overhead. They looked different here, in this place beyond the barrier. Brighter. Closer. As if the sky itself was leaning down to witness whatever was unfolding between her and the massive orc warrior at her side.

The smell of night-blooming flowers surrounded them—sweet and heady, unlike anything she'd cataloged in her years of research. She made a mental note to collect samples in the morning, then smiled at herself. Even here, even now, she couldn't stop being a scientist.

But science had never prepared her for this. For the way the moonlight painted his green skin silver. For the way his presence made her feel simultaneously safe and endangered. For the way every cell in her body seemed to lean toward him like flowers toward the sun.`,

  intimateSpace: (liName: string) => `
The cave felt smaller with him in it.

Not physically smaller—it was actually quite spacious, with high ceilings and smooth walls worn by centuries of water. But ${liName}'s presence filled every corner of it. His scent—woodsmoke and pine and something uniquely him—permeated the air until she was breathing him with every inhale. His warmth radiated toward her even from several feet away.

She was acutely aware of the furs beneath her, soft against her bare skin. Of the fire crackling between them, casting shadows that danced and leaped. Of every breath he took, every slight movement, every moment his golden eyes found hers through the flames.

The world outside this cave might as well not exist. In here, there was only the two of them, suspended in a bubble of firelight and possibility. Whatever happened next would happen here, in this intimate space carved from stone and silence.

She wasn't sure if she was ready for it.

She was absolutely sure she didn't want to stop it.`,
};

// 13. TRY/FAIL CYCLES - Characters resist attraction, fail (builds tension)
// This is CORE romance technique - each failure deepens the connection
const TRY_FAIL_CYCLES = {
  tryingToStayAway: (pName: string, liName: string) => `
${pName} told herself she would keep her distance today.

She'd spent all night convincing herself it was the smart thing to do. The *only* thing to do. Whatever was happening between her and ${liName} was dangerous—not physically, though there was that too—but emotionally. She could feel herself getting pulled deeper with every interaction, every charged glance, every accidental touch that left her skin tingling for hours afterward.

So today, she would be professional. Distant. Polite but cool.

She lasted exactly fourteen minutes.

It started when he brought her water from the spring—a gesture so simple, so thoughtful, that she felt her carefully constructed walls wobble. Then he asked about her research, and she found herself explaining photosynthesis for twenty minutes while he listened with genuine fascination, asking questions that proved he was actually paying attention.

And when their hands brushed as she accepted the water skin, and his fingers lingered just a heartbeat longer than necessary, and his golden eyes darkened with something that made her stomach flip...

*So much for distance,* she thought, already leaning closer.

She would try again tomorrow. She was sure of it.

(She was lying to herself, and she knew it.)`,

  tryingNotToTouch: (pName: string, liName: string) => `
The rules ${pName} had set for herself were simple:

No unnecessary touching. No lingering looks. No standing close enough to feel his body heat or smell that intoxicating scent of woodsmoke and wilderness that seemed to cling to him.

Simple rules. Easy to follow.

Impossible to maintain.

It started with a stumble—her foot catching on a root she should have seen. ${liName}'s hand shot out, steadying her, and the contact sent electricity sparking through her entire body. She should have pulled away immediately. Should have murmured thanks and put distance between them.

Instead, she stood frozen, hyper-aware of his palm against her arm, his fingers curved around her bicep with gentle strength. He could have crushed her with that hand. Instead, he held her like she was made of spun glass.

"Are you all right?" His voice was rough, concerned.

*No,* she thought. *I'm falling apart, and it's entirely your fault.*

"Fine," she managed. "Thank you."

She should step back now. Should remember her rules, her boundaries, all the very good reasons she'd established them in the first place.

His thumb traced a small circle on her skin—probably unconscious, probably meaningless—and her brain short-circuited.

"I should..." she started.

"You should," he agreed, but neither of them moved.

The rules, she was learning, were much easier to make than to keep.`,

  tryingToLeave: (pName: string, liName: string, wound: string) => `
This was a mistake.

${pName} knew it with absolute certainty as she packed her specimens, her notebooks, the scattered evidence of weeks spent in a place she was never supposed to be. She'd gotten what she came for—more than enough data to make her career. It was time to go.

Past time, really. Every day she stayed made leaving harder. Every moment with ${liName} wove another thread between them, binding her tighter to this impossible situation.

*${wound}* The old fear whispered through her mind. *Better to leave now, before it's too late. Before you get attached. Before losing him destroys you.*

She closed her pack with trembling fingers. Took a breath. Squared her shoulders.

She could do this. She *would* do this.

Three steps toward the edge of the clearing.

"Leaving without saying goodbye?"

His voice stopped her cold. She turned to find him leaning against a tree, arms crossed, expression carefully neutral. But his eyes—those golden eyes that she'd learned to read despite herself—told a different story.

He was hurt. He was trying to hide it. And seeing that vulnerability on his face broke something inside her.

"I..." She swallowed. "I have to go back. My research, my career..."

"I know." He pushed off the tree, moved toward her with that predator's grace she still wasn't used to. "I'm not asking you to stay forever. I'm asking you to stay until morning."

*Say no,* her survival instincts screamed. *Walk away now while you still can.*

"Just until morning?" Her voice came out smaller than she intended.

His smile was slow, devastating, victorious. "To start."

She stayed.

(She was beginning to suspect she might stay forever.)`,
};

// 14. "ALMOST" MOMENTS - Interrupted romantic moments (builds anticipation)
// The interrupted kiss is worth more than the actual kiss
const ALMOST_MOMENTS = {
  almostKiss: (pName: string, liName: string) => `
The moment stretched between them like a held breath.

${liName}'s hand had somehow found its way to her face, his palm warm against her cheek, his thumb tracing the curve of her cheekbone. ${pName} felt herself swaying toward him, her body making decisions her mind was still debating.

His eyes dropped to her mouth. Darkened. He leaned in—

A bird screamed from the canopy above them.

They sprang apart like guilty teenagers, the moment shattered. ${pName} pressed a hand to her racing heart, unable to decide if she was relieved or disappointed. Probably both. Definitely both.

"I should—" she started.

"Yes," he agreed, though he sounded like he was agreeing to his own execution. "You should."

Neither of them moved.

"That was..." She didn't know how to finish the sentence.

"A mistake we didn't make," he said quietly. "This time."

The 'this time' hung in the air between them, heavy with promise. With warning. With the absolute certainty that they were only delaying the inevitable.

${pName} nodded once, gathered her scattered composure, and retreated to a safe distance.

Her lips still tingled from a kiss that never happened.

She suspected they would tingle until it did.`,

  almostConfession: (pName: string, liName: string) => `
"There's something I need to tell you."

${liName}'s voice was strange—rough and uncertain in a way she'd never heard from him. ${pName} looked up from her specimens to find him standing at the edge of the clearing, his massive frame tense with something that looked almost like fear.

"What is it?"

He crossed to her in three long strides, dropped to his knees so they were almost eye level. This close, she could see the muscle jumping in his jaw, the way his hands clenched and unclenched at his sides.

"Among my people, when a warrior finds someone who..." He stopped. Swallowed. Started again. "There are bonds that form. Sacred bonds. The kind that cannot be broken, cannot be denied, cannot be—"

"${liName}!"

The shout came from the forest's edge. Another orc—one of his warriors—burst into the clearing, speaking rapidly in a language ${pName} couldn't understand. Whatever he said made ${liName}'s expression shift from vulnerable to stone-cold in the space of a heartbeat.

"I have to go." He rose, already transforming back into the chieftain, the war-leader, the warrior who showed no weakness. "There's trouble at the border."

"But what were you going to tell me?"

He paused at the edge of the trees. Turned back. And for just a moment, she saw past the mask to the man underneath.

"Later," he said. "When there's time. When I can do this properly."

Then he was gone, vanishing into the forest with his warrior, leaving ${pName} alone with questions she couldn't answer and a heart that wouldn't stop pounding.

*What was he going to say?*

She spent the rest of the day unable to think about anything else.`,

  almostSurrender: (pName: string, liName: string, heatLevel: string) => `
"We should stop."

${pName} heard herself say the words, felt them leave her mouth, knew they were the right thing to say. ${liName}'s hands were in her hair, his body pressed against hers, and every nerve ending she possessed was screaming for more.

"We should," he agreed, but his mouth was trailing down her neck, and his agreement sounded more like a growl than a concession.

"This is complicated." Her fingers, traitors that they were, were tracing the muscles of his back. "There are so many reasons this is a bad idea."

"Name one." His teeth grazed her collarbone.

"I... you..." Her brain had stopped functioning entirely. "Cultural differences?"

"I'll learn your ways." His hand slid lower. "And teach you mine."

"My research—"

"Can wait until morning."

"My career—"

"Will still exist tomorrow."

She was running out of objections. Running out of reasons to fight something that felt increasingly inevitable.

"${liName}..."

He pulled back just enough to meet her eyes. His were molten gold, burning with want, but also with something softer. Something that looked like a question.

"Tell me to stop," he said quietly, "and I will. Tell me you don't want this, and I'll walk away. But tell me the truth, ${pName}. Not what you think you should want. What you actually want."

The truth.

She'd been lying to herself for so long she'd almost forgotten what the truth felt like.

"I want..." She took a breath. "I want you to kiss me again."

His smile was pure sin. "As my lady commands."

The kissing led to other things.

She didn't stop any of them.`,
};

// 15. HERO VULNERABILITY - Show his inner struggle (crucial for monster romance)
const HERO_VULNERABILITY = {
  hiddenTenderness: (liName: string, pName: string) => `
${liName} watched her sleep.

It was becoming a habit—this silent vigil he kept in the hours before dawn, when the world was still and his thoughts were loudest. He told himself it was duty. Protection. Ensuring her safety while she was vulnerable.

He was lying to himself.

The truth was simpler and more terrifying: he couldn't stay away. Every moment apart from her felt like a wound that wouldn't heal. And in these quiet hours, when she was soft with sleep and he didn't have to guard his expression, he could simply... look at her. Marvel at this impossible creature who had stumbled into his life and rearranged everything he thought he knew.

*She's so small,* he thought, not for the first time. He could span her waist with his hands. Could break her with a careless movement. Yet she faced him without fear, met his eyes without flinching, challenged him in ways no one had dared in centuries.

She mumbled something in her sleep, her brow furrowing. Without thinking, he reached out and smoothed the crease with his thumb—the lightest touch, barely there.

She sighed and settled, her face smoothing back into peace.

His chest ached with something he couldn't name.

*I would burn the world for you,* he realized. *I would tear down mountains and reshape the stars. I would wage war against the gods themselves if they tried to take you from me.*

The intensity of the feeling should have frightened him. Should have sent him running to the cold streams to clear his head, as he had so many times before.

Instead, he stayed. Watching. Guarding. Loving, though he hadn't yet found the courage to say the word out loud.

Dawn would come soon. He would have to pretend again—to be the chieftain, the warrior, the leader who showed no weakness. But for now, in this quiet moment, he could simply be a man in love with a woman.

It was, he was learning, the most terrifying and wonderful thing he had ever felt.`,

  confessionAtNight: (liName: string, pName: string) => `
"Can I tell you something?"

${liName}'s voice was soft in the darkness, barely louder than the crackling fire. ${pName} turned to find him staring at the flames, his profile carved in shadow and gold.

"Of course."

He was quiet for so long she thought he might not speak. Then:

"I have killed more beings than I can count. Led armies. Conquered territories. Built an empire from blood and iron and the fear of my enemies." A pause. "I have never been afraid. Not truly. Not until you."

Her breath caught. "I frighten you?"

"Terrify me." He finally looked at her, and the vulnerability in his eyes made her heart stutter. "Not because of what you might do—but because of what losing you would do to me. I have spent three hundred years building walls around my heart. You demolished them in a matter of weeks."

"${liName}..."

"I don't know how to do this." The admission seemed to cost him everything. "I don't know how to be soft. How to love without possessing, how to protect without controlling, how to give my heart to someone without armoring it first. All I know is war. Violence. Power." His voice cracked. "I'm afraid I'll hurt you. That I'll be too much, or not enough. That you'll see the monster everyone else sees and finally run."

She crossed to him. Knelt beside him. Took his massive face in her small hands and forced him to meet her eyes.

"I see you," she said quietly. "All of you. The warrior and the leader and the man who brings me water every morning and asks about my research like it actually matters. I see the monster and the protector, the killer and the guardian. And I'm still here."

"Why?"

"Because the monster is only part of who you are. And the rest of you..." She smiled. "The rest of you is worth staying for."

His arms came around her like he was drowning and she was air. His face pressed into her hair, and she felt the shudder that ran through his massive frame.

"I don't deserve you," he whispered.

"Probably not." She held him tighter. "Good thing I'm not going anywhere."`,
};

// 16. PHYSICAL AWARENESS - Noticing each other in mundane moments
// This creates simmering tension throughout non-romantic scenes
const PHYSICAL_AWARENESS = {
  watchingHimWork: (pName: string, liName: string) => `
${pName} was supposed to be cataloging specimens.

Instead, she was watching ${liName} repair a hunting trap, completely unable to look away.

There was nothing inherently romantic about the task. He was simply fixing a broken mechanism, his massive hands moving with surprising dexterity over the wooden frame. But she found herself transfixed by the play of muscles beneath his green skin. The way his forearms flexed with each movement. The concentration on his face that softened his usually fierce features into something almost approachable.

*This is ridiculous,* she told herself firmly. *He's fixing a trap. It's not attractive.*

(It was extremely attractive. She was losing her mind.)

He reached up to wipe sweat from his brow, and his tunic pulled tight across his chest, outlining every ridge of muscle she was absolutely not supposed to be noticing. Her mouth went dry.

"You're staring."

She jumped, heat flooding her face. "I was observing your technique. For... research purposes."

His lips twitched. "Research purposes."

"The manual dexterity of your species is fascinating." She was babbling now, but couldn't seem to stop. "The contrast between gross motor capabilities and fine motor control is actually quite remarkable from an anthropological perspective—"

"${pName}."

"Yes?"

"Your notebook is upside down."

She looked down. It was, in fact, upside down. She had been "writing" gibberish for the past ten minutes.

"I was testing a new organizational system," she said weakly.

His laugh was low and warm and did absolutely nothing to help her composure.

She was in so much trouble.`,

  awareOfHerPresence: (liName: string, pName: string) => `
${liName} was having trouble concentrating.

This was unprecedented. He had led armies into battle, negotiated treaties with enemies who wanted him dead, maintained perfect composure through assassination attempts and political betrayals. His focus was legendary.

But put ${pName} within fifty feet of him, and his legendary focus crumbled like wet sand.

He was supposed to be reviewing supply reports with his second-in-command. Instead, his attention kept drifting to the small human across the clearing, bent over her specimens with that look of intense concentration that did something strange to his chest.

"...and the hunting parties report increased game in the northern valleys, which suggests—${liName}? ${liName}, are you listening?"

"Hmm?" He dragged his gaze back to find his second staring at him with barely concealed amusement. "The northern valleys. Yes."

"I said the northern valleys have been invaded by hostile forces and we should all flee immediately."

"An excellent plan," ${liName} said absently, his attention already sliding back to ${pName}. She was pushing her hair behind her ear—that little gesture she made when she was excited about a discovery. He wondered what she'd found. Wondered if she would tell him about it later, her eyes bright with enthusiasm, her hands moving as she explained things he only half understood.

His second sighed. "You're hopeless."

"I am your chieftain," ${liName} reminded him, though without much heat. "Show some respect."

"My chieftain has been making calf-eyes at a human female for the past month. I'll show respect when he shows sense."

${liName} didn't argue. He didn't have a leg to stand on.

Instead, he went back to his reports—and tried very, very hard not to notice when ${pName} stretched her arms above her head, her shirt riding up to reveal a strip of pale skin.

He failed completely.`,
};

// ============================================================================
// ESCALATING EXPANSION SYSTEM - No repetition, each beat builds on the last
// ============================================================================

// Chapter intensity mapping - what level of content is appropriate
const CHAPTER_INTENSITY = {
  1: 'awareness',    // Noticing each other
  2: 'curiosity',    // Growing interest
  3: 'tension',      // Fighting attraction
  4: 'cracking',     // Walls starting to fall
  5: 'connection',   // Emotional intimacy
  6: 'surrender',    // Giving in
  7: 'deepening',    // Growing love
  8: 'crisis',       // The black moment
  9: 'fighting',     // Fighting for love
  10: 'resolution',  // HEA
};

// ESCALATING INTERNAL THOUGHTS - Each chapter's thoughts are MORE intense
const ESCALATING_THOUGHTS = {
  awareness: (pName: string, liName: string) => `
*Don't stare,* ${pName} reminded herself. *It's rude to stare.*

But she couldn't seem to help it. There was something about the way ${liName} moved—that contained power, that predatory grace—that made it impossible to look away. It was purely scientific interest, she told herself. Anthropological observation. Nothing more.

The flutter in her stomach disagreed.`,

  curiosity: (pName: string, liName: string) => `
${pName} found herself cataloging things about ${liName} that had nothing to do with her research.

The way his voice dropped when he said her name. The almost-smile that sometimes flickered at the corner of his mouth. The careful way he moved around her, as if constantly calculating how not to frighten her away.

*Stop it,* she told herself firmly. *He's a subject of study. Nothing more.*

But her heart wasn't listening to her head anymore.`,

  tension: (pName: string, liName: string) => `
The tension was becoming unbearable.

Every conversation felt charged with things unsaid. Every accidental touch left ${pName} shaken for hours afterward. Every time their eyes met, she forgot how to breathe.

*This is just biology,* she tried to convince herself. *Pheromones. Evolution. Something scientific that can be explained and controlled.*

But when ${liName} looked at her like that—like she was the only thing in the world worth seeing—all her scientific explanations crumbled to dust.

She was in trouble. Deep, dangerous, intoxicating trouble.`,

  cracking: (pName: string, liName: string, wound: string) => `
Something was changing inside her, and ${pName} wasn't sure she could stop it.

The walls she'd built so carefully—brick by brick, year by year, hurt by hurt—were developing cracks. Not obvious ones. Just hairline fractures that let a little light through. A little hope. A little of ${liName}'s warmth seeping into spaces that had been cold for so long.

*${wound}* The old fear whispered. *This is how it starts. This is how you get destroyed.*

But for the first time in her life, the fear felt quieter than the wanting.`,

  surrender: (pName: string, liName: string) => `
${pName} was done fighting.

The realization came quietly, without fanfare or drama. One moment she was trying to convince herself that this was a terrible idea, and the next... she simply stopped.

Maybe it was a terrible idea. Maybe she would regret it. Maybe everything would fall apart and leave her more broken than before.

But looking at ${liName}—really looking, with all her defenses down—she knew one thing with absolute certainty: not trying would be worse. Wondering "what if" for the rest of her life would be worse.

She was terrified. But she was done letting fear make her decisions.`,
};

// ESCALATING PHYSICAL MOMENTS - Touch ladder that builds chapter to chapter
const ESCALATING_TOUCH = {
  awareness: (pName: string, liName: string) => `
Their fingers brushed as he handed her the water skin.

It was nothing—the briefest contact, over in a heartbeat. But ${pName} felt it like a brand, heat spreading from the point of contact up her arm and into her chest. Her breath caught.

${liName} went very still. His golden eyes found hers, and for a moment, neither of them moved.

Then the moment passed, and they both pretended it hadn't happened.

But ${pName} noticed that he was more careful after that. More deliberate about the space between them. As if he, too, had felt the electricity—and wasn't sure what to do about it.`,

  curiosity: (pName: string, liName: string) => `
"You have something in your hair."

Before ${pName} could react, ${liName}'s hand was there, his fingers brushing against her temple as he removed a small leaf. The touch was gentle—impossibly gentle for hands that had killed countless enemies.

She should have stepped back. Should have put distance between them.

Instead, she stayed perfectly still, watching his face as he examined the leaf with exaggerated care, as if it were the most fascinating botanical specimen he'd ever encountered.

"There," he said finally, his voice rougher than usual. "All clear."

"Thank you." Her own voice came out barely above a whisper.

Neither of them mentioned that his hand had lingered longer than strictly necessary. Or that she'd leaned into the touch rather than away from it.`,

  tension: (pName: string, liName: string) => `
${pName} stumbled on a root, and suddenly ${liName} was there—his hands catching her waist, steadying her, pulling her against the solid wall of his chest.

For three thundering heartbeats, she couldn't think. Couldn't breathe. Could only feel: his warmth surrounding her, his scent filling her lungs, his fingers splayed across her back with careful, devastating precision.

"I—" she started.

"Careful." His voice was a rumble against her ear. "The forest is treacherous for those not accustomed to its paths."

*It's not the forest that's treacherous,* she thought wildly. *It's you. It's this. It's the way I want to sink into you and never come up for air.*

"Thank you," she managed, and forced herself to step away.

The loss of his warmth felt like losing sunlight.`,

  cracking: (pName: string, liName: string) => `
They were arguing about something stupid—she couldn't even remember what—when ${liName} grabbed her arm.

Not roughly. Never roughly. But firmly enough to stop her mid-sentence, to make her face him, to force her to meet those molten gold eyes.

"Do you have any idea," he said, his voice low and dangerous, "how maddening you are?"

"I'm maddening? You're the one who—"

"Who can't stop thinking about you?" His grip gentled, his thumb tracing circles on her skin. "Who lies awake at night wondering what it would be like to hold you properly? Who has to remind himself every moment of every day not to touch you, because once I start, I'm not sure I could stop?"

${pName}'s anger evaporated, replaced by something far more terrifying.

"${liName}..."

"I know," he said roughly. "I know you don't want this. I know all the reasons it's impossible. But I am going mad, ${pName}, and I need you to know it."

She should have said something sensible. Something that would restore distance between them.

Instead, she stepped closer.`,

  surrender: (pName: string, liName: string) => `
"I don't want to fight this anymore."

The words fell from ${pName}'s lips before she could stop them, and the effect on ${liName} was immediate. His whole body went taut, his eyes darkening with an intensity that should have frightened her.

"Say that again," he said hoarsely.

"I'm tired of pretending." She reached up, her hand trembling slightly as she placed it against his chest. His heart was pounding—faster than she'd expected. "I'm tired of lying to myself. I'm tired of being afraid."

"${pName}." Her name on his lips was a prayer and a warning. "If you touch me like that, I won't be able to—"

"Then don't." She rose on her tiptoes, bringing her face closer to his. "Don't be able to. I don't want you to be able to. I want..."

"What?" The word was barely a breath. "What do you want?"

"You," she whispered. "Just you."

The sound he made was inhuman—a growl of need that reverberated through her very bones. And when his arms came around her, when his mouth finally found hers, ${pName} understood what all the poets and songwriters had been trying to describe.

This was worth everything. Every risk. Every fear. Every wall she'd had to tear down.

This was *everything*.`,
};

// Helper to expand chapter to target words with meaningful content
// Now with: escalation, no repetition, chapter awareness
function expandChapterMeaningfully(
  baseContent: string,
  targetWords: number,
  pName: string,
  liName: string,
  pWound: string,
  liWound: string,
  pLie: string,
  liLie: string,
  heatLevel: string,
  chapterNumber: number = 1
): string {
  let content = baseContent;
  let currentWords = getWordCount(content);
  
  // If we're already at or above 95% of target, return as-is
  if (currentWords >= targetWords * 0.95) {
    return content;
  }
  
  // Get chapter intensity level for appropriate content selection
  const intensity = CHAPTER_INTENSITY[chapterNumber as keyof typeof CHAPTER_INTENSITY] || 'tension';
  
  // Track what content patterns already exist to avoid repetition
  const contentLower = content.toLowerCase();
  const hasTouch = contentLower.includes('touch') || contentLower.includes('hand on') || contentLower.includes('fingers brushed');
  const hasKiss = contentLower.includes('kiss') || contentLower.includes('his lips');
  const hasInternalThought = (content.match(/\*[^*]+\*/g) || []).length > 2;
  const hasFlashback = contentLower.includes('years old') || contentLower.includes('she was seven');
  const hasHeroVuln = contentLower.includes('watched her sleep') || contentLower.includes('afraid of losing');
  
  // Helper to insert content at a natural break point
  const insertAtBreak = (newContent: string, position: number = 0.6) => {
    if (content.includes('***')) {
      const parts = content.split('***');
      const insertIndex = Math.min(Math.floor(parts.length * position), parts.length - 1);
      parts.splice(insertIndex, 0, '\n\n' + newContent + '\n');
      content = parts.join('***');
    } else {
      const paragraphs = content.split('\n\n');
      const insertPoint = Math.floor(paragraphs.length * position);
      paragraphs.splice(insertPoint, 0, newContent);
      content = paragraphs.join('\n\n');
    }
    currentWords = getWordCount(content);
  };
  
  // EXPANSION 1: Add escalating internal thoughts (if not too many already)
  if (!hasInternalThought && currentWords < targetWords * 0.65) {
    const thoughtContent = ESCALATING_THOUGHTS[intensity as keyof typeof ESCALATING_THOUGHTS];
    if (thoughtContent) {
      // Handle functions that may take 2 or 3 arguments
      const content_str = intensity === 'cracking' && thoughtContent.length === 3
        ? (thoughtContent as (p: string, l: string, w: string) => string)(pName, liName, pWound)
        : (thoughtContent as (p: string, l: string) => string)(pName, liName);
      insertAtBreak(content_str, 0.4);
    }
  }
  
  // EXPANSION 2: Add escalating physical moment
  if (!hasTouch && currentWords < targetWords * 0.75) {
    const touchContent = ESCALATING_TOUCH[intensity as keyof typeof ESCALATING_TOUCH];
    if (touchContent) {
      insertAtBreak(touchContent(pName, liName), 0.55);
    }
  }
  
  // EXPANSION 3: Add chapter-appropriate expansion
  if (currentWords < targetWords * 0.82) {
    switch (intensity) {
      case 'awareness':
      case 'curiosity':
        insertAtBreak(SENSORY_EXPANSION.forestNight(), 0.3);
        break;
        
      case 'tension':
      case 'cracking':
        if (!hasFlashback) {
          insertAtBreak(INTERNAL_CONFLICT_TEMPLATES.resistingAttraction(pName, pLie), 0.5);
        }
        break;
        
      case 'connection':
      case 'surrender':
      case 'deepening':
        if (!hasHeroVuln) {
          insertAtBreak(HERO_VULNERABILITY.confessionAtNight(liName, pName), 0.6);
        }
        break;
        
      case 'crisis':
      case 'fighting':
      case 'resolution':
        if (!hasFlashback) {
          insertAtBreak(ADDITIONAL_SEQUELS.confrontingFear(pName, pWound), 0.5);
        }
        break;
    }
  }
  
  // EXPANSION 4: If still short, add processing/sequel scene
  if (currentWords < targetWords * 0.88) {
    insertAtBreak(ADDITIONAL_SEQUELS.processingAttraction(pName, liName), 0.7);
  }
  
  // EXPANSION 5: If STILL short, add try/fail cycle appropriate to intensity
  if (currentWords < targetWords * 0.93) {
    if (intensity === 'awareness' || intensity === 'curiosity' || intensity === 'tension') {
      insertAtBreak(TRY_FAIL_CYCLES.tryingToStayAway(pName, liName), 0.35);
    } else {
      insertAtBreak(TRY_FAIL_CYCLES.tryingNotToTouch(pName, liName), 0.45);
    }
  }
  
  // FINAL POLISH: Remove any duplicate phrases that might have been created
  content = removeDuplicatePhrases(content);
  
  return content;
}

// Helper to remove duplicate phrases/sentences
function removeDuplicatePhrases(content: string): string {
  const paragraphs = content.split('\n\n');
  const seen = new Map<string, string>(); // normalized -> original
  const uniqueParagraphs: string[] = [];
  
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    
    // Create multiple normalized versions for comparison
    const normalized = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, '').substring(0, 120);
    const firstWords = trimmed.split(/\s+/).slice(0, 10).join(' ').toLowerCase();
    
    // Check for any dialogue that might be repeated
    const dialogues = trimmed.match(/"[^"]{20,}"/g) || [];
    let hasRepeatedDialogue = false;
    for (const dialogue of dialogues) {
      const normDialogue = dialogue.toLowerCase();
      if (seen.has(normDialogue)) {
        hasRepeatedDialogue = true;
        break;
      }
    }
    
    // Skip if we've seen very similar content
    if (normalized.length > 30 && seen.has(normalized)) {
      continue;
    }
    
    // Skip if first words are identical
    if (firstWords.length > 20 && seen.has(firstWords)) {
      continue;
    }
    
    // Skip if dialogue is repeated
    if (hasRepeatedDialogue) {
      continue;
    }
    
    // Track this content
    seen.set(normalized, trimmed);
    seen.set(firstWords, trimmed);
    for (const dialogue of dialogues) {
      seen.set(dialogue.toLowerCase(), trimmed);
    }
    
    uniqueParagraphs.push(para);
  }
  
  return uniqueParagraphs.join('\n\n');
}

// ============================================================================
// GOD-TIER ENHANCEMENT - Add literary depth that elevates content
// CAREFUL: Only add content, never break existing sentences
// ============================================================================

function enhanceWithGodTier(
  content: string,
  pName: string,
  liName: string,
  chapterNumber: number,
  pov: 'heroine' | 'hero'
): string {
  // Don't enhance if content is already long enough - focus on quality
  if (getWordCount(content) > 2200) {
    return content;
  }
  
  let enhanced = content;
  const getRandomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
  // Track what we've added to avoid duplication
  const addedContent = new Set<string>();
  
  // Helper to safely add content at paragraph breaks (not mid-sentence)
  const addAtParagraphBreak = (newContent: string, position: number = 0.5): boolean => {
    // Check if similar content already exists
    const normalizedNew = newContent.toLowerCase().substring(0, 50);
    if (addedContent.has(normalizedNew) || enhanced.toLowerCase().includes(normalizedNew)) {
      return false;
    }
    
    const paragraphs = enhanced.split('\n\n');
    const insertIndex = Math.floor(paragraphs.length * position);
    paragraphs.splice(insertIndex, 0, newContent);
    enhanced = paragraphs.join('\n\n');
    addedContent.add(normalizedNew);
    return true;
  };
  
  // ====== ENHANCEMENT 1: Add ONE emotional layer (at specific point) ======
  if (chapterNumber <= 3 && !enhanced.includes('The urge to run')) {
    const emotionalLayer = getRandomFrom(EMOTIONAL_LAYERS.attraction);
    addAtParagraphBreak(emotionalLayer, 0.6);
  }
  
  // ====== ENHANCEMENT 2: Add ONE character voice thought ======
  if (pov === 'heroine' && !enhanced.includes('cataloged the sensation')) {
    const thought = getRandomFrom(HEROINE_VOICE.thoughtPatterns);
    // Only add if it doesn't duplicate
    if (!enhanced.toLowerCase().includes(thought.toLowerCase().substring(0, 30))) {
      addAtParagraphBreak(thought, 0.4);
    }
  }
  
  // ====== ENHANCEMENT 3: Add physical tell (as a complete sentence) ======
  if (pov === 'heroine' && Math.random() > 0.7) {
    const physical = getRandomFrom(HEROINE_VOICE.physicalTells);
    const completeSentence = `She found herself ${physical}.`;
    if (!enhanced.includes(physical)) {
      addAtParagraphBreak(completeSentence, 0.5);
    }
  }
  
  return enhanced;
}

// Chapter-specific unique scenes that can ONLY appear in that chapter
function getUniqueChapterScene(
  chapterNumber: number,
  pName: string,
  liName: string,
  pov: 'heroine' | 'hero'
): string {
  switch (chapterNumber) {
    case 1:
      return UNIQUE_CHAPTER_CONTENT.ch1_firstSight(pName, liName);
    case 2:
      return UNIQUE_CHAPTER_CONTENT.ch2_heroPOV(pName, liName);
    case 3:
      return UNIQUE_CHAPTER_CONTENT.ch3_realTalk(pName, liName);
    case 4:
      return UNIQUE_CHAPTER_CONTENT.ch4_wallsCracking(pName, liName);
    case 5:
      return UNIQUE_CHAPTER_CONTENT.ch5_almostKiss(pName, liName);
    case 6:
      return UNIQUE_CHAPTER_CONTENT.ch6_afterIntimacy(pName, liName);
    default:
      // For later chapters, generate dynamic content based on intensity
      return generateDynamicUniqueScene(chapterNumber, pName, liName, pov);
  }
}

// Generate unique content for later chapters
function generateDynamicUniqueScene(
  chapterNumber: number,
  pName: string,
  liName: string,
  pov: 'heroine' | 'hero'
): string {
  // Chapter 7-8: Crisis building
  if (chapterNumber === 7 || chapterNumber === 8) {
    return `
The words came before she could stop them.

"I need to tell you something." ${pName}'s voice cracked. "About why I'm really here. About what I haven't told you."

${liName}'s expression shifted—not angry, not yet, but bracing. As if he'd been waiting for this. As if he'd known all along that something was hiding beneath the surface.

"Before you say anything," he said quietly, "know that whatever it is, it won't change how I feel."

"You can't know that."

"I know *you*." He stepped closer, cupped her face in his massive hands with devastating gentleness. "I've known you from the first moment—the real you, underneath all your defenses. Whatever truth you're about to tell me, it's been a part of you all along. And I chose you. All of you."

The tears came then. Hot and fast and impossible to stop.

"My research wasn't sanctioned," she heard herself admit. "The university didn't send me. My funding ran out months ago. I'm... I'm here because I had nothing left. No career. No future. No reason to stay on the other side of the barrier except a life that felt like slow suffocation."

She waited for the disappointment. The betrayal. The withdrawal of everything he'd offered her.

Instead, he pulled her closer. Held her while she shattered.

"You came here looking for something worth living for," he said against her hair. "Did you find it?"

She couldn't answer. Couldn't put into words what she'd found in his arms, in this impossible place, in the golden eyes of a monster who saw her more clearly than anyone ever had.

But her hands clutched at his back, and her body pressed into his, and her silence was its own kind of confession.`;
  }
  
  // Chapter 9: Black moment
  if (chapterNumber === 9) {
    return `
He was gone when she woke.

Not just from the cave—from the entire territory. The warriors who remained wouldn't meet her eyes, wouldn't answer her questions, would only say that the chieftain had *business* to attend to and she should stay where it was safe.

Safe. As if anywhere was safe without him. As if she'd ever be safe again, now that she knew what it felt like to wake up alone after falling asleep in his arms.

*He left,* the old wound whispered. *They always leave. You knew this would happen. You should never have—*

"He'll be back."

${pName} spun to find an elderly orc woman standing at the cave entrance, her weathered face full of something that might have been understanding.

"How do you know?"

"Because I saw his face when he looked at you." The woman moved closer, her movements slow but certain. "I've lived long enough to recognize that look. The chieftain has fought many battles, child. But he has never looked at anything the way he looks at you."

"Then why did he leave without telling me? Without saying goodbye?"

"Because the threat he faces is one he doesn't believe you should have to share." The woman's eyes darkened. "There are things in this world worse than separation, child. And ${liName} will face all of them before he lets any harm come to you."

*He's protecting me,* ${pName} realized. *He left to protect me.*

The knowledge didn't ease the ache in her chest. If anything, it made it worse.

Because she didn't want to be protected. She wanted to be with him. Whatever came, whatever they faced—she wanted to face it together.

And she was done waiting for him to decide that for her.

"Where did he go?" she asked.

The old woman smiled—slow and knowing and full of approval. "I thought you might ask that."`;
  }
  
  // Chapter 10: Resolution
  if (chapterNumber === 10) {
    return `
She found him at the edge of the battlefield.

Not fighting—it was over, the enemies scattered or fallen—but standing among the carnage with his shoulders bowed in a way she'd never seen. As if the weight of three centuries had finally become too much to bear.

"${liName}."

He turned. And the look on his face—raw, desperate, terrified and hopeful all at once—made her forget every angry word she'd rehearsed on the journey here.

"You shouldn't be here." His voice was hoarse. "You shouldn't have come."

"You left without saying goodbye."

"I was trying to protect you."

"I know." She stepped closer, over bodies and broken weapons, through the aftermath of violence she could barely comprehend. "I also know that I didn't ask for that. I didn't ask to be left behind. I asked to be with you."

"${pName}—"

"No." She was close enough to touch him now, close enough to see the fear in his golden eyes. "You don't get to decide what I can handle. You don't get to leave me *for my own good* and expect me to accept it. If we're doing this—if *this*"—she gestured between them—"is what I think it is, then we face things *together*. Even the terrifying things. *Especially* the terrifying things."

His composure cracked. A breath that might have been a sob escaped his lips, and then she was in his arms, and he was shaking, and she understood suddenly that the mighty chieftain was just as scared as she was.

Just as vulnerable. Just as desperate not to lose this impossible, miraculous thing between them.

"I thought I'd lost you," he whispered against her hair. "The entire battle, all I could think was—what if I never see her again? What if she goes back to her world and forgets me?"

"Forget you?" She pulled back to look at him. "I crossed a dimensional barrier, trekked through enemy territory, and walked onto an active battlefield for you. Does that seem like someone who's going to *forget*?"

The laugh that escaped him was wet and broken and absolutely beautiful.

"I love you," she said, the words finally free. "I love you, and I'm not going anywhere, and you're going to have to get used to having someone who fights *with* you instead of waiting to be saved."

"I love you too." He pressed his forehead to hers. "I have loved you since the moment you argued with me instead of fleeing. I will love you until the stars burn out. And if you're determined to fight beside me—" His voice strengthened. "Then I will spend every moment earning that honor."

Around them, the battlefield fell silent. Warriors stopped to watch—human and orc alike—as their chieftain dropped to his knees before a small, fierce botanist and pledged himself to her in words that transcended language.

It was, ${pName} thought, the most absurd and romantic thing that had ever happened in the history of interdimensional research.

She was going to write the hell out of that paper.`;
  }
  
  return '';
}

// ============================================================================
// CONTENT VALIDATION SYSTEM - Architectural safeguards against repetition
// ============================================================================

// FORBIDDEN_PATTERNS: Issues that should NEVER appear in output
// These are fixed automatically by the validation system
const FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; fix: string }> = [
  // Broken ellipses creating sentence fragments
  { pattern: /worthy of\.\s*Something/gi, fix: 'worthy of something' },
  { pattern: /I will\.\s*Ensure/gi, fix: 'I will ensure' },
  { pattern: /Consider it\.\s*A gift/gi, fix: 'Consider it a gift' },
  { pattern: /simply\.\s*Stopped/gi, fix: 'simply stopped' },
  { pattern: /\.\s+Something\.\s+Someone\./gi, fix: 'something—someone.' },
  
  // Grammar errors from template substitution (present tense where past needed)
  { pattern: /She pushing/g, fix: 'She pushed' },
  { pattern: /He pushing/g, fix: 'He pushed' },
  { pattern: /She looking/g, fix: 'She looked' },
  { pattern: /He looking/g, fix: 'He looked' },
  { pattern: /She goes completely/g, fix: 'She went completely' },
  { pattern: /He goes completely/g, fix: 'He went completely' },
  
  // Broken sensory replacements (from unsafe find/replace)
  { pattern: /the way his accent thickened when he said her name (was|held|dropped)/gi, fix: 'His voice $1' },
  
  // Double/malformed punctuation
  { pattern: /\. \./g, fix: '.' },
  { pattern: /\.{4,}/g, fix: '...' },
  { pattern: /!{2,}/g, fix: '!' },
  { pattern: /\?{2,}/g, fix: '?' },
  { pattern: /\.,/g, fix: ',' },
  { pattern: /,\./g, fix: '.' },
  
  // Broken emotional insertions
  { pattern: /looked at her \. \*Stop it/g, fix: 'looked at her.\n\n*Stop it' },
];

// DUPLICATE_INDICATORS: Phrases that indicate content duplication
// If seen twice in same chapter, second occurrence is removed
const DUPLICATE_INDICATORS = [
  // Physical descriptions
  'seven feet of green-skinned muscle',
  'tusks curved up from a jaw that could crush stone',
  'tribal tattoos covered every visible inch',
  'He was *enormous*',
  'golden eyes that had begun to haunt',
  'heat radiating from his massive form',
  
  // World-building
  'the forest breathing around',
  'barrier between the human lands and monster territory',
  'thousand years, kept strong by magic',
  
  // Internal monologue patterns (prevents repetitive thoughts)
  'three hundred years of discipline',
  'cataloged the sensation automatically',
  'the logical part of her brain',
  'the beast inside him',
  'she didn\'t want to fight. And she definitely didn\'t want to flee',
  'walked through them like they were made of morning mist',
  'she is not yours',
  'analyze this later',
  'built walls around his heart',
  
  // Sensory repetition
  'felt it in her bones',
  'woodsmoke and pine',
  'something wild, something male',
];

// Create fingerprint for paragraph deduplication
function createFingerprint(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 80);
}

// Master validation function - called on ALL generated content
function validateAndSanitizeContent(content: string): string {
  let result = content;
  
  // PHASE 1: Apply all forbidden pattern fixes
  for (const { pattern, fix } of FORBIDDEN_PATTERNS) {
    result = result.replace(pattern, fix);
  }
  
  // PHASE 2: Protect ellipses before paragraph processing
  result = result.replace(/\.\.\./g, '…');
  
  // PHASE 3: Remove duplicate paragraphs using fingerprints and indicators
  const paragraphs = result.split('\n\n');
  const seenFingerprints = new Set<string>();
  const seenIndicators = new Set<string>();
  const cleanParagraphs: string[] = [];
  
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    
    // Check fingerprint for near-duplicate paragraphs
    const fingerprint = createFingerprint(trimmed);
    if (fingerprint.length > 40 && seenFingerprints.has(fingerprint)) {
      continue; // Skip duplicate paragraph
    }
    
    // Check for duplicate indicator phrases
    let skipParagraph = false;
    const lowerPara = trimmed.toLowerCase();
    for (const indicator of DUPLICATE_INDICATORS) {
      if (lowerPara.includes(indicator.toLowerCase())) {
        if (seenIndicators.has(indicator)) {
          skipParagraph = true;
          break;
        }
        seenIndicators.add(indicator);
      }
    }
    
    if (skipParagraph) continue;
    
    seenFingerprints.add(fingerprint);
    cleanParagraphs.push(para);
  }
  
  result = cleanParagraphs.join('\n\n');
  
  // PHASE 4: Restore ellipses
  result = result.replace(/…/g, '...');
  
  // PHASE 5: Final cleanup
  result = result.replace(/\n{4,}/g, '\n\n\n');
  result = result.replace(/  +/g, ' ');
  
  return result.trim();
}

// ============================================================================
// TECHNICAL POLISH - Additional cleanup (calls validateAndSanitizeContent first)
// ============================================================================

function polishContent(content: string, pName: string, liName: string): string {
  // Run the architectural validation first
  let polished = validateAndSanitizeContent(content);
  
  // ====== PHASE 1: Fix capitalization issues ======
  
  // Fix random mid-sentence capitalization ("She Pushes" → "She pushes")
  const midSentenceCapitals = [
    'Pushes', 'Pulls', 'Goes', 'Comes', 'Takes', 'Makes', 'Looks', 'Feels',
    'Walks', 'Runs', 'Stands', 'Sits', 'Says', 'Asks', 'Tells', 'Shows',
    'Moves', 'Turns', 'Steps', 'Reaches', 'Touches', 'Holds', 'Watches',
    'Pushing', 'Looking', 'Walking', 'Standing'
  ];
  for (const word of midSentenceCapitals) {
    const pattern = new RegExp(`([a-z]) ${word}\\b`, 'g');
    polished = polished.replace(pattern, `$1 ${word.toLowerCase()}`);
  }
  
  // Fix lowercase sentence starts after periods
  polished = polished.replace(/\. ([a-z])/g, (match, letter) => `. ${letter.toUpperCase()}`);
  
  // Fix lowercase starts after newlines (but not for fragments)
  polished = polished.replace(/\n([a-z][a-z]{3,})/g, (match, word) => `\n${word.charAt(0).toUpperCase()}${word.slice(1)}`);
  
  // ====== PHASE 2: Fix punctuation issues ======
  
  // Fix double periods
  polished = polished.replace(/\.{2,}/g, '.');
  
  // Fix period-comma combinations
  polished = polished.replace(/\.,/g, ',');
  polished = polished.replace(/,\./g, '.');
  
  // Fix multiple exclamation/question marks
  polished = polished.replace(/!{2,}/g, '!');
  polished = polished.replace(/\?{2,}/g, '?');
  
  // Fix space before punctuation
  polished = polished.replace(/ +([.,!?;:])/g, '$1');
  
  // Ensure space after punctuation (except in abbreviations)
  polished = polished.replace(/([.,!?;:])([A-Za-z])/g, '$1 $2');
  
  // ====== PHASE 3: Remove duplicate content ======
  
  // Split into paragraphs for analysis
  const paragraphs = polished.split('\n\n');
  const cleanedParagraphs: string[] = [];
  const seenContent = new Map<string, number>(); // Track normalized content and its index
  
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const trimmed = para.trim();
    if (!trimmed) continue;
    
    // Create multiple fingerprints for detection
    const fullNormalized = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 150);
    const startNormalized = trimmed.toLowerCase().substring(0, 80);
    const dialogueMatch = trimmed.match(/"([^"]{20,})"/)?.[1]?.toLowerCase();
    
    // Check for duplicate content
    let isDuplicate = false;
    
    // Check full content similarity
    if (fullNormalized.length > 50 && seenContent.has(fullNormalized)) {
      isDuplicate = true;
    }
    
    // Check start similarity
    if (startNormalized.length > 40 && seenContent.has(startNormalized)) {
      isDuplicate = true;
    }
    
    // Check dialogue similarity
    if (dialogueMatch && dialogueMatch.length > 30 && seenContent.has(dialogueMatch)) {
      isDuplicate = true;
    }
    
    if (!isDuplicate) {
      cleanedParagraphs.push(para);
      if (fullNormalized.length > 50) seenContent.set(fullNormalized, i);
      if (startNormalized.length > 40) seenContent.set(startNormalized, i);
      if (dialogueMatch) seenContent.set(dialogueMatch, i);
    }
  }
  polished = cleanedParagraphs.join('\n\n');
  
  // ====== PHASE 4: Fix specific repetitive patterns ======
  
  const repetitivePatterns = [
    // Same dialogue appearing twice
    /(\"[^\"]{30,}\")\s*[^\"]*?\1/gi,
    // Same action described twice  
    /(took another step closer[^.]+\.)\s*[^.]{0,100}took another step closer/gi,
    /(his scent surrounded her[^.]+\.)\s*[^.]{0,100}his scent surrounded/gi,
    /(heat radiating from[^.]+\.)\s*[^.]{0,100}heat radiating/gi,
    /(golden eyes[^.]+\.)\s*[^.]{0,50}golden eyes/gi,
    // Repeated internal monologue
    /(\*[^*]{20,}\*)\s*\1/g,
    // Repeated character descriptions
    /(seven feet[^.]+muscle[^.]+\.)\s*[^.]{0,100}seven feet/gi,
    // Consecutive similar descriptions (He was enormous... He was enormous)
    /(He was \*enormous\*[^.]+\.)\s*[^.]{0,50}(He was \*enormous\*|Seven feet)/gi,
    // Tusks description appearing twice
    /(Tusks curved up from a jaw[^.]+\.)\s*[^.]{0,150}Tusks curved up/gi,
    // Forest breathing appearing twice
    /(forest breathing around[^.]+\.)\s*[^.]{0,200}forest breathing/gi,
    // The barrier description twice
    /(barrier[^.]+thousand years[^.]+\.)\s*[^.]{0,100}barrier[^.]+thousand years/gi,
  ];
  
  for (const pattern of repetitivePatterns) {
    polished = polished.replace(pattern, '$1');
  }
  
  // ====== PHASE 5: Remove consecutive near-duplicate sentences ======
  // Protect ellipses before splitting
  polished = polished.replace(/\.\.\./g, '…'); // Convert ... to single ellipsis character
  
  // Split into sentences and remove any that are >70% similar to previous
  const sentences = polished.split(/(?<=[.!?])\s+/);
  const uniqueSentences: string[] = [];
  
  for (let i = 0; i < sentences.length; i++) {
    const current = sentences[i].toLowerCase().replace(/[^a-z0-9\s]/g, '');
    let isDuplicate = false;
    
    // Check against last 3 sentences for similarity
    for (let j = Math.max(0, uniqueSentences.length - 3); j < uniqueSentences.length; j++) {
      const prev = uniqueSentences[j].toLowerCase().replace(/[^a-z0-9\s]/g, '');
      
      // Check for high similarity (shared words)
      const currentWordsArray = current.split(/\s+/).filter(w => w.length > 3);
      const prevWordsSet = new Set(prev.split(/\s+/).filter(w => w.length > 3));
      
      if (currentWordsArray.length > 0 && prevWordsSet.size > 0) {
        let shared = 0;
        for (const word of currentWordsArray) {
          if (prevWordsSet.has(word)) shared++;
        }
        const similarity = shared / Math.min(currentWordsArray.length, prevWordsSet.size);
        
        // If more than 70% of significant words match, it's a duplicate
        if (similarity > 0.7 && currentWordsArray.length > 4) {
          isDuplicate = true;
          break;
        }
      }
    }
    
    if (!isDuplicate) {
      uniqueSentences.push(sentences[i]);
    }
  }
  
  polished = uniqueSentences.join(' ');
  
  // Restore ellipses
  polished = polished.replace(/…/g, '...');
  
  // Restore paragraph breaks that got merged
  polished = polished.replace(/([.!?])\s+(\*\*\*)/g, '$1\n\n$2');
  polished = polished.replace(/(\*\*\*)\s+/g, '$1\n\n');
  
  // ====== PHASE 6: Character name and variable cleanup ======
  
  polished = polished.replace(/\$\{pName\}/g, pName);
  polished = polished.replace(/\$\{liName\}/g, liName);
  polished = polished.replace(/\$\{[^}]+\}/g, ''); // Remove any remaining template vars
  
  // ====== PHASE 7: Whitespace and formatting cleanup ======
  
  // Fix multiple spaces
  polished = polished.replace(/  +/g, ' ');
  
  // Fix multiple newlines
  polished = polished.replace(/\n{4,}/g, '\n\n\n');
  
  // Fix scene break formatting
  polished = polished.replace(/\*\*\*\s*\*\*\*/g, '***');
  polished = polished.replace(/^\*\*\*\s*$/gm, '');
  polished = polished.replace(/([^\n])\*\*\*([^\n])/g, '$1\n\n***\n\n$2');
  
  // Ensure proper spacing around scene breaks
  polished = polished.replace(/\n*\*\*\*\n*/g, '\n\n***\n\n');
  polished = polished.replace(/\n{4,}/g, '\n\n\n');
  
  // Final trim
  polished = polished.trim();
  
  return polished;
}

// Analyze content for quality issues (for debugging/logging)
function analyzeContentQuality(content: string): { 
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  repetitionScore: number;
  dialogueRatio: number;
} {
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Check for repeated phrases (simple check)
  const phrases = content.toLowerCase().match(/\b\w+\s+\w+\s+\w+\b/g) || [];
  const phraseCount = new Map<string, number>();
  for (const phrase of phrases) {
    phraseCount.set(phrase, (phraseCount.get(phrase) || 0) + 1);
  }
  const repeatedPhrases = Array.from(phraseCount.values()).filter(c => c > 2).length;
  const repetitionScore = repeatedPhrases / (phrases.length || 1);
  
  // Check dialogue ratio
  const dialogueMatches = content.match(/"[^"]+"/g) || [];
  const dialogueWords = dialogueMatches.join(' ').split(/\s+/).length;
  const dialogueRatio = dialogueWords / (words.length || 1);
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    avgSentenceLength: words.length / (sentences.length || 1),
    repetitionScore,
    dialogueRatio,
  };
}

// 6. SUBTEXT BANK - What characters DON'T say creates tension
// The gap between words and meaning is where romance lives
const SUBTEXT_EXCHANGES = [
  {
    said: '"I should go."',
    meant: 'I\'m afraid of what I\'ll do if I stay.',
    beat: 'Neither of them moved.',
  },
  {
    said: '"This is a bad idea."',
    meant: 'I want this so much it terrifies me.',
    beat: 'But she didn\'t pull away.',
  },
  {
    said: '"We should keep this professional."',
    meant: 'I\'m losing the battle against wanting you.',
    beat: 'His eyes told a different story.',
  },
  {
    said: '"You don\'t owe me anything."',
    meant: 'Please don\'t leave.',
    beat: 'The words hung between them, heavy with everything unsaid.',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    switch (type) {
      case 'chapter':
        return NextResponse.json({ 
          success: true, 
          content: generateChapterContent(data) 
        });
      
      case 'character':
        return NextResponse.json({ 
          success: true, 
          character: generateCharacter(data) 
        });
      
      case 'outline':
        return NextResponse.json({ 
          success: true, 
          outline: generateOutline(data) 
        });
      
      case 'blurb':
        return NextResponse.json({ 
          success: true, 
          blurb: generateBlurb(data) 
        });
      
      case 'cover-prompt':
        return NextResponse.json({ 
          success: true, 
          prompt: generateCoverPrompt(data) 
        });
      
      case 'keywords':
        return NextResponse.json({ 
          success: true, 
          keywords: generateKeywords(data) 
        });
      
      case 'back-matter':
        return NextResponse.json({ 
          success: true, 
          backMatter: generateBackMatter(data) 
        });
      
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Unknown generation type' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate content' 
    }, { status: 500 });
  }
}

function generateChapterContent(data: {
  chapterTitle: string;
  chapterNumber: number;
  outline: string;
  characters: any[];
  genre: string;
  heatLevel: string;
  previousContext?: string;
  wordTarget?: number;
}): string {
  const { chapterTitle, chapterNumber, outline, characters, genre, heatLevel, previousContext } = data;
  
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest' || c.role === 'love-interest') || characters[1];
  
  // Initialize memory and trackers for new book (chapter 1)
  if (chapterNumber === 1) {
    usedContentTracker.reset();
    bookMemory.initializeBook(
      protagonist?.name || 'She',
      loveInterest?.name || 'He'
    );
    
    // Add genre-appropriate artifacts
    const artifacts = ARTIFACT_TEMPLATES[genre as keyof typeof ARTIFACT_TEMPLATES] || [];
    for (const artifact of artifacts.slice(0, 3)) {
      bookMemory.addArtifact({ ...artifact, firstAppearance: 1 });
    }
  }
  
  // KDP Best Practice: Quality over quantity
  // - Successful erotica novellas are 15,000-30,000 words (10-15 chapters of 1,500-2,500 words)
  // - KDP Unlimited pays by pages READ - boring filler = readers quit = less revenue
  // - Each scene must: advance plot, develop character, or build tension
  // - Pacing is critical: varied scene lengths keep readers engaged
  
  // Determine chapter type and structure based on position in story
  const chapterType = getChapterType(chapterNumber, 15); // Assuming ~15 chapters
  
  // Build chapter with purposeful structure based on story position
  return buildPurposefulChapter({
    chapterNumber,
    chapterType,
    chapterTitle,
    outline,
    characters,
    protagonist,
    loveInterest,
    genre,
    heatLevel,
    previousContext,
  });
}

// Determine chapter purpose based on story structure (romance beat sheet)
function getChapterType(chapterNum: number, totalChapters: number): string {
  const position = chapterNum / totalChapters;
  
  if (position <= 0.1) return 'hook'; // Ch 1-2: Hook reader, establish world
  if (position <= 0.2) return 'meet'; // Ch 2-3: Meet-cute, initial attraction
  if (position <= 0.35) return 'tension'; // Ch 4-5: Build tension, forced proximity
  if (position <= 0.5) return 'turning_point'; // Ch 6-7: First kiss, major development
  if (position <= 0.65) return 'deepening'; // Ch 8-10: Relationship deepens, intimacy grows
  if (position <= 0.8) return 'crisis'; // Ch 11-12: Dark moment, conflict
  if (position <= 0.9) return 'climax'; // Ch 13-14: Resolution, grand gesture
  return 'resolution'; // Ch 15: HEA (Happily Ever After)
}

function buildPurposefulChapter(params: {
  chapterNumber: number;
  chapterType: string;
  chapterTitle: string;
  outline: string;
  characters: any[];
  protagonist: any;
  loveInterest: any;
  genre: string;
  heatLevel: string;
  previousContext?: string;
  totalChapters?: number;
}): string {
  const { chapterNumber, chapterType, chapterTitle, outline, characters, protagonist, loveInterest, genre, heatLevel, totalChapters = 10 } = params;
  
  // Calculate target words per chapter (aim for 2,500 per chapter for 25k book)
  const targetWordsPerChapter = 2500;
  
  // DUAL POV: Determine whose perspective this chapter is from
  const pov = POV_SCHEDULE[chapterNumber as keyof typeof POV_SCHEDULE] || 'heroine';
  const povCharacter = pov === 'hero' ? loveInterest : protagonist;
  const otherCharacter = pov === 'hero' ? protagonist : loveInterest;
  
  // Extract character psychology for expansion
  const pName = protagonist?.name || 'Elena';
  const liName = loveInterest?.name || 'Kael';
  const pWound = protagonist?.coreWound || protagonist?.backstory || 'abandoned by those who should have loved her';
  const liWound = loveInterest?.coreWound || loveInterest?.backstory || 'lost those he swore to protect';
  const pLie = protagonist?.arc?.split('From believing')[1]?.split('to understanding')[0]?.trim() || 'Love is just another word for eventual pain';
  const liLie = loveInterest?.arc?.split('From believing')[1]?.split('to understanding')[0]?.trim() || 'Softness is weakness';
  
  // Generate the main chapter content based on type
  let content: string;
  switch (chapterType) {
    case 'hook':
      content = generateHookChapter(protagonist, loveInterest, genre, heatLevel, chapterNumber);
      break;
    case 'meet':
      content = pov === 'hero' 
        ? generateHeroMeetChapter(protagonist, loveInterest, genre, heatLevel)
        : generateMeetCuteChapter(protagonist, loveInterest, genre, heatLevel);
      break;
    case 'tension':
      content = pov === 'hero'
        ? generateHeroTensionChapter(protagonist, loveInterest, genre, heatLevel)
        : generateTensionChapter(protagonist, loveInterest, genre, heatLevel);
      break;
    case 'turning_point':
      content = generateTurningPointChapter(protagonist, loveInterest, genre, heatLevel);
      break;
    case 'deepening':
      content = pov === 'hero'
        ? generateHeroDeepeningChapter(protagonist, loveInterest, genre, heatLevel)
        : generateDeepeningChapter(protagonist, loveInterest, genre, heatLevel);
      break;
    case 'crisis':
      content = pov === 'hero'
        ? generateHeroCrisisChapter(protagonist, loveInterest, genre, heatLevel)
        : generateCrisisChapter(protagonist, loveInterest, genre, heatLevel);
      break;
    case 'climax':
      content = pov === 'hero'
        ? generateHeroClimaxChapter(protagonist, loveInterest, genre, heatLevel)
        : generateClimaxChapter(protagonist, loveInterest, genre, heatLevel);
      break;
    case 'resolution':
      content = generateResolutionChapter(protagonist, loveInterest, genre, heatLevel);
      break;
    default:
      content = generateTensionChapter(protagonist, loveInterest, genre, heatLevel);
  }
  
  // GOD-TIER: Add unique chapter-specific scene that can ONLY appear once
  const uniqueScene = getUniqueChapterScene(chapterNumber, pName, liName, pov as 'heroine' | 'hero');
  if (uniqueScene && !content.includes(uniqueScene.substring(0, 50))) {
    // Insert unique scene at an appropriate point
    const sceneBreaks = content.split('***');
    if (sceneBreaks.length >= 2) {
      // Insert after the first scene break
      sceneBreaks.splice(1, 0, '\n' + uniqueScene + '\n');
      content = sceneBreaks.join('\n\n***\n\n');
    } else {
      // Insert before the last third of the content
      const insertPoint = Math.floor(content.length * 0.65);
      const lastBreak = content.lastIndexOf('\n\n', insertPoint);
      if (lastBreak > 0) {
        content = content.substring(0, lastBreak) + '\n\n***\n\n' + uniqueScene + '\n\n***\n\n' + content.substring(lastBreak);
      }
    }
  }
  
  // EXPAND MEANINGFULLY to hit target word count
  // This adds escalating content appropriate for this chapter - NOT filler
  content = expandChapterMeaningfully(
    content,
    targetWordsPerChapter,
    pName,
    liName,
    pWound,
    liWound,
    pLie,
    liLie,
    heatLevel,
    chapterNumber // Pass chapter number for escalation
  );
  
  // GOD-TIER ENHANCEMENT: Add literary depth
  content = enhanceWithGodTier(content, pName, liName, chapterNumber, pov as 'heroine' | 'hero');
  
  // TECHNICAL POLISH: Remove duplicates, fix formatting, clean up
  content = polishContent(content, pName, liName);
  
  // ADD CHAPTER HOOK at the end (except for resolution/epilogue chapters)
  if (chapterType !== 'resolution' && chapterNumber < 13) {
    content = addChapterHook(content, chapterType, chapterNumber);
  }
  
  // ==========================================================================
  // MULTI-PASS REFINEMENT SYSTEM - God-tier quality
  // ==========================================================================
  
  // PASS 1: STRUCTURAL CLEANUP
  content = structuralCleanupPass(content, chapterNumber);
  
  // PASS 2: REPETITION CLEANUP
  content = repetitionCleanupPass(content, pName, liName, chapterNumber);
  
  // PASS 3: VOICE & TIGHTENING
  content = voiceTighteningPass(content, pName, liName, pov as 'heroine' | 'hero');
  
  // PASS 4: THEME EVOLUTION CHECK
  content = themeEvolutionPass(content, chapterNumber, pName, liName);
  
  // PASS 5: FINAL VALIDATION
  content = validateAndSanitizeContent(content);
  
  // Record this chapter in memory for future chapters
  recordChapterInMemory(content, chapterNumber, pName, liName);
  
  return content;
}

// ==========================================================================
// PASS 1: STRUCTURAL CLEANUP - Scene breaks, pacing, flow
// ==========================================================================
function structuralCleanupPass(content: string, chapterNumber: number): string {
  let result = content;
  
  // Ensure proper scene breaks (not too many, not too few)
  const sceneBreaks = (result.match(/\*\*\*/g) || []).length;
  
  // If no scene breaks and chapter is long, add them at natural points
  if (sceneBreaks === 0 && result.length > 8000) {
    // Find natural break points (after emotional beats or time transitions)
    const breakIndicators = [
      /(\.\s*)\n\n(Hours later|The next morning|When she woke|By the time|As the sun)/gi,
      /(\.\s*)\n\n(She didn't know how long|Time passed|The fire had burned)/gi,
      /(\.\s*)\n\n(Everything changed when|The moment was broken|Reality crashed)/gi,
    ];
    
    for (const pattern of breakIndicators) {
      if ((result.match(/\*\*\*/g) || []).length < 3) {
        result = result.replace(pattern, '$1\n\n***\n\n$2');
      }
    }
  }
  
  // Remove excessive scene breaks (more than 4 per chapter is too choppy)
  if (sceneBreaks > 4) {
    let count = 0;
    result = result.replace(/\n\n\*\*\*\n\n/g, (match) => {
      count++;
      return count <= 4 ? match : '\n\n';
    });
  }
  
  // Ensure consistent paragraph lengths (break up walls of text)
  const paragraphs = result.split('\n\n');
  const restructured = paragraphs.map(para => {
    // If paragraph is longer than 800 chars and has multiple sentences, consider breaking
    if (para.length > 800 && !para.startsWith('*')) {
      const sentences = para.split(/(?<=[.!?])\s+/);
      if (sentences.length > 6) {
        // Insert break after 3-4 sentences
        const breakPoint = Math.floor(sentences.length / 2);
        return sentences.slice(0, breakPoint).join(' ') + '\n\n' + sentences.slice(breakPoint).join(' ');
      }
    }
    return para;
  });
  
  result = restructured.join('\n\n');
  
  // Ensure chapter doesn't start with dialogue (needs grounding first)
  if (result.trim().startsWith('"')) {
    const groundingOpeners = [
      'The words came before she could stop them.',
      'She found her voice before her courage.',
      'The silence stretched between them until—',
    ];
    result = groundingOpeners[chapterNumber % groundingOpeners.length] + '\n\n' + result;
  }
  
  return result;
}

// ==========================================================================
// PASS 2: REPETITION CLEANUP - Remove repeated words, phrases, patterns
// ==========================================================================
function repetitionCleanupPass(content: string, pName: string, liName: string, chapterNumber: number): string {
  let result = content;
  
  // 2A: Find and vary repeated words in close proximity
  const wordsToVary: Record<string, string[]> = {
    'beautiful': ['striking', 'breathtaking', 'stunning', 'exquisite', 'captivating'],
    'massive': ['enormous', 'towering', 'imposing', 'formidable', 'powerful'],
    'golden': ['amber', 'honey-colored', 'aureate', 'gilded', 'sun-bright'],
    'whispered': ['murmured', 'breathed', 'said softly', 'spoke quietly', 'uttered'],
    'shivered': ['trembled', 'shuddered', 'quivered', 'quaked', 'shook'],
    'stared': ['gazed', 'watched', 'studied', 'observed', 'regarded'],
    'heart': ['pulse', 'chest', 'ribcage', 'core', 'center'],
    'breath': ['exhale', 'inhale', 'breathing', 'air', 'lungs'],
    'eyes': ['gaze', 'stare', 'look', 'regard', 'attention'],
    'touch': ['contact', 'caress', 'brush', 'graze', 'connection'],
    'moment': ['instant', 'heartbeat', 'second', 'breath', 'beat'],
    'suddenly': ['abruptly', 'without warning', 'in an instant', '', ''], // sometimes just remove
  };
  
  for (const [word, alternatives] of Object.entries(wordsToVary)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = result.match(regex) || [];
    
    // If word appears more than twice, vary some instances
    if (matches.length > 2) {
      let count = 0;
      result = result.replace(regex, (match) => {
        count++;
        // Keep first instance, vary subsequent ones
        if (count > 1 && count % 2 === 0) {
          const alt = alternatives[(count + chapterNumber) % alternatives.length];
          // Preserve capitalization
          return match[0] === match[0].toUpperCase() 
            ? alt.charAt(0).toUpperCase() + alt.slice(1) 
            : alt;
        }
        return match;
      });
    }
  }
  
  // 2B: Remove consecutive similar sentence starters
  const paragraphs = result.split('\n\n');
  const variedParagraphs: string[] = [];
  
  const starterVariations: Record<string, string[]> = {
    'She ': ['Her ', `${pName} `, 'The woman ', 'Without thinking, she '],
    'He ': ['His ', `${liName} `, 'The warrior ', 'Wordlessly, he '],
    'The ': ['A ', 'That ', 'This ', 'Their '],
    'Her ': ['She felt her ', `${pName}'s `, 'The woman\'s ', 'Those '],
    'His ': ['He felt his ', `${liName}'s `, 'The warrior\'s ', 'Those '],
  };
  
  let lastStarter = '';
  for (const para of paragraphs) {
    const trimmed = para.trim();
    const currentStarter = trimmed.substring(0, 4);
    
    // If same starter as previous paragraph
    if (currentStarter === lastStarter && starterVariations[currentStarter]) {
      const alts = starterVariations[currentStarter];
      const newStarter = alts[Math.floor(Math.random() * alts.length)];
      variedParagraphs.push(newStarter + trimmed.substring(currentStarter.length));
    } else {
      variedParagraphs.push(para);
    }
    
    lastStarter = currentStarter;
  }
  
  result = variedParagraphs.join('\n\n');
  
  // 2C: Check against book memory for cross-chapter repetition
  const sentences = result.split(/(?<=[.!?])\s+/);
  const deduped: string[] = [];
  
  for (const sentence of sentences) {
    const normalized = sentence.toLowerCase().substring(0, 50);
    
    // Skip if this exact phrase was used in previous chapters
    if (!bookMemory.wasUsed(normalized, 'phrase')) {
      deduped.push(sentence);
      // Only mark longer phrases
      if (normalized.length > 30) {
        bookMemory.markUsed(normalized, 'phrase');
      }
    } else {
      // Replace with a variation or skip
      if (sentence.length > 100) {
        // Try to keep but modify the sentence
        deduped.push(sentence.replace(/^(\w+)/, 'Meanwhile, $1').trim());
      }
      // Short repeated sentences can be dropped
    }
  }
  
  result = deduped.join(' ');
  
  return result;
}

// ==========================================================================
// PASS 3: VOICE & TIGHTENING - Character voice, prose quality
// ==========================================================================
function voiceTighteningPass(
  content: string, 
  pName: string, 
  liName: string, 
  pov: 'heroine' | 'hero'
): string {
  let result = content;
  
  // 3A: Remove weak words and tighten prose
  const weakPatterns: Array<[RegExp, string]> = [
    [/\bvery\s+/gi, ''],
    [/\breally\s+/gi, ''],
    [/\bjust\s+/gi, ''],
    [/\bsomehow\s+/gi, ''],
    [/\bseemed to\s+/gi, ''],
    [/\bappeared to\s+/gi, ''],
    [/\bbegan to\s+/gi, ''],
    [/\bstarted to\s+/gi, ''],
    [/\bshe felt that\s+/gi, 'she felt '],
    [/\bhe felt that\s+/gi, 'he felt '],
    [/\bthere was a\s+/gi, 'a '],
    [/\bthere were\s+/gi, ''],
    [/\bit was\s+(\w+)\s+that/gi, '$1'],
  ];
  
  for (const [pattern, replacement] of weakPatterns) {
    result = result.replace(pattern, replacement);
  }
  
  // 3B: Ensure POV-appropriate voice
  if (pov === 'heroine') {
    // Heroine voice: More analytical, self-aware
    // Add occasional scientific/analytical framing
    if (!result.includes('cataloged') && !result.includes('analyzed') && result.length > 3000) {
      const insertPoint = result.indexOf('. She ');
      if (insertPoint > 500) {
        const analyticalBeat = `\n\n*Observe. Analyze. Don't feel.* The mantra had served her well for years. It was failing her spectacularly now.\n\n`;
        result = result.slice(0, insertPoint + 1) + analyticalBeat + result.slice(insertPoint + 1);
      }
    }
  } else {
    // Hero voice: More visceral, protective, possessive
    if (!result.includes('ancient') && !result.includes('centuries') && result.length > 3000) {
      const insertPoint = result.indexOf('. He ');
      if (insertPoint > 500) {
        const primalBeat = `\n\nThe beast inside him stirred. *Protect. Claim. Keep.* Instincts older than memory demanded action.\n\n`;
        result = result.slice(0, insertPoint + 1) + primalBeat + result.slice(insertPoint + 1);
      }
    }
  }
  
  // 3C: Strengthen verbs (replace weak verbs with strong ones)
  const verbAlternatives: Record<string, string[]> = {
    'walked': ['strode', 'moved', 'crossed', 'made her way'],
    'looked at': ['studied', 'examined', 'watched', 'regarded'],
    'went': ['moved', 'headed', 'proceeded', 'ventured'],
    'got': ['became', 'grew', 'turned', 'received'],
  };
  
  for (const [verb, alternatives] of Object.entries(verbAlternatives)) {
    const pattern = new RegExp(`\\b${verb}\\b`, 'gi');
    let count = 0;
    result = result.replace(pattern, (match) => {
      count++;
      // Only replace every 3rd instance to maintain variety
      if (count % 3 === 0) {
        const alt = alternatives[Math.floor(Math.random() * alternatives.length)];
        return match[0] === match[0].toUpperCase() 
          ? alt.charAt(0).toUpperCase() + alt.slice(1) 
          : alt;
      }
      return match;
    });
  }
  
  return result;
}

// ==========================================================================
// PASS 4: THEME EVOLUTION - Ensure themes progress, not repeat
// ==========================================================================
function themeEvolutionPass(
  content: string, 
  chapterNumber: number, 
  pName: string, 
  liName: string
): string {
  let result = content;
  
  // Get current theme stages
  const trustStage = bookMemory.themes.trust.currentStage;
  const fearStage = bookMemory.themes.fear.currentStage;
  const desireStage = bookMemory.themes.desire.currentStage;
  
  // TRUST THEME - Ensure it evolves
  const trustExpressions: Record<number, string[]> = {
    1: ['She didn\'t trust easily.', 'Trust was a foreign concept.'],
    2: ['She wanted to trust him—that was the terrifying part.', 'Against her better judgment, she found herself believing him.'],
    3: ['The betrayal cut deeper because she\'d started to believe.', 'Trust, once offered, was so easily shattered.'],
    4: ['She chose to trust him. Despite everything. Because of everything.', 'Trust wasn\'t about safety. It was about choosing vulnerability.'],
    5: ['She trusted him completely. The fear remained, but it no longer ruled her.', 'Trust had become as natural as breathing.'],
  };
  
  // If chapter mentions trust, ensure it matches current stage
  if (result.toLowerCase().includes('trust')) {
    const currentStageExpressions = trustExpressions[trustStage] || trustExpressions[1];
    const hasAppropriateExpression = currentStageExpressions.some(expr => 
      result.toLowerCase().includes(expr.toLowerCase().substring(0, 20))
    );
    
    if (!hasAppropriateExpression && chapterNumber > 2) {
      // Add stage-appropriate trust expression
      const expr = currentStageExpressions[chapterNumber % currentStageExpressions.length];
      if (!bookMemory.wasUsed(expr, 'phrase')) {
        const insertPoint = result.indexOf('trust');
        if (insertPoint > 0) {
          result = result.slice(0, insertPoint) + expr + ' ' + result.slice(insertPoint);
          bookMemory.markUsed(expr, 'phrase');
        }
      }
    }
  }
  
  // Record theme expressions for this chapter
  bookMemory.evolveTheme('trust', `Chapter ${chapterNumber} trust state`, chapterNumber);
  bookMemory.evolveTheme('fear', `Chapter ${chapterNumber} fear state`, chapterNumber);
  bookMemory.evolveTheme('desire', `Chapter ${chapterNumber} desire state`, chapterNumber);
  
  return result;
}

// ==========================================================================
// MEMORY RECORDING - Store chapter info for future reference
// ==========================================================================
function recordChapterInMemory(
  content: string, 
  chapterNumber: number, 
  pName: string, 
  liName: string
) {
  // Extract key events
  const keyEvents: string[] = [];
  if (content.includes('kiss')) keyEvents.push('kiss');
  if (content.includes('touch')) keyEvents.push('physical contact');
  if (content.includes('confess') || content.includes('admit')) keyEvents.push('confession');
  if (content.includes('leave') || content.includes('left')) keyEvents.push('separation');
  if (content.includes('fight') || content.includes('battle')) keyEvents.push('conflict');
  
  // Extract emotional beats
  const emotionalBeats: string[] = [];
  if (content.includes('tears') || content.includes('cried')) emotionalBeats.push('tears');
  if (content.includes('laugh')) emotionalBeats.push('laughter');
  if (content.includes('fear') || content.includes('afraid')) emotionalBeats.push('fear');
  if (content.includes('hope')) emotionalBeats.push('hope');
  if (content.includes('love')) emotionalBeats.push('love acknowledged');
  
  // Calculate intimacy level
  let intimacy = 1;
  if (content.includes('touch')) intimacy += 2;
  if (content.includes('kiss')) intimacy += 3;
  if (content.includes('body') || content.includes('skin')) intimacy += 2;
  if (content.includes('made love') || content.includes('inside her')) intimacy += 4;
  intimacy = Math.min(10, intimacy);
  
  // Calculate conflict level
  let conflict = 1;
  if (content.includes('angry') || content.includes('furious')) conflict += 2;
  if (content.includes('betrayed') || content.includes('lied')) conflict += 3;
  if (content.includes('fight') || content.includes('battle')) conflict += 2;
  if (content.includes('danger')) conflict += 2;
  conflict = Math.min(10, conflict);
  
  // Record scene
  bookMemory.recordScene({
    chapter: chapterNumber,
    keyEvents,
    emotionalBeats,
    physicalIntimacy: intimacy,
    conflictLevel: conflict,
    resolutionProgress: Math.min(100, chapterNumber * 10),
  });
  
  // Update character states
  const protagEmotional = intimacy > 5 ? 'vulnerable, opening' : 
                          conflict > 5 ? 'conflicted, guarded' : 
                          'cautiously hopeful';
  
  bookMemory.updateCharacterState('protagonist', protagEmotional, 
    keyEvents.length > 0 ? keyEvents[0] : undefined,
    intimacy > 3 ? 1 : 0
  );
  
  const loveEmotional = intimacy > 5 ? 'protective, possessive' :
                        conflict > 5 ? 'desperate, determined' :
                        'patient, watchful';
  
  bookMemory.updateCharacterState('loveInterest', loveEmotional,
    keyEvents.length > 0 ? keyEvents[0] : undefined,
    intimacy > 3 ? 1 : 0
  );
}

// Add a compelling hook to the end of each chapter
function addChapterHook(content: string, chapterType: string, chapterNum: number): string {
  // Map chapter types to hook types
  const hookMapping: Record<string, keyof typeof CHAPTER_HOOKS> = {
    'hook': 'cliffhanger',
    'meet': 'kiss',
    'tension': 'emotional',
    'turning_point': 'confession',
    'deepening': 'revelation',
    'crisis': 'danger',
    'climax': 'emotional',
  };
  
  const hookType = hookMapping[chapterType] || 'cliffhanger';
  const hooks = CHAPTER_HOOKS[hookType];
  const selectedHook = hooks[chapterNum % hooks.length];
  
  // If content already has a strong ending, keep it; otherwise append the hook
  const lastParagraph = content.split('\n').filter(p => p.trim()).pop() || '';
  const hasStrongEnding = lastParagraph.includes('...') || 
                          lastParagraph.includes('?') ||
                          lastParagraph.includes('—') ||
                          lastParagraph.includes('yet') ||
                          lastParagraph.includes('Everything changed');
  
  if (!hasStrongEnding) {
    content += `\n\n***\n\n${selectedHook}`;
  }
  
  return content;
}

// Helper: Get random internal thought based on situation
function getRandomThought(situation: keyof typeof INTERNAL_THOUGHTS): string {
  const thoughts = INTERNAL_THOUGHTS[situation];
  return thoughts[Math.floor(Math.random() * thoughts.length)];
}

// Helper: Get random dialogue beat
function getRandomBeat(type: keyof typeof DIALOGUE_BEATS): string {
  const beats = DIALOGUE_BEATS[type];
  return beats[Math.floor(Math.random() * beats.length)];
}

// Helper: Get touch appropriate for chapter position
function getTouchForChapter(chapterNum: number): typeof TOUCH_LADDER[number] {
  // Map chapters to touch ladder stages
  const stageMapping: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 8,
    11: 5, 12: 9, 13: 9, 14: 9, 15: 9,
  };
  const stage = stageMapping[chapterNum] || 1;
  return TOUCH_LADDER[stage - 1];
}

// ============================================================================
// WORLD-BUILDING & ATMOSPHERE SYSTEMS
// Every word must add value - immersive details that serve the story
// ============================================================================

// Sensory detail banks for immersive writing (KDP Best Practice: Show don't tell)
const SENSORY_BANKS: Record<string, {sights: string[]; sounds: string[]; smells: string[]; textures: string[]; tastes: string[]}> = {
  'Monster Romance': {
    sights: ['moonlight filtering through ancient trees', 'bioluminescent flowers pulsing with soft light', 'shadows that moved with intention', 'towering stone formations carved by time', 'mist curling between gnarled roots', 'his tusks gleaming in firelight', 'tribal tattoos that told stories on his green skin', 'golden eyes that seemed to glow in darkness', 'scars that mapped a life of battle', 'the massive silhouette blocking the moonlight'],
    sounds: ['the forest breathing around her', 'distant drums echoing through the valley', 'her own heartbeat thundering in her ears', 'the whisper of leaves that seemed to carry secrets', 'his low growl that made her stomach flip', 'his voice—bass rumble felt in bones', 'the crackle of ceremonial fires', 'howls rising to the twin moons', 'his breath catching when she touched him'],
    smells: ['woodsmoke and pine', 'rain on ancient stone', 'something wild and male that made her breath catch', 'night-blooming flowers she couldn\'t name', 'the iron tang of danger', 'leather and steel and ancient magic', 'the green growing smell he carried with him', 'his scent—primal, intoxicating, inescapable'],
    textures: ['bark rough beneath her fingers', 'his skin hot against her cold hands', 'the velvet softness of moss underfoot', 'the shocking heat of his breath on her neck', 'cool night air against flushed skin', 'tusks smooth and cool against her cheek', 'calluses from centuries of battle', 'tribal scarification raised under her fingertips'],
    tastes: ['fear sharp on her tongue', 'something sweet and unknown in the water', 'his kiss—wild and claiming', 'the copper tang of bitten lip', 'air thick enough to taste', 'magic like lightning and honey', 'the salt of her own tears'],
  },
  'Dark Romance': {
    sights: ['rain streaking down floor-to-ceiling windows', 'the gleam of expensive whiskey in crystal', 'his eyes tracking her every movement', 'city lights blurred through tears', 'shadows carved his face into something dangerous', 'blood on white marble', 'his silhouette in the doorway—patient, predatory', 'the red of his tie against white shirt', 'tattoos disappearing beneath his collar'],
    sounds: ['the click of a lock behind her', 'his footsteps—measured, patient, inevitable', 'silk sheets whispering betrayal', 'her own ragged breathing', 'the soft threat in his voice', 'the crack of leather', 'ice against crystal', 'the safety clicking off', 'his voice dropping to a whisper that promised everything'],
    smells: ['expensive cologne and danger', 'gunmetal and Italian leather', 'fear sweat she couldn\'t hide', 'his scent on her pillow', 'smoke from a just-fired weapon', 'cigars and old money', 'blood metallic and fresh', 'his skin after—sex and danger'],
    textures: ['cold metal against her wrist', 'the press of his body trapping her against the wall', 'silk so fine it felt like water', 'his thumb rough against her cheek', 'the bite of desperation in her nails', 'rope that marked her skin', 'his hands—rough despite wealth', 'the trembling she couldn\'t control'],
    tastes: ['champagne that tasted like surrender', 'blood from her bitten lip', 'his mouth claiming hers', 'tears she refused to acknowledge', 'revenge planned and savored', 'fear bitter on her tongue', 'desire sharp and overwhelming'],
  },
  'Mafia Romance': {
    sights: ['chandeliers refracting light like weapons', 'blood pooling on expensive carpet', 'the family crest carved in stone', 'guns arranged like artwork', 'his jaw tight with barely contained rage', 'men in suits deferring without question', 'the church where confessions meant nothing', 'her reflection in his aviator sunglasses'],
    sounds: ['Italian muttered like a curse', 'the soft click of a safety', 'family laughter at Sunday dinner', 'silence that meant someone had died', 'his voice—quiet, dangerous, absolute', 'the roar of European engines', 'church bells hiding darker sounds', 'the pop of suppressed gunfire'],
    smells: ['espresso and blood', 'leather seats and power', 'his cologne—expensive, distinctive', 'gunpowder and roses', 'old money and older sins', 'the kitchen where his mother cooked', 'incense from morning mass'],
    textures: ['silk sheets in safehouse beds', 'the weight of his ring on her finger', 'cold gun metal handed to her', 'rough stubble against her neck', 'the smooth leather of the car interior', 'his calloused hands against her jaw', 'the trembling of her own fingers'],
    tastes: ['wine from the family vineyard', 'blood and broken promises', 'his kiss—possessive, marking', 'fear metallic in her mouth', 'homemade pasta at his mother\'s table', 'tears she swallowed', 'desire forbidden and unstoppable'],
  },
  'Billionaire Romance': {
    sights: ['Manhattan glittering sixty floors below', 'art that cost more than her education', 'his tailored suit a weapon of intimidation', 'the private jet\'s leather interior', 'paparazzi flashes like lightning', 'his penthouse—cold beautiful sterile', 'the way people moved aside for him'],
    sounds: ['the soft hum of the private elevator', 'assistants scrambling to comply', 'his voice—authority incarnate', 'her heartbeat in the silent boardroom', 'crystal clinking at galas', 'helicopter blades on the rooftop', 'the click of her heels on marble'],
    smells: ['expensive everything', 'his cologne—custom, unforgettable', 'fresh flowers replaced daily', 'leather and success', 'champagne at three figures a bottle', 'the clean scent of endless wealth'],
    textures: ['Egyptian cotton sheets', 'his watch cold against her skin', 'the weight of designer clothes', 'his hand firm on her lower back', 'the softness of cashmere', 'the hard plane of his chest', 'his stubble against her palm'],
    tastes: ['Michelin-starred meals', 'champagne that cost her monthly rent', 'his kiss—demanding, intoxicating', 'coffee from beans that cost more than gold', 'the sweetness of being chosen'],
  },
  'Shifter Romance': {
    sights: ['eyes that flickered between human and wolf', 'the ripple of his shift beneath the skin', 'moonlight that called to something inside her', 'pack running as one through the trees', 'scars that mapped pack battles', 'the alpha\'s mark on his shoulder', 'fur dissolving back into skin'],
    sounds: ['howls rising to the full moon', 'the crack and reform of bone in shift', 'growls that weren\'t human', 'pack communication in whines and rumbles', 'his wolf purring against her ear', 'the forest alive with his family', 'her own heart matching pack rhythm'],
    smells: ['pine and pack', 'the musk of his wolf', 'territory markers she learned to recognize', 'her own scent changed by the bite', 'heat rising off transformed bodies', 'the den scented like home', 'prey on the wind'],
    textures: ['fur dissolving under her fingers', 'his skin fever-hot always', 'the den\'s rough walls', 'his teeth—human, then not', 'the soft pelt he wrapped around her', 'his claws gentle against her skin', 'the raised mark where he bit her'],
    tastes: ['the blood of her first hunt', 'his kiss—wild, possessive', 'meat torn fresh', 'the change like lightning in her mouth', 'tears of belonging', 'pack on her tongue—a flavor of home'],
  },
  'Alien Romance': {
    sights: ['stars that were different from her sky', 'his bioluminescent markings pulsing', 'the curve of the ship\'s alien architecture', 'eyes that held galaxies', 'technology that moved like living things', 'his body—humanoid but gloriously not', 'the viewport showing stars she\'d never see from Earth'],
    sounds: ['the hum of the ship\'s living systems', 'his language—musical, impossible', 'the translator struggling with emotion words', 'alien music that made her weep', 'his purr vibrating through her chest', 'the silence of space outside', 'her name in his accent'],
    smells: ['nothing like Earth', 'his scent—indescribable, addictive', 'recycled air becoming home', 'the chemical tang of his biology', 'flowers from his world he grew for her', 'the metallic sweetness of his ship'],
    textures: ['his skin—textured, fascinating', 'technology that responded to thought', 'the suit he gave her like a second skin', 'ridges she traced with wonder', 'his fingers—longer, differently jointed', 'the nest he built from both their worlds', 'cold stars through the viewport glass'],
    tastes: ['food synthesized to match her memories', 'his kiss—alien but somehow perfect', 'the fear of never going home', 'wonder at everything new', 'his blood—copper-sweet, different', 'tears that floated in zero-g'],
  },
  'Romantasy': {
    sights: ['magic swirling like living aurora', 'ancient courts carved from moonstone', 'his fae beauty almost painful to look upon', 'starlight that seemed to follow her', 'flowers that bloomed at her touch', 'the throne that shifted with his mood', 'glamour falling away to show truth', 'iron marks on immortal skin'],
    sounds: ['the hum of ley lines beneath her feet', 'fae music that made mortals weep', 'his voice—beautiful, treacherous', 'wind carrying whispers in dead languages', 'the toll of bells between worlds', 'her heart beating louder than it should', 'bargains sealing with power', 'the court\'s calculating silence'],
    smells: ['night-blooming jasmine and frost', 'ancient magic—like ozone before a storm', 'his scent: midnight and dangerous intent', 'the sweet rot of fae food', 'blood on ceremonial stone', 'mortal flowers dying in fae soil', 'power like copper on her tongue'],
    textures: ['the burn of iron on fae skin', 'silk woven from captured moonlight', 'his fingers—ice cold, impossibly gentle', 'thorns that drew blood like lovers', 'the weight of a crown she never wanted', 'magic crackling between their joined hands', 'his bargain mark warm on her skin'],
    tastes: ['fae wine that tasted like regret', 'the copper of blood vows', 'his kiss—honeyed lies', 'mortal tears on immortal lips', 'power, bitter and addicting', 'the food she shouldn\'t eat', 'freedom slowly forgotten'],
  },
  'Why Choose / Reverse Harem': {
    sights: ['four sets of eyes watching her', 'bodies arranged around her like protection', 'each of them different, all of them hers', 'the house that fits them all', 'their matching marks', 'jealousy becoming something warmer', 'the bed that still isn\'t big enough'],
    sounds: ['their voices overlapping, harmonizing', 'bickering that became background music', 'four different laughs at her joke', 'competition softening into cooperation', 'whispered negotiations in the dark', 'her name in different voices', 'the sound of coming home to full arms'],
    smells: ['each of them distinct—citrus, leather, ocean, smoke', 'their scents mingling in the sheets', 'the kitchen when they cook together', 'cologne mixed with need', 'home smelling like all of them', 'perfume they chose together for her'],
    textures: ['multiple hands learning her', 'the contrast between them—rough and gentle', 'sharing body heat', 'fingers intertwined—hers and theirs', 'the weight of being surrounded', 'different kisses—urgent, sweet, claiming, questioning'],
    tastes: ['competition in their kisses', 'shared meals at crowded tables', 'tears of overwhelm—the good kind', 'each kiss different', 'love compounded, multiplied', 'morning coffee in the chaos'],
  },
};

// Atmospheric time-of-day and weather that enhances mood
function getAtmosphericDetail(genre: string, mood: 'tension' | 'passion' | 'vulnerability' | 'conflict'): string {
  const atmospheres: Record<string, Record<string, string>> = {
    'Monster Romance': {
      tension: 'The twin moons hung low and swollen in the sky, casting the clearing in silver light that made shadows stretch like reaching fingers.',
      passion: 'Night had settled around them like a cocoon, the stars above the only witnesses to what was building between them.',
      vulnerability: 'Dawn crept through the trees, painting the world in soft grays and golds—a gentleness at odds with the wildness of the night before.',
      conflict: 'Storm clouds gathered at the edges of the barrier, magic and weather conspiring to mirror the turmoil in her chest.',
    },
    'Dark Romance': {
      tension: 'Rain slashed against the windows, the city beyond blurred into smears of neon and shadow.',
      passion: 'The penthouse lights were dimmed, the only illumination the city sprawled below them like a kingdom at his feet.',
      vulnerability: 'Morning light was unforgiving, exposing every crack in the armor they both pretended to wear.',
      conflict: 'Thunder rolled in the distance, a storm approaching that had nothing to do with the weather.',
    },
    'Romantasy': {
      tension: 'The fae lights dimmed as he entered, even magic itself seeming to hold its breath in his presence.',
      passion: 'Magic hummed in the air between them, visible as golden threads that wove and sparked where their skin touched.',
      vulnerability: 'The eternal twilight of the Unseelie court softened his features, making him look almost mortal. Almost safe.',
      conflict: 'Power crackled at the edges of her vision, her own magic rising in response to his challenge.',
    },
  };
  return atmospheres[genre]?.[mood] || atmospheres['Dark Romance'][mood];
}

// Internal monologue templates that reflect deep character psychology
function getInternalConflict(character: any, situation: 'attracted' | 'afraid' | 'conflicted' | 'surrendering'): string {
  const lieTheyBelieve = character.lieTheyBelieve || 'Love is dangerous';
  const whatTheyWant = character.whatTheyWant || 'To protect themselves';
  const whatTheyNeed = character.whatTheyNeed || 'To let someone in';
  
  const templates: Record<string, string> = {
    attracted: `*This is madness.* She knew it with the same certainty she knew her own name. ${lieTheyBelieve}—she'd built her entire life on that truth. So why did her body refuse to listen? Why did every cell sing toward him like a compass finding north?`,
    afraid: `Fear coiled in her stomach, familiar and cold. She'd felt this before—the moment before everything fell apart. ${whatTheyWant}. That's what she should do. What she'd always done. But her feet refused to move, rooted by something stronger than survival instinct.`,
    conflicted: `Two voices warred in her head. The first, sharp and self-protective: *Don't be stupid. You know how this ends.* The second, quieter but insistent: *But what if you're wrong? What if this time...* She crushed the hope before it could take root. ${lieTheyBelieve}. She'd learned that lesson. She had the scars to prove it.`,
    surrendering: `Maybe it was the way he looked at her—like she was something precious, something worth protecting. Maybe it was the exhaustion of fighting her own heart. Or maybe she'd simply reached the limit of what she could deny. ${whatTheyNeed}. God help her, she needed this. Needed him. Even if it destroyed her.`,
  };
  return templates[situation];
}

// ============================================================================
// GENRE-SPECIFIC CHAPTER GENERATION
// Each genre has its own setting, tropes, and character dynamics
// ============================================================================

// Get genre-specific world building elements with VARIETY
function getGenreElements(genre: string): {
  setting: string;
  heroineTrait: string;
  heroTrait: string;
  meetLocation: string;
  conflict: string;
  worldDetail: string;
  physicalDetail: string;
} {
  const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
  const genreMap: Record<string, any> = {
    'Monster Romance': {
      setting: randomFrom([
        'the dark forest at the edge of the human realm',
        'the mist-shrouded mountains where humans never ventured',
        'the ancient caves beneath the forgotten kingdom',
        'the enchanted wilderness beyond the barrier',
        'the sacred groves forbidden to outsiders',
      ]),
      heroineTrait: randomFrom([
        'a botanist studying rare plants in forbidden territory',
        'a cartographer determined to map the unmappable',
        'a healer fleeing an arranged marriage',
        'an archaeologist searching for proof of ancient civilizations',
        'a runaway with secrets that could start a war',
        'a merchant\'s daughter shipwrecked in unknown lands',
      ]),
      heroTrait: randomFrom([
        'a massive orc warrior with tusks that gleamed in the moonlight',
        'an ancient orc chieftain whose eyes held centuries of wisdom',
        'a scarred orc warlord feared throughout the realm',
        'a towering orc sentinel sworn to protect these lands',
        'an orc healer whose gentle hands belied his fearsome appearance',
      ]),
      meetLocation: randomFrom([
        'a moonlit clearing deep in monster territory',
        'beside a crystalline waterfall hidden from human eyes',
        'in the shadow of ancient ruins older than memory',
        'a sacred grove where the boundary between worlds thinned',
        'a hidden valley where bioluminescent flowers bloomed',
      ]),
      conflict: 'the ancient treaty between humans and monsters forbade such contact',
      worldDetail: 'The barrier between the human lands and monster territory had stood for a thousand years, kept strong by magic and mutual distrust.',
      physicalDetail: randomFrom([
        'His green skin was marked with intricate tribal tattoos, and his tusks curved up from a jaw that could crush stone. He was easily seven feet tall, all corded muscle and primal power.',
        'Massive and imposing, his emerald skin bore the scars of countless battles. His tusks were decorated with silver rings that chimed softly when he moved.',
        'His jade-green skin stretched over muscles that spoke of brutal strength. The ceremonial scars on his chest told a story she couldn\'t read.',
        'Seven feet of deadly grace, his dark green skin gleaming in the moonlight. The bones braided into his war-locks clattered with each movement.',
      ]),
    },
    'Dark Romance': {
      setting: randomFrom([
        'the underground world of power and shadows',
        'the glittering heights of criminal empire',
        'the dangerous streets where power was the only currency',
        'the gilded cage of old money and older secrets',
      ]),
      heroineTrait: randomFrom([
        'a woman who had learned to survive in a world that showed no mercy',
        'someone with secrets that could bring down empires',
        'a survivor with nothing left to lose',
        'a woman traded as collateral for a debt she didn\'t owe',
      ]),
      heroTrait: randomFrom([
        'a dangerous man with blood on his hands and ice in his veins',
        'a crime lord whose empire was built on fear',
        'a man whose reputation made lesser men tremble',
        'a predator who had finally found prey worth keeping',
      ]),
      meetLocation: 'a penthouse that overlooked the city like a predator surveying its territory',
      conflict: 'he owned her now, whether she accepted it or not',
      worldDetail: 'In this world, weakness was death. She had learned that lesson the hard way, and she would never forget it.',
      physicalDetail: 'His eyes were cold, calculating, promising violence and possession in equal measure. The scar across his jaw told stories of battles won.',
    },
    'Alien Romance': {
      setting: randomFrom([
        'a spaceship hurtling through the vast emptiness between stars',
        'an ice planet at the edge of the known galaxy',
        'a space station where humans were the exotic specimens',
        'a jungle world where nothing was as it seemed',
      ]),
      heroineTrait: randomFrom([
        'an astronaut whose mission had gone catastrophically wrong',
        'a xenobiologist studying alien lifeforms',
        'a colonist stranded far from any hope of rescue',
        'a smuggler with a cargo she never should have taken',
      ]),
      heroTrait: 'an alien warrior whose species had never encountered humans before',
      meetLocation: 'the wreckage of her escape pod on an alien world',
      conflict: 'their species were biologically incompatible—or so everyone believed',
      worldDetail: 'The universe was vast, and humanity had barely scratched its surface. She was about to discover just how much they had yet to learn.',
      physicalDetail: 'His skin was a deep blue, almost purple, and ridges marked his face in patterns she found strangely beautiful. His eyes, silver and luminous, studied her with undisguised curiosity.',
    },
    'Shifter Romance': {
      setting: 'the remote mountains where the pack had lived for generations',
      heroineTrait: 'a city woman who had inherited a cabin she never knew existed',
      heroTrait: 'the alpha of a wolf pack who had scented his fated mate',
      meetLocation: 'the edge of pack territory, where the trees grew thick and wild',
      conflict: 'the pack laws were clear—humans could never know their secret',
      worldDetail: 'The wolves had hidden among humans for centuries, their true nature a closely guarded secret. But some bonds were stronger than any law.',
      physicalDetail: 'Even in human form, there was something wild about him. His amber eyes held a predator\'s focus, and his movements were too fluid, too powerful to be entirely human.',
    },
    'Mafia Romance': {
      setting: 'the gilded cage of the criminal underworld',
      heroineTrait: 'a woman caught between her family\'s debts and a dangerous man\'s obsession',
      heroTrait: 'the heir to a crime empire who always got what he wanted',
      meetLocation: 'his father\'s office, where her fate was sealed with a handshake she had no part in',
      conflict: 'she was payment for a debt she didn\'t owe',
      worldDetail: 'In their world, blood was currency and loyalty was everything. She was about to learn just how deep those waters ran.',
      physicalDetail: 'He wore his three-piece suit like armor, every detail perfect, every gesture calculated. But it was his eyes that scared her most—dark, assessing, already claiming what he considered his.',
    },
    'Romantasy': {
      setting: 'the fae court where beauty and cruelty walked hand in hand',
      heroineTrait: 'a mortal who had accidentally crossed into the realm of the fae',
      heroTrait: 'a dark fae prince with power that made the court tremble',
      meetLocation: 'the throne room of the Unseelie Court, surrounded by creatures of nightmare',
      conflict: 'mortal and fae could never truly be together—the magic wouldn\'t allow it',
      worldDetail: 'The fae realm existed between heartbeats, a world of impossible beauty and terrible danger. Those who entered rarely returned unchanged.',
      physicalDetail: 'He was beautiful the way a sword was beautiful—all deadly edges and cold perfection. His pointed ears and midnight hair marked him as highborn fae, but it was the darkness in his silver eyes that spoke to his true nature.',
    },
    'Why Choose / Reverse Harem': {
      setting: 'an elite academy where the powerful sent their heirs',
      heroineTrait: 'a scholarship student who refused to be intimidated',
      heroTrait: 'the four kings of the school who had made her their target',
      meetLocation: 'the courtyard where they\'d publicly humiliated their last victim',
      conflict: 'they wanted to break her—but attraction was proving harder to ignore than hate',
      worldDetail: 'Blackwood Academy was where the children of the elite learned to rule. And the four who ruled the students had never met anyone they couldn\'t destroy.',
      physicalDetail: 'They were four very different kinds of dangerous: the brooding leader, the charming devil, the silent enforcer, and the one whose smile promised chaos.',
    },
  };
  
  // Default to contemporary if genre not found
  return genreMap[genre] || {
    setting: 'the fast-paced world of high-stakes business',
    heroineTrait: 'a woman who had clawed her way to success',
    heroTrait: 'a man who challenged everything she thought she wanted',
    meetLocation: 'a conference room where deals worth millions were made',
    conflict: 'mixing business with pleasure was a recipe for disaster',
    worldDetail: 'In the corporate world, weakness was exploited and emotions were liabilities.',
    physicalDetail: 'He wore power like other men wore cologne—impossible to ignore and utterly intoxicating.',
  };
}

// ============================================================================
// HEAT LEVEL CONTENT GENERATION
// KDP Best Practice: Match reader expectations based on heat level
// ============================================================================

function getHeatLevelContent(heatLevel: string, sceneType: 'first_touch' | 'first_kiss' | 'tension' | 'intimate' | 'full', pName: string, liName: string): string {
  const content: Record<string, Record<string, string>> = {
    sweet: {
      first_touch: `When ${liName}'s fingers brushed against hers, a spark of electricity shot through ${pName}'s entire body. She pulled back quickly, her heart racing, but she couldn't deny the warmth that lingered where they had touched.`,
      first_kiss: `The kiss was soft, sweet, and over too quickly. ${liName} pulled back, his eyes searching hers for permission. "Was that okay?" he murmured. ${pName} answered by rising on her toes and pressing her lips to his again.`,
      tension: `The air between them crackled with unspoken feelings. ${pName} could feel the heat radiating from ${liName}'s body, so close yet not quite touching. She wondered if he could hear how fast her heart was beating.`,
      intimate: `They held each other in the moonlight, hearts beating in sync, knowing that this moment was the beginning of something beautiful. Some things were too precious to rush, and they had all the time in the world.`,
      full: `Later, wrapped in ${liName}'s arms, ${pName} felt safer than she ever had. Their love was tender, patient, built on a foundation of trust and respect that would last a lifetime.`,
    },
    sensual: {
      first_touch: `${liName}'s hand cupped her face, his thumb tracing the curve of her cheekbone. ${pName} leaned into his touch, her eyes fluttering closed. The warmth of his palm against her skin sent delicious shivers down her spine.`,
      first_kiss: `The kiss deepened, ${liName}'s arms wrapping around her waist and pulling her closer. ${pName} gasped against his lips, her fingers tangling in his hair. When they finally broke apart, both breathing hard, his eyes were dark with promise. "We should stop," he said, though his hands tightened on her hips. "We should," she agreed, making no move to pull away.`,
      tension: `${pName} was acutely aware of every point where their bodies touched—his chest against her back, his breath warm on her neck, his hands splayed possessively across her stomach. She could feel the tension coiled in his muscles, the restraint he was barely maintaining.`,
      intimate: `They moved together in the darkness, a tangle of limbs and whispered promises. ${liName}'s lips traced a path down her throat, and ${pName} arched into his touch, surrendering to sensation. This was what she had been missing—this consuming, overwhelming connection that burned away everything else.`,
      full: `Afterward, they lay together in satisfied silence, ${pName}'s head pillowed on ${liName}'s chest. His fingers traced lazy patterns on her bare shoulder. "Stay," he murmured. "Always," she promised.`,
    },
    steamy: {
      first_touch: `${liName}'s hand slid up her arm, leaving a trail of fire in its wake. ${pName}'s breath hitched as his fingers traced her collarbone, then dipped lower. "You're so responsive," he murmured, satisfaction evident in his voice. "I wonder what other sounds I can draw from you."`,
      first_kiss: `The kiss was all-consuming, devouring. ${liName} kissed her like she was oxygen and he was drowning. His hands roamed her body with clear intent, mapping every curve, every hollow, every place that made her gasp and arch closer. When he lifted her onto the counter, settling between her thighs, ${pName} wrapped her legs around him and pulled him impossibly closer. "More," she demanded against his lips.`,
      tension: `The chemistry between them was combustible. Every accidental touch sent fire racing through ${pName}'s veins. She caught ${liName} staring at her more than once, his gaze hot enough to scorch. At night, alone in her bed, she couldn't stop thinking about what it would feel like to have those massive hands on her bare skin, that powerful body pressed against hers. The wanting was becoming unbearable.`,
      intimate: `${liName} laid her down on the bed with surprising gentleness, then proceeded to worship every inch of her body with his hands and mouth. ${pName} writhed beneath him, lost in sensation, as he discovered every secret place that made her cry out. "You're beautiful like this," he rasped, watching her come undone. "I could do this forever." She believed him.`,
      full: `They came together in a rush of need and release, ${pName} crying out as ${liName} finally gave them both what they had been craving. He was everything she had imagined and more—powerful and demanding, yet somehow tender beneath the intensity. When they finally stilled, tangled together and breathing hard, ${pName} knew nothing would ever be the same. "That was..." she started. "Just the beginning," he finished, and the look in his eyes promised hours more of pleasure to come.`,
    },
    scorching: {
      first_touch: `${liName}'s hand fisted in her hair, tugging her head back to expose her throat. ${pName} moaned as his teeth scraped against her pulse point. "I've been thinking about doing this since the moment I saw you," he growled against her skin. His other hand slid down her body with clear intent, making her knees buckle. "About having you spread out beneath me, begging for more." The image his words painted made heat pool low in her belly.`,
      first_kiss: `The kiss was savage, claiming, ownership declared with every stroke of his tongue. ${liName} backed her against the wall, his body a cage of muscle and heat. ${pName} felt the hard evidence of his desire pressing against her stomach and rolled her hips experimentally. His groan was deeply satisfying. "Careful, little one," he warned, his hands gripping her hips hard enough to bruise. "You don't know what you're starting." "Maybe I do," she challenged. His eyes went molten. "Then don't expect me to stop."`,
      tension: `${pName} couldn't concentrate. Every time ${liName} moved, she tracked him like prey tracks a predator. The memory of his hands on her body, his mouth marking her skin, made her squirm with unfulfilled need. She caught him watching her and saw the same hunger reflected in his golden eyes. "Tonight," he mouthed from across the room. The promise in that single word made her squeeze her thighs together and pray for time to move faster.`,
      intimate: `${liName} pinned her wrists above her head, holding them there with one massive hand while the other explored her body with devastating thoroughness. "You're dripping for me already," he observed, satisfaction roughening his voice. ${pName} writhed beneath him, past the point of embarrassment, caring only about the pleasure he was wringing from her body. "Please," she gasped. "Please what?" he demanded. "Tell me what you want." She told him. In explicit, desperate detail. And he gave her everything she asked for and more.`,
      full: `They spent hours learning each other's bodies, discovering what made the other moan, scream, beg. ${liName} was insatiable, taking her against the wall, on the floor, bent over the table, finally in his massive bed where he spread her out and feasted on her until she forgot her own name. By the time they finally collapsed, sweaty and spent and thoroughly wrecked, the first light of dawn was creeping through the windows. "I'm not done with you yet," ${liName} murmured, already hardening again against her thigh. ${pName} laughed breathlessly and pulled him down for another kiss. "I was hoping you'd say that."`,
    },
  };
  
  return content[heatLevel]?.[sceneType] || content['steamy']?.[sceneType] || '';
}

// Chapter 1-2: Hook the reader, establish protagonist, hint at love interest
// USES: Deep character psychology, sensory immersion, show-don't-tell
function generateHookChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string, chapterNum: number): string {
  const pName = protagonist?.name || 'Wren';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  const sensory = SENSORY_BANKS[genre as keyof typeof SENSORY_BANKS] || SENSORY_BANKS['Monster Romance'];
  const atmosphere = getAtmosphericDetail(genre, 'tension');
  
  // Pull character psychology for authentic internal voice
  const pWound = protagonist?.coreWound || 'Abandoned by those who should have loved her';
  const pLie = protagonist?.lieTheyBelieve || 'Love is just another word for eventual abandonment';
  const pMannerism = protagonist?.mannerisms?.[0] || 'pushes her glasses up when nervous';
  const liWound = loveInterest?.coreWound || 'Watched his mother die because he wasn\'t strong enough';
  const liMannerism = loveInterest?.mannerisms?.[0] || 'goes completely still when assessing a threat';
  
  return `${pName} had always believed in the power of logic. Science. Reason. Things that could be measured, quantified, and controlled.

${atmosphere}

The belief had been her armor since the morning she woke at seven years old to find her mother's closet empty, nothing left but a note that said *"You'll understand when you're older."* Twenty years later, she still didn't understand. But she'd learned something far more useful: love was just another word for eventual abandonment.

Better to love her work. Work didn't leave.

${pName} pushed her glasses up—a nervous habit she'd never managed to break—and consulted her map again. According to her research, the specimens she sought grew only in the deep heart of the forbidden territory—past the barrier that had separated human lands from monster territory for a thousand years.

Her colleagues had called her obsessive. Her thesis advisor had called it career suicide. Her father—on one of the rare occasions he remembered she existed—had laughed and said, "That's my ${pName}, always chasing things that can't be caught."

*Just like her mother,* he didn't say. But she heard it anyway.

${elements.worldDetail}

The forest closed around her like something alive. ${sensory.sights[0]}. ${sensory.sounds[0]}. Each step took her deeper into territory no human had entered in centuries, and with each step, the rational part of her brain screamed that she should turn back.

But turning back meant admitting defeat. Meant returning to the university with nothing, proving everyone right—that she was chasing ghosts, wasting her potential, destined for the same spectacular failure that had defined her mother's life.

*No.* She would find these specimens if it killed her. She would prove her theories. And maybe, just maybe, she would finally prove she was worth something.

She crushed that thought before it could fully form. ${pLie} She'd built her whole life on that truth.

The clearing appeared without warning, as if the forest had simply decided to stop. One moment she was pushing through ancient undergrowth that clutched at her clothes with vegetable fingers; the next, she stood in a perfect circle of silver moonlight, surrounded by flowers that pulsed with soft bioluminescence—species she'd never seen in any botanical text.

Scientific wonder warred with primal fear. The flowers were here. They were *real*. Years of research, months of planning, weeks of—

A sound stopped her thoughts cold.

The snap of a twig. The rustle of something massive moving through the darkness just beyond the clearing's edge.

And then *he* emerged from the shadows, and every rational thought in ${pName}'s head evaporated like morning mist.

He was *enormous*. ${elements.physicalDetail}

But it was his eyes that stole her breath.

Golden. Ancient. And fixed on her with an intensity that made her feel hunted in a way that had nothing to do with danger.

*Everything* to do with desire.

He went completely still—the stillness before a storm—every muscle locked into perfect control, assessing her with a focus that felt almost physical. The air between them grew thick, charged with something primal and electric. ${sensory.sounds[1]}.

*Run,* her survival instincts screamed. *Run now, while you still can.*

But her feet had rooted themselves to the earth. And some treacherous part of her didn't want to run at all.

"You shouldn't be here, human."

His voice was low and rough, rolling through her body like distant thunder. She felt it in her chest, her stomach, lower still. A vibration that seemed to resonate with something deep and ancient inside her.

"These lands are forbidden to your kind."

${pName} forced steel into her spine. She'd faced down hostile thesis committees, condescending professors, her father's eternal disappointment. One oversized creature with pretty eyes wasn't going to intimidate her.

"I go where my research takes me." She was proud of how steady her voice came out. "I wasn't aware I needed permission from anyone."

Surprise flickered across his features—a crack in the stone of his expression. "Brave," he said, taking a single step closer that covered twice the distance a human stride would manage. "Or foolish. I haven't decided which."

"I prefer 'determined.'"

That almost-smile again. The barest softening around those predator's eyes. "My warriors wanted to kill you the moment you crossed the barrier. It's my restraint alone that keeps you breathing."

The reminder of danger should have terrified her. Should have sent her scrambling back toward the safety of human lands.

Instead, she felt something far more dangerous: curiosity.

"Then why didn't you let them? Why come yourself?"

${liName} went very still. For a long moment, the only sounds were ${sensory.sounds[0]} and the thundering of her own heart.

"Because I wanted to see," he said slowly, his voice dropping to something almost intimate, "what manner of creature would be foolish enough to enter these woods alone. What drive could possibly be strong enough to overcome the survival instinct that keeps your kind safely within your walls."

"And now that you've seen?"

He took another step. Close enough now that she could feel the heat radiating from his massive form. Close enough that his scent surrounded her—${sensory.smells[0]}—something wild, something male, something that made her head spin.

"Now I find that I want to understand more."

The words hung between them, weighted with meaning she didn't dare examine.

"What are you called?" he asked finally.

"${pName}. Dr. ${pName}... well, just ${pName}."

"${pName}." He rolled her name around his mouth like he was tasting it. "I am ${liName}. Chieftain of the Eastern Clans. War-leader of these territories." A pause. "And now, apparently, host to a very small, very stubborn human female."

"I didn't ask for a host."

"No." His voice held a note of dark amusement. "But you have one nonetheless. Consider it a gift of the forest."

${pName} told herself it was fear that made her heart race. Purely survival instinct. That the flutter in her stomach was anxiety, not anticipation. That the way her skin heated under his attention was simple biology, nothing more.

She was lying, of course. But admitting the truth felt far too dangerous.

"I'll make you a deal," ${liName} said finally. "Stay in this clearing. Do not venture deeper into our territory. I will ensure your safety while you conduct your research."

"And what do you get in return?"

His smile widened, and this time there was no mistaking the predatory gleam. "The pleasure of your company. It's been a long time since something interesting wandered into my forest."

Every smart decision ${pName} had ever made told her to refuse. To pack up her samples and never look back. To forget she'd ever seen those golden eyes or felt that inexplicable pull.

But ${pName} had never been good at walking away from a mystery.

"Deal," she heard herself say.

The satisfaction that flashed across his features made her question her sanity. But when he extended a massive hand to seal their bargain, she didn't hesitate.

Her palm met his, and the world tilted sideways.

The touch was electric—a current of sensation that raced from her fingertips straight to her heart. His hand completely engulfed hers, warm and rough with calluses, and yet his grip was impossibly gentle. As if he knew exactly how fragile human bones were and was terrified of breaking them.

Their eyes met over their clasped hands. Held. ${pName} forgot to breathe.

Something passed between them in that moment—something she couldn't name but felt in her very marrow. Recognition. Anticipation. The sense that this handshake was sealing far more than a simple agreement.

Neither of them spoke about it. But from the way his breath caught, she knew he'd felt it too.

Whatever this was, there was no going back now.

***

The next few days were a study in contradictions. 

${liName} was terrifying and gentle. Intimidating and strangely considerate. He arrived each morning before dawn, emerging from the forest mist like a creature from myth, and stayed until the stars emerged overhead. He brought her water from a spring that made her samples practically glow with vitality. He showed her plants she'd never documented, specimens that would make her career ten times over.

And through it all, he watched her. Learned her. As if she were the rare specimen and he the scientist.

${pName} had studied dangerous predators before. She recognized the behavior—the careful observation, the gradual approach, the patience of a hunter who knew his prey had nowhere to run. But ${liName} seemed to be hunting something other than her life.

What he wanted, she couldn't quite determine. And that uncertainty was somehow more terrifying than any physical threat.

"You're staring again," she said on the third evening, not looking up from the specimen she was pressing into her collection book. She'd gotten better at sensing his presence—the subtle shift in the air, the way the forest seemed to quiet in acknowledgment of its apex predator.

"You're fascinating," he replied, not bothering to deny it. "Your kind usually runs screaming from mine. You organize plants."

"Knowledge is more useful than fear."

"Is that what your books tell you?"

She looked up then, meeting those golden eyes that had begun to haunt her dreams. "That's what experience has taught me. Fear makes you stupid. Panic gets you killed."

"And you have no fear of me?"

The question hung between them, weighted with meaning.

"I didn't say that," ${pName} admitted quietly. "But I've decided that understanding you is worth the risk."

Something shifted in his expression. Something that looked almost like respect.

"Why are you helping me?" she asked, the question she'd been avoiding since the first night. "You've honored our deal. You've shown me more than enough specimens to make my career. Why do you stay?"

${liName} was quiet for a long moment. When he spoke, his voice was rough with something she couldn't identify.

"Because in all my years, in all my battles, in all the victories and losses that have shaped me, I have never..." He stopped, visibly struggling with words. "I have never wanted something the way I want to understand you."

Her breath caught.

"That's—"

"Foolish. I know." He rose abruptly, his massive form blocking out the stars. "I should go."

But he didn't move. And neither did she.

The fire crackled between them, casting dancing shadows across his features, highlighting the sharp angles and softer places that made up his face. In that light, he looked almost vulnerable. Almost lonely.

"Perhaps I'm tired of things that make sense," he said quietly. "Perhaps I wanted something... unexpected."

${pName} looked at him—really looked—and felt something dangerous unfurl in her chest. Something that had nothing to do with logic or reason or control.

"I know the feeling," she admitted.

The corner of his mouth lifted. Not quite a smile, but close.

It was the moment everything changed. Though neither of them was ready to admit it yet.`;
}

// Chapter 2-3: Deepening connection, learning about each other
function generateMeetCuteChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Elena';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  
  return `A week had passed since their first encounter, and ${pName} was no closer to understanding what was happening between them.

Every day, ${liName} appeared at her campsite. Sometimes at dawn, emerging from the mists like a creature from myth. Sometimes at dusk, when the dying light painted his features in shades of gold and shadow. Always watching. Always close.

"You're staring again," she said without looking up from her specimens. She'd gotten better at sensing his presence—the subtle shift in the air, the way the forest seemed to quiet in acknowledgment of its apex predator.

"You're fascinating," he replied, not bothering to deny it. "Your kind usually runs screaming from mine. You organize plants."

"Knowledge is more useful than fear."

"Is that what your books tell you?"

She looked up then, meeting those golden eyes that had begun to haunt her dreams. "That's what experience has taught me. Fear makes you stupid. Panic gets you killed."

Something flickered in his expression—approval, perhaps. Or surprise.

"Tell me about your world," she said suddenly. The request had been building for days, the curiosity becoming impossible to ignore. "Your people. How do you live?"

He was quiet for a long moment, and she thought he might refuse. Then he settled onto a fallen log across from her, his massive frame making the thick trunk look like a twig.

"We live by the old ways," he began, his voice taking on a rhythmic quality she hadn't heard before. "The hunt. The moon. The bonds of pack and blood. We are born to strength, trained to war, chosen for power."

"Chosen how?"

His lips curved. "By combat. By cunning. By the approval of the spirits who watch over our lands." He gestured to the tattoos marking his arms. "Each mark is earned. Each tells a story."

${pName} found herself leaning closer, the scientist in her enthralled by this glimpse into a culture she'd never known existed.

"That one," she said, pointing to a swirling pattern on his bicep. "What does it mean?"

"First kill." His voice was matter-of-fact. "I was twelve winters old. A wolf had been stalking our younglings."

"Twelve?" She couldn't hide her shock.

"We mature differently than your kind. At twelve, I was stronger than your largest warriors. But the wolf..." His hand moved to trace the pattern. "The wolf was my first test. My first proof that I was worthy of my bloodline."

"And were you? Worthy?"

His golden eyes met hers, and for a moment, the predator looked out from behind them.

"I am chieftain of my clan now. War-leader of the eastern territories. I have killed challengers and enemies beyond counting." He paused. "But worthy? That is a question I ask myself every day."

The honesty of the admission struck her like a physical blow. This was not the monster of legend—the mindless beast that human stories warned of. This was a man. Complex, thoughtful, burdened by responsibility.

"Tell me more," she breathed.

And he did.

He told her of feasts that lasted three days and hunts that ranged across entire mountains. Of a code of honor that prized loyalty above all and punished betrayal with death. Of their goddess, who demanded strength but also wisdom, and the shamans who spoke with her voice.

In return, she told him of her world. The universities where she'd studied, the expeditions that had taken her to the corners of the earth, the endless quest for knowledge that drove her forward even when it cost her everything else.

"You are alone," he observed, when she'd finished. It wasn't a question.

"I prefer—"

"No. You do not prefer. You have simply accepted." His voice gentled in a way she wouldn't have thought him capable of. "There is a difference, little scientist."

The nickname should have annoyed her. Instead, it made something warm unfurl in her chest.

"Why do you keep coming back?" she asked, the question she'd been avoiding since the first night. "You've honored our deal. You've shown me more than enough specimens to make my career. Why do you stay?"

${liName} was quiet for a long moment. When he spoke, his voice was rough with something she couldn't identify.

"Because in all my years, in all my battles, in all the victories and losses that have shaped me, I have never..." He stopped, visibly struggling with words. "I have never wanted something the way I want to understand you."

Her breath caught.

"That's—"

"Foolish. I know." He rose abruptly, and she felt the loss of his proximity like a physical ache. "I should go."

"Stay." The word escaped before she could stop it. "Please."

He froze.

"I don't understand what's happening between us," she continued, her voice barely above a whisper. "I'm a scientist. I need things to make sense. But this... you... nothing about this makes sense. And I find that I don't care anymore."

Slowly, so slowly it was almost painful to watch, he turned back to face her.

"You should care." His voice was strained. "My people... your people... there are rules. Laws older than memory."

"I've never been good at following rules."

Something shifted in his expression. The careful control cracked, just for an instant, and she saw the hunger underneath—vast and desperate and barely leashed.

"Neither have I," he admitted.

The air between them crackled with tension. With possibility. With the weight of a choice that neither of them was ready to make.

Not yet. But soon.

"Tomorrow," he said finally, stepping back with visible effort. "I will show you the sacred springs. Where our healers gather their medicines."

"I would like that."

He nodded once, sharply, and disappeared into the forest without another word.

${pName} sat alone in the gathering dark, heart pounding, mind racing, already counting the hours until dawn.`;
}

// Chapter 4-5: Building tension, forced proximity, growing attraction
function generateTensionChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Elena';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  const tensionContent = getHeatLevelContent(heatLevel, 'tension', pName, liName);
  const firstKissContent = getHeatLevelContent(heatLevel, 'first_kiss', pName, liName);
  
  return `The storm came without warning.

One moment ${pName} was cataloging specimens under a clear sky, carefully pressing a flower she'd never seen in any botanical text. The next, the heavens opened with a fury that seemed almost deliberate, rain hammering down so hard she could barely see her hand in front of her face.

Thunder cracked overhead, so close it shook the ground beneath her feet. Lightning split the sky, illuminating the forest in brief, terrifying flashes that revealed shadows that seemed to move between the trees.

"Inside!" ${liName}'s voice cut through the storm, and before she could protest, he'd swept her off her feet—literally—and was carrying her through the deluge.

She should have objected. Should have insisted she could walk on her own two feet, thank you very much. But the storm was getting worse, and he was so warm, and something about being held in those massive arms felt... right.

Dangerous thoughts. Very dangerous thoughts.

The cave he brought her to was dry and surprisingly spacious. It opened from a narrow entrance into a chamber large enough to hold a dozen people comfortably, with ceilings high enough that even ${liName}'s considerable height didn't require him to duck. Someone had clearly been here before; there were furs piled in one corner, a fire pit in the center ringed with stones that had been blackened by countless flames, even a rough wooden shelf stocked with dried meat, strange fruits, and what looked like medicinal herbs.

"My hunters use this place," ${liName} explained, setting her down with surprising gentleness. "When they range too far from the clan to return before nightfall. We maintain shelters throughout the territory."

"How convenient." She was shivering despite herself, her thin research clothes soaked through and clinging to her body in ways that felt entirely too revealing.

His jaw tightened, and she saw his gaze flicker down her form before he deliberately looked away. Without a word, he turned to build a fire, his movements efficient and practiced despite the obvious tension in his shoulders. Within minutes, flames crackled in the pit, casting dancing shadows across the cave walls and filling the space with welcome warmth.

But it wasn't enough. ${pName} couldn't stop trembling, her body temperature dropping despite the fire's heat. Her teeth began to chatter, an embarrassing sound in the quiet of the cave.

"Your clothes," ${liName} said gruffly, still not looking at her. "You need to remove them."

"Excuse me?"

"You'll catch sick. The night cold in these mountains kills even my people if they're not careful, and you humans are..." He paused, searching for the right word. "Fragile."

"I am not fragile."

"You are shaking so hard I can hear your teeth rattle." He gestured to the furs. "There are coverings. Dry yourself and wrap yourself in those. I will... I will not look."

True to his word, he turned his back, presenting her with a view of green-skinned muscle that was entirely too distracting for her current state of mind. ${pName} hesitated only a moment before practicality won out over modesty. She stripped quickly, using a spare fur to dry herself before wrapping herself in layers of soft pelts that smelled of woodsmoke and pine and something she was beginning to recognize as distinctly him.

"I'm covered," she said.

He turned, and something flickered in his golden eyes when he saw her wrapped in the furs of his people. Something possessive. Something hungry. Something that made her stomach flip despite the cold still seeping through her bones.

"You need to warm up," he said, his voice rougher than before. "Body heat is most effective. Our healers say—"

"I don't think—"

"You are shaking." It was true. Even wrapped in furs, even with the fire crackling nearby, she couldn't stop trembling. The cold had seeped too deep, settling into her bones like a living thing. "I will keep my distance if you wish. But the cold..."

She should refuse. Should maintain the careful boundaries that had kept her safe thus far. But she was so cold, and he was so warm, and the storm showed no signs of stopping. Thunder continued to rumble outside, and through the cave entrance, she could see rain coming down in sheets so thick it looked like a waterfall.

"Fine," she whispered. "Just... be appropriate."

His laugh was unexpected—deep and genuine, rumbling through his chest like distant thunder. "In my culture, there is nothing inappropriate about providing warmth to one who needs it. We are a practical people. Survival comes before modesty."

He settled beside her, not touching but close enough that she could feel the heat radiating from his massive form like a furnace. The contrast was startling—she'd expected him to run cold, like the reptiles she'd studied, but he burned hot. Impossibly, wonderfully hot.

Slowly, carefully, he reached out and pulled her against his side.

The warmth was immediate and overwhelming. She melted into him despite herself, her body responding to the comfort even as her mind screamed warnings about the wisdom of getting this close to a creature who could break her with one careless movement.

"Better?" he murmured against her hair, his breath warm on her scalp.

"Yes." The word came out shakier than she intended. "Thank you."

They sat in silence as the storm raged outside. Gradually, her shivering subsided, replaced by a different kind of tension entirely. A different kind of heat.

${tensionContent}

"You smell like rain," he said suddenly, his voice low and rough in a way that made her shiver for entirely different reasons.

"What?"

"Your scent. It changes when you are wet. Like the forest after a storm." His arm tightened fractionally. "I find it... pleasing."

Heat flooded her face—and other places she didn't want to think about. "That's... a strange thing to notice."

"Among my people, scent is important. It tells us things that words do not. We can smell fear. Anger. Desire." He paused, and when he spoke again, his voice had dropped to something almost dangerous. "Right now, for instance... your scent tells me that you are no longer cold."

She should move away. Should put distance between them. Should remember all the reasons this was complicated, dangerous, impossible. He was a monster—literally. She was human. Their peoples had been enemies for a thousand years. There was no future here, no happy ending, nothing but heartbreak waiting at the end of this road.

But her body didn't seem to care about any of that.

Instead of moving away, she turned in his arms to face him.

"What else does it tell you?" she breathed.

His pupils dilated, the gold nearly swallowed by black. A muscle ticked in his jaw, and she could see the war playing out across his features—duty versus desire, honor versus hunger.

"That you want what I want," he said finally, his voice strained. "That your body knows what your mind refuses to accept."

"And what's that?"

"That we are not meant to fight this." His hand came up to cup her face, his palm spanning nearly her entire cheek. The contrast between them was stark and somehow beautiful—his green skin against her pale flesh, his massive hand cradling her like something precious. "Whatever this is between us... it is not something we chose. But it is something we cannot deny."

"We shouldn't—"

"I know." But he was leaning closer, and she wasn't pulling away. "Tell me to stop, little scientist. Tell me this is wrong, and I will release you. I will walk into that storm and not return until my blood has cooled. I will never speak of this again."

She should say the words. They were right there, logical and sensible and safe. This was madness. This was impossible. This was everything she'd spent her life avoiding—messy, complicated, dangerous emotion that couldn't be quantified or controlled.

But when she opened her mouth, what came out was: "Don't stop."

${firstKissContent}

When they finally broke apart, both gasping for air, his forehead dropped to hers. They stayed like that for a long moment, breathing the same air, hearts pounding in sync.

"We should stop," he managed, though his hands were still holding her like he never wanted to let go.

"Probably."

"I want to do everything honorably. There are customs. Rituals. Among my people, when a warrior finds his mate, there are steps that must be followed. Your family must be consulted. Gifts must be exchanged. Blessings must be given by the clan elders and the shamans who speak for our goddess." He took a shuddering breath. "Not in a cave, during a storm, when you are half-naked and wrapped in furs and I can barely remember my own name."

She laughed, and the sound surprised her. She hadn't laughed—really laughed—in longer than she could remember. "My family wouldn't understand. They barely understood my career choice. This would be... beyond their comprehension."

"That does not mean you don't deserve it." He pulled back far enough to meet her eyes, and she saw something in his gaze that stole her breath. Something that looked terrifyingly like devotion. "You are worth more than a stolen moment in a cave. You are worth everything. The moon ceremonies. The gift exchanges. The blessing of the spirits. You deserve all of it, and more."

Something cracked in her chest. A wall she hadn't even known she'd built, carefully constructed over years of loneliness and professional disappointment and relationships that had fizzled before they ever truly sparked.

"Then give me everything," she whispered. "Eventually. But for now... give me this."

She kissed him again, and this time, neither of them suggested stopping.

***

The storm raged through the night and into the next morning. They stayed wrapped in each other, talking and kissing and learning the landscape of each other's bodies with careful, reverent hands.

${liName} told her about the mating customs of his people—the courtship dances, the challenge fights, the moon ceremonies where bonds were sealed under the eye of their goddess. He spoke of mates who could feel each other's emotions, who always knew when the other was in danger, who were bound not just in body but in soul.

"Is that what this is?" she asked, tracing the tattoos on his chest. "Some kind of... bond?"

"I do not know." His voice was troubled. "Such bonds have never formed between our kind and humans. It should not be possible. But..." He caught her hand, pressed a kiss to her palm. "Nothing about you should be possible, and yet here you are."

She should have been terrified. Instead, she felt something suspiciously like hope.

When the storm finally broke, ${pName} gathered her things with a heart that felt different than it had before. Lighter. Fuller. More alive than it had been in years.

"I must return to my clan," ${liName} said, standing at the cave entrance with the morning light painting his green skin in shades of gold. "There are duties I have neglected. Questions that must be answered." He turned to her, and the intensity in his gaze made her knees weak. "But I will return for you. Tonight. And every night after, until you tell me to stop."

"What if I never tell you to stop?"

His smile was slow and devastating. "Then you may find yourself with a very persistent suitor, little scientist. One who does not know the meaning of surrender."

He kissed her once more—hard and fast and full of promise—and then he was gone, vanishing into the forest with a speed that reminded her, despite everything, that he was not human.

${pName} pressed her fingers to her lips, still tingling from his touch, and wondered what the hell she was getting herself into.

Whatever it was, she couldn't wait to find out.`;
}

// Chapter 6-7: Turning point, first major romantic development
function generateTurningPointChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Elena';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  const intimacyLevel = heatLevel === 'scorching' ? 'explicit' : heatLevel === 'steamy' ? 'detailed' : 'fade';
  
  return `The mating moon rose full and golden over the mountain peaks.

${pName} knew what it meant—${liName} had explained it during one of their long conversations by the fire. Among his people, this moon was sacred. A time when bonds were forged that could never be broken. A time when warriors claimed their mates.

"You should go back to your camp," ${liName} said, his voice strained in a way she'd never heard before. His entire body was tense, his muscles corded beneath his green skin as if he was fighting against something powerful. "Tonight is... dangerous."

"Dangerous how?"

"The moon affects us. Heightens everything." His hands clenched into fists. "I do not know if I can control myself around you."

She should have been afraid. Every human instinct should have been screaming at her to run.

Instead, she stepped closer.

"What if I don't want you to control yourself?"

His eyes, already bright gold, seemed to ignite. "You do not know what you are saying."

"I know exactly what I'm saying." Her voice was steady even as her heart pounded. "I've spent my whole life being careful. Being smart. Never taking risks that might hurt me." She reached up to touch his face, her small hand barely spanning his jaw. "I don't want to be careful anymore."

"${pName}." Her name was a growl, a warning, a plea. "If we do this... among my people, it is not just mating. It is bonding. Permanent. I would not be able to let you go."

"Then don't."

The sound he made was barely human. In one fluid motion, he swept her into his arms, carrying her deeper into the cave, away from the moonlight that seemed to sing in his blood.

"Last chance," he said, his forehead pressed to hers. "Tell me to stop, and I will. I will go to the waterfall and let the cold bring me back to myself. But once I claim you..." His voice broke. "You will be mine. Forever. And I will be yours."

${pName} had never been more certain of anything in her life.

"Then claim me."

${intimacyLevel === 'explicit' ? `
His kiss was consuming, possessive, everything she'd dreamed of and more. His tusks scraped against her skin as his mouth mapped her body, and she found the sensation impossibly erotic.

"So small," he murmured against her throat. "So fragile. And yet you make me weak."

"Show me," she demanded. "Show me everything."

He did.

He worshipped her with a devotion that left her shaking, learning every sensitive spot with focused intensity. When his massive hand slid between her thighs, she cried out at the contrast—the size of him, the gentleness of his touch.

"More," she begged.

"Patience, little mate." But his own control was fraying. She could feel it in the tremor of his muscles, see it in the way his eyes glowed like molten gold.

When he finally joined with her, the stretch was overwhelming—pleasure and pressure and something that felt like coming home. He stilled, letting her adjust, his whole body vibrating with restraint.

"Move," she whispered.

He did. And the world dissolved into sensation.

Later—much later—she lay curled against his massive chest, marked and claimed and utterly content. His hand traced lazy patterns on her back, and she could feel the rumble of satisfaction in his chest.

"Mine," he murmured. "Finally, irrevocably mine."

"Yours," she agreed. And felt something settle into place inside her, like a puzzle piece finally finding its home.` : intimacyLevel === 'detailed' ? `
His kiss was everything—tender and fierce, gentle and overwhelming. He laid her down on the soft furs as if she was made of glass, but the hunger in his eyes told a different story.

"Beautiful," he breathed. "In all my years, I have never seen anything so beautiful."

She pulled him down to her, needing to feel the weight of him, the heat of his skin against hers. When they finally came together, she gasped at the sensation—the size of him, the fullness, the overwhelming rightness of it all.

"Don't stop," she pleaded. "Please, don't ever stop."

He didn't.

Afterward, wrapped in furs and warmth and him, she traced the tattoos on his chest with wonder. Her mate. This incredible, impossible creature was her mate.

"How do you feel?" he asked softly.

"Complete," she answered. "For the first time in my life, I feel complete."

His arms tightened around her. "Then I have given you only what you have given me."` : `
What followed was sacred and profound—a joining of not just bodies but souls. He held her like she was precious, touched her like she was holy, and when they finally came together, she felt something shift in the universe.

Afterward, wrapped in his arms, she understood why his people treated this night with such reverence.

Some bonds were simply meant to be.

"You are my mate now," he said softly. "In the eyes of my people, in the eyes of the spirits, in every way that matters."

"And you're mine," she replied. "Whatever comes next, we face it together."

He pressed a kiss to her forehead, and she felt the truth of his love wash over her like warm rain.`}`;
}

// Chapter 8-10: Deepening relationship, learning about each other's worlds
function generateDeepeningChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Elena';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  
  return `The days that followed their mating were a revelation.

${liName} showed ${pName} his world—not as an outsider observing, but as his mate, welcomed into the heart of everything he held sacred.

"The clan knows," he said the morning after, as they lay tangled together in the furs. "They felt the bond form. By now, every warrior in the eastern territories knows that their war-leader has taken a human mate."

Fear flickered in her chest. "Will they accept me?"

"They will have no choice." His voice was iron. "You are mine, and I am their leader. To disrespect you is to disrespect me, and the consequences of that..." His smile was sharp. "They know better."

The village, when they arrived, was nothing like ${pName} had expected.

She'd imagined crude huts, primitive living. Instead, she found a thriving community—homes carved into the mountainside with remarkable engineering, terraced gardens producing food she didn't recognize, children playing in the central square while their parents went about their work.

"It's beautiful," she breathed.

"It is home." ${liName}'s hand found hers. "Our home now, if you want it to be."

The clan members watched them pass with curiosity rather than hostility. Some bowed their heads in acknowledgment. Others simply stared, their eyes fixed on the small human woman walking beside their massive chieftain.

"They're staring," she murmured.

"Of course they are. You are extraordinary."

"I'm just—"

"The woman who captured the heart of the warrior who swore he would never take a mate." He stopped in the center of the square, turning to face her. "The woman brave enough to walk into monster territory armed with nothing but a notebook. The woman who saw me—truly saw me—and did not run."

His voice carried, she realized. He wanted them to hear.

"In the eyes of my people, courage is the greatest virtue. And you, little scientist, have more courage than warriors twice your size." He lifted their joined hands, displaying the bond to all who watched. "This is your chieftain's mate. She will be treated with the honor she deserves, or the offender will answer to me."

A murmur ran through the crowd—not of disapproval, but of respect. One by one, they bowed their heads.

${pName} felt tears prick her eyes. She had never belonged anywhere. Had always been too strange, too focused, too different for the human world. But here, in this impossible place...

"Thank you," she whispered.

${liName}'s golden eyes softened. "You have nothing to thank me for. I am simply stating the truth."

***

In the weeks that followed, ${pName} found herself becoming part of the clan in ways she never expected.

The children were the first to accept her fully—curious creatures with pointed ears and tiny tusks who wanted to know everything about the human world. She taught them the names of stars in her language; they taught her words in theirs. She showed them how to use her microscope; they showed her how to track game through the forest.

"You're good with them," ${liName} observed one evening, watching her explain photosynthesis to a group of wide-eyed younglings.

"They're curious. I understand curious."

"You understand more than that." His hand settled on her back, warm and possessive. "The clan mothers say you will make a good mother yourself someday."

Her heart stuttered. "We haven't talked about—"

"We don't have to. Not yet." He pulled her close, pressing a kiss to her temple. "But the spirits willing, we have many years to discuss such things."

The shamans accepted her too, eventually. The eldest among them—a wizened female with knowing eyes—had taken one look at ${pName} and laughed.

"The spirits told me the war-leader would bring home trouble," she'd said. "They didn't warn me she would be so small."

"Size means nothing," ${pName} had replied. "I've published thirty-seven papers and discovered three new species. I'd match my 'trouble' against anyone's."

The shaman had laughed again, delighted. "Oh, I like this one. She will be good for him."

"She already is," ${liName} had said, and the love in his voice made ${pName}'s chest ache with happiness.

At night, in their cave high on the mountain, they would talk for hours. About his past—the battles he'd fought, the friends he'd lost, the weight of leadership. About hers—the childhood that made her crave knowledge, the loneliness that had driven her into the wilderness, the yearning for something she'd never been able to name.

Until now.

"I never thought I would have this," she admitted one night, traced the patterns on his chest. "Someone who wanted me for who I am. A place where I belong."

"You deserve this and more." His hand covered hers. "You deserve everything."

"So do you."

They made love then, slow and tender, a conversation without words. And when she fell asleep in his arms, ${pName} knew with absolute certainty:

She was exactly where she was meant to be.`;
}

// Chapter 11-12: Crisis, dark moment, threat to the relationship
function generateCrisisChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Elena';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  
  return `The attack came at dawn.

${pName} was gathering herbs at the edge of camp when the war horns sounded—a terrible, keening wail that made her blood run cold.

"${pName}!" ${liName}'s voice cut through the chaos. He was running toward her, battle gear already strapped to his massive frame, his face a mask of fury and fear. "Get to the caves. Now."

"What's happening?"

"Raiders from the western clans. They've violated the borders." His jaw clenched. "They're here for blood. For territory." His eyes met hers, and she saw the truth he didn't want to say. "For you."

"Me?"

"Word has spread that I took a human mate. Some see it as weakness. An opportunity." He pressed a dagger into her hand. "Go to the caves. The shaman will protect you. I will come for you when this is over."

"${liName}—"

"Go." He kissed her fiercely, desperately. "I cannot fight them if I'm worried about you. Please."

She ran.

The caves were chaos—women and children huddled together, warriors too old or too young to fight standing guard at the entrance. The shaman found her, pulled her into a protected alcove.

"You must stay hidden, little human." Her voice was grave. "They will be looking for you specifically."

"Why?"

"Because to kill the chieftain's mate is to break the chieftain. And a broken leader..." She didn't finish. She didn't need to.

The sounds of battle filtered through the mountain—roars and screams and the clash of weapons. ${pName} pressed her hands over her ears, but she couldn't block out the knowledge of what was happening. Of who was out there, fighting for his people.

Fighting for her.

***

When the silence finally came, it was worse than the noise.

${pName} was on her feet before she could think, pushing past the shaman's restraining hand, running toward the entrance of the caves.

"Child, wait—"

But she couldn't wait. Couldn't breathe, couldn't think, couldn't function until she knew.

The battlefield was a nightmare. Bodies lay scattered across the clearing—some from ${liName}'s clan, more from the raiders. Blood soaked into the earth, and the air was thick with the copper smell of death.

She found him at the center of the carnage.

${liName} was on his knees, surrounded by the bodies of his enemies. His green skin was painted with blood—his own, she realized with horror. The wound in his side was deep, pulsing red with each labored breath.

"No." She was running, falling to her knees beside him. "No, no, no—"

"${pName}." Her name was a whisper on his lips. "You should not... see this..."

"Shut up." Tears were streaming down her face as she pressed her hands to the wound. "You're going to be fine. The shaman—the healers—"

"They have fallen." His hand covered hers, leaving bloody fingerprints on her skin. "I am... sorry."

"Don't you dare." Her voice cracked. "Don't you dare leave me."

"Never leaving." He smiled, and even now, with death creeping toward him, it was beautiful. "Bound, remember? Forever."

"Then fight! You're a warrior, damn it. Fight!"

"Fighting..." His eyes were closing. "Always fighting... tired now..."

"${liName}!"

But he was slipping away, his breath growing shallow, his massive body going still in her arms.

${pName} screamed.

She didn't know how long she knelt there, holding him, begging a universe she'd never believed in to give him back. The sun moved across the sky. Voices came and went. Hands tried to pull her away.

She didn't let go.

It was the shaman who finally reached her. Old, wizened, somehow still standing when so many had fallen.

"There may be a way," she said quietly. "But it will cost you."

"Anything." ${pName} didn't hesitate. "I'll pay anything."

The shaman studied her with ancient eyes. "The spirits told me you would say that. They also told me what the price would be."

"I don't care. Just save him."

"Very well." The shaman knelt beside them, began to chant in a language older than the mountains. "But know this, child—the bond you share will become something more. You will not just be his mate. You will be bound to this world, to these people, forever. You will never be able to return to the life you knew."

${pName} looked down at ${liName}'s pale face, at the warrior who had claimed her heart against all odds.

"I already can't," she whispered. "There's nothing to go back to. He's my home now."

The shaman smiled. "Then the spirits were right about you after all."

The ritual began.`;
}

// Chapter 13-14: Climax, resolution of conflict, grand gesture
function generateClimaxChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Elena';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  
  return `The light was blinding.

${pName} felt power surge through her—ancient and wild and utterly inhuman. Her blood burned with it, her bones ached with it, and somewhere in the distance, she could hear the shaman chanting faster, louder, desperate.

"Hold on, child! You must hold on!"

She was trying. But the magic was too much, too strong, too everything. It wanted to consume her, to reshape her, to tear her apart and rebuild her as something new.

*Worth it,* she thought, clinging to the image of ${liName}'s face. *He's worth it.*

The power crested. Broke.

And then—silence.

${pName} opened her eyes to find herself lying on the ground, gasping for breath. Every cell in her body hummed with something that hadn't been there before. Something that pulsed in time with the heartbeat she could suddenly hear—not her own.

${liName}'s.

She turned her head. He was beside her, still unconscious but breathing. The wound in his side was closed, sealed with the same golden light that still flickered on her skin.

"It worked." The shaman's voice was awed. "The spirits—they accepted you. Made you one of us."

"I don't understand."

"Look at your hands, child."

${pName} raised her hands in front of her face and stared.

Her skin had changed. Not drastically—she was still recognizably human—but there was a faint green tint to it now, barely visible. Her nails were sharper. And when she ran her tongue over her teeth, she felt points that hadn't been there before.

"What happened to me?"

"You offered yourself as payment for his life. The spirits... had their own ideas about what form that payment should take." The shaman smiled. "You are no longer fully human, ${pName}. You are something new. Something that bridges both worlds."

Before she could respond, ${liName} groaned.

"${pName}?" His voice was weak but clear. His eyes—those beautiful golden eyes—fluttered open and found her face. "You're... different."

"I saved you." She was crying, she realized. "The shaman said there was a way, and I—"

"You sacrificed your humanity for me."

"I sacrificed nothing. I gained everything." She pressed her forehead to his. "I love you, you stubborn warrior. Did you really think I was going to let you die?"

His laugh was weak but genuine. "I should have known better."

"Yes. You should have."

His hand came up to cup her face, thumb tracing over her altered features with wonder. "You are still the most beautiful thing I have ever seen. More so, now."

"Flatterer."

"Truth-teller." He pulled her down to him, kissing her with a desperation that spoke of near-loss and gratitude and love so deep it defied words.

***

The clan gathered that evening to witness something unprecedented.

${liName} stood before his people, still weakened but alive, with ${pName} at his side. The shaman stood before them, her ancient voice carrying across the silent crowd.

"Today, we witnessed a miracle," she said. "Our chieftain was struck down, and would have passed to the spirit realm. But his mate—this small, fierce human—offered herself to save him. The spirits heard her plea and answered with a gift."

Murmurs ran through the crowd.

"${pName} is no longer human. She is no longer other. She is one of us—bound by blood and spirit to this clan, to this land, to this chieftain." The shaman raised her arms. "She has proven her worth a hundred times over. From this day forward, she is not merely chieftain's mate. She is chieftain's equal. A leader of the eastern clans."

The crowd erupted.

${pName} stood frozen, overwhelmed, as warriors who had once eyed her with suspicion dropped to their knees. Women she'd barely spoken to were weeping. Children were cheering her name.

"Breathe," ${liName} murmured in her ear. "You've earned this. All of it."

"I didn't—I just wanted to save you—"

"And in doing so, you became exactly what our people needed." His hand found hers. "A leader with the courage to sacrifice everything for those she loves. That is the mark of true strength."

"I don't know how to lead."

"Neither did I, once." He raised their joined hands to the crowd. "We will learn together. We will rule together. And we will face whatever comes, together."

The cheers grew louder.

${pName} looked out at the clan—her clan now—and felt something she had never expected to feel.

Home.

For the first time in her life, she truly belonged.

When they finally broke apart, breathless and grinning, he pressed his forehead to hers.

"We should go inside."

"We should."

"Unless you want to give your neighbors a show."

"Definitely not." But she kissed him again anyway. One more. Two. Lost count somewhere around six.

"${pName}?"

"Yes?"

"Thank you. For being brave."

She smiled against his lips. "Thank you for being worth it."

They walked inside together, hand in hand, leaving the rain and the fear and all their old armor behind.`;
}

// Chapter 15 (or final): Resolution, HEA (Happily Ever After)
function generateResolutionChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Elena';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  
  return `One year later.

${pName} stood on the balcony carved into the mountainside, watching the twin moons rise over the valley below. So much had changed since she'd first stumbled into this world—a human scientist searching for rare plants, never imagining she would find so much more.

Behind her, the sounds of celebration drifted up from the village square. Tonight was the anniversary of the great battle—and of the miracle that had followed. The clan gathered each year to honor those who had fallen and celebrate those who remained.

"There you are." ${liName}'s voice was warm as he stepped onto the balcony, wrapping his arms around her from behind. His hand splayed protectively over her rounded belly. "The little one has been quiet tonight."

"She's saving her strength." ${pName} smiled, covering his hand with her own. "She kicked so hard this morning I almost fell over."

"Strong, like her mother." He pressed a kiss to her temple. "Beautiful, too, I have no doubt."

"And stubborn like her father."

"An excellent combination."

They stood in comfortable silence, watching the moons climb higher. Below them, the village sparkled with lights and laughter—a community that had become her family, a world that had become her home.

"I was thinking," ${pName} said slowly, "about the day we met."

"The day you nearly took my head off with a specimen jar?"

She laughed. "I was scared."

"You were magnificent." His arms tightened around her. "I knew, even then, that you were different. That you were going to change everything."

"I thought you were terrifying."

"And now?"

"Now I know you're terrifying." She turned in his arms, reaching up to cup his face. "But you're also kind, and gentle, and the best mate I could have asked for."

His golden eyes softened. "I love you, little scientist. More than I have words to express."

"I love you too." She stretched up to kiss him. "Even though you snore."

"I do not snore."

"You absolutely do. It's like sleeping next to a thunderstorm."

"Lies and slander."

She was laughing when the first horn sounded from the village below—not the alarm horns of war, but the celebration horns. Their cue.

"Ready?" ${liName} asked, offering his arm.

${pName} looked at him—her mate, her partner, the father of her child. The impossible creature who had taught her what it meant to truly live.

"With you? Always."

They descended together, the chieftain and his mate, to join their people in celebration. And as ${pName} watched ${liName} greet the clan members who had become her family, as she felt her daughter kick in approval, as she breathed in the mountain air of a world that had become her home...

She realized that the greatest discovery of her life had nothing to do with science.

It was this: that love could be found in the most unexpected places. That home was not a location but a feeling. That the walls we build to protect ourselves are often the very things that keep out the joy we're searching for.

And that sometimes, the bravest thing a person can do is let those walls fall down.

${liName} caught her eye across the crowd and smiled—that soft, private smile that was just for her.

${pName} smiled back, one hand on her belly and her heart full to bursting.

This was her story. Her adventure. Her happily ever after.

And it was only just beginning.

*The End*`;
}

// ============================================================================
// HERO POV CHAPTERS - Readers LOVE getting inside the hero's head
// These show his struggle, his attraction, and his vulnerability
// ============================================================================

// Hero POV: His first impression of her (Chapter 2)
function generateHeroMeetChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Wren';
  const liName = loveInterest?.name || 'Kael';
  const elements = getGenreElements(genre);
  
  return `**${liName}**

He smelled her before he saw her.

It was wrong—impossible—but his body knew it before his mind could catch up. That scent, drifting through the ancient trees, bypassed every rational thought and went straight to something primal. Something he'd believed long dead.

*Mate.*

The word echoed through his skull like a war drum.

${liName} had ruled the Eastern Clans for fifteen winters. He had killed challengers, negotiated treaties, led his warriors through battles that would be sung about for generations. He had never—not once—lost control.

But standing in the shadows, watching this tiny human female examine flowers in *his* territory, he felt control slipping through his fingers like water.

${getRandomThought('attraction')}

She was... nothing like what he'd expected. Where his females were tall and strong, built for battle and childbearing, this creature was slight. Fragile. Her hair caught the moonlight like spun copper, and her movements were careful, methodical—a predator's patience wrapped in prey's packaging.

His warriors had reported a trespasser. A human. ${liName} had come expecting to eliminate a threat.

Instead, he found himself rooted to the spot, unable to look away.

*Kill her,* the chieftain in him demanded. *She has violated our borders. The law is clear.*

But another voice—older, deeper, more honest—whispered something else entirely.

*Mine.*

He watched her crouch beside a glowing flower, her notebook open, her expression one of pure wonder. No fear. No hesitation. Just... curiosity. As if the forbidden forest was nothing more than an interesting puzzle to be solved.

Foolish. Impossibly, inexplicably foolish.

And yet...

${liName} stepped out of the shadows before he made the conscious decision to move.

The moment she saw him, her entire body went still. Her eyes—gods, those eyes, deep and intelligent and utterly unafraid—traveled up his form with clinical assessment. Not the terror humans usually showed. Not even the instinctive submission his presence commanded.

She was *evaluating* him. Like he was one of her specimens.

Something hot and unfamiliar coiled in his chest.

"You shouldn't be here, human," he said, and his voice came out rougher than intended. "These lands are forbidden to your kind."

She should have run. Every creature with survival instincts should have fled from a predator three times her size with tusks designed for rending flesh.

Instead, she lifted her chin and met his gaze directly.

"I go where my research takes me. I wasn't aware I needed permission from anyone."

The words hit him like a physical blow. When was the last time anyone had dared speak to him without deference? Without fear?

*Never,* he realized. The answer was never.

He took a step closer, testing her, waiting for the fear to kick in. It didn't.

"Brave," he said slowly. "Or foolish."

"I prefer 'determined.'"

His lips twitched—an actual smile threatening to form. He couldn't remember the last time he'd smiled for anything other than show.

Behind him, his warriors shifted restlessly. He could feel their confusion, their hunger for violence. They'd followed him expecting blood.

${liName} should give the order. Should remove this threat before it became a complication. Before the scent of her drove him mad. Before the way she looked at him—not as a monster, but as something she wanted to *understand*—dismantled centuries of careful control.

"Leave us," he commanded.

The words shocked him as much as his warriors.

"Chieftain—"

"*Leave.*"

They fled. They knew better than to argue when he used that tone.

And then they were alone—the human and the monster—in a clearing that suddenly felt too small.

"I'll make you a deal," he heard himself say, the words emerging from somewhere outside his rational mind. "Stay in this clearing. Conduct your research. I will ensure your safety."

Her eyes narrowed. "And what do you get in return?"

*Everything,* he thought. *I get to see you. To learn you. To understand why my soul is screaming that you belong to me.*

"The pleasure of your company," he said instead. "It's been a long time since something interesting wandered into my forest."

She studied him for a long moment, and he felt exposed in a way he hadn't since he was a youngling. As if she could see through all his armor to the creature underneath.

"Deal," she said finally.

And ${liName}—chieftain, warrior, the most feared creature in the eastern territories—felt something he hadn't felt in centuries.

Hope.

***

He couldn't stay away.

That first night, he'd returned to his clan, determined to purge her from his thoughts. He was *chieftain*. He had responsibilities. An entire people depending on his leadership.

But dawn found him back at the clearing's edge, watching her catalog flowers with that single-minded focus that made his chest ache.

"You're staring again," she said without looking up.

He didn't bother denying it. "You're fascinating."

The days blurred together after that. He told himself it was duty—protecting the borders, ensuring she kept to the agreed-upon territory. But each morning, he arrived earlier. Each evening, he left later. Each moment between was torture and paradise wrapped in one impossible package.

She asked questions no one had ever asked. About his life. His customs. His dreams. And he answered—actually answered—in ways he hadn't with anyone since his mother's death.

"Why do you keep coming back?" she asked one evening, and the directness of the question shouldn't have surprised him anymore.

${liName} looked at her—this tiny, fierce female who had turned his world upside down—and felt the truth rise up before he could stop it.

"Because in all my years," he said, "I have never wanted something the way I want to understand you."

Her breath caught. Something flickered in those remarkable eyes.

*Don't,* the chieftain in him warned. *This ends in disaster.*

But the male in him—the one who had been waiting centuries for exactly this—refused to listen.

"I should go," he said, rising abruptly.

"Stay." Her voice was soft. Uncertain. But the word hit him like a physical blow. "Please."

${liName} looked down at her—this creature who had no business affecting him this way—and made a decision that would change everything.

He stayed.

And something that had been frozen inside him for longer than he could remember began, slowly, to thaw.`;
}

// Hero POV: His struggle to resist (Chapter 4)
function generateHeroTensionChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Wren';
  const liName = loveInterest?.name || 'Kael';
  
  return `**${liName}**

The storm was a blessing and a curse.

A blessing because it forced her into the cave. Into close quarters. Into proximity that his body craved like air.

A curse because ${liName} was losing the battle against himself.

He'd carried her through the rain, her slight weight nothing in his arms, her scent filling his lungs until thought became impossible. She'd felt so *right* there—like she'd been designed to fit against him.

*Dangerous thoughts. Stop.*

But his body wasn't listening. His body hadn't listened to his commands since the moment he'd first caught her scent.

Now she was wrapped in furs—*his* furs—shivering despite the fire, and every instinct he possessed was screaming at him to warm her. To wrap himself around her. To claim what his soul had already decided was his.

"Your clothes," he said, hating how rough his voice sounded. "You need to remove them."

The look she gave him—surprised, yes, but not frightened—did nothing to cool his blood.

"Excuse me?"

"You'll catch sick." He forced himself to turn away, to present her with his back rather than his hungry gaze. "There are coverings. Dry yourself. I will not look."

The sounds of her undressing were torture. The rustle of wet fabric. The soft exhale as cold air hit warm skin. He gripped his own arms hard enough to leave bruises, fighting to maintain control.

*You are a chieftain. You are NOT an animal.*

But gods, she made him want to be.

"I'm covered," she said finally.

He turned—and immediately wished he hadn't.

She was wrapped in the furs of his ancestors, her hair damp and curling around her face, and something about seeing her clothed in *his* things made his blood sing with possession.

*Mine,* that primal voice insisted. *She wears our furs. She's in our territory. She's OURS.*

"You need to warm up," he managed. "Body heat is most effective."

"I don't think—"

"You are still shaking." It wasn't a lie. But his motives weren't entirely altruistic.

When she finally agreed—when she finally pressed her cold body against his heated skin—${liName} had to bite back a groan. She fit against him perfectly. As if the gods had carved her specifically for his arms.

"Better?" he asked, and the word came out like gravel.

"Yes."

They sat in silence, the fire crackling, the storm raging outside, and ${liName} fought the hardest battle of his life.

"You smell like rain," he said, because if he didn't say something, he was going to do something he couldn't take back.

"What?"

"Your scent. It changes when you are wet." He should stop talking. Should *definitely* stop breathing her in. "I find it... pleasing."

Understatement of the century. He found it *intoxicating*.

"That's... a strange thing to notice."

"Among my people, scent is important." He was playing with fire now. "It tells us things that words do not. We can smell fear. Anger." He paused. "*Desire.*"

He felt her go still against him. Felt her heartbeat accelerate.

"Right now, for instance," he continued, unable to stop himself, "your scent tells me you are no longer cold."

She turned in his arms to face him, and the look in her eyes—wanting and uncertain and brave all at once—shattered something inside him.

"What else does it tell you?" she breathed.

*That you want me. That your body knows what your mind refuses to accept. That we are meant for each other in ways neither of us understands.*

"That you want what I want," he said. "That we are not meant to fight this."

"We shouldn't—"

"I know." But he was leaning closer, drawn by a force stronger than reason. "Tell me to stop, and I will. Tell me this is wrong, and I will walk into that storm and not return until my blood has cooled."

She didn't tell him to stop.

Instead, she whispered: "Don't."

When their lips finally met, ${liName} understood why his people spoke of fated bonds with such reverence.

This was what they meant.

This was *everything*.

He kissed her like she was oxygen and he was drowning. Poured centuries of loneliness and wanting into the press of his lips against hers. She tasted like rainwater and courage and home—a home he hadn't known he'd been searching for.

When they finally broke apart, both gasping, he pressed his forehead to hers and made a vow.

He would do this right. He would court her properly. Honor her the way she deserved.

Even if it killed him.

*She's worth it,* he thought, holding her close as the storm raged on. *Whatever comes, she's worth everything.*`;
}

// Hero POV: His realization of love (Chapter 8)
function generateHeroDeepeningChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Wren';
  const liName = loveInterest?.name || 'Kael';
  
  return `**${liName}**

He was in love.

The realization hit ${liName} like a war hammer while watching ${pName} teach the clan younglings about human constellations, her hands tracing patterns in the night sky, her voice soft with wonder.

He loved her.

Not just wanted her—though gods knew he wanted her with an intensity that scared him. Not just desired her presence—though the hours away from her felt like physical pain.

He *loved* her. The whole of her. The curiosity that drove her into danger. The stubbornness that made her argue with him about everything from hunting techniques to the proper way to prepare tea. The way she laughed—startled and bright, as if joy was something she'd forgotten she was capable of.

The way she looked at him like he was worth something more than his strength. More than his title.

*I love her.*

The thought should have terrified him. Chieftains were not supposed to love. They were supposed to rule, to lead, to sacrifice their own desires for the good of their people.

But watching ${pName} now—watching his mate—${liName} couldn't find it in himself to regret.

"You're staring again," she said, approaching him after the children had scampered off to bed. "You do that a lot."

"I like the view."

She rolled her eyes, but he saw the blush climb her cheeks. She tried so hard to hide when he affected her. As if he couldn't smell her attraction rising, feel her pulse quicken through their bond.

"The children adore you," he said, pulling her into his arms. "The shaman says they've never taken to an outsider so quickly."

"I'm not an outsider anymore." She pressed her face against his chest, her words muffled. "The spirits saw to that."

His arms tightened around her. The reminder of what she'd sacrificed—her humanity, her old life, everything she'd known—still made him ache.

"Do you regret it?" he asked quietly. "Any of it?"

She pulled back to look at him, and the certainty in her eyes stole his breath.

"Not for a single moment."

"${pName}..."

"I mean it." She reached up to cup his face, her altered fingers tracing the line of his tusk with intimate familiarity. "I spent my whole life searching for something I couldn't name. A place to belong. Someone to see me for who I really was." Her voice cracked. "I found it here. With you. With your people. How could I ever regret that?"

${liName} had led armies. Had faced down death without flinching. Had made decisions that shaped the fate of nations.

Nothing had ever unmanned him the way her simple words did now.

"I love you," he said, and the words felt inadequate. Too small for the enormity of what he felt. "I love you in a way I didn't know I was capable of. You've become the center of everything. The reason I breathe."

Her eyes went wide. Shiny.

"That's the first time you've said it," she whispered. "Out loud."

"I've been saying it every day. In every look. Every touch." He pressed his forehead to hers. "I was afraid the words would make it too real. Make you too easy to lose."

"You won't lose me."

"Promise?"

"Promise." She stretched up to kiss him—soft and sweet and somehow more devastating than all their passionate encounters combined. "I love you too, you know. In case that wasn't clear."

He laughed—an actual laugh, free and unguarded—and swept her into his arms.

"Where are we going?" she asked, though she was already wrapping her arms around his neck.

"Our chambers. I intend to show you exactly how much your words mean to me." He pressed a kiss to her throat. "It may take all night."

"Only all night? You're getting lazy in your old age."

"Brat."

But he was grinning as he carried her home, his heart lighter than it had been in centuries, full to bursting with a love he'd never expected to find.

*Mine,* he thought, the word no longer claiming but grateful. *Thank the spirits, she's mine. And I'm hers. Forever.*`;
}

// Hero POV: His dark moment / almost losing her (Chapter 10)
function generateHeroCrisisChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Wren';
  const liName = loveInterest?.name || 'Kael';
  
  return `**${liName}**

He was dying.

${liName} knew it with the same certainty he knew his own name. The wound in his side was mortal—even his enhanced healing couldn't repair what the poisoned blade had done.

But that wasn't what terrified him.

${pName}. Where was ${pName}?

"Chieftain!" His second-in-command's voice seemed to come from very far away. "The battle is won. The raiders are retreating."

"My mate." Speaking was agony. Each word cost him blood he couldn't spare. "Where is my mate?"

"Safe. In the caves, as you ordered."

Some of the tension drained from his body. Safe. She was safe.

*Good,* he thought as the world began to gray at the edges. *That's all that matters.*

He'd known this day would come eventually. Had accepted, when he took up the mantle of chieftain, that he would likely die in battle. It was an honorable end. A warrior's end.

But he'd never expected to mind so much.

Before ${pName}, death had seemed like nothing more than the final adventure. Now it felt like betrayal. Like abandoning the only thing that had ever truly mattered.

*I'm sorry,* he thought, his vision swimming. *I'm so sorry, my love. I wanted more time. I wanted forever.*

The darkness was warm. Welcoming. He could feel himself slipping into it, the pain fading to something distant and unimportant.

And then—

"${liName}!"

Her voice. Her scent. Her hands on his face, his chest, pressing against the wound as if she could hold his life inside through sheer will.

"No. No, no, no—"

He tried to speak. Tried to tell her he loved her, that she needed to be strong, that the clan would need her now. But his voice had finally failed him.

"Don't you dare." She was crying, he realized dimly. His fierce, brave mate was crying for him. "You don't get to leave me. Not like this. Not after everything."

*I'm sorry,* he thought again. *I tried. I tried to be worthy of you.*

Her forehead pressed to his. "I'll find a way. I'll save you. Whatever it costs."

*No.* The word screamed through his mind, even as his lips refused to form it. *Not at cost to yourself. Never that.*

But he was falling, falling into darkness too complete to fight, and the last thing he heard was ${pName}'s voice saying words he couldn't quite understand.

And then—light.

Blinding, burning, impossibly bright light pouring through the bond they shared, filling him with energy that wasn't his. With *life* that wasn't his.

${pName}'s life. Her humanity. Her sacrifice.

*NO!*

${liName} fought through the darkness with everything he had, clawing his way back toward consciousness. He couldn't let her do this. Couldn't let her destroy herself for him.

But even as he struggled, he felt the wound closing. Felt strength returning to his limbs. Felt the poison retreating before power too ancient to deny.

When his eyes finally opened, he found himself staring at a goddess.

${pName} knelt over him, but she was... changed. A faint green tinge colored her skin. Her teeth were sharper. Her eyes held depths they hadn't before.

"You sacrificed yourself," he rasped. "Your humanity—"

"I sacrificed nothing." Her voice was fierce. Certain. "I gained a family. A home. A mate worth any price." Tears streamed down her altered face. "I love you, you stubborn warrior. Did you think I was going to let you go that easily?"

He pulled her down to him, ignoring the lingering pain, ignoring everything except the need to hold her.

"I don't deserve you," he said against her hair. "I've never deserved you."

"Probably not." Her laugh was watery but real. "Good thing I'm not going anywhere."

${liName} closed his eyes and held his mate—his bonded, his equal, his reason for existence—and made a silent vow to whatever spirits were listening.

*I will spend every remaining day of my life being worthy of what she's given me. Whatever it takes. However long I have.*

*She's saved me in every way possible.*

*I will never stop trying to be the mate she deserves.*`;
}

// Hero POV: Grand gesture / declaration (Chapter 12)
function generateHeroClimaxChapter(protagonist: any, loveInterest: any, genre: string, heatLevel: string): string {
  const pName = protagonist?.name || 'Wren';
  const liName = loveInterest?.name || 'Kael';
  
  return `**${liName}**

The clan had gathered in the great hall, summoned by horns that hadn't sounded in a generation.

${liName} stood before his people—his tribe, his family, the souls he'd sworn to protect—and felt nervousness for the first time since childhood. Not about the words he was about to speak. About whether he could speak them well enough.

${pName} deserved a speech worthy of her sacrifice. Worthy of the love she'd given so freely. Worthy of the miracle she'd become.

He only hoped his warrior's tongue could find poetry when it mattered most.

"My people," he began, his voice carrying to the farthest corners of the hall. "One year ago, I found a human in our forest. She was small. Seemingly defenseless. A trespasser by every law we hold sacred."

Murmurs rippled through the crowd. They knew this story. Had lived it alongside him.

"I should have killed her. That was what our laws demanded." He paused, letting the words settle. "Instead, I fell in love with her."

The hall went utterly silent.

"I didn't intend to. Didn't want to. Fought against it with everything I had." He found ${pName}'s eyes in the crowd—wide and shining with unshed tears. "But this female—this impossibly brave, infuriatingly stubborn, achingly beautiful creature—saw past every wall I'd built. She looked at the monster everyone else saw and found the man underneath."

His voice cracked. He didn't care.

"She gave up her humanity to save my life. Sacrificed everything she was to become something new. Not for glory. Not for power. Not for anything except love."

He stepped down from the dais, the crowd parting before him as he moved toward his mate.

"The spirits chose her. Made her one of us. But I choose her too. Every day. Every moment. For the rest of my existence, I will choose her."

He stopped before ${pName}, this tiny fierce female who had become his entire world, and sank to his knees.

The crowd gasped. A chieftain *never* knelt. Not for anyone. Not for anything.

But she wasn't anyone. She was everything.

"${pName}." Her name was a prayer on his lips. "Before these witnesses—before the spirits of our ancestors—I pledge myself to you. My heart. My soul. My body. My life. Everything I am and everything I will ever be."

He reached into his tunic and withdrew the gift he'd been crafting for months—a necklace of twisted gold and moonstone, bearing the symbol of his house.

"Among my people, when a chieftain takes a mate, he offers her the crest of his bloodline. It signifies that she is not merely his companion, but his equal in all things. His partner in leadership. His voice in council."

He held it up, and the moonstones caught the light, glowing with inner fire.

"I offer you more than a crest, ${pName}. I offer you my entire heart. It's been yours since the moment I saw you. Please—accept it. Accept me. Not as your chieftain, but as your mate. Your partner. Your husband, in the tradition of your people."

${pName} was crying openly now, and so were half the females in the hall.

"You're already my mate," she said, her voice steady despite the tears. "You've been my home since the moment we met."

"Then let me make it official." He smiled, the expression feeling foreign and wonderful all at once. "Let me tell the entire world—monster and human alike—that you are mine and I am yours. Forever."

She took the necklace from his hands. Fastened it around her neck. And then she pulled him to his feet and kissed him with every ounce of love she possessed.

The hall erupted in cheers.

${liName} held his mate—his wife, his partner, his reason for being—and let the joy wash over him.

*This,* he thought, *is what I was made for. Not war. Not leadership. Not power.*

*Her. Always her.*

*And whatever comes next, we face it together.*`;
}

// ============================================================================
// EPILOGUE GENERATOR - The HEA payoff readers NEED
// ============================================================================

function generateEpilogue(protagonist: any, loveInterest: any, genre: string, heatLevel: string, yearsLater: number = 1): string {
  const pName = protagonist?.name || 'Wren';
  const liName = loveInterest?.name || 'Kael';
  
  const timeDescriptions: Record<number, string> = {
    1: 'One year later',
    2: 'Two years later',
    3: 'Three years later',
    5: 'Five years later',
    10: 'Ten years later',
  };
  
  const timeDesc = timeDescriptions[yearsLater] || `${yearsLater} years later`;
  
  return `## Epilogue

*${timeDesc}*

${pName} leaned against the balcony railing, watching the moons rise over the mountains that had become her home. Behind her, the sounds of celebration drifted up from the village—laughter, music, the happy chaos of a people at peace.

Arms wrapped around her from behind, warm and familiar. "${liName}," she sighed, melting into his embrace.

"You should be resting." His voice was a low rumble against her ear. "The healers said—"

"The healers said I'm perfectly healthy. *They're* the ones who need rest, dealing with me." She turned in his arms, reaching up to cup his face. "Stop worrying."

"Never." His golden eyes softened as they dropped to the swell of her belly. "Not when I have everything to lose."

The baby kicked, as if responding to her father's voice. ${pName} laughed, pressing ${liName}'s hand to the spot where their daughter was practicing her warrior's dance.

"She's strong," he murmured, wonder in his voice. "Like her mother."

"And stubborn, like her father."

"The perfect combination."

They stood together as the moons climbed higher, surrounded by the sounds of their people—*their* people—celebrating another year of peace, another year of plenty, another year of the impossible love story that had united two worlds.

"I was thinking," ${pName} said softly, "about the day we met."

"The day you almost threw a specimen jar at my head?"

"I did not *almost* throw it. I considered throwing it. There's a difference."

His laugh rumbled through both of them. "I knew then. That you were trouble."

"The best kind of trouble."

"The only kind worth having." He pressed a kiss to her temple. "I love you, you know. More than I have words for. More than I ever thought possible."

She turned, stretching up to kiss him properly—a kiss that held years of love, of growth, of learning to be something neither of them had imagined.

"I love you too," she whispered against his lips. "Thank you for finding me."

"Thank you for letting yourself be found."

Later that night, curled together in their chambers, ${pName} would trace the new tattoo on ${liName}'s chest—the one that told the story of a human who became one of them, a scientist who became a leader, a woman who became his everything.

And she would think, not for the first time, how strange and wonderful life could be. How the best things often came from the places you least expected. How love could bloom in impossible soil and grow into something that changed the world.

She had come to this forest looking for rare plants.

She had found something infinitely more precious.

She had found home.

She had found him.

And they would have forever.

*The End*

---

*Thank you for reading! If you enjoyed this story, please consider leaving a review. Your support means everything!*

*Want more? Sign up for my newsletter to get bonus epilogues, deleted scenes, and first looks at upcoming books.*`;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function generateInternalMonologue(characters: any[], genre: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest') || characters[1];
  
  const monologues = [
    `${protagonist?.name || 'She'} caught herself staring at him again and quickly looked away, heat flooding her cheeks. What was wrong with her? She'd sworn off men like him—men who could unravel her with a single glance, men who made her forget every hard-won lesson about protecting her heart.

Yet here she was, pulse racing, palms sweating, acting like a teenager with her first crush instead of the composed, professional woman she'd worked so hard to become.

*Get a grip*, she told herself firmly. *He's just a man. An infuriatingly attractive, impossibly charming, dangerously compelling man, but still just a man.*

The self-lecture did nothing to slow her heartbeat.`,
    
    `What was it about ${loveInterest?.name || 'him'} that got under her skin so completely? ${protagonist?.name || 'She'} had met plenty of handsome men before—dated some, even. None of them had ever made her feel like this: breathless, reckless, like standing at the edge of a cliff and wanting to jump.

It wasn't just his looks, though those were considerable. It was the way he looked at her, as if he could see past all her carefully constructed defenses to the woman underneath. The woman she tried so hard to hide.

It terrified her.
It thrilled her.
Most dangerously of all, it made her want things she'd given up hoping for.`,

    `${protagonist?.name || 'She'} pressed her hand to her chest, feeling her heart thunder beneath her palm. This was insanity. Pure, beautiful insanity.

Everything she'd built—her career, her independence, her carefully ordered life—felt suddenly fragile. As if one wrong move, one moment of weakness, could send it all tumbling down.

And the worst part? Looking at ${loveInterest?.name || 'him'}, seeing the hunger in his eyes that surely mirrored her own... she wasn't sure she cared anymore.

Some falls, she was beginning to realize, might be worth the risk.`,
  ];
  
  return monologues[Math.floor(Math.random() * monologues.length)];
}

function generateDialogueScene(characters: any[], heatLevel: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest') || characters[1];
  
  const scenes = [
    `"We need to talk about what happened," ${protagonist?.name || 'she'} said, forcing herself to meet his eyes.

${loveInterest?.name || 'He'} leaned against the doorframe, arms crossed, a sardonic smile playing at his lips. "Do we? I thought we communicated rather well without words."

"That's exactly what I mean." She straightened her spine, refusing to be intimidated—or charmed. "This... whatever this is between us... it can't happen again."

"Can't?" He pushed off the doorframe, moving toward her with predatory grace. "Or won't?"

"Does it matter?"

"It matters to me." He stopped just close enough that she could feel the heat radiating off him. "I need to know if you're running from what you want or what you're afraid of."

The truth of his words hit too close to home. "Maybe they're the same thing."

His expression softened, and for a moment, she glimpsed something vulnerable beneath his confident exterior. "Maybe they don't have to be."`,

    `"You're infuriating, you know that?" ${protagonist?.name || 'She'} threw up her hands in frustration.

"So I've been told." ${loveInterest?.name || 'His'} voice was annoyingly calm. "Usually by beautiful women who don't like being challenged."

"Don't try to charm your way out of this."

"Is it working?"

She glared at him, hating that the answer was yes. Hating even more that he probably knew it.

"What do you want from me?" she demanded.

The playfulness drained from his expression, replaced by something raw and real. "Honestly? I'm not sure anymore. When I met you, I thought I knew. Now..." He ran a hand through his hair, the first sign of uncertainty she'd ever seen from him. "Now you've got me questioning everything."

"Good." The word came out softer than she intended. "Welcome to my world."`,

    `"Tell me something true," she whispered into the darkness. "Something you've never told anyone else."

${loveInterest?.name || 'He'} was quiet for so long she thought he wouldn't answer. When he finally spoke, his voice was rough with emotion she'd never heard from him before.

"I'm terrified of this. Of you. Of how you make me feel."

Her heart stuttered. "You? Afraid?"

"Surprised?"

"You always seem so... invincible."

His laugh was hollow. "Armor isn't the same as invincibility. Some of us just got better at hiding our vulnerabilities."

She reached out in the dark, found his hand, threaded her fingers through his. "Then why tell me?"

"Because you asked. Because I'm tired of pretending. Because..." He squeezed her hand. "Because you make me want to be brave."`,
  ];
  
  return scenes[Math.floor(Math.random() * scenes.length)];
}

function generateSensoryDescription(characters: any[], genre: string, heatLevel: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest') || characters[1];
  
  const descriptions = [
    `The room seemed to close in around them, the air thick with unspoken desire. ${protagonist?.name || 'She'} was acutely aware of every detail—the soft strains of music drifting from somewhere below, the way candlelight played across ${loveInterest?.name || 'his'} features, casting half his face in shadow.

He smelled incredible. That was the thought that kept circling through her mind, distracting her from all the logical reasons she should walk away. Sandalwood and something spicier beneath it, a scent that was uniquely, intoxicatingly him.

Her skin tingled where he'd touched her, phantom sensations that refused to fade. She could still feel the warmth of his palm against the small of her back, the gentle pressure of his fingers entwined with hers.

The city sprawled beyond the windows, a glittering carpet of lights, but for all she noticed it might as well not exist. Her entire world had narrowed to this room, this moment, this man.`,

    `Outside, the storm had reached its peak. Rain lashed against the windows with furious intensity, and thunder rolled across the sky like a symphony of chaos.

Inside, the fire crackled in the hearth, casting dancing shadows across the room. ${protagonist?.name || 'She'} pulled the blanket tighter around her shoulders, but the shiver that ran through her had nothing to do with cold.

${loveInterest?.name || 'He'} sat across from her, whiskey glass in hand, watching her with those penetrating eyes that seemed to see straight through every defense she'd ever built.

"You're staring," she said.

"Yes." No apology, no deflection. Just simple acknowledgment.

"Why?"

"Because I can't seem to stop." He set down his glass. "Because looking at you is the closest thing to peace I've found in a very long time."

The words hung in the air between them, more intimate than any touch.`,

    `The garden was beautiful at twilight—roses heavy with dew, their perfume sweet and heady on the cooling air. ${protagonist?.name || 'She'} walked the winding paths slowly, trying to gather her thoughts, but they scattered like startled birds every time she remembered the heat of his gaze.

She paused beside a fountain, watching the water catch the last rays of sunlight. Her reflection wavered on the surface, a woman she barely recognized. Flushed. Bright-eyed. Looking like someone teetering on the edge of falling irrevocably in love.

Footsteps on gravel announced his approach. She didn't turn around. Somehow, she knew who it would be before he spoke.

"Beautiful evening," ${loveInterest?.name || 'he'} said, coming to stand beside her.

"Yes." Though she wasn't looking at the sunset anymore.

His hand found hers, and she let it. Their fingers interlaced naturally, like they'd been doing this forever. In the soft purple twilight, surrounded by the scent of roses and possibility, she let herself believe—just for a moment—that this could be real.`,
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateEmotionalBeat(characters: any[], genre: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest') || characters[1];
  
  const beats = [
    `${protagonist?.name || 'She'} felt the tears building behind her eyes and furiously blinked them back. She would not cry in front of him. She would not give him that power.

But something in his expression shifted—the arrogance softening into something almost gentle—and her resolve crumbled.

"Don't," she whispered, when he reached for her. "Don't be kind. I can handle you being difficult. I can handle you being impossible. But if you're kind right now, I'm going to fall apart."

"Would that be so terrible?" He pulled her into his arms anyway, and she let him because she was too tired to fight anymore. "Falling apart isn't the same as breaking. Sometimes it's how we make room for something better."

She buried her face against his chest, breathing in the familiar scent of him, and let herself feel safe. Just for a moment. Just for now.`,

    `"My mother used to say that love is just hope with sharper teeth," ${protagonist?.name || 'she'} said quietly. "That it promises everything and delivers pain."

${loveInterest?.name || 'He'} was silent for a moment. When he spoke, his voice was rough. "Is that what you believe?"

"I used to. It was easier that way—safer." She finally looked at him, and what she saw in his eyes made her breath catch. "But you're making it very hard to stay cynical."

"Good." He reached out, tucked a strand of hair behind her ear with a tenderness that made her heart ache. "Because I plan to spend a very long time proving your mother wrong."

"And if you can't?"

"Then I'll spend a lifetime trying anyway." The conviction in his voice was like solid ground after years of shifting sand. "Some things are worth the risk, no matter the odds."

She wanted to argue, to protect herself, to maintain the walls that had kept her safe for so long. Instead, she did something terrifying.

She chose to believe him.`,

    `There was a moment—a single, crystalline moment—when everything became clear.

${protagonist?.name || 'She'} looked at ${loveInterest?.name || 'him'} standing there, rain-soaked and disheveled, having crossed the city in a storm just to find her, and suddenly all her doubts seemed absurd.

"You came," she said, her voice barely a whisper.

"Of course I came." He was breathing hard, water dripping from his hair, looking at her like she was the only thing in the world that mattered. "Did you really think I wouldn't?"

"I hoped. I was afraid to hope."

He crossed to her in three quick strides, cupped her face in his hands, and kissed her like his life depended on it. When they finally broke apart, foreheads pressed together, hearts racing in tandem, he smiled.

"Hope anyway," he said. "I promise to make it worth it."

And standing there in his arms, feeling whole for the first time in longer than she could remember, she finally let herself hope.`,
  ];
  
  return beats[Math.floor(Math.random() * beats.length)];
}

function generateTransitionScene(characters: any[], genre: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest') || characters[1];
  
  const transitions = [
    `The next few days passed in a blur of stolen glances and charged silences. ${protagonist?.name || 'She'} threw herself into work, trying to ignore the way her heart jumped every time her phone buzzed. It was never him, and the disappointment she felt at each wrong notification was telling.

"You're distracted," her assistant noted during their morning meeting. "Everything okay?"

"Fine," ${protagonist?.name || 'she'} said, too quickly to be convincing. "Just a lot on my mind."

A lot being an understatement. Her mind was full of him—his smile, his voice, the way he'd looked at her like she was something precious. The way she'd felt safe in his arms, a feeling she'd stopped believing in years ago.

She needed to focus. She needed to be practical. She needed to stop daydreaming about a man who had "complicated" written all over him.

But every time she closed her eyes, she saw his face. And every time she let herself think about it, she wanted more.`,

    `Time became elastic in the week that followed. Hours dragged when they were apart, then compressed into heartbeats when they were together.

${protagonist?.name || 'She'} learned things about ${loveInterest?.name || 'him'} she hadn't expected. That he was an early riser who ran five miles before sunrise. That he had an encyclopedic knowledge of old films and could recite dialogue from memory. That beneath the polished exterior was a man of quiet depth, still waters hiding complicated currents.

In turn, she found herself opening up in ways she never had before. Sharing childhood memories over wine, admitting fears during late-night conversations, letting him see the cracks in her armor that she'd spent years concealing.

It was exhilarating. It was terrifying. It was falling, and she wasn't sure if she had a parachute or just the blind faith that he'd catch her.

Either way, she thought, she was committed to the jump.`,

    `The charity gala was exactly the sort of event ${protagonist?.name || 'she'} usually enjoyed—glittering chandeliers, champagne towers, the electric hum of power and influence mingling in one elegant space.

Tonight, though, she could barely focus on any of it.

Because he was here. She'd known he would be, had spent an embarrassing amount of time on her appearance because of it, but nothing had prepared her for the reality of seeing him in a perfectly tailored tuxedo, looking like he'd stepped out of her most dangerous fantasies.

Their eyes met across the crowded room, and she felt the impact like a physical blow. He smiled—that devastating half-smile that made her knees weak—and started making his way toward her.

She had perhaps thirty seconds to compose herself. Thirty seconds to remember how to breathe, how to speak, how to pretend that her whole world didn't narrow to a point whenever he was near.

"${protagonist?.name || 'Hello'}," he said, stopping just close enough to be proprietary without causing scandal. "You look incredible."

"You're not bad yourself." *Understatement of the century.*

"Dance with me?"

She knew she should refuse. Should maintain distance, keep things professional, protect what remained of her heart.

Instead, she took his hand and let him lead her onto the floor.

Some battles, she was learning, weren't meant to be won.`,
  ];
  
  return transitions[Math.floor(Math.random() * transitions.length)];
}

// =============================================================================
// KDP BEST PRACTICES INTEGRATED:
// - Quality over quantity: Each chapter serves a purpose in the romance arc
// - Proper pacing: Varied chapter lengths keep readers engaged  
// - Reader engagement: Hooks, tension, emotional beats throughout
// - KU optimization: Content that readers want to finish (pages READ = revenue)
// =============================================================================

function generateOpeningHook(chapterNumber: number, outline: string, characters: any[], genre: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const setting = extractSetting(outline);
  
  const openings = [
    `The ${setting} held its breath as ${protagonist?.name || 'she'} stepped inside, every nerve ending alive with anticipation. Something had shifted in the air—something dangerous, something irresistible.`,
    `${protagonist?.name || 'She'} hadn't expected the flutter in her chest when their eyes met across the ${setting}. It was as if the universe had conspired to bring them to this exact moment.`,
    `The memory of last night lingered like expensive perfume—intoxicating, impossible to ignore. ${protagonist?.name || 'She'} pressed her fingertips to her lips, still feeling the ghost of that kiss.`,
    `Every rational thought screamed that this was a mistake. Yet here ${protagonist?.name || 'she'} stood, heart pounding, about to cross a line that couldn't be uncrossed.`,
    `The tension between them had been building for weeks, a storm gathering force. Tonight, ${protagonist?.name || 'she'} could feel it about to break.`,
  ];
  
  return openings[Math.floor(Math.random() * openings.length)];
}

function generateSceneDevelopment(outline: string, characters: any[], genre: string, heatLevel: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest') || characters[1];
  
  const sceneParagraphs = [
    `${protagonist?.name || 'She'} moved through the space with practiced grace, acutely aware of ${loveInterest?.name || 'his'} gaze following her every movement. The air between them crackled with unspoken words and barely contained desire.`,
    
    `"You're playing with fire," ${loveInterest?.name || 'he'} said, his voice a low rumble that sent shivers down her spine. The warning in his words was belied by the heat in his eyes.`,
    
    `${protagonist?.name || 'She'} tilted her chin defiantly. "Maybe I like getting burned."`,
    
    `The confession hung between them, bold and unapologetic. She watched his jaw tighten, watched the battle play out across his handsome features—duty warring with desire.`,
    
    `"You don't know what you're asking for," he growled, taking a step closer. Close enough that she could feel the heat radiating from his body, could catch the intoxicating scent of him—sandalwood and something uniquely masculine.`,
    
    `"Then show me," she whispered, the words escaping before she could stop them.`,
  ];
  
  return sceneParagraphs.join('\n\n');
}

function generateCharacterInteraction(characters: any[], heatLevel: string, genre: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest') || characters[1];
  
  const interactions = {
    sweet: `
${loveInterest?.name || 'He'} reached out, gently brushing a strand of hair from her face. The simple touch sent warmth flooding through her entire body.

"I've been wanting to do that all evening," he admitted softly.

${protagonist?.name || 'She'} felt her cheeks flush. "Just that?"

His smile was slow, devastating. "Among other things."

Their fingers intertwined naturally, as if they'd been doing this forever. In that moment, surrounded by the soft glow of candlelight, everything felt possible.
    `,
    sensual: `
The distance between them evaporated in an instant. ${loveInterest?.name || 'His'} hand found the curve of her waist, drawing her closer until not even air could pass between them.

"Tell me to stop," he murmured against her ear, his breath warm and tantalizing.

"No." The word was barely a whisper.

His lips found hers in a kiss that started gentle and quickly turned consuming. ${protagonist?.name || 'She'} melted against him, her fingers tangling in his hair as the world outside ceased to exist.

When they finally broke apart, both breathing hard, she saw her own wonder reflected in his eyes.
    `,
    steamy: `
His kiss was demanding, possessive, branding her as his. ${protagonist?.name || 'She'} gasped against his mouth as his hands mapped the curves of her body with expert precision.

"I've imagined this," he confessed between kisses, his voice rough with need. "Every night. Driving myself crazy thinking about how you'd taste, how you'd feel in my arms."

"Stop talking," she demanded, pulling him closer. "Show me instead."

A growl rumbled in his chest. In one fluid motion, he lifted her, her legs wrapping instinctively around his waist. Her back met the cool wall, a delicious contrast to the fire building between them.

"Are you sure?" His question was strained, giving her one last chance to retreat.

In answer, she captured his lips in a kiss that left no room for doubt.
    `,
    scorching: `
Clothes became obstacles to be conquered. His shirt fell away, revealing planes of muscle that her hands immediately sought to explore. His sharp intake of breath when her nails traced down his abs made her feel powerful, desired.

"You're wearing too many clothes," he growled, making quick work of her zipper.

The dress pooled at her feet, leaving her exposed to his hungry gaze. Rather than shy away, ${protagonist?.name || 'she'} held his stare, letting him look his fill.

"Beautiful," he breathed, the reverence in his voice making her heart stutter. "Absolutely beautiful."

Then his mouth was on her skin, kissing, tasting, worshipping every inch he could reach. She arched into his touch, surrendering to the pleasure he so expertly gave.

Their bodies came together in a dance as old as time, moving in perfect rhythm. Every touch, every whispered word, every shared breath brought them higher until they shattered together, calling each other's names into the darkness.
    `,
  };

  return interactions[heatLevel as keyof typeof interactions] || interactions.sensual;
}

function generateTensionBuilding(outline: string, characters: any[], genre: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  
  return `
Reality came crashing back with the harsh ring of a phone. ${protagonist?.name || 'She'} pulled back, chest heaving, as the moment shattered around them.

"Ignore it," he urged, reaching for her again.

But the spell was broken. She pressed trembling fingers to her kiss-swollen lips, trying to gather her scattered thoughts. What had she done? What were they doing?

"This is complicated," she said, hating how her voice wavered.

"Only if we let it be." He captured her hand, pressing a kiss to her palm. "Tell me you feel this too. Tell me I'm not alone in this."

She wanted to deny it, to retreat to the safety of rationality. But looking into his eyes, she found she couldn't lie.

"You're not alone," she admitted. "That's what terrifies me."
  `.trim();
}

function generateChapterClimax(outline: string, characters: any[], genre: string, heatLevel: string): string {
  const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];
  const loveInterest = characters.find(c => c.role === 'love_interest') || characters[1];
  
  return `
Something shifted in ${loveInterest?.name || 'his'} expression—vulnerability replacing the careful control he usually wore like armor.

"I need you to understand something," he said, his grip on her hand tightening. "This isn't a game to me. You're not just another—" He broke off, struggling with words that didn't come easily to a man like him.

${protagonist?.name || 'She'} waited, heart suspended.

"You matter," he finally managed. "More than I ever intended to let anyone matter again."

The confession cracked something open inside her. All her carefully constructed walls, all her reasons for keeping him at arm's length, crumbled to dust.

"Then stop fighting it," she said softly. "Stop fighting us."

His forehead dropped to hers, their breaths mingling in the charged space between them.

"I don't think I could even if I wanted to," he admitted. "And God help me, I don't want to anymore."
  `.trim();
}

function generateClosingHook(chapterNumber: number, outline: string, genre: string): string {
  const closings = [
    `As she drifted off in his arms, one thought crystallized with absolute certainty: after tonight, nothing would ever be the same. She just couldn't decide if that terrified her or thrilled her more.`,
    
    `The dawn was approaching, bringing with it a new day and new complications. But wrapped in the warmth of this moment, she couldn't bring herself to care about tomorrow. Not yet.`,
    
    `He was gone when she woke, but the note on the pillow proved it hadn't been a dream: "This is just the beginning." Three words that promised—or threatened—to turn her entire world upside down.`,
    
    `Looking at her reflection in the mirror, she barely recognized the woman staring back. There was a glow about her, a secret smile playing on her lips. Whatever came next, she was ready.`,
    
    `The sound of approaching footsteps made her heart leap. But when she turned, it wasn't the face she expected to see. And the news they brought would change everything.`,
  ];
  
  return closings[Math.floor(Math.random() * closings.length)];
}

function extractSetting(outline: string): string {
  const settings = ['room', 'office', 'garden', 'ballroom', 'café', 'penthouse', 'beach house', 'library'];
  return settings[Math.floor(Math.random() * settings.length)];
}

function getContentTemplates(genre: string, heatLevel: string) {
  return {
    opening: [],
    development: [],
    climax: [],
    closing: [],
  };
}

function generateCharacter(data: {
  role: string;
  genre: string;
  existingCharacters?: any[];
}): any {
  const { role, genre, existingCharacters = [] } = data;
  
  // DEEP CHARACTER PSYCHOLOGY - What makes KDP bestsellers work
  // Characters need: Wound, Lie, Truth, Ghost, Voice, Sensory Presence, Fear, Want vs Need
  
  const genreConfig: Record<string, {
    femaleNames: string[];
    maleNames: string[];
    protagonistVariants?: Array<{
      description: string;
      physical: string;
      occupation: string;
      coreWound: string;
      lieTheyBelieve: string;
    }>;
    protagonist: {
      description: string;
      physical: string;
      coreWound: string;
      ghostEvent: string;
      lieTheyBelieve: string;
      truthTheyNeed: string;
      deepestFear: string;
      whatTheyWant: string;
      whatTheyNeed: string;
      mannerisms: string[];
      voicePattern: string;
      sensoryPresence: string;
      internalConflict: string;
    };
    loveInterest: {
      description: string;
      physical: string;
      coreWound: string;
      ghostEvent: string;
      lieTheyBelieve: string;
      truthTheyNeed: string;
      deepestFear: string;
      whatTheyWant: string;
      whatTheyNeed: string;
      mannerisms: string[];
      voicePattern: string;
      sensoryPresence: string;
      internalConflict: string;
    };
  }> = {
    'Monster Romance': {
      femaleNames: ['Wren', 'Sage', 'Ivy', 'Luna', 'Aurora', 'Thea', 'Cora', 'Hazel', 'Rowan', 'Briar', 'Meadow', 'Fern', 'Willow', 'Ember', 'Nova', 'Sierra'],
      maleNames: ['Kael', 'Throk', 'Grimjaw', 'Zryx', 'Vornak', 'Draven', 'Azrak', 'Korth', 'Groknar', 'Ironhide', 'Stoneheart', 'Ragnar', 'Bjorn', 'Fenrir', 'Magnus', 'Tyr'],
      // VARIETY: Multiple protagonist archetypes randomly selected
      protagonistVariants: [
        {
          description: 'A brilliant botanist who uses science to keep the world at arm\'s length',
          physical: 'Petite but fierce, with wild curls she\'s always pushing back, ink-stained fingers, and eyes that miss nothing—the color of honey in sunlight.',
          occupation: 'botanist researching rare plants',
          coreWound: 'Abandoned by her mother at seven',
          lieTheyBelieve: 'Love is just another word for eventual abandonment.',
        },
        {
          description: 'A cartographer determined to map the unmappable, driven by the need to prove herself',
          physical: 'Tall and lean, with calloused hands from years of climbing and steady eyes that have measured countless horizons—storm gray and utterly fearless.',
          occupation: 'cartographer mapping unknown territories',
          coreWound: 'Raised by a father who wanted a son and never let her forget she wasn\'t one',
          lieTheyBelieve: 'She has to be exceptional to be worth anything.',
        },
        {
          description: 'A runaway healer fleeing an arranged marriage to a cruel lord',
          physical: 'Soft curves she\'s learned to hide under practical clothes, gentle hands that have mended countless wounds, eyes the color of spring leaves.',
          occupation: 'healer with forbidden knowledge',
          coreWound: 'Treated as property her whole life, traded between men who saw her only as useful',
          lieTheyBelieve: 'Her worth is only in what she can do for others.',
        },
        {
          description: 'An archaeologist obsessed with proving ancient monster civilizations existed',
          physical: 'Sun-bronzed skin from years in the field, a mess of auburn hair, and curious hazel eyes behind round spectacles.',
          occupation: 'archaeologist searching for proof',
          coreWound: 'Mocked and dismissed by the academic establishment, driven to prove them wrong at any cost',
          lieTheyBelieve: 'She doesn\'t need anyone—only her research matters.',
        },
        {
          description: 'A former soldier who deserted when she couldn\'t stomach any more killing',
          physical: 'Muscular and scarred, with cropped dark hair, sharp cheekbones, and haunted blue eyes that have seen too much death.',
          occupation: 'deserter hiding from her past',
          coreWound: 'Ordered to massacre a village. She refused, but not before some were already dead.',
          lieTheyBelieve: 'She doesn\'t deserve peace or happiness.',
        },
        {
          description: 'A merchant\'s daughter shipwrecked in monster territory',
          physical: 'Copper curls always escaping her braids, freckled skin, and determined green eyes that refuse to show fear.',
          occupation: 'merchant\'s daughter learning survival',
          coreWound: 'Sheltered her whole life, told she was too fragile for the real world',
          lieTheyBelieve: 'She\'s helpless without someone to protect her.',
        },
      ],
      protagonist: {
        description: 'A brilliant but emotionally guarded botanist who uses science to keep the world at arm\'s length',
        physical: 'Petite but fierce, with wild curls she\'s always pushing back, ink-stained fingers from her research notes, and eyes that miss nothing—the color of honey in sunlight.',
        coreWound: 'Abandoned by her mother at age seven',
        ghostEvent: 'The morning she woke to find her mother\'s closet empty.',
        lieTheyBelieve: 'Love is just another word for eventual abandonment. Everyone leaves.',
        truthTheyNeed: 'Being left wasn\'t her fault. She is worthy of being chosen.',
        deepestFear: 'That there\'s something fundamentally unlovable about her.',
        whatTheyWant: 'Recognition for her work. To never need anyone.',
        whatTheyNeed: 'To be loved for who she is, not what she can do.',
        mannerisms: ['Pushes her glasses up when nervous', 'Talks to herself when working', 'Keeps meticulous lists', 'Bites her lower lip when thinking'],
        voicePattern: 'Speaks precisely, almost formally, when uncomfortable. Uses technical terms as armor.',
        sensoryPresence: 'Smells of crushed herbs and old books. Her hands are always slightly cold.',
        internalConflict: 'Her rational mind wars constantly with her heart.',
      },
      loveInterest: {
        description: 'A massive orc chieftain who has forged himself into a weapon to protect his people',
        physical: 'Seven feet of green-skinned power, scarred from countless battles. Tusks that curve from a jaw that could crush stone. Golden eyes impossibly tender when they look at her. Tribal tattoos telling his people\'s story.',
        coreWound: 'Watched his mother die when he was twelve. She told him to run. He did.',
        ghostEvent: 'The smell of smoke. His mother\'s voice. The question: what if he had stayed?',
        lieTheyBelieve: 'Softness is death. Love is vulnerability that gets people killed.',
        truthTheyNeed: 'His mother wanted him to live. Truly live. The walls he built have become a prison.',
        deepestFear: 'That he\'ll fail to protect someone he loves again.',
        whatTheyWant: 'To protect his clan. To never feel that helpless agony again.',
        whatTheyNeed: 'To forgive the child who ran. To let himself love again.',
        mannerisms: ['Goes completely still when angry', 'Speaks rarely but precisely', 'Stands between her and every threat', 'Hums an old lullaby when he thinks she\'s asleep'],
        voicePattern: 'Deep, rumbling. Uses her name like a prayer. Slips into old tongue when emotional.',
        sensoryPresence: 'Smells of woodsmoke and pine. His skin runs hot. The air feels charged when he\'s near.',
        internalConflict: 'Every instinct screams to claim her. But loving her feels like betraying his mother\'s memory.',
      },
    },
    'Dark Romance': {
      femaleNames: ['Anastasia', 'Valentina', 'Nikolina', 'Ravenna', 'Seraphina', 'Catalina', 'Alessandra', 'Bianca'],
      maleNames: ['Dante', 'Viktor', 'Roman', 'Lucian', 'Nikolai', 'Damien', 'Konstantin', 'Adrian'],
      protagonist: {
        description: 'A woman who learned early that the world is cruel, and built herself into someone who could survive it—until she meets a man who makes survival feel like not nearly enough',
        physical: 'Striking rather than pretty, with sharp cheekbones, dark hair, and eyes that have seen too much. A dancer\'s grace in her movements. Small scars on her hands from years of working jobs she\'ll never talk about.',
        coreWound: 'Raised in poverty by a father who gambled away every dollar. Learned that love was just another word for debt.',
        ghostEvent: 'The night her father sold her to pay his debts. The way he couldn\'t meet her eyes. The realization that she had never been his daughter—only his collateral.',
        lieTheyBelieve: 'She is a commodity. A pawn. Her only value is what someone will pay for her.',
        truthTheyNeed: 'She has intrinsic worth. She deserves to be wanted, not owned. Love doesn\'t have a price tag.',
        deepestFear: 'That her father was right. That she\'s worth nothing more than what she can be traded for.',
        whatTheyWant: 'Freedom. To belong to no one. To never be sold again.',
        whatTheyNeed: 'To be chosen freely. To understand that being wanted by someone worthy isn\'t a cage—it\'s a home.',
        mannerisms: ['Counts exits in every room', 'Flinches from unexpected touch', 'Sleeps in short bursts, never deeply', 'Hoards food without realizing', 'Never turns her back on anyone'],
        voicePattern: 'Controlled, measured, revealing nothing. Deflects with sarcasm. Her true voice—vulnerable, yearning—only emerges when her defenses crack.',
        sensoryPresence: 'Moves like a shadow, silent and watchful. Smells of nothing—she learned early that scent gives you away. Her hands are calloused from survival.',
        internalConflict: 'Her mind says this man is a monster. Her body responds to him anyway. And worst of all, beneath his brutality, she glimpses something that looks terrifyingly like her own loneliness.',
      },
      loveInterest: {
        description: 'A crime lord who has built an empire on fear and control, who has never wanted anything he couldn\'t simply take—until she makes him want to be chosen',
        physical: 'Devastatingly handsome in a brutal way. Dark eyes that see everything. A scar cutting through one brow—he earned it killing the man who murdered his sister. Hands that have ended lives, now desperate to be gentle for her.',
        coreWound: 'His younger sister was killed as collateral in a gang war when he was seventeen. He was supposed to protect her. He failed.',
        ghostEvent: 'Finding her body. The pink ribbon still in her hair. She was ten years old. He made the men who did it die slowly, and it changed nothing.',
        lieTheyBelieve: 'Control is the only safety. If he\'s powerful enough, ruthless enough, no one else will die because he was too weak.',
        truthTheyNeed: 'Control is an illusion. His sister\'s death wasn\'t about his weakness—it was about other men\'s cruelty. He\'s allowed to love again.',
        deepestFear: 'That someone will find the soft places in him and use them to destroy him. That loving anyone means painting a target on them.',
        whatTheyWant: 'Empire. Power. Control over everything that might threaten him or his.',
        whatTheyNeed: 'To let someone in. To forgive the teenager who couldn\'t save his sister. To learn that love is worth the vulnerability.',
        mannerisms: ['Straightens his cufflinks when thinking', 'Goes terrifyingly still when enraged', 'Traces patterns on her skin while lost in thought', 'Never sits with his back to a door', 'Keeps his sister\'s ribbon in his pocket always'],
        voicePattern: 'Quiet, controlled, dangerous. The softer his voice, the angrier he is. With her, sometimes—only sometimes—it breaks. Rough with want. Raw with things he can\'t say.',
        sensoryPresence: 'Expensive cologne and gunmetal. His presence fills a room. When he touches her, his hands shake slightly—a tell he hates.',
        internalConflict: 'She was delivered to him as property, but he doesn\'t want a possession—he wants her to choose him. And he has no idea how to be a man worth choosing.',
      },
    },
    'Romantasy': {
      femaleNames: ['Seraphina', 'Elara', 'Aurelia', 'Lysandra', 'Celestia', 'Valeria', 'Nephele', 'Astrid'],
      maleNames: ['Caelum', 'Theron', 'Alaric', 'Orion', 'Corvus', 'Silas', 'Ezriel', 'Caspian'],
      protagonist: {
        description: 'A mortal woman with hidden power who\'s spent her life being underestimated—until she falls into a realm where her mere existence threatens the balance of power',
        physical: 'Unremarkable by fae standards, which makes her stand out entirely. Brown hair, warm brown eyes, a stubborn chin. But when her power rises, silver flames dance in her eyes, and the High Fae look away first.',
        coreWound: 'Raised as "the ordinary one" in a family of special children. Always overlooked, always the afterthought.',
        ghostEvent: 'Her mother\'s words at her sister\'s wedding: "At least one of my daughters will accomplish something."',
        lieTheyBelieve: 'She is unremarkable. Average. Destined to live a small life on the sidelines of other people\'s stories.',
        truthTheyNeed: 'She was never ordinary—she was hidden. Her uniqueness is her greatest power. She was always meant for something enormous.',
        deepestFear: 'That she really is as ordinary as they always said. That even here, even with magic, she\'ll be overlooked.',
        whatTheyWant: 'To matter. To be seen. To prove everyone wrong.',
        whatTheyNeed: 'To stop seeking external validation. Her worth isn\'t determined by what others see—it\'s intrinsic.',
        mannerisms: ['Apologizes unnecessarily', 'Makes herself physically smaller in crowds', 'Surprises herself with courage', 'Laughs when nervous', 'Grows steadier the worse things get'],
        voicePattern: 'Starts sentences, stops, starts again. Grows more certain as the story progresses. When her power speaks through her, her voice carries the echo of ancient things.',
        sensoryPresence: 'To humans, forgettable. To fae, she burns—something in her blood calls to their magic. The fae prince can sense her heartbeat across a room.',
        internalConflict: 'Power is awakening in her, and she doesn\'t know if she can control it. The prince sees something in her that she\'s not sure exists. If she trusts him and she\'s wrong, she\'ll be destroyed.',
      },
      loveInterest: {
        description: 'An immortal fae prince known for cruelty, hiding a soul so damaged by centuries of his mother\'s machinations that kindness feels like a trap—until a mortal woman makes him want to be kind',
        physical: 'Impossibly beautiful, as all High Fae are, but there\'s something wrong about his beauty—it\'s too sharp, too cold, like a blade forged in starlight. Silver eyes, midnight hair, and a smile that promises pain. Yet when he looks at her, his face does something unfamiliar. Something soft.',
        coreWound: 'Used as a weapon by his mother since childhood. Every kindness was a manipulation. Every soft feeling was punished. He learned to be cruel because cruelty was the only safe emotion.',
        ghostEvent: 'At seven years old, he loved a kitchen servant. His mother had the servant killed, then made him watch. "This is what kindness costs," she said. He never forgot.',
        lieTheyBelieve: 'Love is a weapon used against you. Caring about anything gives others power over you. Better to be the monster than the victim.',
        truthTheyNeed: 'His mother was the monster, not love. His capacity for feeling isn\'t weakness—it\'s the only thing that makes immortality bearable.',
        deepestFear: 'That his mother was right. That he\'s too broken for anyone to truly love. That the cruelty is all that\'s left of him.',
        whatTheyWant: 'Power. Immunity from manipulation. To be feared so thoroughly that no one dares use him again.',
        whatTheyNeed: 'To let someone see behind the mask. To trust. To learn that love given freely isn\'t a trap—it\'s salvation.',
        mannerisms: ['Smiles when making threats—genuine emotion makes the smile disappear', 'Speaks in riddles to hide truth', 'Watches her when she\'s not looking', 'Touches her things when she\'s not there', 'Flinches from genuine compliments'],
        voicePattern: 'Mocking, elegant, cruel. His court voice is performance. His real voice—the one he uses only with her—is quieter, uncertain, achingly vulnerable.',
        sensoryPresence: 'Cold as starlight. The scent of night-blooming flowers and frost. When he touches her, his fingers are ice, but his mouth burns.',
        internalConflict: 'She makes him want things he learned to stop wanting centuries ago. Every moment with her is proof that his mother was wrong, and proof terrifies him more than cruelty ever could.',
      },
    },
  };
  
  // Default to Dark Romance if genre not found
  const config = genreConfig[genre] || genreConfig['Dark Romance'];
  const usedNames = existingCharacters.map(c => c.name);
  
  const getName = (names: string[]) => {
    const available = names.filter(n => !usedNames.includes(n));
    return available[Math.floor(Math.random() * available.length)] || names[0];
  };

  if (role === 'protagonist') {
    const p = config.protagonist;
    return {
      name: getName(config.femaleNames),
      role: 'protagonist',
      age: 24 + Math.floor(Math.random() * 8),
      description: p.description,
      physicalDescription: p.physical,
      personality: ['brave', 'guarded', 'intelligent', 'resilient'],
      backstory: `${p.coreWound} ${p.ghostEvent}`,
      // Deep psychology for writing
      coreWound: p.coreWound,
      ghostEvent: p.ghostEvent,
      lieTheyBelieve: p.lieTheyBelieve,
      truthTheyNeed: p.truthTheyNeed,
      deepestFear: p.deepestFear,
      whatTheyWant: p.whatTheyWant,
      whatTheyNeed: p.whatTheyNeed,
      mannerisms: p.mannerisms,
      voicePattern: p.voicePattern,
      sensoryPresence: p.sensoryPresence,
      internalConflict: p.internalConflict,
      goals: [p.whatTheyWant, 'Survive', 'Find the truth'],
      flaws: ['Guards her heart fiercely', 'Struggles to trust'],
      arc: `From believing "${p.lieTheyBelieve}" to understanding "${p.truthTheyNeed}"`,
    };
  }

  if (role === 'love_interest') {
    const li = config.loveInterest;
    return {
      name: getName(config.maleNames),
      role: 'love_interest',
      age: genre === 'Monster Romance' || genre === 'Romantasy' ? 300 + Math.floor(Math.random() * 500) : 30 + Math.floor(Math.random() * 12),
      description: li.description,
      physicalDescription: li.physical,
      personality: ['protective', 'intense', 'wounded', 'devoted'],
      backstory: `${li.coreWound} ${li.ghostEvent}`,
      // Deep psychology for writing
      coreWound: li.coreWound,
      ghostEvent: li.ghostEvent,
      lieTheyBelieve: li.lieTheyBelieve,
      truthTheyNeed: li.truthTheyNeed,
      deepestFear: li.deepestFear,
      whatTheyWant: li.whatTheyWant,
      whatTheyNeed: li.whatTheyNeed,
      mannerisms: li.mannerisms,
      voicePattern: li.voicePattern,
      sensoryPresence: li.sensoryPresence,
      internalConflict: li.internalConflict,
      goals: [li.whatTheyWant, 'Protect what\'s his', 'Never feel helpless again'],
      flaws: ['Struggles with vulnerability', 'Controls instead of trusts'],
      arc: `From believing "${li.lieTheyBelieve}" to understanding "${li.truthTheyNeed}"`,
    };
  }

  // Antagonist
  if (role === 'antagonist') {
    return {
      name: getName(config.maleNames),
      role: 'antagonist',
      age: 35 + Math.floor(Math.random() * 20),
      description: 'A mirror of what the hero could become if he gave in to his darkest impulses',
      physicalDescription: 'Attractive in a cold, calculated way—the kind of beauty that serves as camouflage for something rotten underneath',
      personality: ['ambitious', 'ruthless', 'charismatic', 'envious'],
      backstory: 'Born with every advantage, yet consumed by the need for more. He sees in the heroine something he can never have—genuine goodness—and wants to possess or destroy it.',
      coreWound: 'Never enough for his family, no matter what he achieved',
      lieTheyBelieve: 'Power is the only thing that matters. Everyone is using everyone else—might as well be the one on top.',
      deepestFear: 'Being exposed as the fraud he secretly believes himself to be',
      goals: ['Take what the hero has', 'Prove his own superiority', 'Possess what he cannot earn'],
      flaws: ['Cannot comprehend genuine love', 'Underestimates those he considers beneath him'],
      arc: 'Serves as the dark mirror—showing what love prevents, what happens when wounds fester instead of heal',
    };
  }

  // Supporting character
  return {
    name: getName(config.femaleNames),
    role: 'supporting',
    age: 25 + Math.floor(Math.random() * 8),
    description: 'A loyal friend whose own journey echoes and illuminates the main romance',
    physicalDescription: 'Warm and approachable, with kind eyes and a ready smile that hides her own depths',
    personality: ['loyal', 'perceptive', 'brave', 'nurturing'],
    backstory: 'Her own story runs parallel to the main romance, offering both support and contrast.',
    goals: ['Help her friend find happiness', 'Navigate her own complicated feelings', 'Survive the coming storm'],
    flaws: ['Puts others before herself', 'Hides her own pain to be strong for others'],
    arc: 'Finds her own strength while supporting the main couple, setting up potential for her own story',
  };
}

function generateOutline(data: {
  title: string;
  genre: string;
  premise: string;
  characters: any[];
  chapterCount?: number;
}): any[] {
  const { title, genre, premise, characters, chapterCount = 10 } = data;
  
  const protagonist = characters.find(c => c.role === 'protagonist')?.name || 'protagonist';
  const loveInterest = characters.find(c => c.role === 'love_interest')?.name || 'love interest';
  
  const outlineStructure = [
    {
      title: 'First Encounter',
      beats: [`${protagonist} meets ${loveInterest} in an unexpected situation`, 'Instant chemistry but immediate conflict', 'A glimpse of the attraction they\'re both fighting'],
      purpose: 'Hook readers with irresistible tension',
    },
    {
      title: 'Reluctant Attraction',
      beats: ['Forced proximity brings them together again', 'Verbal sparring masks growing attraction', 'A moment of vulnerability breaks through defenses'],
      purpose: 'Build romantic tension through conflict',
    },
    {
      title: 'The Stakes Rise',
      beats: ['External conflict complicates their connection', 'They must work together despite resistance', 'Growing respect mingles with desire'],
      purpose: 'Raise stakes and deepen connection',
    },
    {
      title: 'Walls Begin to Crumble',
      beats: ['A shared secret or experience bonds them', `${protagonist} sees a new side of ${loveInterest}`, 'First kiss or moment of physical intimacy'],
      purpose: 'First major romantic milestone',
    },
    {
      title: 'Deepening Connection',
      beats: ['Emotional intimacy grows', 'Past wounds are revealed', 'Readers see why they\'re perfect for each other'],
      purpose: 'Build emotional investment',
    },
    {
      title: 'Point of No Return',
      beats: ['Physical relationship develops', 'Emotional stakes become clear', 'Both begin to question their defenses'],
      purpose: 'Major romantic development',
    },
    {
      title: 'The Dark Moment Approaches',
      beats: ['Warning signs of coming conflict', 'External threats intensify', 'Brief moment of happiness before the fall'],
      purpose: 'Build tension for climax',
    },
    {
      title: 'The Black Moment',
      beats: ['Major conflict or misunderstanding', 'Seems like all is lost', 'Both must face their deepest fears'],
      purpose: 'Emotional climax and crisis',
    },
    {
      title: 'Fighting for Love',
      beats: ['Grand gesture or decisive action', 'Confronting fears and obstacles', 'Choosing love despite the risk'],
      purpose: 'Resolution of conflict',
    },
    {
      title: 'Happily Ever After',
      beats: ['Reunion and declaration of love', 'Resolution of external conflicts', 'Glimpse of their future together'],
      purpose: 'Satisfying emotional payoff',
    },
  ];

  // Adjust to requested chapter count
  return outlineStructure.slice(0, chapterCount).map((chapter, idx) => ({
    chapterNumber: idx + 1,
    ...chapter,
  }));
}

function generateBlurb(data: {
  title: string;
  genre: string;
  premise: string;
  characters: any[];
  keywords?: string[];
}): string {
  const { title, genre, premise, characters, keywords = [] } = data;
  
  const protagonist = characters.find(c => c.role === 'protagonist');
  const loveInterest = characters.find(c => c.role === 'love_interest');

  return `
**${protagonist?.name || 'She'}** thought she had it all figured out. Career on track. Heart safely guarded. Life perfectly controlled.

Then **${loveInterest?.name || 'he'}** walked into her world and shattered every rule she'd ever made.

${premise || 'He\'s everything she\'s been running from—intense, commanding, and far too dangerous to her carefully constructed walls. But some attractions are impossible to ignore, no matter how hard you try.'}

When circumstances throw them together, the chemistry between them becomes explosive. Every stolen glance ignites a fire. Every accidental touch leaves her wanting more. And every moment with him makes her question everything she thought she knew about love.

But ${loveInterest?.name || 'he'} has secrets of his own—shadows from his past that threaten to consume them both. As the truth unravels, ${protagonist?.name || 'she'} must decide: Is he worth the risk? Can she trust him with her heart?

Or will loving him destroy everything she's worked so hard to protect?

**${title}** is a *${genre || 'steamy contemporary romance'}* featuring a swoon-worthy hero, a heroine who gives as good as she gets, and enough heat to melt your kindle. 

*Contains mature themes and explicit content.*

**One-click now and fall in love with this addictive page-turner!**
  `.trim();
}

function generateCoverPrompt(data: {
  title: string;
  genre: string;
  characters: any[];
  authorName?: string;
  mood?: string;
}): string {
  const { title, genre, characters, authorName = 'Author Name', mood = 'intensely passionate and provocative' } = data;
  
  const protagonist = characters.find(c => c.role === 'protagonist');
  const loveInterest = characters.find(c => c.role === 'love_interest');

  // Genre-specific mood and atmosphere
  const genreAtmosphere: Record<string, string> = {
    'Monster Romance': 'dark, primal, otherworldly—where beauty meets beast',
    'Dark Romance': 'dangerous, forbidden, seductive shadows',
    'Romantasy': 'magical, ethereal, with hints of ancient power',
    'Mafia Romance': 'luxurious yet deadly, silk and steel',
    'Shifter Romance': 'wild, untamed, with primal energy',
    'Alien Romance': 'cosmic, exotic, with alien technology or landscapes',
  };

  const atmosphere = genreAtmosphere[genre] || mood;

  return `
Create a professional romance novel cover for "${title}" by ${authorName}:

**TYPOGRAPHY (Critical for Sales)**:
- TITLE: "${title}" - Large, elegant script or bold serif at top
  - Must be readable as thumbnail (this is how 90% of KDP buyers see it)
  - Use contrasting color against background
  - Consider metallic/gold effects for premium feel
- AUTHOR: "${authorName}" - Clean, readable font at bottom
  - Smaller than title but clearly visible
  - Consistent styling for author brand recognition

**Style**: Premium romance cover, professional quality, must grab attention in Amazon thumbnails

**Composition**:
- Focus: Intimate couple in charged moment OR dramatic single figure
- Hero: ${loveInterest?.physicalDescription || 'powerfully built with intense, smoldering presence'}
- Heroine: ${protagonist?.physicalDescription || 'beautiful with fierce intelligence in her eyes'}
- Mood: ${atmosphere}
- Color palette: Rich, saturated tones that pop on screen (deep jewel tones, passionate reds, mysterious purples, or sophisticated blacks with gold accents)

**Background by Genre**:
${genre === 'Monster Romance' ? '- Dark forest, moonlit clearing, or atmospheric wilderness suggesting forbidden territory' : ''}
${genre === 'Dark Romance' ? '- Shadowy luxury setting, rain-streaked windows, or moody interior suggesting danger and desire' : ''}
${genre === 'Romantasy' ? '- Magical elements—swirling mist, ancient architecture, soft magical glow' : ''}
${genre === 'Mafia Romance' ? '- Elegant but dangerous—city lights, expensive interior, subtle hints of the underworld' : ''}
- Background should enhance mood, never compete with figures or text

**Emotional Hook**:
- Tension should be palpable—viewers should feel the chemistry
- Eye contact between subjects or intense profile
- Body language suggesting desire, possessiveness, or forbidden attraction

**Technical Requirements for KDP**:
- High resolution: 2560 x 1600 pixels (portrait)
- RGB color space
- Professional lighting with dramatic shadows
- Clear hierarchy: Title → Figures → Author → Background
- Safe zones for title and author text placement

**AVOID**:
- Explicit nudity (violates KDP guidelines)
- Cluttered compositions
- Text that's too small to read at thumbnail size
- Generic stock photo feeling
- Cartoonish or amateur quality
- Faces directly under where title will go
  `.trim();
}

function generateKeywords(data: {
  genre: string;
  tropes: string[];
  heatLevel: string;
  subGenre?: string;
}): string[] {
  const { genre, tropes, heatLevel, subGenre } = data;
  
  // KDP Best Practice: Use LONG-TAIL keywords that readers actually search for
  // Each keyword can be up to 50 characters and should match search queries
  
  // Genre-specific long-tail keywords (highly targeted for discoverability)
  const genreKeywordSets: Record<string, string[]> = {
    'Monster Romance': [
      'monster romance books',
      'orc romance books',
      'creature romance',
      'fantasy monster romance',
      'beauty and the beast retelling',
      'monster love story',
      'alien romance books',
      'dragon shifter romance',
      'demon romance books',
      'fated mates monster',
      'paranormal monster romance',
    ],
    'Dark Romance': [
      'dark romance books',
      'possessive alpha male romance',
      'captive romance',
      'villain romance books',
      'morally gray hero romance',
      'obsessed hero romance',
      'dark mafia romance',
      'kidnapped romance books',
      'twisted love story',
      'antivillain romance',
    ],
    'Mafia Romance': [
      'mafia romance books',
      'italian mafia romance',
      'arranged marriage mafia',
      'bratva romance',
      'cartel romance books',
      'organized crime romance',
      'mafia boss romance',
      'dangerous man romance',
    ],
    'Shifter Romance': [
      'shifter romance books',
      'wolf shifter romance',
      'alpha wolf romance',
      'fated mates romance',
      'pack romance',
      'bear shifter romance',
      'paranormal shifter romance',
      'rejected mate romance',
    ],
    'Alien Romance': [
      'alien romance books',
      'scifi romance',
      'alien warrior romance',
      'space romance books',
      'alien abduction romance',
      'intergalactic romance',
      'alien mate romance',
    ],
    'Romantasy': [
      'romantasy books',
      'fantasy romance',
      'fae romance books',
      'enemies to lovers fantasy',
      'dark fantasy romance',
      'romantic fantasy series',
      'magic romance books',
      'court intrigue romance',
    ],
    'Why Choose / Reverse Harem': [
      'reverse harem romance',
      'why choose romance',
      'multiple love interests',
      'polyamorous romance',
      'mfm romance books',
      'mmf romance',
      'bully romance reverse harem',
    ],
    'Billionaire Romance': [
      'billionaire romance books',
      'rich hero romance',
      'boss romance books',
      'ceo romance',
      'enemies to lovers billionaire',
      'arranged marriage billionaire',
    ],
    'Contemporary Romance': [
      'contemporary romance books',
      'small town romance',
      'friends to lovers romance',
      'second chance romance',
      'romantic comedy books',
      'new adult romance',
    ],
  };

  // Sub-genre specific keywords
  const subGenreKeywords: Record<string, string[]> = {
    'Orc': ['orc romance', 'orc warrior romance', 'green skin romance', 'tusked hero romance'],
    'Dragon': ['dragon shifter', 'dragon romance books', 'dragon mate romance'],
    'Demon': ['demon romance', 'incubus romance', 'hell romance books'],
    'Vampire': ['vampire romance', 'vampire mate', 'blood romance'],
    'Alien': ['alien romance', 'alien warrior', 'space mate romance'],
    'Minotaur': ['minotaur romance', 'beast romance', 'labyrinth romance'],
  };

  // Trope-specific long-tail keywords
  const tropeKeywordMap: Record<string, string[]> = {
    'Enemies to Lovers': ['enemies to lovers romance', 'hate to love romance'],
    'Forced Proximity': ['forced proximity romance', 'stuck together romance'],
    'Fated Mates': ['fated mates romance', 'destined love'],
    'Forbidden Love': ['forbidden romance books', 'taboo romance'],
    'Second Chance': ['second chance romance', 'rekindled love story'],
    'Boss/Employee': ['boss romance', 'office romance books'],
    'Age Gap': ['age gap romance', 'older man romance'],
    'Captive': ['captive romance', 'kidnapped romance'],
    'Arranged Marriage': ['arranged marriage romance', 'forced marriage'],
    'Possessive': ['possessive hero romance', 'obsessed hero'],
  };

  // Heat level keywords
  const heatKeywords: Record<string, string[]> = {
    'sweet': ['clean romance', 'sweet romance books'],
    'sensual': ['steamy romance', 'sensual romance books'],
    'steamy': ['spicy romance books', 'explicit romance'],
    'scorching': ['very spicy romance', 'explicit adult romance', 'erotic romance books'],
  };

  // Build keyword set with strict priority ordering
  // KDP Best Practice: SubGenre keywords are MOST specific = highest conversion
  const priorityKeywords: string[] = [];
  const secondaryKeywords: string[] = [];
  
  // 1. HIGHEST PRIORITY: Sub-genre specific keywords (e.g., "orc romance" for Orc sub-genre)
  if (subGenre && subGenreKeywords[subGenre]) {
    priorityKeywords.push(...subGenreKeywords[subGenre]);
  }
  
  // Also add dynamic subGenre keyword if not in preset list
  if (subGenre) {
    const dynamicKeyword = `${subGenre.toLowerCase()} romance`;
    if (!priorityKeywords.includes(dynamicKeyword)) {
      priorityKeywords.unshift(dynamicKeyword); // Add to front
    }
  }

  // 2. Genre-specific keywords
  const genreKey = Object.keys(genreKeywordSets).find(k => 
    genre?.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(genre?.toLowerCase())
  );
  if (genreKey) {
    secondaryKeywords.push(...genreKeywordSets[genreKey]);
  }

  // 3. Add trope keywords
  tropes?.forEach(trope => {
    Object.entries(tropeKeywordMap).forEach(([key, keywords]) => {
      if (trope.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trope.toLowerCase())) {
        secondaryKeywords.push(...keywords);
      }
    });
  });

  // 4. Add heat level keywords
  if (heatLevel && heatKeywords[heatLevel]) {
    secondaryKeywords.push(...heatKeywords[heatLevel]);
  }

  // 5. Add "HEA guaranteed" - readers love knowing there's a happy ending
  secondaryKeywords.push('HEA guaranteed');
  secondaryKeywords.push('happily ever after romance');

  // Combine with priority keywords first
  const keywordPool = [...priorityKeywords, ...secondaryKeywords];
  
  // Deduplicate while preserving priority order
  const unique = Array.from(new Set(keywordPool));

  // Return top 7, each max 50 characters (priority keywords come first due to ordering)
  return unique.slice(0, 7).map(k => k.substring(0, 50));
}

function generateBackMatter(data: {
  title: string;
  authorName: string;
  seriesName?: string;
  seriesNumber?: number;
  otherBooks?: { title: string; link?: string }[];
  socialLinks?: { platform: string; url: string }[];
}): string {
  const { title, authorName, seriesName, seriesNumber, otherBooks = [], socialLinks = [] } = data;
  
  let backMatter = `
---

## Thank You for Reading!

I hope you loved **${title}**! If you enjoyed this story, please consider leaving a review on Amazon. Your reviews help other readers discover my books and mean the world to me!

`;

  if (seriesName && otherBooks.length > 0) {
    backMatter += `
---

## More from the ${seriesName} Series

`;
    otherBooks.forEach((book, idx) => {
      backMatter += `**Book ${idx + 1}: ${book.title}**\n`;
      if (book.link) {
        backMatter += `[Get it now!](${book.link})\n`;
      }
      backMatter += '\n';
    });
  }

  backMatter += `
---

## About the Author

${authorName} writes steamy contemporary romance featuring swoon-worthy heroes and strong heroines. When not writing, you can find them [personalize this section with hobbies/interests].

`;

  if (socialLinks.length > 0) {
    backMatter += '**Connect with me:**\n\n';
    socialLinks.forEach(link => {
      backMatter += `- ${link.platform}: ${link.url}\n`;
    });
  }

  backMatter += `
---

## Want More?

Sign up for my newsletter to get:
- Exclusive bonus scenes
- Early access to new releases
- Cover reveals and sneak peeks
- Special subscriber-only giveaways

[Subscribe Now] (Add your newsletter link)

---

*Copyright © ${new Date().getFullYear()} ${authorName}. All rights reserved.*
  `;

  return backMatter.trim();
}
