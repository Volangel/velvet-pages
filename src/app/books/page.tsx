'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
} from 'lucide-react';
import { Book } from '@/types';
import { getBooks, deleteBook } from '@/lib/storage';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import NewBookModal from '@/components/NewBookModal';
import BookCard from '@/components/BookCard';

type ViewMode = 'grid' | 'list';
type SortBy = 'updated' | 'created' | 'title' | 'progress';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showNewBookModal, setShowNewBookModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('updated');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      deleteBook(id);
      setBooks(books.filter(b => b.id !== id));
    }
  };

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query) ||
          book.penName.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(book => {
      if (filterStatus === 'all') return true;
      return book.status === filterStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'progress':
          const progressA = a.currentWordCount / a.targetWordCount;
          const progressB = b.currentWordCount / b.targetWordCount;
          return progressB - progressA;
        default:
          return 0;
      }
    });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              My Books
            </h1>
            <p className="text-noir-400">
              {books.length} book{books.length !== 1 ? 's' : ''} in your library
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewBookModal(true)}
            className="btn-velvet px-5 py-2.5 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Book
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-noir-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="input-noir w-full pl-10 pr-4 py-2.5 rounded-lg text-white placeholder:text-noir-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-noir px-4 py-2.5 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="writing">Writing</option>
            <option value="editing">Editing</option>
            <option value="complete">Complete</option>
            <option value="published">Published</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="input-noir px-4 py-2.5 rounded-lg text-white"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title A-Z</option>
            <option value="progress">Progress</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-noir-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-velvet-600 text-white' : 'text-noir-400 hover:text-white'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-velvet-600 text-white' : 'text-noir-400 hover:text-white'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Books Grid/List */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-noir-400">
              {books.length === 0 
                ? 'No books yet. Create your first book!' 
                : 'No books match your filters.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {filteredBooks.map((book, index) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  index={index}
                  onDelete={() => handleDeleteBook(book.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredBooks.map((book, index) => (
              <motion.a
                key={book.id}
                href={`/book/${book.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="card-noir rounded-xl p-4 flex items-center gap-4 card-hover"
              >
                {/* Cover */}
                <div className="w-16 h-24 bg-noir-800 rounded-lg overflow-hidden flex-shrink-0">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-velvet-900/50 to-noir-800" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold text-white truncate">
                    {book.title}
                  </h3>
                  <p className="text-sm text-noir-400">
                    {book.penName || 'No pen name'} • {book.genre}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-noir-500">
                    <span>{book.chapters.length} chapters</span>
                    <span>{book.currentWordCount.toLocaleString()} words</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="w-32 text-right">
                  <div className="text-sm font-medium text-white mb-1">
                    {Math.round((book.currentWordCount / book.targetWordCount) * 100)}%
                  </div>
                  <div className="h-1.5 bg-noir-700 rounded-full overflow-hidden">
                    <div
                      className="h-full progress-velvet rounded-full"
                      style={{ width: `${Math.min(100, (book.currentWordCount / book.targetWordCount) * 100)}%` }}
                    />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </main>

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

