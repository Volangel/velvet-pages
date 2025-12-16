'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  User,
  Trash2,
  ChevronRight,
  Edit2,
  Sparkles,
  Crown,
  Heart,
  Skull,
  Users,
  Bot,
  Wand2,
  Loader2,
} from 'lucide-react';
import { Character, Book } from '@/types';
import { cn } from '@/lib/utils';
import { aiService } from '@/lib/ai-service';

interface CharacterPanelProps {
  characters: Character[];
  onUpdate: (characters: Character[]) => void;
  book: Book;
}

const roleIcons: Record<Character['role'], any> = {
  protagonist: Crown,
  'love-interest': Heart,
  antagonist: Skull,
  supporting: Users,
};

const roleColors: Record<Character['role'], string> = {
  protagonist: 'text-amber-400 bg-amber-500/20',
  'love-interest': 'text-pink-400 bg-pink-500/20',
  antagonist: 'text-red-400 bg-red-500/20',
  supporting: 'text-blue-400 bg-blue-500/20',
};

const roleOrder: Record<Character['role'], number> = {
  protagonist: 0,
  'love-interest': 1,
  antagonist: 2,
  supporting: 3,
};

export default function CharacterPanel({ characters, onUpdate, book }: CharacterPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingRole, setGeneratingRole] = useState<Character['role'] | null>(null);

  const handleAddCharacter = (role: Character['role'] = 'supporting') => {
    const newCharacter: Character = {
      id: crypto.randomUUID(),
      name: 'New Character',
      role,
      age: '25',
      appearance: '',
      personality: '',
      background: '',
      desires: '',
      arc: '',
    };
    onUpdate([...characters, newCharacter]);
    setEditingId(newCharacter.id);
    setExpandedId(newCharacter.id);
  };

  const handleGenerateCharacter = async (role: Character['role']) => {
    setIsGenerating(true);
    setGeneratingRole(role);

    try {
      const result = await aiService.generateCharacter({
        book,
        role,
        existingCharacters: characters,
      });

      if (result.success && result.data) {
        const newCharacter: Character = {
          id: crypto.randomUUID(),
          ...result.data,
        };
        onUpdate([...characters, newCharacter]);
        setExpandedId(newCharacter.id);
      }
    } catch (error) {
      console.error('Failed to generate character:', error);
    } finally {
      setIsGenerating(false);
      setGeneratingRole(null);
    }
  };

  const handleDeleteCharacter = (id: string) => {
    if (!confirm('Delete this character?')) return;
    onUpdate(characters.filter(c => c.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleUpdateCharacter = (id: string, updates: Partial<Character>) => {
    onUpdate(characters.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const sortedCharacters = [...characters].sort((a, b) => {
    return roleOrder[a.role] - roleOrder[b.role];
  });

  const roles: Character['role'][] = ['protagonist', 'love-interest', 'antagonist', 'supporting'];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Quick Add Buttons */}
      <div className="p-4 border-b border-noir-700/50">
        <div className="text-xs font-medium text-noir-400 mb-3">Quick Add / Generate</div>
        <div className="grid grid-cols-2 gap-2">
          {roles.map(role => {
            const Icon = roleIcons[role];
            const hasRole = role !== 'supporting' && characters.some(c => c.role === role);
            const isGeneratingThis = isGenerating && generatingRole === role;
            const displayName = role === 'love-interest' ? 'love interest' : role;
            
            return (
              <div key={role} className="flex gap-1">
                <button
                  onClick={() => handleAddCharacter(role)}
                  disabled={hasRole || isGenerating}
                  className={cn(
                    'flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1',
                    hasRole || isGenerating
                      ? 'bg-noir-800/50 text-noir-500 cursor-not-allowed'
                      : `${roleColors[role]} hover:opacity-80`
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {displayName}
                </button>
                <button
                  onClick={() => handleGenerateCharacter(role)}
                  disabled={hasRole || isGenerating}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    hasRole || isGenerating
                      ? 'bg-noir-800/50 text-noir-500 cursor-not-allowed'
                      : 'bg-velvet-600/20 text-velvet-400 hover:bg-velvet-600/30'
                  )}
                  title={`Generate ${displayName} with AI`}
                >
                  {isGeneratingThis ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate All Characters */}
      {characters.length === 0 && (
        <div className="p-4 border-b border-noir-700/50">
          <button
            onClick={async () => {
              setIsGenerating(true);
              for (const role of ['protagonist', 'love-interest', 'supporting'] as const) {
                setGeneratingRole(role);
                await handleGenerateCharacter(role);
              }
              setIsGenerating(false);
              setGeneratingRole(null);
            }}
            disabled={isGenerating}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-velvet-600 to-purple-600 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating {generatingRole === 'love-interest' ? 'love interest' : generatingRole}...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                Generate All Characters with AI
              </>
            )}
          </button>
        </div>
      )}

      {/* Character List */}
      <div className="p-2 space-y-2">
        <AnimatePresence>
          {sortedCharacters.map(character => {
            const Icon = roleIcons[character.role];
            const isExpanded = expandedId === character.id;
            const displayRole = character.role === 'love-interest' ? 'love interest' : character.role;

            return (
              <motion.div
                key={character.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-noir-800/50 rounded-lg overflow-hidden"
              >
                {/* Character Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : character.id)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-noir-800 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg', roleColors[character.role])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{character.name}</div>
                    <div className="text-xs text-noir-400 capitalize">
                      {displayRole}
                      {character.age && ` · ${character.age} years old`}
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 text-noir-400 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 border-t border-noir-700/50 space-y-3">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-medium text-noir-400 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={character.name}
                            onChange={(e) =>
                              handleUpdateCharacter(character.id, { name: e.target.value })
                            }
                            className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                          />
                        </div>

                        {/* Role & Age */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-noir-400 mb-1">
                              Role
                            </label>
                            <select
                              value={character.role}
                              onChange={(e) =>
                                handleUpdateCharacter(character.id, {
                                  role: e.target.value as Character['role'],
                                })
                              }
                              className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                            >
                              <option value="protagonist">Protagonist</option>
                              <option value="love-interest">Love Interest</option>
                              <option value="antagonist">Antagonist</option>
                              <option value="supporting">Supporting</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-noir-400 mb-1">
                              Age
                            </label>
                            <input
                              type="text"
                              value={character.age || ''}
                              onChange={(e) =>
                                handleUpdateCharacter(character.id, {
                                  age: e.target.value,
                                })
                              }
                              className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white"
                              placeholder="25, late 20s, immortal..."
                            />
                          </div>
                        </div>

                        {/* Appearance */}
                        <div>
                          <label className="block text-xs font-medium text-noir-400 mb-1">
                            Appearance
                          </label>
                          <textarea
                            value={character.appearance || ''}
                            onChange={(e) =>
                              handleUpdateCharacter(character.id, { appearance: e.target.value })
                            }
                            rows={2}
                            className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                            placeholder="Height, build, hair, eyes, distinctive features..."
                          />
                        </div>

                        {/* Personality */}
                        <div>
                          <label className="block text-xs font-medium text-noir-400 mb-1">
                            Personality
                          </label>
                          <textarea
                            value={character.personality || ''}
                            onChange={(e) =>
                              handleUpdateCharacter(character.id, {
                                personality: e.target.value,
                              })
                            }
                            rows={2}
                            className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                            placeholder="Witty, guarded, passionate..."
                          />
                        </div>

                        {/* Background */}
                        <div>
                          <label className="block text-xs font-medium text-noir-400 mb-1">
                            Background
                          </label>
                          <textarea
                            value={character.background || ''}
                            onChange={(e) =>
                              handleUpdateCharacter(character.id, { background: e.target.value })
                            }
                            rows={3}
                            className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                            placeholder="Their history, what shaped them..."
                          />
                        </div>

                        {/* Desires */}
                        <div>
                          <label className="block text-xs font-medium text-noir-400 mb-1">
                            Desires & Motivations
                          </label>
                          <textarea
                            value={character.desires || ''}
                            onChange={(e) =>
                              handleUpdateCharacter(character.id, {
                                desires: e.target.value,
                              })
                            }
                            rows={2}
                            className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                            placeholder="What they want, what drives them..."
                          />
                        </div>

                        {/* Character Arc */}
                        <div>
                          <label className="block text-xs font-medium text-noir-400 mb-1">
                            Character Arc
                          </label>
                          <textarea
                            value={character.arc || ''}
                            onChange={(e) =>
                              handleUpdateCharacter(character.id, { arc: e.target.value })
                            }
                            rows={2}
                            className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                            placeholder="How they change throughout the story..."
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteCharacter(character.id)}
                          className="w-full py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm flex items-center justify-center gap-2"
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
          })}
        </AnimatePresence>

        {characters.length === 0 && !isGenerating && (
          <div className="text-center py-8 text-noir-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No characters yet</p>
            <p className="text-xs mt-1">Add characters to bring your story to life</p>
          </div>
        )}
      </div>
    </div>
  );
}
