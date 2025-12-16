import { StoryIdea, Chapter, Character, HeatLevel, PROFITABLE_NICHES, TROPES, BlurbFormula, BLURB_FORMULAS } from '@/types';

// ============================================
// STORY PREMISE TEMPLATES BY NICHE
// ============================================

const STORY_TEMPLATES: Record<string, string[]> = {
  'Dark Romance': [
    '{protagonist} thought she escaped {villain_org}. But when {love_interest}, the ruthless {title}, discovers she\'s the key to {stakes}, he\'ll stop at nothing to make her his.',
    'Sold to pay her father\'s debt, {protagonist} becomes the property of {love_interest}—a man as dangerous as he is beautiful. But the monster she expected isn\'t the one keeping her captive.',
    'They call him the {title}. {protagonist} calls him her obsession. When she witnesses something she shouldn\'t, the only way to survive is to become his.',
    '{protagonist} made a deal with the devil. Now {love_interest} owns her for thirty days. She just has to survive without falling for the man who destroyed her family.',
    'He took everything from her. Her home. Her freedom. Her heart. {love_interest} doesn\'t just want {protagonist}—he wants to possess her completely.',
  ],
  'Monster Romance': [
    'When {protagonist}\'s ship crashes on an alien planet, she never expected to be rescued by {creature}—or to find herself falling for a being who shouldn\'t exist.',
    'The {creature} in the forest was supposed to be a legend. Now {protagonist} is his mate, and he has no intention of letting her go.',
    '{protagonist} summoned a {creature} for protection. She got {love_interest}—seven feet of muscle, tusks, and an absolutely filthy mouth.',
    'Trapped in the monster realm, {protagonist}\'s only hope is {love_interest}, an {creature} who\'s as gentle as he is terrifying. And very interested in making her his.',
    'They say {creature}s can\'t love. They\'re wrong. {love_interest} has waited centuries for his mate.',
    // NEW: More monster romance premises
    'Her research led her past the barrier. His territory had been forbidden for a thousand years. The {creature} who caught her wasn\'t supposed to be real—or this attractive.',
    '{protagonist} was meant to be a sacrifice to the monster. {love_interest} was meant to consume her. Neither of them expected to fall in love.',
    'Running from an arranged marriage, {protagonist} fled into monster territory. The {creature} chieftain who found her offered her a deal: protection in exchange for staying forever.',
    'She\'s a healer captured by {creature}s. He\'s their warlord who claims she\'s off-limits—to everyone but him.',
    '{protagonist} crossed the barrier to find a cure for her dying sister. She found {love_interest} instead—an {creature} who says he can save her sister, for a price.',
    'Human women are sold in the monster markets. {love_interest}, the {creature} who bought her, doesn\'t want a slave. He wants a mate.',
    'When {protagonist}\'s village offers her as tribute, she expects death. She gets {love_interest}—a lonely {creature} who just wants someone to talk to.',
    'She\'s an archaeologist. The ruins she\'s excavating? They belong to him. And {love_interest}, the {creature} who built them, has been waiting for someone to find him.',
    'Her expedition was supposed to prove monsters were extinct. {love_interest} was supposed to scare her away. Neither of them planned on this.',
    '{protagonist} made a wish. The {creature} who answered has his own agenda—and falling for her wasn\'t part of it.',
    'Shipwrecked on an island that shouldn\'t exist, {protagonist}\'s only chance of survival is {love_interest}—an {creature} with secrets darker than the caves he calls home.',
    'She was kidnapped by raiders. Rescued by something worse. The {creature} who saved her says she\'s his now. She\'s starting to be okay with that.',
    'Every generation, a human woman is chosen to walk through the barrier. She\'s the first one to come back. She\'s also the first to bring an {creature} with her.',
    '{protagonist} thought she was helping a wounded animal. {love_interest} thought she was the answer to an ancient prophecy. They were both partly right.',
    'The {creature} haunting her dreams turns out to be real—and very determined to claim her in the waking world too.',
  ],
  'Why Choose / Reverse Harem': [
    '{protagonist} transferred to {academy_name} Academy to escape her past. She didn\'t expect to catch the attention of {num} of the most powerful men on campus.',
    'One fake girlfriend. {num} possessive alphas. {protagonist} thought this arrangement would be simple. She was so wrong.',
    'The {group_name} don\'t share. But when {protagonist} becomes their assignment, these {num} men discover they\'d rather share her than lose her.',
    '{protagonist} inherited a haunted mansion and {num} supernatural guardians who are very territorial—about the house and about her.',
    'She\'s the first female to join the {team_name}. They\'re the {num} elite fighters who\'ve sworn to protect her. Falling for all of them wasn\'t part of the plan.',
  ],
  'Mafia Romance': [
    'In the world of the {family_name} famiglia, {protagonist} is a pawn. To {love_interest}, the ruthless don, she\'s the only woman he\'ll ever want.',
    '{protagonist} witnessed a murder. Now {love_interest}, the head of the {family_name} bratva, has two choices: kill her or keep her.',
    'An arranged marriage to unite two crime families. {protagonist} expected to hate her new husband. She didn\'t expect {love_interest} to make her feel so alive.',
    'She\'s the prosecutor trying to bring down the {family_name} empire. He\'s the don\'s heir. Their attraction is forbidden. Their love is a death sentence.',
    '{protagonist} thought she was safe. Then {love_interest}, the man she escaped five years ago, found her. And this time, he\'s not letting her go.',
  ],
  'Billionaire Romance': [
    'One night. No strings. That was the deal. {protagonist} didn\'t know the stranger in her bed was {love_interest}, her new CEO.',
    '{protagonist} needs money. {love_interest} needs a fake fiancée. Their arrangement was supposed to be simple. Their chemistry is anything but.',
    'He bought her company. Now {love_interest} wants to buy her too. {protagonist} refuses to be owned—even by the most persistent billionaire in {city}.',
    '{protagonist} is the nanny. {love_interest} is the single dad billionaire who hired her. The job description didn\'t include falling in love.',
    'When her car breaks down outside his estate, {protagonist} has no idea she\'s about to spend the weekend with {love_interest}, the reclusive billionaire the world thought was dead.',
  ],
  'Alien Romance': [
    '{protagonist}\'s escape pod crashed on a frozen planet. The massive blue alien who found her doesn\'t speak her language, but his intentions are very clear.',
    'Abducted by aliens and sold at auction, {protagonist} is bought by {love_interest}—a warrior who claims she\'s his fated mate.',
    'The treaty requires a human ambassador. {protagonist} didn\'t realize her new position came with {love_interest}, a possessive alien prince who\'s determined to make her his.',
    'She\'s the last fertile human female. He\'s the alien warlord who won her in battle. {love_interest} has no intention of letting his prize escape.',
    '{protagonist} was supposed to study the aliens. She wasn\'t supposed to fall for {love_interest}, the massive warrior with purple skin and a very creative tongue.',
  ],
  'Shifter Romance': [
    'The alpha of the {pack_name} pack doesn\'t do mates. Then {protagonist} stumbles into his territory, and {love_interest}\'s wolf decides she\'s his.',
    '{protagonist} didn\'t believe in werewolves until she was claimed by one. {love_interest} isn\'t just the alpha—he\'s been waiting for her for three hundred years.',
    'Running from an arranged mating, {protagonist} finds refuge with a rival pack. Their alpha, {love_interest}, offers her protection. The price? Becoming his.',
    'She\'s a human in shifter territory. He\'s the bear alpha who pulled her from the river. {love_interest} knows she\'s his mate. Now he just has to convince her.',
    'When {protagonist} inherits her grandmother\'s cabin, she inherits a problem: {love_interest}, the dragon shifter who\'s been guarding the land for centuries. And he\'s very possessive.',
  ],
  'Romantasy': [
    'Stolen by the fae as a child, {protagonist} returns to the mortal world with one mission: destroy the High Lord who took her. She didn\'t plan on {love_interest} making her question everything.',
    'In a kingdom where magic is forbidden, {protagonist} is the last witch. {love_interest} is the assassin sent to kill her. Neither expected the bond that flares between them.',
    'Sold to the Dark Court as tribute, {protagonist} becomes the obsession of {love_interest}, the cruel prince who rules with an iron fist and wants her submission.',
    'To save her kingdom, {protagonist} must marry the monster. But {love_interest}, the beast lord everyone fears, isn\'t what the legends promised.',
    'She\'s the prophesied destroyer of his realm. He\'s the immortal king sworn to stop her. {love_interest} should kill {protagonist}. Instead, he makes her his queen.',
  ],
  'MM Romance': [
    'The team\'s new enforcer has a rule: no relationships. {protagonist} has a rule too: no falling for straight guys. Turns out they\'re both liars.',
    'His best friend\'s little brother is off limits. {protagonist} knows this. But {love_interest} isn\'t so little anymore, and he\'s done waiting.',
    'One drunken kiss ruined their friendship ten years ago. Now {protagonist} and {love_interest} are stuck working together, and the tension is unbearable.',
    'The grumpy veteran. The sunshine rookie. {protagonist} and {love_interest} are polar opposites who can\'t stand each other. Until they can\'t keep their hands off each other.',
    'He came out at forty and swore off relationships. Then {love_interest} moved next door with his rescue dogs and homemade cookies, and {protagonist}\'s walls started crumbling.',
  ],
  'Bully Romance': [
    'They made her life hell for four years. Now {protagonist} is back, and the {group_name} realize too late that they destroyed the only girl who ever mattered.',
    'The scholarship student. The elite\'s favorite target. {protagonist} was supposed to be entertainment. {love_interest} wasn\'t supposed to become obsessed.',
    '{protagonist} thought escaping {academy_name} Academy meant escaping him. She was wrong. {love_interest} found her, and he\'s not sorry for what he did. He\'s sorry he ever let her go.',
    'He tormented her. Humiliated her. Made her cry. Now {love_interest} is begging for forgiveness, and {protagonist} has to decide if revenge or love tastes sweeter.',
    'Four years of hell. One summer of secrets. {protagonist} knows what {love_interest} did. And she\'s going to make him pay—even if it destroys them both.',
  ],
  'Age Gap Romance': [
    'He\'s her father\'s best friend. {love_interest} watched {protagonist} grow up, swearing he\'d never touch her. But she\'s not a little girl anymore.',
    'Her new professor is the same man who spent one unforgettable night with her over summer break. {love_interest} should stay away. He won\'t.',
    '{protagonist} just inherited her late husband\'s company—and his infuriatingly attractive, much younger business partner who looks at her like she\'s his next meal.',
    'At 45, {love_interest} knows better than to want his daughter\'s college roommate. At 22, {protagonist} doesn\'t care about what\'s appropriate.',
    'The silver-fox CEO. The new assistant half his age. {love_interest} has rules about workplace relationships. {protagonist} is about to break every single one.',
  ],
};

