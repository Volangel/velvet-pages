'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Image,
  Wand2,
  Copy,
  Check,
  ExternalLink,
  Palette,
  Layout,
  Type,
  Sparkles,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Book } from '@/types';
import { aiService } from '@/lib/ai-service';
import { cn } from '@/lib/utils';

interface CoverGeneratorProps {
  book: Book;
  onCoverPromptGenerated: (prompt: string) => void;
}

const coverStyles = [
  { id: 'romantic', label: 'Romantic', desc: 'Soft, dreamy, intimate' },
  { id: 'dramatic', label: 'Dramatic', desc: 'Bold, intense, passionate' },
  { id: 'elegant', label: 'Elegant', desc: 'Sophisticated, classy' },
  { id: 'dark', label: 'Dark', desc: 'Mysterious, edgy, provocative' },
  { id: 'playful', label: 'Playful', desc: 'Light, fun, colorful' },
];

const colorSchemes = [
  { id: 'warm', label: 'Warm', colors: ['#DC2626', '#F97316', '#FBBF24'] },
  { id: 'cool', label: 'Cool', colors: ['#3B82F6', '#6366F1', '#8B5CF6'] },
  { id: 'dark', label: 'Dark', colors: ['#1F2937', '#374151', '#4B5563'] },
  { id: 'romantic', label: 'Romantic', colors: ['#EC4899', '#F472B6', '#FBCFE8'] },
  { id: 'earth', label: 'Earth', colors: ['#78350F', '#A16207', '#CA8A04'] },
  { id: 'luxury', label: 'Luxury', colors: ['#7C3AED', '#A855F7', '#C084FC'] },
];

export default function CoverGenerator({ book, onCoverPromptGenerated }: CoverGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverPrompt, setCoverPrompt] = useState(book.coverPrompt || '');
  const [selectedStyle, setSelectedStyle] = useState('romantic');
  const [selectedScheme, setSelectedScheme] = useState('warm');
  const [copied, setCopied] = useState(false);

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      const result = await aiService.generateCoverPrompt(book);
      if (result.success && result.data) {
        // Enhance with selected style and color scheme
        const enhancedPrompt = `${result.data}\n\n**Style**: ${selectedStyle}\n**Color Scheme**: ${selectedScheme}`;
        setCoverPrompt(enhancedPrompt);
        onCoverPromptGenerated(enhancedPrompt);
      }
    } catch (error) {
      console.error('Failed to generate cover prompt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(coverPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aiImageTools = [
    { name: 'Midjourney', url: 'https://midjourney.com', desc: 'Best quality' },
    { name: 'DALL-E', url: 'https://openai.com/dall-e-3', desc: 'Easy to use' },
    { name: 'Leonardo AI', url: 'https://leonardo.ai', desc: 'Free tier' },
    { name: 'Stable Diffusion', url: 'https://stability.ai', desc: 'Open source' },
  ];

  return (
    <div className="space-y-6">
      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Cover Style</label>
        <div className="grid grid-cols-5 gap-2">
          {coverStyles.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={cn(
                'p-3 rounded-lg border transition-all text-center',
                selectedStyle === style.id
                  ? 'border-velvet-500 bg-velvet-500/10 text-white'
                  : 'border-noir-700 hover:border-noir-600 text-noir-300'
              )}
            >
              <div className="text-sm font-medium">{style.label}</div>
              <div className="text-xs text-noir-400 mt-1">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Color Scheme</label>
        <div className="grid grid-cols-6 gap-2">
          {colorSchemes.map(scheme => (
            <button
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme.id)}
              className={cn(
                'p-3 rounded-lg border transition-all',
                selectedScheme === scheme.id
                  ? 'border-velvet-500 ring-2 ring-velvet-500/30'
                  : 'border-noir-700 hover:border-noir-600'
              )}
            >
              <div className="flex gap-1 mb-2">
                {scheme.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="text-xs text-noir-300">{scheme.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGeneratePrompt}
        disabled={isGenerating}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-velvet-600 to-purple-600 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Generating Cover Concept...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Cover Prompt
          </>
        )}
      </button>

      {/* Generated Prompt */}
      {coverPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white">Generated Prompt</label>
            <button
              onClick={handleCopyPrompt}
              className="text-sm text-velvet-400 hover:text-velvet-300 flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <textarea
            value={coverPrompt}
            onChange={(e) => {
              setCoverPrompt(e.target.value);
              onCoverPromptGenerated(e.target.value);
            }}
            rows={12}
            className="w-full px-4 py-3 rounded-lg bg-noir-800 border border-noir-700 text-white text-sm focus:border-velvet-500 focus:outline-none font-mono resize-none"
          />

          {/* AI Tools Links */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Create with AI Image Generators
            </label>
            <div className="grid grid-cols-2 gap-3">
              {aiImageTools.map(tool => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-noir-800 border border-noir-700 hover:border-velvet-500 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{tool.name}</div>
                    <div className="text-xs text-noir-400">{tool.desc}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-noir-400" />
                </a>
              ))}
            </div>
          </div>

          {/* KDP Cover Requirements */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
              <Image className="w-4 h-4" />
              KDP Cover Requirements
            </h4>
            <ul className="text-xs text-amber-200/80 space-y-1">
              <li>• eBook: 1600 x 2560 pixels (1:1.6 ratio)</li>
              <li>• Paperback: Varies by trim size + bleed</li>
              <li>• Format: JPEG or TIFF, RGB color</li>
              <li>• No blurry images or pixelation</li>
              <li>• No copyright-infringing content</li>
              <li>• Must include title and author name</li>
            </ul>
          </div>

          {/* Design Tips */}
          <div className="p-4 rounded-lg bg-velvet-500/10 border border-velvet-500/30">
            <h4 className="text-sm font-medium text-velvet-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Romance Cover Best Practices
            </h4>
            <ul className="text-xs text-velvet-200/80 space-y-1">
              <li>• Feature attractive couple or single figure</li>
              <li>• Use genre-appropriate imagery and colors</li>
              <li>• Title should be readable at thumbnail size</li>
              <li>• Match sub-genre expectations (billionaire = luxury)</li>
              <li>• Avoid faces covered by text placement</li>
              <li>• Test thumbnail at 150x240 pixels</li>
            </ul>
          </div>

          {/* Canva Integration Tip */}
          <div className="p-4 rounded-lg bg-noir-800 border border-noir-700">
            <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Pro Tip: Use Canva
            </h4>
            <p className="text-xs text-noir-300 mb-3">
              After generating your AI image, use Canva to add professional typography, 
              adjust composition, and ensure KDP-compliant dimensions.
            </p>
            <a
              href="https://www.canva.com/create/book-covers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-velvet-400 hover:text-velvet-300 flex items-center gap-1"
            >
              Open Canva Book Cover Maker
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}

