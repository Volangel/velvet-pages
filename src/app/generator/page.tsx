'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  ArrowRight,
  Flame,
  Heart,
  Zap,
  Sun,
  BookOpen,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  Target,
} from 'lucide-react';
import { GENRES, PROFITABLE_NICHES, TROPES, StoryIdea, HeatLevel } from '@/types';
import { generateStoryIdea, generateChapterOutline, generateKeywords } from '@/lib/story-generator';
import { createNewBook, saveBook } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';

const heatLevels = [
  { id: 'sweet' as HeatLevel, label: 'Sweet', icon: Heart, color: 'text-pink-400', description: 'Closed door' },
  { id: 'sensual' as HeatLevel, label: 'Sensual', icon: Sun, color: 'text-orange-400', description: 'Fade to black' },
  { id: 'steamy' as HeatLevel, label: 'Steamy', icon: Zap, color: 'text-yellow-400', description: 'Explicit' },
  { id: 'scorching' as HeatLevel, label: 'Scorching', icon: Flame, color: 'text-red-400', description: 'Very explicit' },
];

export default function GeneratorPage() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState('Dark Romance');
  const [selectedHeat, setSelectedHeat] = useState<HeatLevel>('steamy');
  const [selectedTropes, setSelectedTropes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<StoryIdea[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [showTropes, setShowTropes] = useState(false);

  const nicheData = PROFITABLE_NICHES[selectedGenre];

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const ideas: StoryIdea[] = [];
      for (let i = 0; i < 4; i++) {
        const idea = generateStoryIdea(selectedGenre);
        // Override with selected heat and add selected tropes
        idea.heat = selectedHeat;
        if (selectedTropes.length > 0) {
          idea.tropes = [...selectedTropes, ...idea.tropes].slice(0, 5);
        }
        ideas.push(idea);
      }
      setGeneratedIdeas(ideas);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = (idea: StoryIdea, index: number) => {
    const text = `Title: ${idea.title}\nGenre: ${idea.genre}\nSub-Genre: ${idea.subGenre}\nHeat: ${idea.heat}\nTropes: ${idea.tropes.join(', ')}\n\nPremise: ${idea.logline}\n\nSetting: ${idea.setting}\nConflict: ${idea.conflict}`;
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreateBook = (idea: StoryIdea) => {
    const wordCount = nicheData?.recommendedWordCount.min || 50000;
    const chapters = generateChapterOutline(idea.genre, idea.logline, 15);
    
    const book = createNewBook({
      title: idea.title,
      genre: idea.genre,
      subGenre: idea.subGenre,
      tropes: idea.tropes,
      heatLevel: idea.heat,
      synopsis: idea.logline,
      targetWordCount: wordCount,
      chapters: chapters.map((ch, idx) => ({
        id: ch.id || crypto.randomUUID(),
        title: ch.title || `Chapter ${idx + 1}`,
        orderIndex: idx,
        content: '',
        wordCount: 0,
        outline: ch.outline || '',
        notes: '',
        status: 'outline' as const,
      })),
      metadata: {
        description: '',
        keywords: generateKeywords(idea.genre, idea.tropes),
        categories: [],
        price: nicheData?.avgPrice || 3.99,
        enrollKU: nicheData?.kuPopular ?? true,
        contentWarnings: ['Adult Content 18+', 'Explicit Sexual Content'],
      },
    });

    saveBook(book);
    router.push(`/book/${book.id}`);
  };

  const toggleTrope = (trope: string) => {
    if (selectedTropes.includes(trope)) {
      setSelectedTropes(selectedTropes.filter(t => t !== trope));
    } else if (selectedTropes.length < 5) {
      setSelectedTropes([...selectedTropes, trope]);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-velvet-500 to-velvet-700">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            Story Generator
          </h1>
          <p className="text-noir-400">
            Generate profitable story ideas optimized for your chosen niche
          </p>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-noir rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-3 gap-6">
            {/* Genre Selection */}
            <div>
              <label className="block text-sm font-medium text-noir-300 mb-3">
                Select Niche
              </label>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-2">
                {GENRES.map(genre => {
                  const niche = PROFITABLE_NICHES[genre];
                  return (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={cn(
                        'w-full px-3 py-2.5 rounded-lg text-sm text-left transition-all flex items-center justify-between',
                        selectedGenre === genre
                          ? 'bg-velvet-600/30 text-white border border-velvet-500'
                          : 'bg-noir-800/50 text-noir-300 border border-transparent hover:border-noir-600'
                      )}
                    >
                      <span>{genre}</span>
                      {niche && (
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded capitalize',
                          niche.popularity === 'trending' ? 'bg-green-500/20 text-green-400' :
                          niche.popularity === 'growing' ? 'bg-blue-500/20 text-blue-400' :
                          niche.popularity === 'stable' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        )}>
                          {niche.popularity}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Niche Stats + Heat Level */}
            <div className="space-y-4">
              {/* Niche Quick Stats */}
              {nicheData && (
                <div className="bg-noir-800/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-velvet-400" />
                    {selectedGenre} Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-noir-400">Avg. Price</span>
                      <p className="text-green-400 font-semibold">${nicheData.avgPrice}</p>
                    </div>
                    <div>
                      <span className="text-noir-400">Competition</span>
                      <p className={cn(
                        'font-semibold capitalize',
                        nicheData.competition === 'low' ? 'text-green-400' :
                        nicheData.competition === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                      )}>{nicheData.competition}</p>
                    </div>
                    <div>
                      <span className="text-noir-400">Word Count</span>
                      <p className="text-white font-semibold">
                        {(nicheData.recommendedWordCount.min / 1000).toFixed(0)}k-{(nicheData.recommendedWordCount.max / 1000).toFixed(0)}k
                      </p>
                    </div>
                    <div>
                      <span className="text-noir-400">KU Popular</span>
                      <p className={cn(
                        'font-semibold',
                        nicheData.kuPopular ? 'text-green-400' : 'text-red-400'
                      )}>
                        {nicheData.kuPopular ? 'Yes ✓' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Heat Level */}
              <div>
                <label className="block text-sm font-medium text-noir-300 mb-3">
                  Heat Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {heatLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedHeat(level.id)}
                      className={cn(
                        'px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all text-sm',
                        selectedHeat === level.id
                          ? 'bg-velvet-600/30 border border-velvet-500'
                          : 'bg-noir-800/50 border border-transparent hover:border-noir-600'
                      )}
                    >
                      <level.icon className={cn('w-4 h-4', level.color)} />
                      <div className="text-left">
                        <div className="text-white text-xs font-medium">{level.label}</div>
                        <div className="text-[10px] text-noir-400">{level.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tropes Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-noir-300">
                  Select Tropes (optional)
                </label>
                <button
                  onClick={() => setShowTropes(!showTropes)}
                  className="text-xs text-velvet-400 hover:text-velvet-300"
                >
                  {showTropes ? 'Hide' : 'Show all'}
                </button>
              </div>
              
              {selectedTropes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedTropes.map(trope => (
                    <button
                      key={trope}
                      onClick={() => toggleTrope(trope)}
                      className="px-2 py-1 bg-velvet-600/30 border border-velvet-500 rounded text-xs text-velvet-300 hover:bg-velvet-600/50"
                    >
                      {trope} ×
                    </button>
                  ))}
                </div>
              )}
              
              <AnimatePresence>
                {showTropes && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                      {Object.entries(TROPES).map(([category, tropes]) => (
                        <div key={category}>
                          <div className="text-[10px] text-noir-500 uppercase mb-1">{category}</div>
                          <div className="flex flex-wrap gap-1">
                            {tropes.map(trope => (
                              <button
                                key={trope}
                                onClick={() => toggleTrope(trope)}
                                disabled={selectedTropes.length >= 5 && !selectedTropes.includes(trope)}
                                className={cn(
                                  'px-2 py-0.5 rounded text-[10px] transition-all',
                                  selectedTropes.includes(trope)
                                    ? 'bg-velvet-600/30 border border-velvet-500 text-velvet-300'
                                    : 'bg-noir-700/50 text-noir-400 hover:text-white disabled:opacity-30'
                                )}
                              >
                                {trope}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!showTropes && (
                <p className="text-xs text-noir-500">
                  Click "Show all" to choose specific tropes, or let the generator pick for you.
                </p>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-6 pt-6 border-t border-noir-700">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-velvet w-full py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Story Ideas
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Generated Ideas */}
        <AnimatePresence mode="wait">
          {generatedIdeas.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-white">
                  Generated Ideas
                </h2>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 text-sm text-velvet-400 hover:text-velvet-300 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {generatedIdeas.map((idea, index) => {
                  const heat = heatLevels.find(h => h.id === idea.heat);
                  const HeatIcon = heat?.icon || Flame;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card-noir rounded-xl p-5 card-hover group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-semibold text-white mb-2">
                            {idea.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="tag px-2 py-0.5 rounded text-xs">
                              {idea.genre}
                            </span>
                            {idea.subGenre && (
                              <span className="text-xs text-noir-400">
                                • {idea.subGenre}
                              </span>
                            )}
                            <span className={cn('flex items-center gap-1 text-xs', heat?.color)}>
                              <HeatIcon className="w-3.5 h-3.5" />
                              {heat?.label}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(idea, index);
                          }}
                          className="p-2 rounded-lg hover:bg-noir-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {copied === index ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-noir-400" />
                          )}
                        </button>
                      </div>

                      {/* Tropes */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {idea.tropes.slice(0, 4).map((trope, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-noir-700/50 rounded text-[10px] text-noir-300"
                          >
                            {trope}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-noir-300 mb-4 leading-relaxed">
                        {idea.logline}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                        <div>
                          <span className="text-noir-500">Setting</span>
                          <p className="text-noir-300 mt-0.5">{idea.setting}</p>
                        </div>
                        <div>
                          <span className="text-noir-500">Core Conflict</span>
                          <p className="text-noir-300 mt-0.5">{idea.conflict}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCreateBook(idea)}
                        className="w-full py-2.5 rounded-lg bg-velvet-600/20 hover:bg-velvet-600/30 border border-velvet-600/50 text-velvet-300 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                      >
                        <BookOpen className="w-4 h-4" />
                        Start This Book
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {generatedIdeas.length === 0 && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-velvet-500/20 to-velvet-700/20 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-velvet-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Ready to Generate
            </h3>
            <p className="text-noir-400 max-w-md mx-auto">
              Select your niche, heat level, and optional tropes above, then click generate to create profitable story ideas.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