// ============================================================================
// EXPANDED CHARACTER NAME BANKS - High variety to prevent repetition
// ============================================================================

// Female protagonist names - Mix of modern, nature-inspired, and unique
const FEMALE_NAMES = [
  // Nature/Botanical
  'Ivy', 'Sage', 'Willow', 'Wren', 'Briar', 'Fern', 'Laurel', 'Rowan', 'Hazel', 'Dahlia',
  'Maple', 'Clover', 'Meadow', 'Aurora', 'Celeste', 'Terra', 'Marina', 'Sierra', 'Coral',
  // Modern/Edgy
  'Harper', 'Quinn', 'Blake', 'Sloane', 'Piper', 'Emery', 'Harlow', 'Monroe', 'Sutton', 'Ellis',
  'Lennox', 'Phoenix', 'Raven', 'Onyx', 'Sable', 'Zara', 'Vesper', 'Lyric', 'Rebel', 'Storm',
  // Classic with edge
  'Elena', 'Aria', 'Luna', 'Nova', 'Mira', 'Cora', 'Thea', 'Nora', 'Vera', 'Ada',
  'Clara', 'Iris', 'Violet', 'Scarlet', 'Ruby', 'Pearl', 'Jade', 'Opal', 'Raven', 'Ember',
  // Uncommon/Unique
  'Elowen', 'Isolde', 'Seraphina', 'Evander', 'Lysandra', 'Thessaly', 'Calliope', 'Arden',
  'Seren', 'Niamh', 'Maeve', 'Aoife', 'Astrid', 'Freya', 'Ingrid', 'Sigrid', 'Greta', 'Thora',
];

