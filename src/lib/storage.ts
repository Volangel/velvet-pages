import { Book, HeatLevel } from '@/types';

const STORAGE_KEY = 'erotica-ebook-creator-books';

export function getBooks(): Book[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Alias for getBooks
export const getAllBooks = getBooks;

export function getBook(id: string): Book | undefined {
  const books = getBooks();
  return books.find(book => book.id === id);
}

export function saveBook(book: Book): void {
  const books = getBooks();
  const existingIndex = books.findIndex(b => b.id === book.id);
  
  if (existingIndex >= 0) {
    books[existingIndex] = { ...book, updatedAt: new Date().toISOString() };
  } else {
    books.push(book);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function deleteBook(id: string): void {
  const books = getBooks().filter(book => book.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function createNewBook(partial: Partial<Book>): Book {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: partial.title || 'Untitled Book',
    penName: partial.penName || '',
    genre: partial.genre || 'Dark Romance',
    subGenre: partial.subGenre || '',
    tropes: partial.tropes || [],
    heatLevel: partial.heatLevel || 'steamy',
    synopsis: partial.synopsis || '',
    targetWordCount: partial.targetWordCount || 50000,
    currentWordCount: 0,
    chapters: partial.chapters || [],
    characters: partial.characters || [],
    coverImage: partial.coverImage,
    metadata: partial.metadata || {
      description: '',
      keywords: [],
      categories: [],
      price: 3.99,
      enrollKU: true,
      contentWarnings: ['Adult Content 18+', 'Explicit Sexual Content'],
    },
    series: partial.series,
    backMatter: partial.backMatter,
    createdAt: now,
    updatedAt: now,
    status: 'draft',
  };
}

// Get books in a series
export function getSeriesBooks(seriesName: string): Book[] {
  return getBooks()
    .filter(book => book.series?.name === seriesName)
    .sort((a, b) => (a.series?.bookNumber || 0) - (b.series?.bookNumber || 0));
}

// Get all unique series names
export function getAllSeries(): string[] {
  const books = getBooks();
  const seriesNames = new Set<string>();
  
  books.forEach(book => {
    if (book.series?.name) {
      seriesNames.add(book.series.name);
    }
  });
  
  return Array.from(seriesNames);
}

// Calculate total stats across all books
export function getAuthorStats() {
  const books = getBooks();
  
  const totalWords = books.reduce((sum, book) => sum + book.currentWordCount, 0);
  const totalChapters = books.reduce((sum, book) => sum + book.chapters.length, 0);
  const completedBooks = books.filter(b => b.status === 'complete' || b.status === 'published').length;
  const publishedBooks = books.filter(b => b.status === 'published').length;
  
  const genreBreakdown: Record<string, number> = {};
  books.forEach(book => {
    genreBreakdown[book.genre] = (genreBreakdown[book.genre] || 0) + 1;
  });
  
  return {
    totalBooks: books.length,
    totalWords,
    totalChapters,
    completedBooks,
    publishedBooks,
    genreBreakdown,
    avgWordsPerBook: books.length > 0 ? Math.round(totalWords / books.length) : 0,
  };
}
