'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Bot,
  Sparkles,
  Users,
  BookOpen,
  FileText,
  Image,
  Tag,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Wand2,
  Zap,
} from 'lucide-react';
import { Book, Chapter, Character } from '@/types';
import { aiService } from '@/lib/ai-service';
import { cn, formatNumber } from '@/lib/utils';

interface FullBookGeneratorProps {
  book: Book;
  onBookUpdate: (updates: Partial<Book>) => void;
  onClose: () => void;
}

type GenerationStage = 
  | 'idle'
  | 'characters'
  | 'outline'
  | 'blurb'
  | 'keywords'
  | 'cover'
  | 'chapters'
  | 'complete'
  | 'error';

interface GenerationProgress {
  stage: GenerationStage;
  progress: number;
  detail: string;
  currentChapter?: number;
  totalChapters?: number;
}

const stages = [
  { id: 'characters', label: 'Characters', icon: Users, desc: 'Creating compelling characters' },
  { id: 'outline', label: 'Outline', icon: BookOpen, desc: 'Structuring the story' },
  { id: 'blurb', label: 'Blurb', icon: FileText, desc: 'Writing book description' },
  { id: 'keywords', label: 'Keywords', icon: Tag, desc: 'Optimizing for discovery' },
  { id: 'cover', label: 'Cover', icon: Image, desc: 'Generating cover concept' },
  { id: 'chapters', label: 'Chapters', icon: Sparkles, desc: 'Writing all chapters' },
];