// Male/Monster love interest names - Strong, unique, memorable
const MALE_NAMES = [
  // Dark/Powerful
  'Dante', 'Kael', 'Knox', 'Cade', 'Ezra', 'Cole', 'Roman', 'Kai', 'Axel', 'Zane',
  'Rhys', 'Thane', 'Draven', 'Caspian', 'Lucian', 'Malakai', 'Silas', 'Damon', 'Nero', 'Magnus',
  // Warrior/Ancient
  'Atlas', 'Orion', 'Titan', 'Ajax', 'Ares', 'Hector', 'Leander', 'Evander', 'Alaric', 'Ragnar',
  'Bjorn', 'Fenrir', 'Tyr', 'Baldr', 'Sigurd', 'Gunnar', 'Erik', 'Rorik', 'Thorin', 'Orin',
  // Monster-specific
  'Groknar', 'Drax', 'Zul\'kar', 'Thokk', 'Grimjaw', 'Ironhide', 'Bloodfang', 'Stoneheart',
  'Ashclaw', 'Darkhorn', 'Shadowmaw', 'Bonecrusher', 'Stormrage', 'Warbringer', 'Dreadmaw',
  // Elegant/Mysterious
  'Aurelius', 'Sebastian', 'Lysander', 'Cassian', 'Dorian', 'Cyprian', 'Ambrose', 'Percival',
  'Gideon', 'Jasper', 'Sterling', 'Griffin', 'Bastian', 'Stellan', 'Caelum', 'Sorren',
];

// Orc-specific names for monster romance
const ORC_NAMES = [
  'Grokk', 'Zul\'tar', 'Thokk', 'Drukhar', 'Grimmok', 'Rokgar', 'Zorg', 'Kargath', 'Thrall',
  'Nazgrim', 'Garrosh', 'Durotan', 'Grom', 'Kilrogg', 'Blackhand', 'Orgrim', 'Broxigar',
  'Saurfang', 'Varok', 'Eitrigg', 'Rexxar', 'Mokvar', 'Gorrok', 'Kargath', 'Zuluhed',
];

// Dragon-shifter names
const DRAGON_NAMES = [
  'Drakorian', 'Ignis', 'Scorch', 'Emberheart', 'Pyraxis', 'Flamewing', 'Cinderclaw',
  'Ashbringer', 'Infernos', 'Blazeborn', 'Scorchwing', 'Firethorn', 'Dracul', 'Smaug',
];

// Demon names
const DEMON_NAMES = [
  'Azrael', 'Belial', 'Malphas', 'Asmodeus', 'Mammon', 'Abaddon', 'Bael', 'Samael',
  'Azazel', 'Mephisto', 'Lucifer', 'Beelzebub', 'Leviathan', 'Astaroth', 'Moloch',
];

const VILLAIN_ORGS = ['the Syndicate', 'the Cartel', 'the Brotherhood', 'the Order', 'the Society', 'the Covenant', 'the Conclave', 'the Assembly', 'the Tribunal', 'the Dominion'];
const TITLES = ['Don', 'Boss', 'Alpha', 'King', 'Lord', 'Duke', 'Commander', 'Captain', 'Warlord', 'Chieftain', 'High Lord', 'Overlord', 'Master', 'Sovereign'];
const CREATURES = ['orc', 'demon', 'dragon', 'minotaur', 'vampire', 'gargoyle', 'troll', 'fae lord', 'werewolf', 'incubus', 'djinn', 'kraken', 'centaur', 'satyr', 'naga'];
const ACADEMIES = ['Blackwood', 'Sterling', 'Thornwood', 'Ravencrest', 'Ashford', 'Kingsley', 'Westbrook', 'Nightingale', 'Shadowmere', 'Ironwood', 'Crystalhaven', 'Stormhold', 'Darkhollow', 'Grimoire'];
const FAMILIES = ['Morozov', 'Valentino', 'Romano', 'Volkov', 'Castellano', 'Petrov', 'Sinclair', 'Montague', 'Ashworth', 'Blackwell', 'Thornton', 'Ravenswood', 'Nightshade', 'Grimaldi', 'DuMont', 'Valerius'];
const PACK_NAMES = ['Shadow Moon', 'Blood Moon', 'Silver Creek', 'Dark River', 'Storm Ridge', 'Frost Peak', 'Iron Mountain', 'Crimson Valley', 'Thunder Pass', 'Bone Hollow', 'Ghost Wood', 'Raven Peak'];
const GROUPS = ['Elite', 'Kings', 'Devils', 'Saints', 'Princes', 'Lords', 'Reapers', 'Shadows', 'Serpents', 'Ravens', 'Wolves', 'Dragons'];
const CITIES = ['Manhattan', 'Chicago', 'London', 'Los Angeles', 'Miami', 'Seattle', 'Boston', 'New Orleans', 'San Francisco', 'Las Vegas', 'Monaco', 'Paris', 'Rome', 'Tokyo', 'Hong Kong'];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template: string, subGenre?: string): string {
  // Use subgenre-specific creature if available
  const creature = subGenre?.toLowerCase() || randomChoice(CREATURES);
  
  return template
    .replace(/{protagonist}/g, randomChoice(FEMALE_NAMES))
    .replace(/{love_interest}/g, randomChoice(MALE_NAMES))
    .replace(/{villain_org}/g, randomChoice(VILLAIN_ORGS))
    .replace(/{title}/g, randomChoice(TITLES))
    .replace(/{creature}/g, creature)
    .replace(/{academy_name}/g, randomChoice(ACADEMIES))
    .replace(/{family_name}/g, randomChoice(FAMILIES))
    .replace(/{pack_name}/g, randomChoice(PACK_NAMES))
    .replace(/{group_name}/g, randomChoice(GROUPS))
    .replace(/{team_name}/g, randomChoice(GROUPS))
    .replace(/{city}/g, randomChoice(CITIES))
    .replace(/{num}/g, String(randomChoice([3, 4, 5])))
    .replace(/{stakes}/g, randomChoice(['his revenge', 'his empire', 'his survival', 'his power']));
}

