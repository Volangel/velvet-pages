'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users,
  Plus,
  Search,
  User,
  Heart,
  Skull,
  ChevronDown,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Book, Character } from '@/types';
import { getBooks, saveBook } from '@/lib/storage';
import { generateCharacterTemplate } from '@/lib/story-generator';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';

const roleIcons = {
  protagonist: User,
  'love-interest': Heart,
  antagonist: Skull,
  supporting: Users,
};

const roleColors = {
  protagonist: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  'love-interest': 'text-pink-400 bg-pink-500/20 border-pink-500/30',
  antagonist: 'text-red-400 bg-red-500/20 border-red-500/30',
  supporting: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
};

export default function CharactersPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const loadedBooks = getBooks();
    setBooks(loadedBooks);
    if (loadedBooks.length > 0) {
      setSelectedBookId(loadedBooks[0].id);
    }
  }, []);

  const selectedBook = books.find(b => b.id === selectedBookId);
  const characters = selectedBook?.characters || [];

  const filteredCharacters = characters.filter(char => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      char.name.toLowerCase().includes(query) ||
      char.role.toLowerCase().includes(query)
    );
  });

  const handleAddCharacter = (role: Character['role']) => {
    if (!selectedBook) return;
    
    const template = generateCharacterTemplate(role);
    const newCharacter: Character = {
      id: template.id || crypto.randomUUID(),
      name: template.name || '',
      role,
      age: template.age || '',
      appearance: template.appearance || '',
      personality: template.personality || '',
      background: template.background || '',
      desires: template.desires || '',
      arc: template.arc || '',
    };
    
    const updatedBook = {
      ...selectedBook,
      characters: [...selectedBook.characters, newCharacter],
    };
    
    saveBook(updatedBook);
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    setExpandedId(newCharacter.id);
    setShowAddForm(false);
  };

  const handleUpdateCharacter = (characterId: string, updates: Partial<Character>) => {
    if (!selectedBook) return;
    
    const updatedBook = {
      ...selectedBook,
      characters: selectedBook.characters.map(c => 
        c.id === characterId ? { ...c, ...updates } : c
      ),
    };
    
    saveBook(updatedBook);
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (!selectedBook || !confirm('Delete this character?')) return;
    
    const updatedBook = {
      ...selectedBook,
      characters: selectedBook.characters.filter(c => c.id !== characterId),
    };
    
    saveBook(updatedBook);
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
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
              <Users className="w-6 h-6 text-white" />
            </div>
            Character Builder
          </h1>
          <p className="text-noir-400">
            Create and manage characters for your stories
          </p>
        </motion.div>

        {books.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-noir-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Books Yet</h3>
            <p className="text-noir-400 mb-4">Create a book first to add characters</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Book Selection & Add Character */}
            <div className="col-span-1 space-y-4">
              {/* Book Selector */}
              <div className="card-noir rounded-xl p-4">
                <label className="block text-sm font-medium text-noir-300 mb-2">
                  Select Book
                </label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="input-noir w-full px-4 py-3 rounded-lg text-white"
                >
                  {books.map(book => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-noir-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search characters..."
                  className="input-noir w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder:text-noir-500"
                />
              </div>

              {/* Add Character */}
              <div className="card-noir rounded-xl p-4">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="w-full flex items-center justify-between text-sm font-medium text-white"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-velvet-400" />
                    Add Character
                  </span>
                  {showAddForm ? (
                    <ChevronDown className="w-4 h-4 text-noir-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-noir-400" />
                  )}
                </button>

                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 space-y-2 overflow-hidden"
                    >
                      {(['protagonist', 'love-interest', 'antagonist', 'supporting'] as const).map(role => {
                        const Icon = roleIcons[role];
                        return (
                          <button
                            key={role}
                            onClick={() => handleAddCharacter(role)}
                            className={cn(
                              'w-full p-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all hover:scale-[1.02] border',
                              roleColors[role]
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="capitalize">{role.replace('-', ' ')}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Character Count */}
              <div className="card-noir rounded-xl p-4">
                <h3 className="text-sm font-medium text-noir-300 mb-3">Character Count</h3>
                <div className="space-y-2">
                  {(['protagonist', 'love-interest', 'antagonist', 'supporting'] as const).map(role => {
                    const Icon = roleIcons[role];
                    const count = characters.filter(c => c.role === role).length;
                    return (
                      <div key={role} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-noir-400 capitalize">
                          <Icon className="w-4 h-4" />
                          {role.replace('-', ' ')}
                        </span>
                        <span className="text-white font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Characters List */}
            <div className="col-span-2 space-y-4">
              {filteredCharacters.length === 0 ? (
                <div className="card-noir rounded-xl p-12 text-center">
                  <Users className="w-16 h-16 text-noir-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Characters</h3>
                  <p className="text-noir-400">
                    {characters.length === 0 
                      ? 'Add your first character to this book' 
                      : 'No characters match your search'}
                  </p>
                </div>
              ) : (
                filteredCharacters.map((character, index) => {
                  const Icon = roleIcons[character.role];
                  const isExpanded = expandedId === character.id;
                  
                  return (
                    <motion.div
                      key={character.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-noir rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : character.id)}
                        className="w-full p-5 flex items-center gap-4 hover:bg-noir-800/30 transition-colors"
                      >
                        <div className={cn('p-3 rounded-xl border', roleColors[character.role])}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-semibold text-white">
                            {character.name || 'Unnamed Character'}
                          </h3>
                          <p className="text-sm text-noir-400 capitalize">
                            {character.role.replace('-', ' ')} • {character.age || 'Age not set'}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-noir-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-noir-400" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 pt-0 space-y-4 border-t border-noir-700/50">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs text-noir-400 mb-1 block">Name</label>
                                  <input
                                    type="text"
                                    value={character.name}
                                    onChange={(e) => handleUpdateCharacter(character.id, { name: e.target.value })}
                                    className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                                    placeholder="Character name..."
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-noir-400 mb-1 block">Age</label>
                                  <input
                                    type="text"
                                    value={character.age}
                                    onChange={(e) => handleUpdateCharacter(character.id, { age: e.target.value })}
                                    className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                                    placeholder="Age or age range..."
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-xs text-noir-400 mb-1 block">Appearance</label>
                                <textarea
                                  value={character.appearance}
                                  onChange={(e) => handleUpdateCharacter(character.id, { appearance: e.target.value })}
                                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                                  rows={3}
                                  placeholder="Physical description, style, notable features..."
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-noir-400 mb-1 block">Personality</label>
                                <textarea
                                  value={character.personality}
                                  onChange={(e) => handleUpdateCharacter(character.id, { personality: e.target.value })}
                                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                                  rows={3}
                                  placeholder="Traits, quirks, temperament..."
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-noir-400 mb-1 block">Background</label>
                                <textarea
                                  value={character.background}
                                  onChange={(e) => handleUpdateCharacter(character.id, { background: e.target.value })}
                                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                                  rows={3}
                                  placeholder="History, upbringing, key events..."
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-noir-400 mb-1 block">Desires & Motivations</label>
                                <textarea
                                  value={character.desires}
                                  onChange={(e) => handleUpdateCharacter(character.id, { desires: e.target.value })}
                                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                                  rows={2}
                                  placeholder="What drives them, what they want..."
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-noir-400 mb-1 block">Character Arc</label>
                                <textarea
                                  value={character.arc}
                                  onChange={(e) => handleUpdateCharacter(character.id, { arc: e.target.value })}
                                  className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                                  rows={2}
                                  placeholder="How they change throughout the story..."
                                />
                              </div>
                              
                              <button
                                onClick={() => handleDeleteCharacter(character.id)}
                                className="w-full py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 border border-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Character
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

