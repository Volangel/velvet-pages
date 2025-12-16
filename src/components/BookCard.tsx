'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  FileDown,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { Book } from '@/types';
import { formatNumber, calculateReadingTime, truncate, cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  index: number;
  onDelete: () => void;
}

export default function BookCard({ book, index, onDelete }: BookCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const progress = Math.min(100, Math.round((book.currentWordCount / book.targetWordCount) * 100));
  
  const statusColors: Record<string, string> = {
    draft: 'status-draft',
    writing: 'status-writing',
    editing: 'status-editing',
    complete: 'status-complete',
    published: 'status-published',
  };

  const statusLabels: Record<string, string> = {
    draft: 'Draft',
    writing: 'Writing',
    editing: 'Editing',
    complete: 'Complete',
    published: 'Published',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="card-noir rounded-xl overflow-hidden card-hover group"
    >
      {/* Cover Image / Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-velvet-900/50 to-noir-800 overflow-hidden">
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-velvet-700/50" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900/90 to-transparent" />
        
        {/* Genre badge */}
        <div className="absolute top-3 left-3">
          <span className="tag px-2.5 py-1 rounded-full text-xs font-medium">
            {book.genre}
          </span>
        </div>

        {/* Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg bg-noir-900/60 hover:bg-noir-900/80 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-noir-800 rounded-lg shadow-xl border border-noir-700 z-20">
                  <Link
                    href={`/book/${book.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-noir-300 hover:text-white hover:bg-noir-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Book
                  </Link>
                  <Link
                    href={`/export?book=${book.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-noir-300 hover:text-white hover:bg-noir-700 transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    Export EPUB
                  </Link>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-noir-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title on cover */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-lg font-semibold text-white leading-tight">
            {truncate(book.title, 40)}
          </h3>
          {book.penName && (
            <p className="text-sm text-noir-300 mt-0.5">by {book.penName}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-noir-400">Progress</span>
            <span className="text-xs font-medium text-velvet-400">
              {formatNumber(book.currentWordCount)} / {formatNumber(book.targetWordCount)} words
            </span>
          </div>
          <div className="h-1.5 bg-noir-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full progress-velvet rounded-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-noir-400">
            <span>{book.chapters.length} chapters</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {calculateReadingTime(book.currentWordCount)}
            </span>
          </div>
          
          <span className={cn(
            'px-2 py-0.5 rounded text-xs font-medium',
            statusColors[book.status]
          )}>
            {statusLabels[book.status]}
          </span>
        </div>

        {/* Quick Action */}
        <Link
          href={`/book/${book.id}`}
          className="mt-4 block w-full text-center py-2.5 rounded-lg bg-noir-700/50 hover:bg-velvet-600/20 border border-noir-600 hover:border-velvet-600/50 text-sm font-medium text-white transition-all"
        >
          Continue Writing
        </Link>
      </div>
    </motion.div>
  );
}

