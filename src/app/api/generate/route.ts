import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { runChapterPipeline, PIPELINE_VERSION } from '@/lib/story-pipeline';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function missingKeyResponse() {
  return NextResponse.json(
    { success: false, error: 'OpenAI API key is not configured on the server.' },
    { status: 500 }
  );
}

async function createTextCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: { temperature?: number; maxTokens?: number; json?: boolean } = {}
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens,
    response_format: options.json ? { type: 'json_object' } : undefined,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }

  return content.trim();
}

function chapterPrompt(data: any): OpenAI.Chat.ChatCompletionMessageParam[] {
  const wordTarget = data.wordTarget ? `${data.wordTarget} words (±15%)` : '800-1200 words';
  return [
    {
      role: 'system',
      content:
        'You are a bestselling romance ghostwriter. Write vivid, character-driven chapters with natural dialogue, clear pacing, and emotional stakes. Keep the tone aligned to the requested subgenre and heat level.',
    },
    {
      role: 'user',
      content: [
        `Chapter: ${data.chapterNumber ? `#${data.chapterNumber} - ` : ''}${data.chapterTitle || 'Untitled'}`,
        `Genre: ${data.genre || 'Romance'} | Heat Level: ${data.heatLevel || 'sensual'}`,
        data.outline ? `Outline:\n${data.outline}` : null,
        data.previousContext ? `Recent context:\n${data.previousContext}` : null,
        `Primary characters: ${(data.characters || []).map((c: any) => c.name).join(', ') || 'Use given names where relevant'}`,
        `Target length: ${wordTarget}`,
        'Deliver the chapter in markdown paragraphs with dialogue in quotes. Do not include author notes or explanations.',
      ]
        .filter(Boolean)
        .join('\n\n'),
    },
  ];
}

function characterPrompt(data: any): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content:
        'Create a romance character profile with depth and clear motivations. Respond as compact JSON with fields: name, role, age, appearance, personality, background, desires, arc. Use engaging but concise prose (1-3 sentences per field).',
    },
    {
      role: 'user',
      content: [
        `Role to generate: ${data.role}`,
        `Genre: ${data.genre || 'Romance'}`,
        data.existingCharacters?.length
          ? `Existing characters: ${data.existingCharacters
              .map((c: any) => `${c.name} (${c.role})`)
              .join(', ')}`
          : null,
        'Return only valid JSON.',
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ];
}

function outlinePrompt(data: any): OpenAI.Chat.ChatCompletionMessageParam[] {
  const chapterCount = data.chapterCount || 10;
  return [
    {
      role: 'system',
      content:
        'Design a clear, commercial romance outline. Respond as JSON with an "outline" array. Each item should include: title (string), purpose (1-2 sentences), beats (array of 3-5 concise bullet points).',
    },
    {
      role: 'user',
      content: [
        `Book title: ${data.title}`,
        `Genre: ${data.genre || 'Romance'}`,
        data.premise ? `Premise: ${data.premise}` : null,
        data.characters?.length
          ? `Characters: ${data.characters.map((c: any) => `${c.name} (${c.role})`).join(', ')}`
          : null,
        `Chapters: ${chapterCount}`,
        'Please return exactly the requested number of chapters.',
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ];
}

function blurbPrompt(data: any): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content:
        'Write an irresistible back-cover blurb for a romance ebook. Keep it under 200 words, end with a hook, and avoid spoilers. Use a confident, market-ready tone.',
    },
    {
      role: 'user',
      content: [
        `Title: ${data.title}`,
        `Genre: ${data.genre}`,
        data.premise ? `Premise: ${data.premise}` : null,
        data.characters?.length
          ? `Lead characters: ${data.characters.map((c: any) => `${c.name} (${c.role})`).join(', ')}`
          : null,
        data.keywords?.length ? `Keywords: ${data.keywords.join(', ')}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ];
}

function coverPrompt(data: any): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content:
        'Write a concise, image-focused prompt for a book cover designer or image model. Emphasize mood, genre cues, and primary subjects. 80 words maximum.',
    },
    {
      role: 'user',
      content: [
        `Title: ${data.title}`,
        `Author: ${data.authorName || 'Author'}`,
        `Genre: ${data.genre}`,
        data.characters?.length
          ? `Characters to feature: ${data.characters.map((c: any) => `${c.name} (${c.role})`).join(', ')}`
          : null,
        data.mood ? `Mood: ${data.mood}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ];
}

function keywordsPrompt(data: any): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content:
        'Generate 8-12 high-impact Kindle keywords for the romance book. Focus on reader search terms. Respond as JSON with a "keywords" array of short strings (max 50 characters each).',
    },
    {
      role: 'user',
      content: [
        `Genre: ${data.genre}`,
        data.subGenre ? `Subgenre: ${data.subGenre}` : null,
        data.tropes?.length ? `Tropes: ${data.tropes.join(', ')}` : null,
        `Heat level: ${data.heatLevel}`,
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ];
}

