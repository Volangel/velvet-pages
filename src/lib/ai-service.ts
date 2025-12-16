// AI Service Layer for Content Generation
// This module handles all AI-powered content generation

import { Book, Chapter, Character } from '@/types';

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  style?: 'descriptive' | 'punchy' | 'literary';
}

export interface ChapterGenerationParams {
  book: Book;
  chapter: Chapter;
  previousChapters?: Chapter[];
  options?: GenerationOptions;
}

export interface CharacterGenerationParams {
  book: Book;
  role: Character['role'];
  existingCharacters?: Character[];
  options?: GenerationOptions;
}

export interface GenerationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class AIService {
  private baseUrl = '/api/generate';

  async generateChapter(params: ChapterGenerationParams): Promise<GenerationResult<string>> {
    try {
      const { book, chapter, previousChapters = [] } = params;
      
      // Build context from previous chapters
      const previousContext = previousChapters
        .slice(-2)
        .filter(ch => ch.content && ch.content.length > 0)
        .map(ch => `${ch.title}: ${(ch.content || '').slice(0, 500)}...`)
        .join('\n\n');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chapter',
          data: {
            chapterTitle: chapter.title,
            chapterNumber: chapter.orderIndex + 1,
            outline: chapter.outline || '',
            characters: book.characters,
            genre: book.genre,
            heatLevel: book.heatLevel,
            previousContext,
            wordTarget: Math.floor(book.targetWordCount / book.chapters.length),
          },
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        return { success: true, data: result.content };
      }
      
      return { success: false, error: result.error || 'Failed to generate chapter' };
    } catch (error) {
      console.error('Chapter generation error:', error);
      return { success: false, error: 'Network error during generation' };
    }
  }

  async generateCharacter(params: CharacterGenerationParams): Promise<GenerationResult<Omit<Character, 'id'>>> {
    try {
      const { book, role, existingCharacters = [] } = params;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'character',
          data: {
            role,
            genre: book.genre,
            existingCharacters,
          },
        }),
      });

      const result = await response.json();
      
      if (result.success && result.character) {
        return { success: true, data: result.character };
      }
      
      return { success: false, error: result.error || 'Failed to generate character' };
    } catch (error) {
      console.error('Character generation error:', error);
      return { success: false, error: 'Network error during generation' };
    }
  }

  async generateOutline(book: Book): Promise<GenerationResult<any[]>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'outline',
          data: {
            title: book.title,
            genre: book.genre,
            premise: book.metadata.description || '',
            characters: book.characters,
            chapterCount: book.chapters.length || 10,
          },
        }),
      });

      const result = await response.json();
      
      if (result.success && result.outline) {
        return { success: true, data: result.outline };
      }
      
      return { success: false, error: result.error || 'Failed to generate outline' };
    } catch (error) {
      console.error('Outline generation error:', error);
      return { success: false, error: 'Network error during generation' };
    }
  }

  async generateBlurb(book: Book): Promise<GenerationResult<string>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blurb',
          data: {
            title: book.title,
            genre: book.genre,
            premise: book.metadata.description || '',
            characters: book.characters,
            keywords: book.metadata.keywords,
          },
        }),
      });

      const result = await response.json();
      
      if (result.success && result.blurb) {
        return { success: true, data: result.blurb };
      }
      
      return { success: false, error: result.error || 'Failed to generate blurb' };
    } catch (error) {
      console.error('Blurb generation error:', error);
      return { success: false, error: 'Network error during generation' };
    }
  }

  async generateCoverPrompt(book: Book): Promise<GenerationResult<string>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cover-prompt',
          data: {
            title: book.title,
            genre: book.genre,
            characters: book.characters,
            authorName: book.penName || 'Author Name', // Include author name for cover
            mood: this.getMoodFromHeatLevel(book.heatLevel),
          },
        }),
      });

      const result = await response.json();
      
      if (result.success && result.prompt) {
        return { success: true, data: result.prompt };
      }
      
      return { success: false, error: result.error || 'Failed to generate cover prompt' };
    } catch (error) {
      console.error('Cover prompt generation error:', error);
      return { success: false, error: 'Network error during generation' };
    }
  }

  async generateKeywords(book: Book): Promise<GenerationResult<string[]>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'keywords',
          data: {
            genre: book.genre,
            subGenre: book.subGenre, // Include subGenre for monster romance specific keywords
            tropes: book.tropes || [],
            heatLevel: book.heatLevel,
          },
        }),
      });

      const result = await response.json();
      
      if (result.success && result.keywords) {
        return { success: true, data: result.keywords };
      }
      
      return { success: false, error: result.error || 'Failed to generate keywords' };
    } catch (error) {
      console.error('Keywords generation error:', error);
      return { success: false, error: 'Network error during generation' };
    }
  }

  async generateBackMatter(book: Book, options?: {
    seriesName?: string;
    seriesNumber?: number;
    otherBooks?: { title: string; link?: string }[];
    socialLinks?: { platform: string; url: string }[];
  }): Promise<GenerationResult<string>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'back-matter',
          data: {
            title: book.title,
            authorName: book.penName || 'Author',
            ...options,
          },
        }),
      });

      const result = await response.json();
      
      if (result.success && result.backMatter) {
        return { success: true, data: result.backMatter };
      }
      
      return { success: false, error: result.error || 'Failed to generate back matter' };
    } catch (error) {
      console.error('Back matter generation error:', error);
      return { success: false, error: 'Network error during generation' };
    }
  }

  // Full book generation orchestration
  async generateFullBook(
    book: Book,
    onProgress: (stage: string, progress: number, detail?: string) => void
  ): Promise<GenerationResult<Book>> {
    try {
      let updatedBook = { ...book };
      const totalSteps = 5 + book.chapters.length;
      let currentStep = 0;

      // Step 1: Generate characters if none exist
      onProgress('characters', (++currentStep / totalSteps) * 100, 'Generating characters...');
      if (updatedBook.characters.length === 0) {
        const roles: Character['role'][] = ['protagonist', 'love-interest', 'supporting'];
        const newCharacters: Character[] = [];
        
        for (const role of roles) {
          const result = await this.generateCharacter({
            book: updatedBook,
            role,
            existingCharacters: newCharacters,
          });
          
          if (result.success && result.data) {
            newCharacters.push({
              id: crypto.randomUUID(),
              ...result.data,
            });
          }
        }
        
        updatedBook.characters = newCharacters;
      }

      // Step 2: Generate outline
      onProgress('outline', (++currentStep / totalSteps) * 100, 'Creating story outline...');
      const outlineResult = await this.generateOutline(updatedBook);
      if (outlineResult.success && outlineResult.data) {
        updatedBook.chapters = updatedBook.chapters.map((ch, idx) => {
          const outline = outlineResult.data![idx];
          return {
            ...ch,
            outline: outline ? `${outline.purpose}\n\nBeats:\n${outline.beats.join('\n')}` : ch.outline,
          };
        });
      }

      // Step 3: Generate blurb
      onProgress('blurb', (++currentStep / totalSteps) * 100, 'Writing book description...');
      const blurbResult = await this.generateBlurb(updatedBook);
      if (blurbResult.success && blurbResult.data) {
        updatedBook.metadata = {
          ...updatedBook.metadata,
          description: blurbResult.data,
        };
      }

      // Step 4: Generate keywords
      onProgress('keywords', (++currentStep / totalSteps) * 100, 'Optimizing keywords...');
      const keywordsResult = await this.generateKeywords(updatedBook);
      if (keywordsResult.success && keywordsResult.data) {
        updatedBook.metadata = {
          ...updatedBook.metadata,
          keywords: keywordsResult.data,
        };
      }

      // Step 5: Generate cover prompt
      onProgress('cover', (++currentStep / totalSteps) * 100, 'Creating cover concept...');
      const coverResult = await this.generateCoverPrompt(updatedBook);
      if (coverResult.success && coverResult.data) {
        updatedBook.coverPrompt = coverResult.data;
      }

      // Step 6+: Generate each chapter
      for (let i = 0; i < updatedBook.chapters.length; i++) {
        const chapter = updatedBook.chapters[i];
        onProgress(
          'chapters',
          (++currentStep / totalSteps) * 100,
          `Writing Chapter ${i + 1}: ${chapter.title}`
        );
        
        const previousChapters = updatedBook.chapters.slice(0, i);
        const result = await this.generateChapter({
          book: updatedBook,
          chapter,
          previousChapters,
        });
        
        if (result.success && result.data) {
          updatedBook.chapters[i] = {
            ...chapter,
            content: result.data,
            wordCount: result.data.split(/\s+/).length,
            status: 'draft',
          };
        }
      }

      // Calculate final word count
      updatedBook.currentWordCount = updatedBook.chapters.reduce(
        (sum, ch) => sum + ch.wordCount,
        0
      );
      updatedBook.status = 'editing';

      return { success: true, data: updatedBook };
    } catch (error) {
      console.error('Full book generation error:', error);
      return { success: false, error: 'Failed to generate book' };
    }
  }

  private getMoodFromHeatLevel(heatLevel: string): string {
    const moods: Record<string, string> = {
      sweet: 'romantic and tender',
      sensual: 'romantic and alluring',
      steamy: 'passionate and seductive',
      scorching: 'intensely passionate and provocative',
    };
    return moods[heatLevel] || 'romantic and sensual';
  }
}

// Export singleton instance
export const aiService = new AIService();
