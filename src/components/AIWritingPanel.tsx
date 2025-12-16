'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  BookOpen,
  Users,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { Book, Chapter } from '@/types';
import { cn } from '@/lib/utils';

interface AIWritingPanelProps {
  book: Book;
  currentChapter: Chapter;
  onContentGenerated: (content: string) => void;
  onChapterUpdate: (chapter: Chapter) => void;
}

type GenerationMode = 'full' | 'continue' | 'rewrite' | 'expand';

export default function AIWritingPanel({
  book,
  currentChapter,
  onContentGenerated,
  onChapterUpdate,
}: AIWritingPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('full');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress('Preparing...');

    try {
      setProgress('Generating content...');
      
      // Use the correct API format
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chapter',
          data: {
            chapterTitle: currentChapter.title,
            chapterNumber: currentChapter.orderIndex + 1,
            outline: currentChapter.outline || '',
            characters: book.characters || [],
            genre: book.genre,
            heatLevel: book.heatLevel || 'steamy',
            previousContext: currentChapter.content || '',
            wordTarget: Math.floor(book.targetWordCount / Math.max(book.chapters.length, 1)),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      
      if (!data.success || !data.content) {
        throw new Error(data.error || 'No content generated');
      }
      
      // Handle different modes
      let finalContent = data.content;
      if (generationMode === 'continue' && currentChapter.content) {
        finalContent = currentChapter.content + '\n\n' + data.content;
      } else if (generationMode === 'expand') {
        finalContent = expandContent(currentChapter.content || '', data.content);
      }

      onContentGenerated(finalContent);
      setProgress('Done!');
      
      // Update chapter status
      onChapterUpdate({
        ...currentChapter,
        content: finalContent,
        wordCount: finalContent.split(/\s+/).length,
        status: 'draft',
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const buildPrompt = (): string => {
    const heatDescriptions: Record<string, string> = {
      sweet: 'Keep romance sweet and clean. Fade to black before any intimate scenes.',
      sensual: 'Include sensual tension. Fade to black for intimate scenes but make the lead-up steamy.',
      steamy: 'Include explicit intimate scenes when appropriate. Be descriptive but tasteful.',
      scorching: 'Include very explicit, detailed intimate scenes. Be bold and descriptive.',
    };

    const characters = book.characters?.map(c => 
      `${c.name} (${c.role}): ${c.personality || 'complex personality'}. ${c.appearance || ''}`
    ).join('\n') || 'No characters defined yet.';

    const targetWords = Math.round((book.targetWordCount / Math.max(book.chapters.length, 1)) * 0.9);
    const tropes = Array.isArray(book.tropes) ? book.tropes.join(', ') : 'contemporary romance tropes';

    let modeInstructions = '';
    switch (generationMode) {
      case 'full':
        modeInstructions = `Write the complete chapter (approximately ${targetWords} words).`;
        break;
      case 'continue':
        modeInstructions = `Continue this chapter from where it left off. Write approximately ${Math.round(targetWords * 0.5)} more words.`;
        break;
      case 'rewrite':
        modeInstructions = `Rewrite and improve this chapter while keeping the same plot beats. Make it more engaging and emotionally resonant.`;
        break;
      case 'expand':
        modeInstructions = `Expand this chapter with more sensory details, dialogue, and emotional depth. Add approximately ${Math.round(targetWords * 0.3)} more words.`;
        break;
    }

    return `Write Chapter ${currentChapter.orderIndex + 1}: "${currentChapter.title}" for "${book.title}"

GENRE: ${book.genre}${book.subGenre ? ` / ${book.subGenre}` : ''}
TROPES: ${tropes}
HEAT LEVEL: ${(book.heatLevel || 'steamy').toUpperCase()} - ${heatDescriptions[book.heatLevel || 'steamy']}

BOOK SYNOPSIS:
${book.synopsis || book.metadata?.description || 'A steamy romance story.'}

CHARACTERS:
${characters}

CHAPTER OUTLINE:
${currentChapter.outline || 'Write an engaging chapter that advances the romance and builds tension.'}

${currentChapter.content && generationMode !== 'full' ? `
EXISTING CONTENT:
${currentChapter.content}
` : ''}

INSTRUCTIONS:
${modeInstructions}

Additional requirements:
- Start with an engaging hook
- Include dialogue, internal thoughts, and sensory details
- Build tension and chemistry between characters
- End with a hook that makes readers want to continue
- All characters must be clearly adults (18+)
- Use deep POV (usually the female protagonist)

Write now:`;
  };

  const getSystemPrompt = (): string => {
    return `You are a bestselling romance/erotica author with millions of readers. You write compelling, emotionally engaging content that readers can't put down.

Your writing style:
- Deep POV (usually female protagonist)
- Show don't tell - use vivid sensory details
- Strong emotional beats
- Tension and chemistry between characters
- Natural, snappy dialogue
- Appropriate pacing for the scene type

For intimate scenes based on heat level:
- Sweet: Focus on emotional connection, sweet moments
- Sensual: Build tension, fade to black
- Steamy: Be explicit but tasteful
- Scorching: Be bold and detailed

IMPORTANT: All characters are adults (18+). Never include minors in any romantic or sexual context.`;
  };

  const expandContent = (original: string, expansion: string): string => {
    // Simple expansion - in a real app, this would be more sophisticated
    const paragraphs = original.split('\n\n');
    const expansionParagraphs = expansion.split('\n\n');
    
    // Interleave new content
    const result: string[] = [];
    for (let i = 0; i < paragraphs.length; i++) {
      result.push(paragraphs[i]);
      if (expansionParagraphs[i]) {
        result.push(expansionParagraphs[i]);
      }
    }
    return result.join('\n\n');
  };

  const modes: { id: GenerationMode; label: string; icon: typeof Wand2; description: string }[] = [
    { id: 'full', label: 'Write Full Chapter', icon: BookOpen, description: 'Generate complete chapter from outline' },
    { id: 'continue', label: 'Continue Writing', icon: ChevronRight, description: 'Continue from current content' },
    { id: 'rewrite', label: 'Rewrite & Improve', icon: RefreshCw, description: 'Rewrite with better quality' },
    { id: 'expand', label: 'Expand & Enrich', icon: Zap, description: 'Add more detail and depth' },
  ];

  return (
    <div className="card-noir rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-velvet-500 to-velvet-700 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">AI Writing Assistant</h3>
          <p className="text-xs text-noir-400">Generate content for this chapter</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-2">
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => setGenerationMode(mode.id)}
            disabled={isGenerating || (mode.id !== 'full' && !currentChapter.content)}
            className={cn(
              'p-3 rounded-lg text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed',
              generationMode === mode.id
                ? 'bg-velvet-600/30 border border-velvet-500'
                : 'bg-noir-800/50 border border-transparent hover:border-noir-600'
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <mode.icon className="w-4 h-4 text-velvet-400" />
              <span className="text-sm font-medium text-white">{mode.label}</span>
            </div>
            <p className="text-xs text-noir-400">{mode.description}</p>
          </button>
        ))}
      </div>

      {/* Chapter Info */}
      <div className="bg-noir-800/50 rounded-lg p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-noir-400">Chapter Outline:</span>
          <span className="text-noir-300">{currentChapter.outline?.length || 0} chars</span>
        </div>
        {currentChapter.outline && (
          <p className="text-xs text-noir-300 mt-2 line-clamp-3">{currentChapter.outline}</p>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full btn-velvet py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {progress}
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Chapter
          </>
        )}
      </button>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-velvet-600/10 border border-velvet-500/20">
        <Lightbulb className="w-4 h-4 text-velvet-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-noir-300">
          <strong className="text-velvet-300">Tip:</strong> For best results, ensure your chapter outline 
          is detailed and your characters are well-defined. The AI uses this context to generate 
          coherent, on-brand content.
        </p>
      </div>
    </div>
  );
}

