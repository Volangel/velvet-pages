import {
  BriefInterpretation,
  ChapterPipelineRequest,
  ChapterPipelineResult,
  ContinuityReport,
  CriticFinding,
  PipelineScores,
  ScenePlan,
  SpecificityBudget,
  StageArtifact,
  StoryBible,
  StyleSafetyConfig,
  VoiceCard,
  RewriteInstruction,
} from '@/types';

import OpenAI from 'openai';

export const PIPELINE_VERSION = '1.0.0-multistage';

const CLICHE_LEXICON = [
  'velvet voice',
  'storm mirrored',
  'safe place for a girl',
  'intoxicating fear',
  'heart hammered like',
  'could not help but',
];

const SPECIFICITY_DEFAULT: SpecificityBudget = {
  sensoryDetails: 6,
  personalDetails: 2,
  locationDetails: 2,
  artifactDetails: 1,
};

type Runner = (
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: { temperature?: number; maxTokens?: number; json?: boolean }
) => Promise<string>;

function timestamp(): string {
  return new Date().toISOString();
}

function buildCanon(bible?: StoryBible): StoryBible {
  return (
    bible || {
      characters: [],
      worldRules: [],
      timeline: [],
      styleGuide: {
        proseRules: ['Show character interiority over exposition', 'Prefer concrete nouns to abstractions'],
        tabooPhrases: [],
        allowedMetaphors: [],
        pacingTargets: ['Open with motion', 'End with unresolved decision in last two paragraphs'],
      },
    }
  );
}

function buildStyleSafetyConfig(config?: StyleSafetyConfig): StyleSafetyConfig {
  return (
    config || {
      heatLevel: 'sensual',
      violenceLevel: 'medium',
      languageIntensity: 'moderate',
      forbiddenContent: ['minors', 'incest', 'non-consensual content'],
      tabooPhrases: ['velvet voice', 'storm mirrored her mood'],
      allowedMetaphors: ['weather as foreshadowing', 'body as geography'],
    }
  );
}

function withArtifact(name: string, content: any): StageArtifact {
  return { name, content, timestamp: timestamp(), promptVersion: PIPELINE_VERSION };
}

function requireSpecificityBudget(budget?: SpecificityBudget): SpecificityBudget {
  return budget || SPECIFICITY_DEFAULT;
}

function systemStageIntro(stage: string) {
  return `You are the ${stage} stage of a deterministic fiction pipeline. Respond ONLY with JSON.`;
}

function briefInterpreterPrompt(request: ChapterPipelineRequest): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: systemStageIntro('Brief Interpreter') },
    {
      role: 'user',
      content: JSON.stringify({
        brief: request.brief,
        specificityBudget: requireSpecificityBudget(request.specificityBudget),
        styleSafety: buildStyleSafetyConfig(request.styleSafety),
      }),
    },
  ];
}

function storyStatePrompt(request: ChapterPipelineRequest, canon: StoryBible): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: systemStageIntro('Story State Loader') },
    {
      role: 'user',
      content: JSON.stringify({
        canon,
        chapterSynopsis: request.chapterSynopsis,
        chapterTitle: request.chapterTitle,
        arcs: request.seriesArcs || [],
      }),
    },
  ];
}

function scenePlannerPrompt(brief: BriefInterpretation, canon: StoryBible, budget: SpecificityBudget): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: systemStageIntro('Scene Planner') },
    {
      role: 'user',
      content: JSON.stringify({
        genre: brief.genre,
        tropes: brief.tropes,
        tone: brief.tone,
        heatLevel: brief.heatLevel,
        canon,
        specificityBudget: budget,
        requirements: {
          beatCount: { min: 10, max: 20 },
          tensionCurve: '0-10 scale across beats',
          hooks: 'Last two paragraphs end with unresolved question and decision',
        },
      }),
    },
  ];
}

function draftPrompt(
  plan: ScenePlan,
  canon: StoryBible,
  budget: SpecificityBudget,
  voiceCard?: VoiceCard,
  styleSafety?: StyleSafetyConfig
): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: systemStageIntro('Draft Generator') },
    {
      role: 'user',
      content: JSON.stringify({
        plan,
        canon,
        budget,
        voiceCard,
        styleSafety,
        constraints: {
          honorBeats: true,
          enforceSpecificity: true,
          maintainPOV: true,
          heatLevel: styleSafety?.heatLevel,
        },
      }),
    },
  ];
}

function criticPrompt(draft: string, budget: SpecificityBudget, lexicon: string[]): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: systemStageIntro('Critic / Editor') },
    {
      role: 'user',
      content: JSON.stringify({ draft, specificityBudget: budget, clicheLexicon: lexicon }),
    },
  ];
}

function rewritePrompt(
  draft: string,
  instructions: RewriteInstruction[],
  voiceCard?: VoiceCard,
  styleSafety?: StyleSafetyConfig
): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: systemStageIntro('Rewrite Pass') },
    {
      role: 'user',
      content: JSON.stringify({ draft, instructions, voiceCard, styleSafety, mode: 'surgical' }),
    },
  ];
}

