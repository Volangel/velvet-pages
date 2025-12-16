'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  Feather, 
  Sparkles, 
  TrendingUp,
  Clock,
  Target,
  FileText
} from 'lucide-react';
import { Book } from '@/types';
import { getBooks, deleteBook } from '@/lib/storage';
import { formatNumber, calculateReadingTime, truncate } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import NewBookModal from '@/components/NewBookModal';
import BookCard from '@/components/BookCard';

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showNewBookModal, setShowNewBookModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedBooks = getBooks();
    setBooks(loadedBooks);
    setIsLoading(false);
  }, []);

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      deleteBook(id);
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const totalWords = books.reduce((sum, book) => sum + book.currentWordCount, 0);
  const totalChapters = books.reduce((sum, book) => sum + book.chapters.length, 0);
  const completedBooks = books.filter(b => b.status === 'complete' || b.status === 'published').length;

  const stats = [
    { 
      label: 'Total Words', 
      value: formatNumber(totalWords), 
      icon: FileText,
      color: 'from-velvet-500 to-velvet-700'
    },
    { 
      label: 'Books in Progress', 
      value: books.length, 
      icon: BookOpen,
      color: 'from-fuchsia-500 to-fuchsia-700'
    },
    { 
      label: 'Chapters Written', 
      value: totalChapters, 
      icon: Feather,
      color: 'from-pink-500 to-pink-700'
    },
    { 
      label: 'Books Completed', 
      value: completedBooks, 
      icon: Sparkles,
      color: 'from-purple-500 to-purple-700'
    },
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
          <h1 className="font-display text-4xl font-bold text-gradient mb-2">
            Velvet Pages
          </h1>
          <p className="text-noir-400 text-lg">
            Your creative studio for steamy storytelling
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="card-noir rounded-xl p-5 card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-noir-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Books Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-white">
            Your Books
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewBookModal(true)}
            className="btn-velvet px-5 py-2.5 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Book
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-velvet-500 border-t-transparent" />
          </div>
        ) : books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-noir rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-velvet-500/20 to-velvet-700/20 flex items-center justify-center">
              <Feather className="w-10 h-10 text-velvet-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Your First Story
            </h3>
            <p className="text-noir-400 mb-6 max-w-md mx-auto">
              Every bestseller begins with a single word. Create your first book and let your imagination run wild.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewBookModal(true)}
              className="btn-velvet px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Create Your First Book
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {books.map((book, index) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  index={index}
                  onDelete={() => handleDeleteBook(book.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Quick Tips */}
        {books.length > 0 && books.length < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 card-noir rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-velvet-500/10">
                <TrendingUp className="w-6 h-6 text-velvet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Quick Tips for KDP Success</h3>
                <ul className="text-noir-400 text-sm space-y-1">
                  <li>• Aim for 20,000-50,000 words for romance novels</li>
                  <li>• Use compelling keywords and categories for discoverability</li>
                  <li>• A professional cover can increase sales by 50%+</li>
                  <li>• Consistent publishing builds your author brand</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* New Book Modal */}
      <AnimatePresence>
        {showNewBookModal && (
          <NewBookModal 
            onClose={() => setShowNewBookModal(false)}
            onCreated={(book) => {
              setBooks([...books, book]);
              setShowNewBookModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

