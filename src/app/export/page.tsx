'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileDown, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen,
  FileText,
  Image as ImageIcon,
  Tag,
  DollarSign,
  AlertTriangle,
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  Target,
  Zap,
  Info,
} from 'lucide-react';
import { Book, KDP_CATEGORIES, CONTENT_WARNINGS, PROFITABLE_NICHES, HeatLevel } from '@/types';
import { getBooks, saveBook } from '@/lib/storage';
import { generateEpub } from '@/lib/epub-generator';
import { generateKDPDescription, generateKeywords, getPricingRecommendation, generateBackMatter } from '@/lib/story-generator';
import { formatNumber, cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import KDPComplianceChecker from '@/components/KDPComplianceChecker';

export default function ExportPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('book');
  
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'metadata' | 'keywords' | 'cover'>('checklist');

  useEffect(() => {
    const loadedBooks = getBooks();
    setBooks(loadedBooks);
    
    if (bookId) {
      const book = loadedBooks.find(b => b.id === bookId);
      if (book) setSelectedBook(book);
    }
  }, [bookId]);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setExportSuccess(false);
  };

  const handleUpdateMetadata = (updates: Partial<Book['metadata']>) => {
    if (!selectedBook) return;
    const updatedBook = {
      ...selectedBook,
      metadata: { ...selectedBook.metadata, ...updates },
    };
    setSelectedBook(updatedBook);
    saveBook(updatedBook);
  };

  const handleUpdateBook = (updates: Partial<Book>) => {
    if (!selectedBook) return;
    const updatedBook = { ...selectedBook, ...updates };
    setSelectedBook(updatedBook);
    saveBook(updatedBook);
  };

  const handleGenerateDescription = () => {
    if (!selectedBook) return;
    const description = generateKDPDescription({
      title: selectedBook.title,
      synopsis: selectedBook.synopsis,
      genre: selectedBook.genre,
      tropes: selectedBook.tropes,
      heatLevel: selectedBook.heatLevel,
    });
    handleUpdateMetadata({ description });
  };

  const handleGenerateKeywords = () => {
    if (!selectedBook) return;
    const keywords = generateKeywords(selectedBook.genre, selectedBook.tropes);
    handleUpdateMetadata({ keywords });
  };

  const handleApplyPricing = () => {
    if (!selectedBook) return;
    const recommendation = getPricingRecommendation(
      selectedBook.currentWordCount || selectedBook.targetWordCount,
      selectedBook.genre,
      !!selectedBook.series
    );
    handleUpdateMetadata({ 
      price: recommendation.recommended,
      enrollKU: recommendation.kuRecommended,
    });
  };

  const handleExport = async () => {
    if (!selectedBook) return;
    
    setIsExporting(true);
    try {
      const blob = await generateEpub(selectedBook);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedBook.title.replace(/[^a-z0-9]/gi, '_')}.epub`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getReadinessChecks = (book: Book) => {
    return [
      { 
        label: 'Title set', 
        passed: book.title.length > 0 && book.title !== 'Untitled Book',
        required: true 
      },
      { 
        label: 'Author/pen name set', 
        passed: book.penName.length > 0,
        required: true 
      },
      { 
        label: 'Has chapters with content', 
        passed: book.chapters.some(ch => ch.wordCount > 0),
        required: true 
      },
      { 
        label: 'Book description set (50+ chars)', 
        passed: book.metadata.description.length > 50,
        required: true 
      },
      { 
        label: 'Keywords added (7 recommended)', 
        passed: book.metadata.keywords.length >= 5,
        required: true 
      },
      { 
        label: 'At least 15,000 words', 
        passed: book.currentWordCount >= 15000,
        required: false 
      },
      { 
        label: 'Categories selected (2)', 
        passed: book.metadata.categories.length >= 2,
        required: false 
      },
      { 
        label: 'Cover image uploaded', 
        passed: !!book.coverImage,
        required: false 
      },
      { 
        label: 'Price set ($2.99-$9.99 for 70%)', 
        passed: book.metadata.price >= 2.99 && book.metadata.price <= 9.99,
        required: false 
      },
    ];
  };

  const checks = selectedBook ? getReadinessChecks(selectedBook) : [];
  const requiredChecksPassed = checks.filter(c => c.required).every(c => c.passed);
  const allChecksPassed = checks.every(c => c.passed);

  const pricing = selectedBook ? getPricingRecommendation(
    selectedBook.currentWordCount || selectedBook.targetWordCount,
    selectedBook.genre,
    !!selectedBook.series
  ) : null;

  const tabs = [
    { id: 'checklist' as const, label: 'Checklist', icon: CheckCircle2 },
    { id: 'metadata' as const, label: 'Description', icon: FileText },
    { id: 'keywords' as const, label: 'Keywords', icon: Target },
    { id: 'cover' as const, label: 'Cover', icon: ImageIcon },
  ];

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
              <FileDown className="w-6 h-6 text-white" />
            </div>
            Export & Publish
          </h1>
          <p className="text-noir-400">
            Optimize your book for Amazon KDP and export as EPUB
          </p>
        </motion.div>

        <div className="grid grid-cols-4 gap-6">
          {/* Book Selection */}
          <div className="col-span-1 space-y-4">
            <div className="card-noir rounded-xl p-4">
              <h2 className="font-semibold text-white mb-4">Select Book</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {books.length === 0 ? (
                  <p className="text-sm text-noir-400 text-center py-4">
                    No books yet. Create one first!
                  </p>
                ) : (
                  books.map(book => (
                    <button
                      key={book.id}
                      onClick={() => handleSelectBook(book)}
                      className={cn(
                        'w-full p-3 rounded-lg text-left transition-all',
                        selectedBook?.id === book.id
                          ? 'bg-velvet-600/20 border border-velvet-500'
                          : 'bg-noir-800/50 border border-transparent hover:border-noir-600'
                      )}
                    >
                      <div className="font-medium text-white text-sm truncate">
                        {book.title}
                      </div>
                      <div className="text-xs text-noir-400 mt-1">
                        {formatNumber(book.currentWordCount)} words
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* KDP Compliance Checker */}
            {selectedBook && (
              <KDPComplianceChecker book={selectedBook} />
            )}

            {/* Pricing Advisor */}
            {selectedBook && pricing && (
              <div className="card-noir rounded-xl p-4">
                <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Pricing Advisor
                </h2>
                <div className="space-y-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      ${pricing.recommended.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-300">Recommended Price</div>
                  </div>
                  <div className="text-xs text-noir-400">
                    <p>{pricing.reasoning}</p>
                    <p className="mt-2">
                      Range: ${pricing.range.min.toFixed(2)} - ${pricing.range.max.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={cn(
                      'px-2 py-1 rounded',
                      pricing.royalty70 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    )}>
                      {pricing.royalty70 ? '70% Royalty' : '35% Royalty'}
                    </span>
                    {pricing.kuRecommended && (
                      <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                        KU Recommended
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleApplyPricing}
                    className="w-full py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 text-sm transition-colors"
                  >
                    Apply Recommendation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            {selectedBook ? (
              <div className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all',
                        activeTab === tab.id
                          ? 'bg-velvet-600/20 text-white border border-velvet-500'
                          : 'text-noir-400 hover:text-white bg-noir-800/50'
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'checklist' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-noir rounded-xl p-6"
                  >
                    <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-velvet-400" />
                      Publishing Checklist
                      <span className="ml-auto text-sm text-noir-400">
                        {checks.filter(c => c.passed).length}/{checks.length} complete
                      </span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {checks.map((check, index) => (
                        <div
                          key={index}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg',
                            check.passed ? 'bg-green-500/10' : 'bg-noir-800/50'
                          )}
                        >
                          {check.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : check.required ? (
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                          )}
                          <span className={cn(
                            'text-sm',
                            check.passed ? 'text-green-300' : 'text-noir-300'
                          )}>
                            {check.label}
                            {check.required && !check.passed && (
                              <span className="text-red-400 text-xs ml-1">(required)</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Export Section */}
                    <div className="mt-6 pt-6 border-t border-noir-700">
                      {exportSuccess ? (
                        <div className="text-center py-4">
                          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-white mb-2">Export Successful!</h3>
                          <p className="text-noir-400 text-sm mb-4">
                            Your EPUB is ready. Upload it to KDP!
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <a
                              href="https://kdp.amazon.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-velvet px-5 py-2.5 rounded-lg inline-flex items-center gap-2 text-sm"
                            >
                              Go to KDP
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={handleExport}
                              className="px-5 py-2.5 rounded-lg border border-noir-600 text-white text-sm hover:border-velvet-500 transition-colors"
                            >
                              Download Again
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">Export EPUB</h3>
                            <p className="text-sm text-noir-400">
                              {requiredChecksPassed 
                                ? 'Ready to export!' 
                                : 'Complete required items first'}
                            </p>
                          </div>
                          <button
                            onClick={handleExport}
                            disabled={!requiredChecksPassed || isExporting}
                            className="btn-velvet px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isExporting ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Exporting...
                              </>
                            ) : (
                              <>
                                <Download className="w-5 h-5" />
                                Export EPUB
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'metadata' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-noir rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-velvet-400" />
                        Book Description
                      </h2>
                      <button
                        onClick={handleGenerateDescription}
                        className="flex items-center gap-2 text-sm text-velvet-400 hover:text-velvet-300 transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        Auto-generate
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <textarea
                          value={selectedBook.metadata.description}
                          onChange={(e) => handleUpdateMetadata({ description: e.target.value })}
                          className="input-noir w-full px-4 py-3 rounded-lg text-sm text-white resize-none font-mono"
                          rows={12}
                          placeholder="Write a compelling description for your book...

Use HTML tags for formatting:
<b>Bold text</b>
<i>Italic text</i>
<br> for line breaks"
                        />
                        <div className="flex justify-between mt-2 text-xs text-noir-500">
                          <span>HTML formatting supported</span>
                          <span className={cn(
                            selectedBook.metadata.description.length > 4000 ? 'text-red-400' : ''
                          )}>
                            {selectedBook.metadata.description.length} / 4,000 characters
                          </span>
                        </div>
                      </div>

                      <div className="bg-velvet-600/10 border border-velvet-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-velvet-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-noir-300">
                            <p className="font-medium text-white mb-1">High-Converting Description Tips:</p>
                            <ul className="space-y-1 text-xs">
                              <li>• Start with a hook (question or bold statement)</li>
                              <li>• Introduce protagonist and their problem</li>
                              <li>• Tease the love interest and conflict</li>
                              <li>• List your tropes with bullet points</li>
                              <li>• End with a call to action</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'keywords' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-noir rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-velvet-400" />
                        Backend Keywords (7 slots)
                      </h2>
                      <button
                        onClick={handleGenerateKeywords}
                        className="flex items-center gap-2 text-sm text-velvet-400 hover:text-velvet-300 transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        Auto-generate
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-xs text-noir-500 w-6">{index + 1}.</span>
                          <input
                            type="text"
                            value={selectedBook.metadata.keywords[index] || ''}
                            onChange={(e) => {
                              const newKeywords = [...selectedBook.metadata.keywords];
                              newKeywords[index] = e.target.value;
                              handleUpdateMetadata({ keywords: newKeywords });
                            }}
                            maxLength={50}
                            className="input-noir flex-1 px-3 py-2 rounded-lg text-sm text-white"
                            placeholder={`Keyword phrase ${index + 1} (max 50 chars)`}
                          />
                          <span className={cn(
                            'text-xs w-12 text-right',
                            (selectedBook.metadata.keywords[index]?.length || 0) > 45 
                              ? 'text-yellow-400' 
                              : 'text-noir-500'
                          )}>
                            {selectedBook.metadata.keywords[index]?.length || 0}/50
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 bg-velvet-600/10 border border-velvet-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-velvet-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-noir-300">
                          <p className="font-medium text-white mb-1">Keyword Optimization Tips:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Use phrases, not single words (e.g., "dark romance alpha hero")</li>
                            <li>• NO commas - use spaces between phrases</li>
                            <li>• Include genre + tropes + themes</li>
                            <li>• Think about what readers search for</li>
                            <li>• Don't repeat words already in your title</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="mt-6 pt-6 border-t border-noir-700">
                      <h3 className="font-semibold text-white mb-3">KDP Categories (select up to 2)</h3>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {KDP_CATEGORIES.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              const current = selectedBook.metadata.categories;
                              if (current.includes(category)) {
                                handleUpdateMetadata({ categories: current.filter(c => c !== category) });
                              } else if (current.length < 2) {
                                handleUpdateMetadata({ categories: [...current, category] });
                              }
                            }}
                            className={cn(
                              'px-3 py-2 rounded-lg text-xs text-left transition-all',
                              selectedBook.metadata.categories.includes(category)
                                ? 'bg-velvet-600/30 text-white border border-velvet-500'
                                : 'bg-noir-800/50 text-noir-300 border border-transparent hover:border-noir-600'
                            )}
                          >
                            {category.split(' > ').pop()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'cover' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-noir rounded-xl p-6"
                  >
                    <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-velvet-400" />
                      Cover Image
                    </h2>
                    
                    <div className="flex gap-6">
                      <div className="w-48 h-72 bg-noir-800 rounded-lg overflow-hidden flex items-center justify-center border border-noir-700">
                        {selectedBook.coverImage ? (
                          <img 
                            src={selectedBook.coverImage} 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <BookOpen className="w-12 h-12 text-noir-600 mx-auto mb-2" />
                            <p className="text-xs text-noir-500">No cover</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <label className="block">
                          <span className="btn-velvet px-4 py-2 rounded-lg inline-flex items-center gap-2 cursor-pointer text-sm">
                            <ImageIcon className="w-4 h-4" />
                            Upload Cover
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  handleUpdateBook({ coverImage: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        
                        <div className="bg-noir-800/50 rounded-lg p-4">
                          <h3 className="font-medium text-white mb-3 text-sm">KDP Cover Requirements</h3>
                          <ul className="text-xs text-noir-400 space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              Ideal: 1600 x 2560 pixels
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              Minimum: 625 x 1000 pixels
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              Format: JPEG or TIFF
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              RGB color mode
                            </li>
                          </ul>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                          <p className="text-xs text-yellow-300">
                            <strong>Pro Tip:</strong> Your cover is 50%+ of the purchase decision. 
                            Consider hiring a professional designer on Fiverr or using Canva Pro templates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="card-noir rounded-xl p-12 text-center">
                <BookOpen className="w-16 h-16 text-noir-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Book</h3>
                <p className="text-noir-400">
                  Choose a book from the list to prepare it for export and publishing.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