function continuityPrompt(draft: string, canon: StoryBible, brief: BriefInterpretation): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: systemStageIntro('Continuity Validator') },
    {
      role: 'user',
      content: JSON.stringify({ draft, canon, brief }),
    },
  ];
}

function parseJson<T>(content: string): T {
  return JSON.parse(content) as T;
}

function evaluateDraft(
  draft: string,
  plan: ScenePlan,
  continuity: ContinuityReport,
  budget: SpecificityBudget
): PipelineScores {
  const lowerDraft = draft.toLowerCase();
  const clicheHits = CLICHE_LEXICON.reduce((count, phrase) => (lowerDraft.includes(phrase) ? count + 1 : count), 0);
  const specificityCount = (draft.match(/\b(?:scent|texture|temperature|scar|habit|tattoo|detail|brand)\b/gi) || []).length;
  const dialogueLines = (draft.match(/"/g) || []).length / 2;
  const sentences = draft.split(/[.!?]/).filter(Boolean);
  const avgSentenceLength = sentences.length > 0
    ? sentences.reduce((len, sentence) => len + sentence.trim().split(/\s+/).length, 0) / sentences.length
    : 0;
  const dialogueRatio = sentences.length ? dialogueLines / sentences.length : 0;
  const beatCoverage = plan?.beats?.length || 0;

  const failures: string[] = [];
  if (clicheHits > 2) failures.push('Cliche score too high');
  if (specificityCount < budget.sensoryDetails + budget.personalDetails) failures.push('Specificity budget not met');
  if (beatCoverage < 8) failures.push('Insufficient beat coverage');
  if (!continuity.povConsistent || !continuity.timelineConsistent || !continuity.namesConsistent) {
    failures.push('Continuity checks failed');
  }
  if (dialogueRatio < 0.15 || dialogueRatio > 0.55) failures.push('Dialogue ratio out of range');
  if (avgSentenceLength > 28 || avgSentenceLength < 8) failures.push('Readability outside band');

  return {
    clicheScore: clicheHits,
    specificityCount,
    continuityPass: failures.every(issue => !issue.toLowerCase().includes('continuity')),
    dialogueRatio,
    readability: avgSentenceLength.toFixed(1),
    passed: failures.length === 0,
    failures,
  };
}

export async function runChapterPipeline(
  runner: Runner,
  request: ChapterPipelineRequest,
  model: string
): Promise<ChapterPipelineResult> {
  const artifacts: StageArtifact[] = [];
  const styleSafety = buildStyleSafetyConfig(request.styleSafety);
  const canon = buildCanon(request.storyBible);
  const budget = requireSpecificityBudget(request.specificityBudget);

  const briefContent = await runner(briefInterpreterPrompt(request), { json: true, temperature: 0 });
  const interpretedBrief = parseJson<BriefInterpretation>(briefContent);
  artifacts.push(withArtifact('brief-interpreter', interpretedBrief));

  const canonContent = await runner(storyStatePrompt(request, canon), { json: true, temperature: 0 });
  const mergedCanon = parseJson<StoryBible>(canonContent);
  artifacts.push(withArtifact('story-state-loader', mergedCanon));

  const planContent = await runner(scenePlannerPrompt(interpretedBrief, mergedCanon, budget), { json: true, temperature: 0.3 });
  const plan = parseJson<ScenePlan>(planContent);
  artifacts.push(withArtifact('scene-planner', plan));

  const draftContent = await runner(draftPrompt(plan, mergedCanon, budget, request.voiceCard, styleSafety), {
    temperature: 0.65,
    maxTokens: Math.min(6000, interpretedBrief.targetLength * 2),
  });
  artifacts.push(withArtifact('draft-generator', draftContent));

  const criticContent = await runner(criticPrompt(draftContent, budget, CLICHE_LEXICON), { json: true, temperature: 0.2 });
  const critic = parseJson<{ findings: CriticFinding[]; rewritePlan: RewriteInstruction[] }>(criticContent);
  artifacts.push(withArtifact('critic-editor', critic));

  const rewriteContent = await runner(
    rewritePrompt(draftContent, critic.rewritePlan, request.voiceCard, styleSafety),
    { temperature: 0.4 }
  );
  artifacts.push(withArtifact('rewrite-pass', rewriteContent));

  const continuityContent = await runner(continuityPrompt(rewriteContent, mergedCanon, interpretedBrief), {
    json: true,
    temperature: 0,
  });
  const continuity = parseJson<ContinuityReport>(continuityContent);
  artifacts.push(withArtifact('continuity-validator', continuity));

  const scores = evaluateDraft(rewriteContent, plan, continuity, budget);

  const telemetry = {
    promptVersion: PIPELINE_VERSION,
    model,
    stages: artifacts,
    scores,
  };

  return {
    artifacts,
    storyBible: mergedCanon,
    scores,
    finalDraft: rewriteContent,
    telemetry,
  };
}