// ============================================
// TITLE GENERATION
// ============================================

// Generate title with subgenre awareness
function generateTitle(genre: string, subGenre?: string): string {
  const creature = subGenre?.charAt(0).toUpperCase() + (subGenre?.slice(1).toLowerCase() || '') || 'Beast';
  
  const TITLE_PATTERNS: Record<string, (() => string)[]> = {
    'Dark Romance': [
      () => `${randomChoice(['Captive', 'Stolen', 'Claimed', 'Bound', 'Ruined', 'Shattered', 'Broken'])} by the ${randomChoice(TITLES)}`,
      () => `His ${randomChoice(['Obsession', 'Possession', 'Redemption', 'Destruction', 'Salvation', 'Addiction', 'Downfall'])}`,
      () => `The ${randomChoice(TITLES)}'s ${randomChoice(['Captive', 'Prize', 'Obsession', 'Bride', 'Pet', 'Weakness', 'Ruin'])}`,
      () => `${randomChoice(['Cruel', 'Savage', 'Wicked', 'Ruthless', 'Merciless', 'Brutal', 'Vicious'])} ${randomChoice(['King', 'Prince', 'Devil', 'Monster', 'Beast', 'Love'])}`,
      () => `${randomChoice(['Twisted', 'Tangled', 'Tortured', 'Tainted'])} ${randomChoice(['Hearts', 'Souls', 'Vows', 'Desires'])}`,
      () => `${randomChoice(['Breaking', 'Stealing', 'Claiming', 'Destroying'])} ${randomChoice(['Her', 'the Princess', 'My Enemy', 'What\'s Mine'])}`,
      () => `${randomChoice(['Blood', 'Sin', 'Shadow', 'Venom'])} and ${randomChoice(['Roses', 'Redemption', 'Ruin', 'Rapture'])}`,
    ],
    'Monster Romance': [
      () => `${randomChoice(['Claimed', 'Mated', 'Bonded', 'Taken', 'Chosen', 'Marked', 'Kept'])} by the ${creature}`,
      () => `The ${creature}'s ${randomChoice(['Mate', 'Bride', 'Human', 'Treasure', 'Heart', 'Obsession', 'Weakness'])}`,
      () => `${randomChoice(['Loving', 'Craving', 'Needing', 'Wanting', 'Hunting'])} My ${creature}`,
      () => `My ${creature} ${randomChoice(['Mate', 'Lover', 'Husband', 'King', 'Warrior', 'Heart'])}`,
      () => `${creature} ${randomChoice(['Heart', 'Soul', 'Obsession', 'Desire', 'Claim', 'Kiss', 'Touch'])}`,
      () => `${randomChoice(['Savage', 'Wild', 'Fierce', 'Primal', 'Untamed', 'Brutal'])} ${creature}`,
      () => `The ${creature}'s ${randomChoice(['Captive', 'Sacrifice', 'Offering', 'Gift', 'Promise'])}`,
      () => `${randomChoice(['Stolen', 'Lost', 'Saved', 'Found'])} by an ${creature}`,
      () => `${randomChoice(['Her', 'My', 'The'])} ${creature} ${randomChoice(['King', 'Prince', 'Protector', 'Guardian'])}`,
      () => `Into the ${creature}'s ${randomChoice(['Arms', 'Lair', 'Heart', 'Territory'])}`,
      () => `${randomChoice(['Beauty', 'Woman', 'Maiden'])} and the ${creature}`,
      () => `${creature} ${randomChoice(['Bound', 'Claimed', 'Desired', 'Devoted'])}`,
      () => `The ${creature} Who ${randomChoice(['Kept Me', 'Chose Me', 'Claimed Me', 'Saved Me', 'Found Me'])}`,
      () => `${randomChoice(['Kiss', 'Taste', 'Touch', 'Scent'])} of ${creature}`,
      () => `${creature}s Don't ${randomChoice(['Share', 'Let Go', 'Say Goodbye', 'Give Up'])}`,
    ],
    'Alien Romance': [
      () => `${randomChoice(['Claimed', 'Mated', 'Bonded', 'Taken', 'Abducted', 'Stolen'])} by the Alien`,
      () => `The Alien's ${randomChoice(['Mate', 'Bride', 'Human', 'Treasure', 'Obsession', 'Female'])}`,
      () => `${randomChoice(['Stolen', 'Captured', 'Abducted', 'Sold'])} by the ${randomChoice(['Warlord', 'Commander', 'Prince', 'Emperor'])}`,
      () => `My Alien ${randomChoice(['Mate', 'Warrior', 'King', 'Protector', 'Husband', 'Hunter'])}`,
      () => `${randomChoice(['Ice', 'Fire', 'Dark', 'Star'])} ${randomChoice(['Planet', 'World', 'King', 'Warrior'])}`,
      () => `${randomChoice(['Bred', 'Kept', 'Claimed', 'Mated'])} on ${randomChoice(['Ice Planet', 'the Ship', 'His World', 'an Alien World'])}`,
    ],
    'Why Choose / Reverse Harem': [
      () => `${randomChoice(['Their', 'Four', 'Five', 'Her'])} ${randomChoice(['Kings', 'Devils', 'Princes', 'Lords', 'Monsters', 'Beasts'])}`,
      () => `${randomChoice(['Claimed', 'Chosen', 'Taken', 'Wanted', 'Owned'])} by ${randomChoice(['Them', 'the Elite', 'the Pack', 'the Kings', 'All of Them'])}`,
      () => `The ${randomChoice(ACADEMIES)} ${randomChoice(['Boys', 'Kings', 'Devils', 'Heirs', 'Rulers'])}`,
      () => `${randomChoice(['One Girl', 'She', 'Her'])} ${randomChoice(['Four', 'Five', 'Three', 'Many'])} ${randomChoice(['Rules', 'Hearts', 'Beasts', 'Kings', 'Monsters'])}`,
      () => `${randomChoice(['Shared', 'Surrounded', 'Protected', 'Worshipped'])} by ${randomChoice(['Monsters', 'Warriors', 'Alphas', 'Kings'])}`,
    ],
    'Mafia Romance': [
      () => `The ${randomChoice(FAMILIES)} ${randomChoice(['Bride', 'Heir', 'Princess', 'Queen', 'Wife', 'Woman'])}`,
      () => `${randomChoice(['Stolen', 'Sold', 'Given', 'Promised', 'Traded', 'Delivered'])} to the ${randomChoice(['Don', 'Boss', 'King', 'Bratva', 'Mafia'])}`,
      () => `${randomChoice(['Brutal', 'Savage', 'Ruthless', 'Merciless', 'Bloody', 'Violent'])} ${randomChoice(['Vows', 'Love', 'Union', 'Obsession', 'Devotion'])}`,
      () => `His ${randomChoice(['Italian', 'Russian', 'Irish', 'Greek'])} ${randomChoice(['Bride', 'Princess', 'Queen', 'Possession', 'Obsession'])}`,
      () => `${randomChoice(['Blood', 'Ink', 'Sin', 'Debt'])} and ${randomChoice(['Roses', 'Diamonds', 'Bullets', 'Obsession'])}`,
    ],
    'Shifter Romance': [
      () => `${randomChoice(['Claimed', 'Mated', 'Marked', 'Chosen', 'Scented'])} by the Alpha`,
      () => `The Alpha's ${randomChoice(['Mate', 'Human', 'Obsession', 'Omega', 'Heart', 'Weakness'])}`,
      () => `${randomChoice(['Wild', 'Feral', 'Savage', 'Primal', 'Untamed', 'Hungry'])} ${randomChoice(['Heart', 'Soul', 'Desire', 'Claim', 'Need'])}`,
      () => `My ${randomChoice(['Wolf', 'Bear', 'Dragon', 'Lion', 'Panther'])} ${randomChoice(['Mate', 'King', 'Protector', 'Alpha', 'Heart'])}`,
      () => `The ${randomChoice(PACK_NAMES)} ${randomChoice(['Alpha', 'Pack', 'Mate', 'Heart'])}`,
    ],
    'Romantasy': [
      () => `The ${randomChoice(['Dark', 'Shadow', 'Night', 'Blood', 'Thorn', 'Bone'])} ${randomChoice(['Prince', 'King', 'Lord', 'Court', 'Crown'])}`,
      () => `${randomChoice(['Claimed', 'Stolen', 'Taken', 'Cursed'])} by the Fae`,
      () => `A ${randomChoice(['Court', 'Crown', 'Kingdom', 'Throne', 'Realm'])} of ${randomChoice(['Shadows', 'Thorns', 'Night', 'Darkness', 'Stars', 'Blood'])}`,
      () => `The ${randomChoice(['Cruel', 'Wicked', 'Dark', 'Fallen', 'Cursed'])} Prince's ${randomChoice(['Bride', 'Obsession', 'Pet', 'Prisoner', 'Heart'])}`,
      () => `${randomChoice(['Wings', 'Fangs', 'Claws', 'Flames'])} and ${randomChoice(['Fate', 'Fire', 'Fury', 'Fortune'])}`,
    ],
  };

  const patterns = TITLE_PATTERNS[genre] || TITLE_PATTERNS['Dark Romance'];
  return randomChoice(patterns)();
}

