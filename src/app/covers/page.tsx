'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Image,
  BookOpen,
  ArrowRight,
  Sparkles,
  Palette,
  Layout,
  Eye,
  Download,
  RefreshCw,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CoverGenerator from '@/components/CoverGenerator';
import { Book } from '@/types';
import { getAllBooks, saveBook } from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function CoversPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadedBooks = getAllBooks();
    setBooks(loadedBooks);
    if (loadedBooks.length > 0 && !selectedBook) {
      setSelectedBook(loadedBooks[0]);
    }
  }, []);

  const handleCoverPromptGenerated = (prompt: string) => {
    if (!selectedBook) return;
    
    const updatedBook = {
      ...selectedBook,
      coverPrompt: prompt,
    };
    
    saveBook(updatedBook);
    setSelectedBook(updatedBook);
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
              <Image className="w-8 h-8 text-velvet-400" />
              Cover Designer
            </h1>
            <p className="text-noir-400 mt-2">
              Generate AI-powered cover concepts and prompts for your books
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {/* Book Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-1"
            >
              <div className="card-noir p-4 rounded-xl">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-velvet-400" />
                  Select Book
                </h2>
                
                {books.length === 0 ? (
                  <div className="text-center py-8 text-noir-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No books yet</p>
                    <p className="text-xs mt-1">Create a book first</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {books.map(book => (
                      <button
                        key={book.id}
                        onClick={() => setSelectedBook(book)}
                        className={cn(
                          'w-full p-3 rounded-lg text-left transition-all',
                          selectedBook?.id === book.id
                            ? 'bg-velvet-500/15 border border-velvet-500/30'
                            : 'bg-noir-800/50 border border-transparent hover:border-noir-700'
                        )}
                      >
                        <div className="text-sm font-medium text-white">{book.title}</div>
                        <div className="text-xs text-noir-400 mt-1">
                          {book.genre} • {book.heatLevel}
                        </div>
                        {book.coverPrompt && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                            <Sparkles className="w-3 h-3" />
                            Cover prompt ready
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover Design Tips */}
              <div className="card-noir p-4 rounded-xl mt-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-velvet-400" />
                  Genre Cover Trends
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-2 rounded bg-noir-800/50">
                    <div className="font-medium text-white">Billionaire Romance</div>
                    <div className="text-noir-400 mt-1">
                      Dark suits, city skylines, luxury settings, deep blues & golds
                    </div>
                  </div>
                  <div className="p-2 rounded bg-noir-800/50">
                    <div className="font-medium text-white">Dark Romance</div>
                    <div className="text-noir-400 mt-1">
                      Moody lighting, tattoos, blacks & reds, dangerous vibes
                    </div>
                  </div>
                  <div className="p-2 rounded bg-noir-800/50">
                    <div className="font-medium text-white">Small Town</div>
                    <div className="text-noir-400 mt-1">
                      Warm colors, countryside, cozy settings, illustrated style
                    </div>
                  </div>
                  <div className="p-2 rounded bg-noir-800/50">
                    <div className="font-medium text-white">Paranormal</div>
                    <div className="text-noir-400 mt-1">
                      Mystical elements, dark atmosphere, purples & silvers
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cover Generator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-2"
            >
              <div className="card-noir p-6 rounded-xl">
                {selectedBook ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {selectedBook.title}
                        </h2>
                        <p className="text-sm text-noir-400 mt-1">
                          Generate an AI cover prompt for this book
                        </p>
                      </div>
                      {selectedBook.coverPrompt && (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                          Prompt Generated
                        </span>
                      )}
                    </div>

                    <CoverGenerator
                      book={selectedBook}
                      onCoverPromptGenerated={handleCoverPromptGenerated}
                    />
                  </>
                ) : (
                  <div className="text-center py-16 text-noir-400">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Select a Book</p>
                    <p className="text-sm mt-2">
                      Choose a book from the left to generate cover concepts
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Workflow Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Cover Creation Workflow</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  step: 1,
                  title: 'Generate Prompt',
                  desc: 'Create an AI-optimized prompt based on your book',
                  icon: Sparkles,
                },
                {
                  step: 2,
                  title: 'Create Image',
                  desc: 'Use Midjourney, DALL-E, or other AI tools',
                  icon: Image,
                },
                {
                  step: 3,
                  title: 'Add Typography',
                  desc: 'Use Canva to add title and author name',
                  icon: Layout,
                },
                {
                  step: 4,
                  title: 'Test & Upload',
                  desc: 'Check thumbnail size and upload to KDP',
                  icon: Eye,
                },
              ].map((item, idx) => (
                <div
                  key={item.step}
                  className="card-noir p-4 rounded-xl relative"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-velvet-500/20 flex items-center justify-center text-velvet-400 text-sm font-bold">
                      {item.step}
                    </div>
                    <item.icon className="w-5 h-5 text-velvet-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-noir-400 mt-1">{item.desc}</p>
                  {idx < 3 && (
                    <ArrowRight className="absolute top-1/2 -right-3 w-5 h-5 text-noir-600 transform -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