function backMatterPrompt(data: any): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content:
        'Draft engaging back matter for a romance ebook. Include: brief author bio, short invitation to join newsletter, and optional series/other books mentions if provided. Keep it friendly and concise.',
    },
    {
      role: 'user',
      content: [
        `Book title: ${data.title}`,
        `Author: ${data.authorName || 'Author'}`,
        data.seriesName ? `Series: ${data.seriesName} (Book ${data.seriesNumber || 1})` : null,
        data.otherBooks?.length
          ? `Other books: ${data.otherBooks.map((b: any) => b.title).join(', ')}`
          : null,
        data.socialLinks?.length
          ? `Social links: ${data.socialLinks.map((s: any) => `${s.platform}: ${s.url}`).join(' | ')}`
          : null,
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ];
}

function parseJson<T>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error('Failed to parse JSON response from OpenAI');
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return missingKeyResponse();
  }

  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'chapter': {
        const content = await createTextCompletion(chapterPrompt(data), {
          temperature: 0.85,
          maxTokens: Math.min(4000, Math.max(800, Math.floor((data.wordTarget || 1000) * 1.5))),
        });
        return NextResponse.json({ success: true, content });
      }

      case 'chapter-pipeline': {
        const pipeline = await runChapterPipeline(
          (messages, options) => createTextCompletion(messages, options),
          data,
          MODEL
        );

        return NextResponse.json({ success: true, pipeline, promptVersion: PIPELINE_VERSION });
      }

      case 'character': {
        const content = await createTextCompletion(characterPrompt(data), {
          temperature: 0.75,
          json: true,
        });
        const character = parseJson(content);
        return NextResponse.json({ success: true, character });
      }

      case 'outline': {
        const content = await createTextCompletion(outlinePrompt(data), {
          temperature: 0.7,
          json: true,
        });
        const parsed = parseJson<{ outline: any[] }>(content);
        return NextResponse.json({ success: true, outline: parsed.outline });
      }

      case 'blurb': {
        const blurb = await createTextCompletion(blurbPrompt(data), { temperature: 0.78, maxTokens: 320 });
        return NextResponse.json({ success: true, blurb });
      }

      case 'cover-prompt': {
        const prompt = await createTextCompletion(coverPrompt(data), { temperature: 0.72, maxTokens: 160 });
        return NextResponse.json({ success: true, prompt });
      }

      case 'keywords': {
        const content = await createTextCompletion(keywordsPrompt(data), { temperature: 0.65, json: true });
        const parsed = parseJson<{ keywords: string[] }>(content);
        return NextResponse.json({ success: true, keywords: parsed.keywords });
      }

      case 'back-matter': {
        const backMatter = await createTextCompletion(backMatterPrompt(data), { temperature: 0.7, maxTokens: 400 });
        return NextResponse.json({ success: true, backMatter });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown generation type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate content. Please try again.',
      },
      { status: 500 }
    );
  }
}
