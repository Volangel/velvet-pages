'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Sparkles, ChevronRight, BookOpen, Library, Plus } from 'lucide-react';
import { Book, GENRES, SUB_GENRES, PROFITABLE_NICHES, HeatLevel, SeriesInfo } from '@/types';
import { createNewBook, saveBook, getAllSeries, getSeriesBooks } from '@/lib/storage';
import { generateStoryIdea, generateChapterOutline, generateKeywords } from '@/lib/story-generator';
import { cn } from '@/lib/utils';

interface NewBookModalProps {
  onClose: () => void;
  onCreated: (book: Book) => void;
}

const HEAT_LEVELS: { id: HeatLevel; label: string; emoji: string }[] = [
  { id: 'sweet', label: 'Sweet', emoji: '💕' },
  { id: 'sensual', label: 'Sensual', emoji: '✨' },
  { id: 'steamy', label: 'Steamy', emoji: '🔥' },
  { id: 'scorching', label: 'Scorching', emoji: '🌶️' },
];

export default function NewBookModal({ onClose, onCreated }: NewBookModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [existingSeries, setExistingSeries] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    penName: '',
    genre: 'Dark Romance',
    subGenre: '',
    heatLevel: 'steamy' as HeatLevel,
    synopsis: '',
    targetWordCount: 25000, // KDP erotica/romance sweet spot for ROI
    chapterCount: 10, // ~2,500 words/chapter for 25K novella
    isPartOfSeries: false,
    seriesName: '',
    isNewSeries: true,
    seriesBookNumber: 1,
  });

  useEffect(() => {
    setExistingSeries(getAllSeries());
  }, []);

  const [generatedIdea, setGeneratedIdea] = useState<{
    title: string;
    logline: string;
    setting: string;
    conflict: string;
    tropes: string[];
  } | null>(null);

  const nicheData = PROFITABLE_NICHES[formData.genre];

  const handleGenerateIdea = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const idea = generateStoryIdea(formData.genre, formData.subGenre || undefined);
      setGeneratedIdea(idea);
      setFormData(prev => ({
        ...prev,
        title: idea.title,
        synopsis: idea.logline,
        targetWordCount: nicheData?.recommendedWordCount.min || 25000,
      }));
      setIsGenerating(false);
    }, 800);
  };

  const handleCreate = () => {
    const chapters = generateChapterOutline(
      formData.genre,
      formData.synopsis,
      formData.chapterCount
    );

    const series: SeriesInfo | undefined = formData.isPartOfSeries && formData.seriesName ? {
      name: formData.seriesName,
      bookNumber: formData.seriesBookNumber,
      totalPlanned: formData.seriesBookNumber + 2,
      linkedBooks: [],
    } : undefined;

    const book = createNewBook({
      ...formData,
      tropes: generatedIdea?.tropes || [],
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
      series,
      metadata: {
        description: '',
        keywords: generateKeywords(formData.genre, generatedIdea?.tropes),
        categories: [],
        price: nicheData?.avgPrice || 3.99,
        enrollKU: nicheData?.kuPopular ?? true,
        contentWarnings: ['Adult Content 18+', 'Explicit Sexual Content'],
      },
    });

    saveBook(book);
    onCreated(book);
    router.push(`/book/${book.id}`);
  };

  const handleSelectExistingSeries = (name: string) => {
    const booksInSeries = getSeriesBooks(name);
    const nextNumber = booksInSeries.length + 1;
    setFormData({
      ...formData,
      seriesName: name,
      isNewSeries: false,
      seriesBookNumber: nextNumber,
    });
  };

  const subGenres = SUB_GENRES[formData.genre as keyof typeof SUB_GENRES] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-noir-900 rounded-2xl shadow-2xl border border-noir-700/50 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-noir-700/50 flex items-center justify-between sticky top-0 bg-noir-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-velvet-500 to-velvet-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                Create New Book
              </h2>
              <p className="text-sm text-noir-400">Step {step} of 2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-noir-800 transition-colors"
          >
            <X className="w-5 h-5 text-noir-400" />
          </button>
        </div>

        {/* Progress */}
        <div className="h-1 bg-noir-800">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
            className="h-full progress-velvet"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Genre Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-noir-300 mb-2">
                    Genre/Niche *
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value, subGenre: '' })}
                    className="input-noir w-full px-4 py-3 rounded-lg text-white"
                  >
                    {GENRES.map(genre => {
                      const niche = PROFITABLE_NICHES[genre];
                      return (
                        <option key={genre} value={genre}>
                          {genre} {niche?.popularity === 'trending' ? '🔥' : niche?.popularity === 'growing' ? '📈' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Sub-Genre */}
                <div>
                  <label className="block text-sm font-medium text-noir-300 mb-2">
                    Sub-Genre
                  </label>
                  <select
                    value={formData.subGenre}
                    onChange={(e) => setFormData({ ...formData, subGenre: e.target.value })}
                    className="input-noir w-full px-4 py-3 rounded-lg text-white"
                    disabled={subGenres.length === 0}
                  >
                    <option value="">Select sub-genre...</option>
                    {subGenres.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Niche Stats Banner */}
              {nicheData && (
                <div className="bg-noir-800/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      nicheData.popularity === 'trending' ? 'bg-green-500/20 text-green-400' :
                      nicheData.popularity === 'growing' ? 'bg-blue-500/20 text-blue-400' :
                      nicheData.popularity === 'stable' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    )}>
                      {nicheData.popularity}
                    </span>
                    <span className="text-xs text-noir-400">
                      Competition: <span className={cn(
                        nicheData.competition === 'low' ? 'text-green-400' :
                        nicheData.competition === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                      )}>{nicheData.competition}</span>
                    </span>
                    <span className="text-xs text-noir-400">
                      Avg Price: <span className="text-green-400">${nicheData.avgPrice}</span>
                    </span>
                  </div>
                  <span className="text-xs text-noir-400">
                    Target: {(nicheData.recommendedWordCount.min / 1000).toFixed(0)}k-{(nicheData.recommendedWordCount.max / 1000).toFixed(0)}k words
                  </span>
                </div>
              )}

              {/* Heat Level */}
              <div>
                <label className="block text-sm font-medium text-noir-300 mb-2">
                  Heat Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {HEAT_LEVELS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({ ...formData, heatLevel: level.id })}
                      className={cn(
                        'px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2',
                        formData.heatLevel === level.id
                          ? 'bg-velvet-600/30 text-white border border-velvet-500'
                          : 'bg-noir-800/50 text-noir-300 border border-transparent hover:border-noir-600'
                      )}
                    >
                      <span>{level.emoji}</span>
                      <span>{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Generator */}
              <div className="card-noir rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-velvet-400" />
                      Generate Story Idea
                    </h3>
                    <p className="text-sm text-noir-400 mt-1">
                      AI-powered premise based on profitable tropes
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateIdea}
                    disabled={isGenerating}
                    className="btn-velvet px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate
                  </button>
                </div>

                {generatedIdea && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 pt-4 border-t border-noir-700"
                  >
                    <div>
                      <span className="text-xs text-velvet-400 font-medium">Generated Title</span>
                      <p className="text-white font-display text-lg">{generatedIdea.title}</p>
                    </div>
                    <div>
                      <span className="text-xs text-velvet-400 font-medium">Premise</span>
                      <p className="text-noir-300 text-sm">{generatedIdea.logline}</p>
                    </div>
                    {generatedIdea.tropes && (
                      <div className="flex flex-wrap gap-1.5">
                        {generatedIdea.tropes.slice(0, 4).map((trope, i) => (
                          <span key={i} className="px-2 py-0.5 bg-velvet-600/20 rounded text-xs text-velvet-300">
                            {trope}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-xs text-velvet-400 font-medium">Setting</span>
                        <p className="text-noir-300">{generatedIdea.setting}</p>
                      </div>
                      <div>
                        <span className="text-xs text-velvet-400 font-medium">Conflict</span>
                        <p className="text-noir-300">{generatedIdea.conflict}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-noir-300 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter your book title..."
                  className="input-noir w-full px-4 py-3 rounded-lg text-white placeholder:text-noir-500"
                />
              </div>

              {/* Pen Name */}
              <div>
                <label className="block text-sm font-medium text-noir-300 mb-2">
                  Pen Name *
                </label>
                <input
                  type="text"
                  value={formData.penName}
                  onChange={(e) => setFormData({ ...formData, penName: e.target.value })}
                  placeholder="Your author name..."
                  className="input-noir w-full px-4 py-3 rounded-lg text-white placeholder:text-noir-500"
                />
              </div>

              {/* Series Toggle */}
              <div className="card-noir rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Library className="w-4 h-4 text-velvet-400" />
                    <span className="font-medium text-white text-sm">Part of a Series?</span>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, isPartOfSeries: !formData.isPartOfSeries })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      formData.isPartOfSeries ? 'bg-velvet-600' : 'bg-noir-700'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                      formData.isPartOfSeries ? 'left-7' : 'left-1'
                    )} />
                  </button>
                </div>
                
                {formData.isPartOfSeries && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-3 pt-3 border-t border-noir-700"
                  >
                    <p className="text-xs text-green-400">
                      📈 Series books earn 3x more than standalones!
                    </p>
                    
                    {existingSeries.length > 0 && (
                      <div>
                        <label className="text-xs text-noir-400 mb-2 block">Existing Series</label>
                        <div className="flex flex-wrap gap-2">
                          {existingSeries.map(name => (
                            <button
                              key={name}
                              onClick={() => handleSelectExistingSeries(name)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-xs transition-all',
                                formData.seriesName === name && !formData.isNewSeries
                                  ? 'bg-velvet-600/30 text-white border border-velvet-500'
                                  : 'bg-noir-800 text-noir-300 hover:text-white'
                              )}
                            >
                              {name}
                            </button>
                          ))}
                          <button
                            onClick={() => setFormData({ ...formData, isNewSeries: true, seriesName: '' })}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1',
                              formData.isNewSeries
                                ? 'bg-velvet-600/30 text-white border border-velvet-500'
                                : 'bg-noir-800 text-noir-300 hover:text-white'
                            )}
                          >
                            <Plus className="w-3 h-3" /> New Series
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {formData.isNewSeries && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-noir-400 mb-1 block">Series Name</label>
                          <input
                            type="text"
                            value={formData.seriesName}
                            onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
                            placeholder="e.g., Dark Kings Series"
                            className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white placeholder:text-noir-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-noir-400 mb-1 block">Book Number</label>
                          <select
                            value={formData.seriesBookNumber}
                            onChange={(e) => setFormData({ ...formData, seriesBookNumber: Number(e.target.value) })}
                            className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                              <option key={n} value={n}>Book {n}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-sm font-medium text-noir-300 mb-2">
                  Synopsis / Logline
                </label>
                <textarea
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="A brief description of your story..."
                  rows={3}
                  className="input-noir w-full px-4 py-3 rounded-lg text-white placeholder:text-noir-500 resize-none"
                />
              </div>

              {/* Word Count & Chapters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-noir-300 mb-2">
                    Target Word Count
                    <span className="text-xs text-velvet-400 ml-2">(KDP pays by pages READ)</span>
                  </label>
                  <select
                    value={formData.targetWordCount}
                    onChange={(e) => setFormData({ ...formData, targetWordCount: Number(e.target.value) })}
                    className="input-noir w-full px-4 py-3 rounded-lg text-white"
                  >
                    <option value={15000}>15,000 (Short Novella - Quick Reads)</option>
                    <option value={25000}>25,000 (Novella - Most Profitable) ★</option>
                    <option value={35000}>35,000 (Long Novella)</option>
                    <option value={50000}>50,000 (Short Novel)</option>
                    <option value={70000}>70,000 (Novel - Romantasy/Dark)</option>
                  </select>
                  <p className="text-xs text-noir-500 mt-1">
                    💡 15-30K novellas have highest ROI in erotica/romance
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-noir-300 mb-2">
                    Chapters
                  </label>
                  <select
                    value={formData.chapterCount}
                    onChange={(e) => setFormData({ ...formData, chapterCount: Number(e.target.value) })}
                    className="input-noir w-full px-4 py-3 rounded-lg text-white"
                  >
                    {[8, 10, 12, 15, 18, 20, 25, 30].map(n => (
                      <option key={n} value={n}>{n} chapters</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-noir-700/50 flex justify-between sticky bottom-0 bg-noir-900">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-noir-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="btn-velvet px-6 py-2.5 rounded-lg flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-lg text-noir-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!formData.title.trim() || !formData.penName.trim()}
                className="btn-velvet px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Book
                <Sparkles className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
