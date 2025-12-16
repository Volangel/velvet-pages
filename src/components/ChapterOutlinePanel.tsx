'use client';

import { useState } from 'react';
import { Sparkles, FileText, StickyNote, Target } from 'lucide-react';
import { Chapter } from '@/types';
import { cn } from '@/lib/utils';

interface ChapterOutlinePanelProps {
  chapter: Chapter;
  onUpdate: (updates: Partial<Chapter>) => void;
}

export default function ChapterOutlinePanel({ chapter, onUpdate }: ChapterOutlinePanelProps) {
  const [activeSection, setActiveSection] = useState<'outline' | 'notes'>('outline');

  const sections = [
    { id: 'outline' as const, label: 'Outline', icon: Target },
    { id: 'notes' as const, label: 'Notes', icon: StickyNote },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-noir-700/50">
        <h3 className="text-sm font-medium text-white mb-1">
          {chapter.title}
        </h3>
        <p className="text-xs text-noir-400">
          Plan your chapter before writing
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-noir-700/50">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              'flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors',
              activeSection === section.id
                ? 'text-velvet-400 bg-velvet-500/10 border-b-2 border-velvet-500'
                : 'text-noir-400 hover:text-white'
            )}
          >
            <section.icon className="w-3.5 h-3.5" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'outline' ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-noir-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-velvet-400" />
                  Chapter Outline
                </label>
              </div>
              <textarea
                value={chapter.outline}
                onChange={(e) => onUpdate({ outline: e.target.value })}
                placeholder="• Key events in this chapter
• Character development moments
• Romantic/intimate scenes
• Conflict or tension points
• Chapter ending hook"
                className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
                rows={12}
              />
            </div>

            <div className="card-noir rounded-lg p-3">
              <div className="flex items-center gap-2 text-velvet-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">Writing Tips</span>
              </div>
              <ul className="text-xs text-noir-400 space-y-1.5">
                <li>• Start with action or dialogue to hook readers</li>
                <li>• Include sensory details for intimate scenes</li>
                <li>• End chapters on tension or revelation</li>
                <li>• Show character emotions through actions</li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <StickyNote className="w-3.5 h-3.5 text-velvet-400" />
              <label className="text-xs font-medium text-noir-300">
                Notes & Ideas
              </label>
            </div>
            <textarea
              value={chapter.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Jot down any ideas, research notes, dialogue snippets, or things to remember for this chapter..."
              className="input-noir w-full px-3 py-2 rounded-lg text-sm text-white resize-none"
              rows={15}
            />
          </div>
        )}
      </div>
    </div>
  );
}