export default function FullBookGenerator({ book, onBookUpdate, onClose }: FullBookGeneratorProps) {
  const [progress, setProgress] = useState<GenerationProgress>({
    stage: 'idle',
    progress: 0,
    detail: 'Ready to generate',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
  const [generatedContent, setGeneratedContent] = useState<{
    characters?: Character[];
    outlines?: any[];
    blurb?: string;
    keywords?: string[];
    coverPrompt?: string;
    chapters?: Chapter[];
  }>({});

  const updateProgress = useCallback((stage: GenerationStage, progressPercent: number, detail: string) => {
    setProgress({
      stage,
      progress: progressPercent,
      detail,
    });
  }, []);

  const generateFullBook = async () => {
    setIsGenerating(true);
    setError(null);
    setCompletedStages(new Set());
    
    let updatedBook = { ...book };
    const totalSteps = 5 + book.chapters.length;
    let currentStep = 0;

    try {
      // Step 1: Generate characters
      updateProgress('characters', 0, 'Analyzing genre and creating characters...');
      
      if (updatedBook.characters.length === 0) {
        const roles: Character['role'][] = ['protagonist', 'love-interest', 'supporting'];
        const newCharacters: Character[] = [];
        
        for (let i = 0; i < roles.length; i++) {
          if (isPaused) {
            await waitForResume();
          }
          
          updateProgress('characters', (i / roles.length) * 100, `Creating ${roles[i].replace('_', ' ')}...`);
          
          const result = await aiService.generateCharacter({
            book: updatedBook,
            role: roles[i],
            existingCharacters: newCharacters,
          });
          
          if (result.success && result.data) {
            newCharacters.push({
              id: crypto.randomUUID(),
              ...result.data,
            });
          }
        }
        
        updatedBook.characters = newCharacters;
        setGeneratedContent(prev => ({ ...prev, characters: newCharacters }));
        onBookUpdate({ characters: newCharacters });
      }
      
      setCompletedStages(prev => new Set([...prev, 'characters']));
      currentStep++;

      // Step 2: Generate outline
      updateProgress('outline', 0, 'Crafting story structure...');
      
      if (isPaused) await waitForResume();
      
      const outlineResult = await aiService.generateOutline(updatedBook);
      if (outlineResult.success && outlineResult.data) {
        const updatedChapters = updatedBook.chapters.map((ch, idx) => {
          const outline = outlineResult.data![idx];
          return {
            ...ch,
            title: outline?.title || ch.title,
            outline: outline ? `Purpose: ${outline.purpose}\n\nKey Beats:\n• ${outline.beats.join('\n• ')}` : ch.outline,
          };
        });
        
        updatedBook.chapters = updatedChapters;
        setGeneratedContent(prev => ({ ...prev, outlines: outlineResult.data }));
        onBookUpdate({ chapters: updatedChapters });
      }
      
      setCompletedStages(prev => new Set([...prev, 'outline']));
      currentStep++;

      // Step 3: Generate blurb
      updateProgress('blurb', 0, 'Writing compelling book description...');
      
      if (isPaused) await waitForResume();
      
      const blurbResult = await aiService.generateBlurb(updatedBook);
      if (blurbResult.success && blurbResult.data) {
        updatedBook.metadata = {
          ...updatedBook.metadata,
          description: blurbResult.data,
        };
        setGeneratedContent(prev => ({ ...prev, blurb: blurbResult.data }));
        onBookUpdate({ metadata: updatedBook.metadata });
      }
      
      setCompletedStages(prev => new Set([...prev, 'blurb']));
      currentStep++;

      // Step 4: Generate keywords
      updateProgress('keywords', 0, 'Optimizing keywords for discoverability...');
      
      if (isPaused) await waitForResume();
      
      const keywordsResult = await aiService.generateKeywords(updatedBook);
      if (keywordsResult.success && keywordsResult.data) {
        updatedBook.metadata = {
          ...updatedBook.metadata,
          keywords: keywordsResult.data,
        };
        setGeneratedContent(prev => ({ ...prev, keywords: keywordsResult.data }));
        onBookUpdate({ metadata: updatedBook.metadata });
      }
      
      setCompletedStages(prev => new Set([...prev, 'keywords']));
      currentStep++;

      // Step 5: Generate cover prompt
      updateProgress('cover', 0, 'Creating cover concept...');
      
      if (isPaused) await waitForResume();
      
      const coverResult = await aiService.generateCoverPrompt(updatedBook);
      if (coverResult.success && coverResult.data) {
        updatedBook.coverPrompt = coverResult.data;
        setGeneratedContent(prev => ({ ...prev, coverPrompt: coverResult.data }));
        onBookUpdate({ coverPrompt: coverResult.data });
      }
      
      setCompletedStages(prev => new Set([...prev, 'cover']));
      currentStep++;

      // Step 6+: Generate each chapter
      const chaptersToGenerate = updatedBook.chapters.filter(ch => !ch.content || ch.content.trim() === '');
      
      for (let i = 0; i < updatedBook.chapters.length; i++) {
        const chapter = updatedBook.chapters[i];
        
        if (isPaused) await waitForResume();
        
        setProgress({
          stage: 'chapters',
          progress: (i / updatedBook.chapters.length) * 100,
          detail: `Writing "${chapter.title}"...`,
          currentChapter: i + 1,
          totalChapters: updatedBook.chapters.length,
        });
        
        // Skip if chapter already has content
        if (chapter.content && chapter.content.trim().length > 100) {
          continue;
        }
        
        const previousChapters = updatedBook.chapters.slice(0, i);
        const result = await aiService.generateChapter({
          book: updatedBook,
          chapter,
          previousChapters,
        });
        
        if (result.success && result.data) {
          const wordCount = result.data.split(/\s+/).length;
          updatedBook.chapters[i] = {
            ...chapter,
            content: result.data,
            wordCount,
            status: 'draft',
          };
          
          onBookUpdate({ chapters: [...updatedBook.chapters] });
        }
        
        currentStep++;
      }
      
      setCompletedStages(prev => new Set([...prev, 'chapters']));

      // Calculate final word count
      updatedBook.currentWordCount = updatedBook.chapters.reduce(
        (sum, ch) => sum + ch.wordCount,
        0
      );
      updatedBook.status = 'editing';
      
      // IMPORTANT: Include ALL data in final update to ensure nothing is lost
      onBookUpdate({
        characters: updatedBook.characters,
        chapters: [...updatedBook.chapters],
        metadata: updatedBook.metadata,
        coverPrompt: updatedBook.coverPrompt,
        currentWordCount: updatedBook.currentWordCount,
        status: 'editing',
      });

      setProgress({
        stage: 'complete',
        progress: 100,
        detail: 'Book generation complete!',
      });

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setProgress({
        stage: 'error',
        progress: 0,
        detail: 'Generation failed',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const waitForResume = (): Promise<void> => {
    return new Promise(resolve => {
      const checkPaused = setInterval(() => {
        if (!isPaused) {
          clearInterval(checkPaused);
          resolve();
        }
      }, 100);
    });
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const getStageStatus = (stageId: string): 'pending' | 'active' | 'complete' | 'error' => {
    if (completedStages.has(stageId)) return 'complete';
    if (progress.stage === stageId) return 'active';
    if (progress.stage === 'error') return 'error';
    return 'pending';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !isGenerating && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-noir-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-noir-700"
      >
        {/* Header */}
        <div className="p-6 border-b border-noir-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-velvet-600 to-purple-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                AI Book Generator
              </h2>
              <p className="text-sm text-noir-400">
                Generate complete book content automatically
              </p>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-noir-800 transition-colors text-noir-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Book Info */}
          <div className="mb-6 p-4 rounded-xl bg-noir-800/50 border border-noir-700">
            <h3 className="font-semibold text-white mb-2">{book.title}</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-velvet-500/20 text-velvet-400">
                {book.genre}
              </span>
              <span className="px-2 py-1 rounded bg-pink-500/20 text-pink-400">
                {book.heatLevel}
              </span>
              <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                {book.chapters.length} chapters
              </span>
              <span className="px-2 py-1 rounded bg-green-500/20 text-green-400">
                Target: {formatNumber(book.targetWordCount)} words
              </span>
            </div>
          </div>

          {/* Progress Stages */}
          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const status = getStageStatus(stage.id);
              const StageIcon = stage.icon;
              const isCurrentStage = progress.stage === stage.id;
              
              return (
                <div
                  key={stage.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    status === 'complete' && 'bg-green-500/10 border-green-500/30',
                    status === 'active' && 'bg-velvet-500/10 border-velvet-500/30',
                    status === 'pending' && 'bg-noir-800/30 border-noir-700',
                    status === 'error' && 'bg-red-500/10 border-red-500/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      status === 'complete' && 'bg-green-500/20 text-green-400',
                      status === 'active' && 'bg-velvet-500/20 text-velvet-400',
                      status === 'pending' && 'bg-noir-700 text-noir-400',
                      status === 'error' && 'bg-red-500/20 text-red-400'
                    )}>
                      {status === 'complete' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : status === 'active' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : status === 'error' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StageIcon className="w-4 h-4 text-noir-400" />
                          <span className={cn(
                            'font-medium',
                            status === 'complete' && 'text-green-400',
                            status === 'active' && 'text-white',
                            status === 'pending' && 'text-noir-400',
                            status === 'error' && 'text-red-400'
                          )}>
                            {stage.label}
                          </span>
                        </div>
                        
                        {stage.id === 'chapters' && isCurrentStage && progress.currentChapter && (
                          <span className="text-xs text-velvet-400">
                            {progress.currentChapter} / {progress.totalChapters}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-noir-400 mt-1">
                        {isCurrentStage ? progress.detail : stage.desc}
                      </p>
                      
                      {/* Progress bar for chapters */}
                      {stage.id === 'chapters' && isCurrentStage && (
                        <div className="mt-2 h-1.5 bg-noir-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-velvet-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm text-red-300 mt-2">{error}</p>
            </div>
          )}

          {/* Completion Message */}
          {progress.stage === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
            >
              <div className="flex items-center gap-2 text-green-400">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Generation Complete!</span>
              </div>
              <p className="text-sm text-green-300 mt-2">
                Your book has been generated with{' '}
                {formatNumber(book.chapters.reduce((sum, ch) => sum + ch.wordCount, 0))} words
                across {book.chapters.length} chapters. Review and edit as needed.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-noir-700 flex items-center justify-between">
          <div className="text-sm text-noir-400">
            {isGenerating && isPaused && (
              <span className="text-amber-400 flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Paused
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {isGenerating && (
              <button
                onClick={handlePauseResume}
                className="px-4 py-2 rounded-lg bg-noir-800 text-white flex items-center gap-2 hover:bg-noir-700 transition-colors"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </button>
            )}
            
            {progress.stage === 'complete' || progress.stage === 'error' ? (
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-velvet-600 text-white font-medium hover:bg-velvet-500 transition-colors"
              >
                Done
              </button>
            ) : !isGenerating ? (
              <button
                onClick={generateFullBook}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-velvet-600 to-purple-600 text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Zap className="w-5 h-5" />
                Generate Full Book
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