// ============================================
// MAIN STORY IDEA GENERATOR
// ============================================

export function generateStoryIdea(genre: string, subGenre?: string): StoryIdea {
  const templates = STORY_TEMPLATES[genre] || STORY_TEMPLATES['Dark Romance'];
  const template = randomChoice(templates);
  const logline = fillTemplate(template, subGenre);
  
  const nicheData = PROFITABLE_NICHES[genre];
  
  // Get tropes for this genre
  const genreTropes = getGenreTropes(genre);
  const selectedTropes: string[] = [];
  for (let i = 0; i < 4; i++) {
    const trope = randomChoice(genreTropes);
    if (!selectedTropes.includes(trope)) {
      selectedTropes.push(trope);
    }
  }
  
  const settings = getGenreSettings(genre);
  const conflicts = getGenreConflicts(genre);

  // Use provided subGenre or generate one
  const finalSubGenre = subGenre || getRandomSubGenre(genre);

  return {
    title: generateTitle(genre, finalSubGenre),
    logline,
    genre,
    subGenre: finalSubGenre,
    tropes: selectedTropes,
    setting: randomChoice(settings),
    conflict: randomChoice(conflicts),
    heat: randomChoice(['steamy', 'scorching'] as HeatLevel[]),
  };
}

function getGenreTropes(genre: string): string[] {
  const baseTropes = [...TROPES.relationship, ...TROPES.character, ...TROPES.situation];
  
  const genreSpecific: Record<string, string[]> = {
    'Dark Romance': ['Captive', 'Possessive Hero', 'Touch Her and Die', 'Morally Gray', 'Obsessive Behavior'],
    'Monster Romance': ['Fated Mates', 'Size Difference', 'Claiming/Marking', 'Fish out of Water', 'Protective Hero'],
    'Why Choose / Reverse Harem': ['Multiple Partners', 'Found Family', 'Academy Setting', 'Pack Dynamics'],
    'Mafia Romance': ['Arranged Marriage', 'Forbidden Love', 'Forced Proximity', 'Protector'],
    'Shifter Romance': ['Fated Mates', 'Pack Dynamics', 'Claiming/Marking', 'Heat/Rut', 'Alpha Hero'],
    'Romantasy': ['Enemies to Lovers', 'Fated Mates', 'Chosen One', 'Dark Curse', 'Forbidden Love'],
    'Alien Romance': ['Fated Mates', 'Size Difference', 'Fish out of Water', 'Claiming/Marking', 'Protective Hero'],
    'MM Romance': ['Grumpy/Sunshine', 'Friends to Lovers', 'Sports Romance', 'Found Family', 'Second Chance'],
    'Bully Romance': ['Enemies to Lovers', 'Academy Setting', 'Forced Proximity', 'He Falls First'],
  };
  
  return [...baseTropes, ...(genreSpecific[genre] || [])];
}

