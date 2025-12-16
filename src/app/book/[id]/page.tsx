'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Settings,
  BookOpen,
  Sparkles,
  Check,
  Clock,
  Target,
  Wand2,
  Zap,
  Bot,
} from 'lucide-react';
import { Book, Chapter, Character } from '@/types';
import { getBook, saveBook } from '@/lib/storage';
import { countWords, formatNumber, cn } from '@/lib/utils';
import CharacterPanel from '@/components/CharacterPanel';
import ChapterOutlinePanel from '@/components/ChapterOutlinePanel';
import AIWritingPanel from '@/components/AIWritingPanel';
import FullBookGenerator from '@/components/FullBookGenerator';

type Tab = 'write' | 'characters' | 'outline' | 'settings' | 'ai';

export default function BookEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('write');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isChapterListOpen, setIsChapterListOpen] = useState(true);
  const [showFullBookGenerator, setShowFullBookGenerator] = useState(false);

  useEffect(() => {
    const loadedBook = getBook(params.id as string);
    if (loadedBook) {
      setBook(loadedBook);
      if (loadedBook.chapters.length > 0) {
        setActiveChapter(loadedBook.chapters[0].id);
      }
    } else {
      router.push('/');
    }
  }, [params.id, router]);

  const handleSave = useCallback(() => {
    if (!book) return;
    setIsSaving(true);
    
    // Calculate total word count
    const totalWords = book.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
    const updatedBook = { ...book, currentWordCount: totalWords };
    
    saveBook(updatedBook);
    setBook(updatedBook);
    setLastSaved(new Date());
    
    setTimeout(() => setIsSaving(false), 500);
  }, [book]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (book) handleSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [book, handleSave]);

  const handleChapterContentChange = (chapterId: string, content: string) => {
    if (!book) return;
    
    const updatedChapters = book.chapters.map(ch => 
      ch.id === chapterId 
        ? { ...ch, content, wordCount: countWords(content) }
        : ch
    );
    
    setBook({ ...book, chapters: updatedChapters });
  };

  const handleAddChapter = () => {
    if (!book) return;
    
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: `Chapter ${book.chapters.length + 1}`,
      orderIndex: book.chapters.length,
      content: '',
      wordCount: 0,
      outline: '',
      notes: '',
      status: 'outline',
    };
    
    setBook({ ...book, chapters: [...book.chapters, newChapter] });
    setActiveChapter(newChapter.id);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!book || book.chapters.length <= 1) return;
    if (!confirm('Delete this chapter?')) return;
    
    const updatedChapters = book.chapters
      .filter(ch => ch.id !== chapterId)
      .map((ch, idx) => ({ ...ch, orderIndex: idx }));
    
    setBook({ ...book, chapters: updatedChapters });
    if (activeChapter === chapterId) {
      setActiveChapter(updatedChapters[0]?.id || null);
    }
  };

  const handleChapterTitleChange = (chapterId: string, title: string) => {
    if (!book) return;
    
    const updatedChapters = book.chapters.map(ch =>
      ch.id === chapterId ? { ...ch, title } : ch
    );
    
    setBook({ ...book, chapters: updatedChapters });
  };

  const handleUpdateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    if (!book) return;
    
    const updatedChapters = book.chapters.map(ch =>
      ch.id === chapterId ? { ...ch, ...updates } : ch
    );
    
    setBook({ ...book, chapters: updatedChapters });
  };

  const handleUpdateCharacters = (characters: Character[]) => {
    if (!book) return;
    setBook({ ...book, characters });
  };

  const handleUpdateBook = useCallback((updates: Partial<Book>) => {
    setBook(currentBook => {
      if (!currentBook) return currentBook;
      const updatedBook = { ...currentBook, ...updates };
      // Save to localStorage synchronously to ensure data persists
      saveBook(updatedBook);
      return updatedBook;
    });
  }, []);

  const handleAIContentGenerated = (content: string) => {
    if (!activeChapter) return;
    handleChapterContentChange(activeChapter, content);
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-velvet-500 border-t-transparent" />
      </div>
    );
  }

  const currentChapter = book.chapters.find(ch => ch.id === activeChapter);
  const totalWords = book.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
  const progress = Math.min(100, Math.round((totalWords / book.targetWordCount) * 100));

  const tabs = [
    { id: 'write' as Tab, label: 'Write', icon: FileText },
    { id: 'ai' as Tab, label: 'AI', icon: Wand2, badge: true },
    { id: 'characters' as Tab, label: 'Characters', icon: Users },
    { id: 'outline' as Tab, label: 'Outline', icon: BookOpen },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Full Book Generator Modal */}
      <AnimatePresence>
        {showFullBookGenerator && (
          <FullBookGenerator
            book={book}
            onBookUpdate={handleUpdateBook}
            onClose={() => setShowFullBookGenerator(false)}
          />
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <header className="h-16 bg-noir-900/80 backdrop-blur-xl border-b border-noir-700/50 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              handleSave();
              router.push('/');
            }}
            className="p-2 rounded-lg hover:bg-noir-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-noir-400" />
          </button>
          
          <div>
            <input
              type="text"
              value={book.title}
              onChange={(e) => handleUpdateBook({ title: e.target.value })}
              className="bg-transparent text-lg font-display font-semibold text-white focus:outline-none focus:ring-0 border-none"
            />
            <div className="flex items-center gap-3 text-xs text-noir-400">
              <span>{book.genre}</span>
              <span>•</span>
              <span>{book.penName || 'No pen name'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* AI Generate Full Book Button */}
          <button
            onClick={() => setShowFullBookGenerator(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-velvet-600 to-purple-600 text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Bot className="w-4 h-4" />
            Generate Full Book
          </button>

          {/* Word Count Progress */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {formatNumber(totalWords)} / {formatNumber(book.targetWordCount)}
              </div>
              <div className="text-xs text-noir-400">{progress}% complete</div>
            </div>
            <div className="w-24 h-2 bg-noir-700 rounded-full overflow-hidden">
              <div
                className="h-full progress-velvet rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-2 text-sm text-noir-400">
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-velvet-500/30 border-t-velvet-500 rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span>Saved</span>
              </>
            ) : null}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn-velvet px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Chapter List */}
        <aside className="w-72 bg-noir-900/50 border-r border-noir-700/50 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-noir-700/50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 py-3 text-xs font-medium transition-colors flex flex-col items-center gap-1 relative',
                  activeTab === tab.id
                    ? 'text-velvet-400 bg-velvet-500/10 border-b-2 border-velvet-500'
                    : 'text-noir-400 hover:text-white'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'write' && (
            <>
              {/* Chapters Header */}
              <div className="p-4 border-b border-noir-700/50">
                <button
                  onClick={() => setIsChapterListOpen(!isChapterListOpen)}
                  className="w-full flex items-center justify-between text-sm font-medium text-white"
                >
                  <span>Chapters ({book.chapters.length})</span>
                  {isChapterListOpen ? (
                    <ChevronUp className="w-4 h-4 text-noir-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-noir-400" />
                  )}
                </button>
              </div>

              {/* Chapter List */}
              <AnimatePresence>
                {isChapterListOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="flex-1 overflow-y-auto"
                  >
                    <div className="p-2 space-y-1">
                      {book.chapters
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((chapter) => (
                          <motion.div
                            key={chapter.id}
                            onClick={() => setActiveChapter(chapter.id)}
                            className={cn(
                              'w-full text-left p-3 rounded-lg transition-all group chapter-item cursor-pointer',
                              activeChapter === chapter.id
                                ? 'bg-velvet-500/15 border-l-velvet-500'
                                : 'hover:bg-noir-800/50',
                              chapter.status
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">
                                  {chapter.title}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs">
                                  <span className={cn(
                                    chapter.wordCount >= Math.floor(book.targetWordCount / book.chapters.length * 0.8)
                                      ? 'text-green-400'
                                      : chapter.wordCount > 0
                                        ? 'text-yellow-400'
                                        : 'text-noir-400'
                                  )}>
                                    {formatNumber(chapter.wordCount)} words
                                  </span>
                                  {chapter.wordCount > 0 && chapter.wordCount < Math.floor(book.targetWordCount / book.chapters.length * 0.8) && (
                                    <span className="text-yellow-400/70 text-[10px]">
                                      (need ~{Math.max(0, Math.floor(book.targetWordCount / book.chapters.length * 0.8) - chapter.wordCount).toLocaleString()} more)
                                    </span>
                                  )}
                                  {chapter.wordCount >= Math.floor(book.targetWordCount / book.chapters.length * 0.8) && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChapter(chapter.id);
                                }}
                                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-noir-700 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-noir-400 hover:text-red-400" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                    </div>

                    {/* Add Chapter */}
                    <div className="p-2">
                      <button
                        onClick={handleAddChapter}
                        className="w-full py-2.5 rounded-lg border border-dashed border-noir-600 text-noir-400 hover:text-white hover:border-velvet-600 transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Chapter
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {activeTab === 'ai' && currentChapter && book && (
            <div className="flex-1 overflow-y-auto p-4">
              <AIWritingPanel
                book={book}
                currentChapter={currentChapter}
                onContentGenerated={handleAIContentGenerated}
                onChapterUpdate={(ch) => handleUpdateChapter(ch.id, ch)}
              />
            </div>
          )}

          {activeTab === 'characters' && (
            <CharacterPanel
              characters={book.characters}
              onUpdate={handleUpdateCharacters}
              book={book}
            />
          )}

          {activeTab === 'outline' && currentChapter && (
            <ChapterOutlinePanel
              chapter={currentChapter}
              onUpdate={(updates) => handleUpdateChapter(currentChapter.id, updates)}
            />
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  Pen Name
                </label>
                <input
                  type="text"
                  value={book.penName}
                  onChange={(e) => handleUpdateBook({ penName: e.target.value })}
                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                  placeholder="Author name..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  Target Word Count
                </label>
                <select
                  value={book.targetWordCount}
                  onChange={(e) => handleUpdateBook({ targetWordCount: Number(e.target.value) })}
                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                >
                  <option value={15000}>15,000 (Short Novella)</option>
                  <option value={25000}>25,000 (Novella - Most Profitable) ★</option>
                  <option value={35000}>35,000 (Long Novella)</option>
                  <option value={50000}>50,000 (Short Novel)</option>
                  <option value={70000}>70,000 (Novel)</option>
                  <option value={100000}>100,000 (Epic)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  Heat Level
                </label>
                <select
                  value={book.heatLevel}
                  onChange={(e) => handleUpdateBook({ heatLevel: e.target.value as Book['heatLevel'] })}
                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                >
                  <option value="sweet">💕 Sweet (Closed door)</option>
                  <option value="sensual">✨ Sensual (Fade to black)</option>
                  <option value="steamy">🔥 Steamy (Explicit)</option>
                  <option value="scorching">🌶️ Scorching (Very explicit)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  Status
                </label>
                <select
                  value={book.status}
                  onChange={(e) => handleUpdateBook({ status: e.target.value as Book['status'] })}
                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="writing">Writing</option>
                  <option value="editing">Editing</option>
                  <option value="complete">Complete</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Book Blurb */}
              <div>
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  Book Blurb
                </label>
                <textarea
                  value={book.metadata?.description || ''}
                  onChange={(e) => handleUpdateBook({ 
                    metadata: { ...book.metadata, description: e.target.value } 
                  })}
                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                  rows={5}
                  placeholder="Your captivating book description..."
                />
                {book.metadata?.description && (
                  <div className="text-xs text-noir-500 mt-1">
                    {book.metadata.description.length} / 4000 characters
                  </div>
                )}
              </div>

              {/* Keywords */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-noir-400">
                    Keywords (for KDP discoverability)
                  </label>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            type: 'keywords',
                            data: {
                              genre: book.genre,
                              subGenre: book.subGenre,
                              tropes: book.tropes || [],
                              heatLevel: book.heatLevel,
                            },
                          }),
                        });
                        const result = await response.json();
                        if (result.success && result.keywords) {
                          handleUpdateBook({ metadata: { ...book.metadata, keywords: result.keywords } });
                        }
                      } catch (err) {
                        console.error('Failed to regenerate keywords:', err);
                      }
                    }}
                    className="text-xs px-2 py-1 rounded bg-velvet-600/20 hover:bg-velvet-600/30 text-velvet-300 border border-velvet-500/30 transition-colors"
                  >
                    🔄 Regenerate
                  </button>
                </div>
                <textarea
                  value={book.metadata?.keywords?.join(', ') || ''}
                  onChange={(e) => handleUpdateBook({ 
                    metadata: { 
                      ...book.metadata, 
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                    } 
                  })}
                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                  rows={3}
                  placeholder="orc romance, monster romance, fated mates, forbidden love..."
                />
                {book.metadata?.keywords && book.metadata.keywords.length > 0 && (
                  <div className="text-xs text-noir-500 mt-1">
                    {book.metadata.keywords.length} / 7 keywords
                  </div>
                )}
              </div>

              {/* Series Info */}
              <div className="border-t border-noir-700/50 pt-4">
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  📚 Series Information
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={book.series?.name || ''}
                    onChange={(e) => handleUpdateBook({ 
                      series: { 
                        ...book.series, 
                        name: e.target.value,
                        bookNumber: book.series?.bookNumber || 1,
                        totalPlanned: book.series?.totalPlanned || 3,
                        linkedBooks: book.series?.linkedBooks || []
                      } 
                    })}
                    className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                    placeholder="Series name (e.g., Orc Warriors of the East)"
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        min="1"
                        value={book.series?.bookNumber || 1}
                        onChange={(e) => handleUpdateBook({ 
                          series: { 
                            ...book.series, 
                            name: book.series?.name || '',
                            bookNumber: parseInt(e.target.value) || 1,
                            totalPlanned: book.series?.totalPlanned || 3,
                            linkedBooks: book.series?.linkedBooks || []
                          } 
                        })}
                        className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                        placeholder="Book #"
                      />
                      <div className="text-xs text-noir-500 mt-1">Book #</div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="1"
                        value={book.series?.totalPlanned || 3}
                        onChange={(e) => handleUpdateBook({ 
                          series: { 
                            ...book.series, 
                            name: book.series?.name || '',
                            bookNumber: book.series?.bookNumber || 1,
                            totalPlanned: parseInt(e.target.value) || 3,
                            linkedBooks: book.series?.linkedBooks || []
                          } 
                        })}
                        className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                        placeholder="Total"
                      />
                      <div className="text-xs text-noir-500 mt-1">Total planned</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-400/70 mt-2">
                  💡 Series books earn 3x more revenue on KDP!
                </div>
              </div>

              {/* KDP Category */}
              <div>
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  📂 KDP Category
                </label>
                <select
                  value={book.metadata?.categories?.[0] || ''}
                  onChange={(e) => handleUpdateBook({ 
                    metadata: { 
                      ...book.metadata, 
                      categories: [e.target.value] 
                    } 
                  })}
                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                >
                  <option value="">Select primary category...</option>
                  <optgroup label="Romance - Most Popular">
                    <option value="FICTION / Romance / Paranormal / Shifters">Paranormal / Shifters</option>
                    <option value="FICTION / Romance / Fantasy">Fantasy Romance</option>
                    <option value="FICTION / Romance / Paranormal / Vampires">Paranormal / Vampires</option>
                    <option value="FICTION / Romance / Science Fiction">Science Fiction Romance</option>
                    <option value="FICTION / Romance / Erotica">Erotica</option>
                    <option value="FICTION / Romance / Contemporary">Contemporary Romance</option>
                    <option value="FICTION / Romance / Suspense">Romantic Suspense</option>
                    <option value="FICTION / Romance / Dark">Dark Romance</option>
                  </optgroup>
                  <optgroup label="Erotica">
                    <option value="FICTION / Erotica / Science Fiction">Erotica / Science Fiction</option>
                    <option value="FICTION / Erotica / Paranormal">Erotica / Paranormal</option>
                    <option value="FICTION / Erotica / BDSM">Erotica / BDSM</option>
                    <option value="FICTION / Erotica / Fantasy">Erotica / Fantasy</option>
                  </optgroup>
                </select>
              </div>

              {/* AI Content Disclosure */}
              <div className="border-t border-noir-700/50 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={book.metadata?.aiContentDisclosure || false}
                    onChange={(e) => handleUpdateBook({ 
                      metadata: { 
                        ...book.metadata, 
                        aiContentDisclosure: e.target.checked 
                      } 
                    })}
                    className="mt-1 w-4 h-4 rounded border-noir-600 bg-noir-800 text-velvet-500 focus:ring-velvet-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">
                      🤖 AI-Generated Content Disclosure
                    </div>
                    <div className="text-xs text-noir-400 mt-1">
                      Required by KDP since 2024. Check this if any content was AI-generated or AI-assisted.
                    </div>
                  </div>
                </label>
              </div>

              {/* KDP Enrollment */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={book.metadata?.enrollKU || false}
                    onChange={(e) => handleUpdateBook({ 
                      metadata: { 
                        ...book.metadata, 
                        enrollKU: e.target.checked 
                      } 
                    })}
                    className="mt-1 w-4 h-4 rounded border-noir-600 bg-noir-800 text-velvet-500 focus:ring-velvet-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">
                      📖 Enroll in Kindle Unlimited (KDP Select)
                    </div>
                    <div className="text-xs text-noir-400 mt-1">
                      90-day exclusive. Earn royalties per page read. Recommended for romance/erotica.
                    </div>
                  </div>
                </label>
              </div>

              {/* Pricing Recommendations */}
              <div className="border-t border-noir-700/50 pt-4">
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  💰 Recommended Pricing
                </label>
                <div className="bg-noir-800/50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-noir-400">Your word count:</span>
                    <span className="text-white font-medium">{book.currentWordCount.toLocaleString()} words</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-noir-400">Genre avg:</span>
                    <span className="text-green-400 font-medium">
                      {book.genre === 'Monster Romance' ? '$4.99' :
                       book.genre === 'Dark Romance' ? '$3.99' :
                       book.genre === 'Romantasy' ? '$4.99' :
                       book.genre === 'Why Choose / Reverse Harem' ? '$4.99' :
                       '$3.99'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-noir-400">Recommended:</span>
                    <span className="text-velvet-400 font-bold">
                      {book.currentWordCount < 20000 ? '$2.99' :
                       book.currentWordCount < 40000 ? '$3.99' :
                       book.currentWordCount < 60000 ? '$4.99' :
                       '$5.99'}
                    </span>
                  </div>
                  <div className="text-xs text-noir-500 pt-2 border-t border-noir-700">
                    💡 70% royalty at $2.99-$9.99. KU pays ~$0.004/page read.
                  </div>
                </div>
              </div>

              {/* Word Count Progress */}
              <div>
                <label className="block text-xs font-medium text-noir-400 mb-2">
                  📊 Word Count Analysis
                </label>
                <div className="bg-noir-800/50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-noir-400">Progress:</span>
                    <span className={`font-medium ${book.currentWordCount >= book.targetWordCount ? 'text-green-400' : 'text-yellow-400'}`}>
                      {Math.round((book.currentWordCount / book.targetWordCount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-noir-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${book.currentWordCount >= book.targetWordCount ? 'bg-green-500' : 'bg-velvet-500'}`}
                      style={{ width: `${Math.min((book.currentWordCount / book.targetWordCount) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-noir-500">
                    <span>{book.currentWordCount.toLocaleString()} written</span>
                    <span>{(book.targetWordCount - book.currentWordCount).toLocaleString()} remaining</span>
                  </div>
                  {book.currentWordCount < book.targetWordCount && (
                    <>
                      <div className="text-xs text-yellow-400/80 pt-2">
                        ⚠️ Below target. {book.chapters.filter(c => c.wordCount < Math.floor(book.targetWordCount / book.chapters.length * 0.8)).length} chapters need expansion.
                      </div>
                      <button
                        onClick={() => setShowFullBookGenerator(true)}
                        className="w-full mt-2 px-3 py-2 rounded-lg bg-velvet-600 hover:bg-velvet-700 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        Regenerate Book (AI Expand All)
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Cover Prompt */}
              {book.coverPrompt && (
                <div>
                  <label className="block text-xs font-medium text-noir-400 mb-2">
                    Cover Concept
                  </label>
                  <div className="bg-noir-800/50 rounded-lg p-3 text-sm text-noir-300">
                    {book.coverPrompt}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Main Editor */}
        <main className="flex-1 flex flex-col">
          {currentChapter ? (
            <>
              {/* Chapter Header */}
              <div className="p-6 border-b border-noir-700/50 bg-noir-900/30">
                <input
                  type="text"
                  value={currentChapter.title}
                  onChange={(e) => handleChapterTitleChange(currentChapter.id, e.target.value)}
                  className="bg-transparent text-2xl font-display font-semibold text-white focus:outline-none w-full"
                  placeholder="Chapter Title"
                />
                <div className="flex items-center gap-4 mt-2 text-sm text-noir-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {formatNumber(currentChapter.wordCount)} words
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~{Math.ceil(currentChapter.wordCount / 250)} min read
                  </span>
                  <select
                    value={currentChapter.status}
                    onChange={(e) => handleUpdateChapter(currentChapter.id, { status: e.target.value as Chapter['status'] })}
                    className="bg-transparent text-noir-400 focus:outline-none cursor-pointer"
                  >
                    <option value="outline">📝 Outline</option>
                    <option value="draft">✏️ Draft</option>
                    <option value="revision">🔄 Revision</option>
                    <option value="complete">✅ Complete</option>
                  </select>
                  
                  {/* Quick AI Write Button */}
                  {currentChapter.wordCount === 0 && (
                    <button
                      onClick={() => setActiveTab('ai')}
                      className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-velvet-600/20 hover:bg-velvet-600/30 border border-velvet-500/30 text-velvet-300 text-xs transition-colors"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      Write with AI
                    </button>
                  )}
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 p-6 overflow-y-auto">
                <textarea
                  value={currentChapter.content}
                  onChange={(e) => handleChapterContentChange(currentChapter.id, e.target.value)}
                  placeholder="Begin writing your chapter here...

Let your imagination flow. Don't worry about perfection on the first draft—just write.

💡 Tips:
• Use *** or --- for scene breaks
• Press Ctrl/Cmd + S to save
• Your work auto-saves every 30 seconds
• Click the AI tab to generate content automatically"
                  className="w-full h-full min-h-[60vh] bg-transparent resize-none focus:outline-none editor-content text-noir-200 placeholder:text-noir-600"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-noir-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Chapter Selected</h3>
                <p className="text-noir-400 mb-4">Select a chapter from the sidebar or create a new one</p>
                <button
                  onClick={handleAddChapter}
                  className="btn-velvet px-4 py-2 rounded-lg inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Chapter
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
