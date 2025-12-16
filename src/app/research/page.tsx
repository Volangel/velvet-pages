'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Flame,
  Star,
  AlertCircle,
  Check,
  BookOpen,
  Zap,
  Users,
  Award,
} from 'lucide-react';
import { PROFITABLE_NICHES, TROPES, PRICING_GUIDE, NicheData } from '@/types';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';

export default function ResearchPage() {
  const [selectedNiche, setSelectedNiche] = useState<string>('Dark Romance');
  
  const niche = PROFITABLE_NICHES[selectedNiche];
  
  const popularityColors = {
    trending: 'text-green-400 bg-green-500/20',
    growing: 'text-blue-400 bg-blue-500/20',
    stable: 'text-yellow-400 bg-yellow-500/20',
    saturated: 'text-red-400 bg-red-500/20',
  };
  
  const competitionColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  const sortedNiches = Object.entries(PROFITABLE_NICHES).sort((a, b) => {
    const order = { trending: 0, growing: 1, stable: 2, saturated: 3 };
    return order[a[1].popularity] - order[b[1].popularity];
  });

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
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            Market Research
          </h1>
          <p className="text-noir-400">
            Discover profitable niches, trending tropes, and optimize your books for maximum sales
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {/* Niche List */}
          <div className="col-span-1 space-y-4">
            <div className="card-noir rounded-xl p-4">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-velvet-400" />
                Profitable Niches
              </h2>
              <div className="space-y-2">
                {sortedNiches.map(([name, data]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedNiche(name)}
                    className={cn(
                      'w-full p-3 rounded-lg text-left transition-all flex items-center justify-between',
                      selectedNiche === name
                        ? 'bg-velvet-600/20 border border-velvet-500'
                        : 'bg-noir-800/50 border border-transparent hover:border-noir-600'
                    )}
                  >
                    <span className="text-sm font-medium text-white">{name}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full capitalize',
                      popularityColors[data.popularity]
                    )}>
                      {data.popularity}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="card-noir rounded-xl p-4">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-velvet-400" />
                Top Performer Tips
              </h2>
              <ul className="space-y-3 text-sm text-noir-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Series outperform standalones 3:1</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>KU earns ~$0.004-0.005 per page read</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>First-in-series at $0.99-2.99 hooks readers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Cover + blurb = 80% of purchase decision</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Publish consistently (every 4-6 weeks)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Niche Details */}
          <div className="col-span-2 space-y-6">
            {niche && (
              <>
                {/* Niche Overview */}
                <motion.div
                  key={selectedNiche}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-noir rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white mb-2">
                        {selectedNiche}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'text-sm px-3 py-1 rounded-full capitalize',
                          popularityColors[niche.popularity]
                        )}>
                          {niche.popularity === 'trending' && <Flame className="w-3.5 h-3.5 inline mr-1" />}
                          {niche.popularity}
                        </span>
                        <span className="text-sm text-noir-400">
                          Competition: <span className={competitionColors[niche.competition]}>{niche.competition}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">${niche.avgPrice}</div>
                      <div className="text-xs text-noir-400">Avg. Price</div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-noir-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-noir-400 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs">Word Count Target</span>
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {(niche.recommendedWordCount.min / 1000).toFixed(0)}k - {(niche.recommendedWordCount.max / 1000).toFixed(0)}k
                      </div>
                    </div>
                    <div className="bg-noir-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-noir-400 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">KU Popular</span>
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {niche.kuPopular ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <Check className="w-5 h-5" /> Yes
                          </span>
                        ) : (
                          <span className="text-red-400">No</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-noir-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-noir-400 mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs">Est. Monthly (10 books)</span>
                      </div>
                      <div className="text-lg font-semibold text-green-400">
                        ${(niche.avgPrice * 0.7 * 30 * 10).toFixed(0)}-${(niche.avgPrice * 0.7 * 100 * 10).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-velvet-400" />
                      Success Tips for {selectedNiche}
                    </h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {niche.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-noir-300 bg-noir-800/30 rounded-lg p-3"
                        >
                          <Star className="w-4 h-4 text-velvet-400 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Top Keywords */}
                  <div>
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-velvet-400" />
                      Top Keywords to Use
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {niche.topKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-velvet-600/20 border border-velvet-500/30 rounded-full text-sm text-velvet-300"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Tropes Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card-noir rounded-xl p-6"
                >
                  <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-velvet-400" />
                    Trending Tropes That Sell
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-noir-400 mb-3">Relationship Tropes</h3>
                      <div className="flex flex-wrap gap-2">
                        {TROPES.relationship.map((trope, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-xs text-pink-300"
                          >
                            {trope}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-noir-400 mb-3">Character Tropes</h3>
                      <div className="flex flex-wrap gap-2">
                        {TROPES.character.map((trope, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-300"
                          >
                            {trope}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-noir-400 mb-3">Situation Tropes</h3>
                      <div className="flex flex-wrap gap-2">
                        {TROPES.situation.map((trope, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300"
                          >
                            {trope}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-noir-400 mb-3">Spicy Tropes 🔥</h3>
                      <div className="flex flex-wrap gap-2">
                        {TROPES.spicy.map((trope, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300"
                          >
                            {trope}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Pricing Guide */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card-noir rounded-xl p-6"
                >
                  <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-velvet-400" />
                    Pricing Strategy Guide
                  </h2>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {Object.entries(PRICING_GUIDE).filter(([key]) => key !== 'kuBonus').map(([key, data]) => {
                      if (typeof data === 'string') return null;
                      return (
                        <div key={key} className="bg-noir-800/50 rounded-lg p-4">
                          <div className="text-xs text-noir-400 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-xl font-bold text-green-400 mb-1">
                            ${data.recommended}
                          </div>
                          <div className="text-xs text-noir-500">
                            {(data.wordCount.min / 1000).toFixed(0)}k-{(data.wordCount.max / 1000).toFixed(0)}k words
                          </div>
                          <div className="text-xs text-noir-500">
                            Range: ${data.min}-${data.max}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-velvet-600/10 border border-velvet-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-velvet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white mb-1">Kindle Unlimited Strategy</h3>
                        <p className="text-sm text-noir-300">
                          {PRICING_GUIDE.kuBonus} For a 60,000 word book, that's approximately $240-$300 per full read-through. 
                          Combined with purchases, KU can significantly boost income.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