function getGenreSettings(genre: string): string[] {
  const settings: Record<string, string[]> = {
    'Dark Romance': ['criminal underworld', 'isolated mansion', 'underground club', 'secret compound', 'penthouse prison'],
    'Monster Romance': ['enchanted forest', 'alien planet', 'monster realm', 'hidden sanctuary', 'cursed castle'],
    'Why Choose / Reverse Harem': ['elite academy', 'secret society', 'paranormal school', 'MC clubhouse', 'penthouse suite'],
    'Mafia Romance': ['Italian villa', 'NYC penthouse', 'Moscow mansion', 'family compound', 'casino empire'],
    'Shifter Romance': ['pack territory', 'mountain compound', 'forest sanctuary', 'small town with secrets', 'isolated lodge'],
    'Romantasy': ['dark fae court', 'cursed kingdom', 'magical academy', 'forbidden realm', 'enchanted castle'],
    'Alien Romance': ['space station', 'alien planet', 'starship', 'hidden colony', 'frozen world'],
    'MM Romance': ['hockey arena', 'small town', 'fire station', 'military base', 'recording studio'],
    'Bully Romance': ['elite prep school', 'exclusive university', 'small town', 'gated community', 'private academy'],
    'Billionaire Romance': ['Manhattan penthouse', 'private island', 'corporate tower', 'luxury yacht', 'exclusive resort'],
  };
  
  return settings[genre] || settings['Dark Romance'];
}

function getGenreConflicts(genre: string): string[] {
  const conflicts: Record<string, string[]> = {
    'Dark Romance': ['dangerous secrets', 'revenge mission', 'betrayal and trust', 'past trauma', 'rival threats'],
    'Monster Romance': ['forbidden bond', 'species differences', 'outside threats', 'acceptance', 'world collision'],
    'Why Choose / Reverse Harem': ['jealousy and sharing', 'external enemies', 'commitment fears', 'pack/group dynamics', 'past trauma'],
    'Mafia Romance': ['rival families', 'betrayal', 'arranged vs love', 'escape attempts', 'loyalty tests'],
    'Shifter Romance': ['rival packs', 'human discovery', 'mate rejection', 'pack politics', 'rogue threats'],
    'Romantasy': ['warring courts', 'prophecy', 'forbidden magic', 'political intrigue', 'curse breaking'],
    'Alien Romance': ['cultural differences', 'Earth vs alien world', 'communication barriers', 'other suitors', 'survival'],
    'MM Romance': ['coming out', 'career vs love', 'past relationships', 'team dynamics', 'family acceptance'],
    'Bully Romance': ['revenge vs forgiveness', 'trust rebuilding', 'public exposure', 'grovel worthy crimes', 'past secrets'],
    'Billionaire Romance': ['class differences', 'trust issues', 'past gold-diggers', 'public scrutiny', 'family disapproval'],
  };
  
  return conflicts[genre] || conflicts['Dark Romance'];
}

function getRandomSubGenre(genre: string): string {
  const subGenres: Record<string, string[]> = {
    'Dark Romance': ['Captive', 'Stalker', 'Mafia', 'Cartel', 'Obsession'],
    'Monster Romance': ['Orc', 'Dragon', 'Demon', 'Vampire', 'Alien'],
    'Why Choose / Reverse Harem': ['Academy', 'Paranormal', 'Mafia', 'Fantasy'],
    'Shifter Romance': ['Wolf', 'Bear', 'Dragon', 'Multi-Shifter'],
    'Romantasy': ['Fae', 'Demon', 'Vampire', 'Dark Court'],
  };
  
  const options = subGenres[genre];
  return options ? randomChoice(options) : '';
}

// ============================================
// CHAPTER OUTLINE GENERATOR
// ============================================

export function generateChapterOutline(
  genre: string,
  synopsis: string,
  chapterCount: number
): Partial<Chapter>[] {
  const chapters: Partial<Chapter>[] = [];
  
  // Story structure percentages
  const structure = [
    { phase: 'hook', percent: 0.05, titles: ['The Beginning', 'First Sight', 'Inciting Incident'] },
    { phase: 'setup', percent: 0.15, titles: ['New World', 'The Rules', 'First Clash'] },
    { phase: 'rising', percent: 0.25, titles: ['Dangerous Games', 'Crossing Lines', 'Breaking Rules'] },
    { phase: 'midpoint', percent: 0.15, titles: ['Point of No Return', 'Everything Changes', 'First Time'] },
    { phase: 'complications', percent: 0.15, titles: ['Falling Deeper', 'Dark Secrets', 'Growing Closer'] },
    { phase: 'crisis', percent: 0.15, titles: ['Black Moment', 'Shattered', 'The Truth'] },
    { phase: 'resolution', percent: 0.10, titles: ['Grand Gesture', 'Final Battle', 'Claiming', 'Forever'] },
  ];

  for (let i = 0; i < chapterCount; i++) {
    const progress = i / chapterCount;
    let currentPhase = structure[0];
    let cumulative = 0;
    
    for (const phase of structure) {
      cumulative += phase.percent;
      if (progress < cumulative) {
        currentPhase = phase;
        break;
      }
    }
    
    const chapterTitle = `Chapter ${i + 1}: ${randomChoice(currentPhase.titles)}`;
    
    chapters.push({
      id: crypto.randomUUID(),
      title: chapterTitle,
      orderIndex: i,
      content: '',
      wordCount: 0,
      outline: generateChapterOutlineText(currentPhase.phase, i, chapterCount, genre),
      notes: '',
      status: 'outline',
    });
  }
  
  return chapters;
}

function generateChapterOutlineText(phase: string, index: number, total: number, genre: string): string {
  const outlines: Record<string, string[]> = {
    hook: [
      '• Open with action or intriguing situation\n• Introduce protagonist in their world\n• Hint at what\'s to come\n• End with first glimpse of love interest or inciting incident\n• GOAL: Hook reader in first 10%',
    ],
    setup: [
      '• Establish the rules of this world\n• Show protagonist\'s normal life being disrupted\n• First real interaction with love interest\n• Build initial tension/attraction\n• Plant seeds of main conflict\n• INCLUDE: First spicy tension moment',
    ],
    rising: [
      '• Deepen attraction despite resistance\n• Forced proximity or circumstances pushing them together\n• First kiss or intimate moment\n• Reveal vulnerability\n• Raise external stakes\n• INCLUDE: Steamy scene (adjust heat to your level)',
    ],
    midpoint: [
      '• MAJOR turning point\n• First full intimate scene\n• Emotional breakthrough\n• "No going back" moment\n• False sense of security\n• INCLUDE: Your steamiest scene of this section',
    ],
    complications: [
      '• Deepen emotional connection\n• External threats escalate\n• More intimate moments\n• Character growth\n• Secrets start coming out\n• Build toward the crisis',
    ],
    crisis: [
      '• BLACK MOMENT - everything falls apart\n• Secrets revealed / betrayal / misunderstanding\n• Characters separated (emotionally or physically)\n• All seems lost\n• Reader should be DEVASTATED\n• No spice in crisis chapter - pure emotion',
    ],
    resolution: [
      '• Grand gesture or confrontation\n• External conflict resolved\n• Emotional declarations\n• Reunion and makeup\n• Final intimate scene (celebratory)\n• HEA or HFN ending\n• INCLUDE: Epilogue tease if series',
    ],
  };
  
  return randomChoice(outlines[phase] || outlines.setup);
}

// ============================================
// CHARACTER TEMPLATES
// ============================================

export function generateCharacterTemplate(role: Character['role']): Partial<Character> {
  const templates: Record<Character['role'], Partial<Character>[]> = {
    protagonist: [
      {
        name: randomChoice(FEMALE_NAMES),
        age: '22-28',
        appearance: 'Describe: hair, eyes, body type, style. What makes her memorable?',
        personality: 'Strong but vulnerable. What are her walls? What\'s behind them?',
        background: 'What trauma/history shaped her? Why does she resist love?',
        desires: 'Surface want vs. deep need. What does she think she wants vs. what she truly needs?',
        arc: 'From guarded/broken to trusting/healed. What does she learn?',
      },
    ],
    'love-interest': [
      {
        name: randomChoice(MALE_NAMES),
        age: '28-38',
        appearance: 'Tall, built, commanding presence. Distinctive features (scars, tattoos, unique eyes)?',
        personality: 'Dominant, possessive, protective. What softens him? What makes him dangerous?',
        background: 'What made him hard? What does he regret? Why does he resist love?',
        desires: 'He wants HER. But why? What does she represent to him?',
        arc: 'From closed off/ruthless to vulnerable/devoted. What does she teach him?',
      },
    ],
    antagonist: [
      {
        name: '',
        age: 'Any',
        appearance: 'What makes them threatening? Attractive villain or obvious monster?',
        personality: 'Motivation should be understandable. What do they want? Why are they wrong?',
        background: 'What created this villain? Connection to main characters?',
        desires: 'What do they want that conflicts with our couple?',
        arc: 'Defeated, redeemed, or escaped for sequel?',
      },
    ],
    supporting: [
      {
        name: '',
        age: 'Any',
        appearance: 'Quick identifying features.',
        personality: 'Best friend? Mentor? Comic relief? What role do they serve?',
        background: 'Relationship to protagonist.',
        desires: 'Their own subplot if any. Potential for spin-off?',
        arc: 'How do they support the main romance?',
      },
    ],
  };
  
  return { ...randomChoice(templates[role]), role, id: crypto.randomUUID() };
}

// ============================================
// BLURB GENERATOR
// ============================================

export function generateBlurb(book: {
  title: string;
  synopsis: string;
  genre: string;
  tropes: string[];
  heatLevel: HeatLevel;
  penName: string;
}): string {
  const formula = randomChoice(BLURB_FORMULAS);
  
  const heatWarning = {
    sweet: 'Clean romance with closed-door intimacy.',
    sensual: 'Contains sensual scenes.',
    steamy: 'Contains explicit scenes. 18+ only.',
    scorching: 'Contains very explicit content. For mature readers only.',
  };
  
  const tropeString = book.tropes.slice(0, 4).join(' • ');
  
  return `${book.synopsis}

${tropeString}

${heatWarning[book.heatLevel]}

This is a standalone ${book.genre.toLowerCase()} with no cheating and a guaranteed HEA.

⭐ Scroll up and one-click to start reading today! ⭐`;
}

// ============================================
// KEYWORD GENERATOR
// ============================================

export function generateKeywords(genre: string, tropes: string[] = []): string[] {
  const nicheData = PROFITABLE_NICHES[genre];
  const baseKeywords = nicheData?.topKeywords || [];
  
  // Add trope-based keywords
  const tropeKeywords = tropes.map(t => t.toLowerCase().replace(/ /g, ' '));
  
  // Combine and ensure we have 7 unique keywords, each under 50 chars
  const allKeywords = Array.from(new Set([...baseKeywords, ...tropeKeywords]));
  
  // Each keyword slot can have multiple words (phrases), up to 50 characters
  // We want to maximize each slot
  const optimizedKeywords: string[] = [];
  let currentSlot = '';
  
  for (const keyword of allKeywords) {
    if (optimizedKeywords.length >= 7) break;
    
    const testSlot = currentSlot ? `${currentSlot} ${keyword}` : keyword;
    
    if (testSlot.length <= 50) {
      currentSlot = testSlot;
    } else {
      if (currentSlot) {
        optimizedKeywords.push(currentSlot);
        currentSlot = keyword.length <= 50 ? keyword : '';
      }
    }
  }
  
  if (currentSlot && optimizedKeywords.length < 7) {
    optimizedKeywords.push(currentSlot);
  }
  
  // Ensure we have exactly 7 slots
  while (optimizedKeywords.length < 7) {
    const genericKeywords = ['steamy romance', 'alpha male', 'strong heroine', 'hea guaranteed', 'adult romance', 'spicy books', 'book boyfriend'];
    const remaining = genericKeywords.filter(k => !optimizedKeywords.includes(k));
    if (remaining.length > 0) {
      optimizedKeywords.push(remaining[0]);
    } else {
      break;
    }
  }
  
  return optimizedKeywords.slice(0, 7);
}

// ============================================
// KDP DESCRIPTION GENERATOR
// ============================================

export function generateKDPDescription(book: {
  title: string;
  synopsis: string;
  genre: string;
  tropes?: string[];
  heatLevel?: HeatLevel;
}): string {
  const tropes = book.tropes || [];
  const heat = book.heatLevel || 'steamy';
  
  const heatText = {
    sweet: 'A clean romance with all the feels.',
    sensual: 'Contains sensual scenes that will make you swoon.',
    steamy: 'Contains explicit scenes. Intended for readers 18+.',
    scorching: '🔥 VERY explicit content. For mature readers only.',
  };

  const tropeList = tropes.length > 0 
    ? `\n\n<b>Tropes you'll love:</b>\n✓ ${tropes.slice(0, 5).join('\n✓ ')}`
    : '';

  return `<b>${book.title}</b>

${book.synopsis}
${tropeList}

<i>${heatText[heat]}</i>

This is a <b>standalone ${book.genre.toLowerCase()}</b> with no cheating, no cliffhanger, and a guaranteed happily ever after.

<b>Content Note:</b> This book contains mature themes and explicit content intended for adult readers.

---
<b>⭐ One-click now and escape into a story you won't be able to put down! ⭐</b>`;
}

// ============================================
// PRICING ADVISOR
// ============================================

export interface PricingRecommendation {
  recommended: number;
  range: { min: number; max: number };
  royalty70: boolean;
  kuRecommended: boolean;
  reasoning: string;
}

export function getPricingRecommendation(
  wordCount: number,
  genre: string,
  isSeriesBook: boolean
): PricingRecommendation {
  const nicheData = PROFITABLE_NICHES[genre];
  
  let basePrice = nicheData?.avgPrice || 3.99;
  let kuRecommended = nicheData?.kuPopular ?? true;
  
  // Adjust for word count
  if (wordCount < 25000) {
    basePrice = 0.99;
  } else if (wordCount < 40000) {
    basePrice = Math.min(basePrice, 2.99);
  } else if (wordCount > 80000) {
    basePrice = Math.max(basePrice, 4.99);
  }
  
  // Series books can be priced lower to hook readers
  if (isSeriesBook) {
    basePrice = Math.max(0.99, basePrice - 1);
  }
  
  const royalty70 = basePrice >= 2.99 && basePrice <= 9.99;
  
  let reasoning = '';
  if (wordCount < 25000) {
    reasoning = 'Short length suggests $0.99 price point for impulse buys. Consider KU for page reads revenue.';
  } else if (isSeriesBook) {
    reasoning = 'First-in-series pricing to hook readers. Make money on subsequent books.';
  } else if (nicheData?.competition === 'high') {
    reasoning = `Competitive ${genre} market. Price competitively while maintaining 70% royalty.`;
  } else {
    reasoning = `${genre} readers expect quality at this price point. Good for KU page reads too.`;
  }
  
  return {
    recommended: basePrice,
    range: { min: Math.max(0.99, basePrice - 1), max: Math.min(9.99, basePrice + 2) },
    royalty70,
    kuRecommended,
    reasoning,
  };
}

// ============================================
// BACK MATTER GENERATOR
// ============================================

export function generateBackMatter(
  authorName: string,
  otherBooks: Array<{ title: string; link: string; blurb: string }>,
  newsletterLink?: string
): string {
  let backMatter = `
<h2>About the Author</h2>
<p>${authorName} writes steamy romance that will make you laugh, cry, and fan yourself. When not creating swoon-worthy book boyfriends, you can find them [INSERT HOBBY].</p>

<h2>Also by ${authorName}</h2>
`;

  for (const book of otherBooks.slice(0, 5)) {
    backMatter += `
<h3>${book.title}</h3>
<p>${book.blurb}</p>
<p><b>Available now:</b> ${book.link}</p>
`;
  }

  if (newsletterLink) {
    backMatter += `
<h2>Stay Connected</h2>
<p>Want to be the first to know about new releases, sales, and exclusive content?</p>
<p><b>Join my newsletter:</b> ${newsletterLink}</p>
<p>Subscribers get [FREEBIE] just for signing up!</p>
`;
  }

  backMatter += `
<h2>Did you enjoy this book?</h2>
<p>Reviews help readers find books they'll love. If you enjoyed this story, please consider leaving a review on Amazon. Even a sentence or two makes a huge difference!</p>
<p>Thank you for reading! ❤️</p>
`;

  return backMatter;
}
