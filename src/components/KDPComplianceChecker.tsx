'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Book } from '@/types';
import { cn } from '@/lib/utils';

interface KDPComplianceCheckerProps {
  book: Book;
}

interface ComplianceIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  details: string;
  fix?: string;
}

// Forbidden terms that will get books banned or flagged
const FORBIDDEN_PATTERNS = {
  absoluteForbidden: [
    // Age-related
    /\b(underage|minor|child|children|kid|kids|teen|teenager|teenage|adolescent|youth|juvenile|preteen|pre-teen)\b/gi,
    /\b(schoolgirl|school\s*girl|school\s*boy|schoolboy)\b/gi,
    /\b(\d{1,2}\s*years?\s*old|\d{1,2}\s*y\/o)\b/gi,
    // Illegal activities
    /\b(bestiality|zoophilia)\b/gi,
    /\b(incest|incestuous)\b/gi,
    /\b(pedophil|paedophil)\b/gi,
  ],
  highRisk: [
    // Non-consent patterns
    /\b(rape|raped|raping|rapist)\b/gi,
    /\b(non-?consensual|non-?consent)\b/gi,
    /\b(force[sd]?\s+(?:sex|intercourse|himself|herself))\b/gi,
    // Related terms
    /\b(snuff|necrophilia)\b/gi,
    // Drug-related in sexual context
    /\b(drugged|roofie|roofied)\b/gi,
  ],
  metadataRisky: [
    // Words that shouldn't be in title/description but okay in content
    /\b(explicit|xxx|porn|pornographic|hardcore)\b/gi,
    /\b(taboo|forbidden|wrong|filthy|dirty|nasty|slutty|whore)\b/gi,
    /\b(virgin|virginity|deflower|cherry)\b/gi,
  ],
};

// Terms that indicate content warnings should be present
const REQUIRES_WARNING = [
  { pattern: /\b(dubcon|dub-?con|dubious consent)\b/gi, warning: 'Dubious Consent' },
  { pattern: /\b(non-?con)\b/gi, warning: 'Dark Themes' },
  { pattern: /\b(bdsm|bondage|dominat|submissi|sadis|masochis)\b/gi, warning: 'BDSM Elements' },
  { pattern: /\b(captive|kidnap|abduct|imprison)\b/gi, warning: 'Captivity' },
  { pattern: /\b(stalk|stalking|stalker|obsess)\b/gi, warning: 'Stalking' },
  { pattern: /\b(breed|impregnate|pregnant|pregnancy)\b/gi, warning: 'Pregnancy/Breeding' },
  { pattern: /\b(age\s*gap|older\s*man|younger\s*woman|daddy)\b/gi, warning: 'Age Gap' },
  { pattern: /\b(power\s*dynamic|power\s*imbalance|boss|employee)\b/gi, warning: 'Power Imbalance' },
  { pattern: /\b(degrad|humiliat)\b/gi, warning: 'Degradation' },
  { pattern: /\b(chok|breath\s*play|asphyxia)\b/gi, warning: 'Breath Play' },
  { pattern: /\b(multiple|threesome|foursome|group|gangbang|orgy)\b/gi, warning: 'Multiple Partners' },
  { pattern: /\b(public|exhibit|voyeur|watch)\b/gi, warning: 'Public Acts' },
];

export default function KDPComplianceChecker({ book }: KDPComplianceCheckerProps) {
  const [issues, setIssues] = useState<ComplianceIssue[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkCompliance = () => {
    setIsChecking(true);
    const foundIssues: ComplianceIssue[] = [];
    
    // Combine all text to check
    const allContent = book.chapters.map(ch => ch.content).join(' ');
    const metadata = `${book.title} ${book.synopsis} ${book.metadata.description}`;
    const keywords = book.metadata.keywords.join(' ');
    
    // Check for absolutely forbidden content
    FORBIDDEN_PATTERNS.absoluteForbidden.forEach(pattern => {
      const metadataMatches = metadata.match(pattern);
      const contentMatches = allContent.match(pattern);
      
      if (metadataMatches || contentMatches) {
        foundIssues.push({
          type: 'error',
          category: 'Forbidden Content',
          message: 'Contains potentially prohibited content',
          details: `Found: "${(metadataMatches || contentMatches)?.[0]}" - This type of content is strictly prohibited on KDP and will result in immediate rejection or account termination.`,
          fix: 'Remove or rewrite content to comply with KDP guidelines. Ensure all characters are clearly adults (18+).',
        });
      }
    });

    // Check for high-risk content
    FORBIDDEN_PATTERNS.highRisk.forEach(pattern => {
      const metadataMatches = metadata.match(pattern);
      
      if (metadataMatches) {
        foundIssues.push({
          type: 'error',
          category: 'High-Risk Metadata',
          message: 'High-risk term in title/description',
          details: `Found: "${metadataMatches[0]}" in your metadata. This term should NOT appear in title, description, or keywords.`,
          fix: 'Remove this term from title and description. If the content contains these themes, ensure proper content warnings are included.',
        });
      }
    });

    // Check for risky metadata terms
    FORBIDDEN_PATTERNS.metadataRisky.forEach(pattern => {
      const titleMatch = book.title.match(pattern);
      const keywordMatch = keywords.match(pattern);
      
      if (titleMatch) {
        foundIssues.push({
          type: 'warning',
          category: 'Risky Title',
          message: 'Title contains flagged term',
          details: `"${titleMatch[0]}" in title may trigger content filters and reduce visibility.`,
          fix: 'Consider using more subtle language in the title.',
        });
      }
      
      if (keywordMatch) {
        foundIssues.push({
          type: 'warning',
          category: 'Risky Keywords',
          message: 'Keywords contain flagged term',
          details: `"${keywordMatch[0]}" in keywords may cause issues.`,
          fix: 'Replace with less explicit synonyms.',
        });
      }
    });

    // Check for missing content warnings
    const allText = `${metadata} ${allContent}`;
    REQUIRES_WARNING.forEach(({ pattern, warning }) => {
      if (pattern.test(allText) && !book.metadata.contentWarnings.includes(warning)) {
        foundIssues.push({
          type: 'warning',
          category: 'Missing Content Warning',
          message: `Consider adding "${warning}" warning`,
          details: `Your content appears to contain ${warning.toLowerCase()} themes but this isn't listed in content warnings.`,
          fix: `Add "${warning}" to your content warnings for transparency.`,
        });
      }
    });

    // Check metadata completeness
    if (book.metadata.description.length < 100) {
      foundIssues.push({
        type: 'info',
        category: 'Optimization',
        message: 'Description too short',
        details: 'Short descriptions convert poorly. Aim for 500-2000 characters.',
        fix: 'Expand your description with hook, conflict, tropes, and call to action.',
      });
    }

    if (book.metadata.keywords.filter(k => k.length > 0).length < 7) {
      foundIssues.push({
        type: 'info',
        category: 'Optimization',
        message: 'Not using all 7 keyword slots',
        details: 'You\'re leaving discoverability on the table!',
        fix: 'Fill all 7 keyword slots with relevant search terms.',
      });
    }

    if (!book.coverImage) {
      foundIssues.push({
        type: 'warning',
        category: 'Missing Cover',
        message: 'No cover image uploaded',
        details: 'Cover is 50%+ of the purchase decision. Books without covers get almost no sales.',
        fix: 'Upload a professional, genre-appropriate cover.',
      });
    }

    if (book.metadata.categories.length < 2) {
      foundIssues.push({
        type: 'info',
        category: 'Optimization',
        message: 'Not using both category slots',
        details: 'You can select 2 categories for better discoverability.',
        fix: 'Select 2 relevant categories.',
      });
    }

    // Check if enrolled in KU without proper pricing
    if (book.metadata.enrollKU && (book.metadata.price < 2.99 || book.metadata.price > 9.99)) {
      foundIssues.push({
        type: 'info',
        category: 'Pricing',
        message: 'Suboptimal pricing for KU',
        details: `Books in KU priced at $${book.metadata.price} only earn 35% royalty. Price between $2.99-$9.99 for 70%.`,
        fix: 'Consider adjusting price to $2.99-$4.99 range.',
      });
    }

    // AI content disclosure check
    foundIssues.push({
      type: 'info',
      category: 'Disclosure',
      message: 'AI Content Disclosure Required',
      details: 'Amazon requires disclosure if AI tools were used to generate text or images.',
      fix: 'When publishing, check the AI-generated content box if applicable.',
    });

    setIssues(foundIssues);
    setIsChecking(false);
  };

  useEffect(() => {
    checkCompliance();
  }, [book]);

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;

  const overallStatus = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'good';

  return (
    <div className="card-noir rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-noir-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            overallStatus === 'error' ? 'bg-red-500/20' :
            overallStatus === 'warning' ? 'bg-yellow-500/20' :
            'bg-green-500/20'
          )}>
            <Shield className={cn(
              'w-5 h-5',
              overallStatus === 'error' ? 'text-red-400' :
              overallStatus === 'warning' ? 'text-yellow-400' :
              'text-green-400'
            )} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">KDP Compliance Check</h3>
            <p className="text-xs text-noir-400">
              {errorCount > 0 ? `${errorCount} critical issue${errorCount > 1 ? 's' : ''}` :
               warningCount > 0 ? `${warningCount} warning${warningCount > 1 ? 's' : ''}` :
               'Looking good!'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            {errorCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-400">
                <XCircle className="w-3 h-3" /> {errorCount}
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                <AlertTriangle className="w-3 h-3" /> {warningCount}
              </span>
            )}
            {infoCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                <Info className="w-3 h-3" /> {infoCount}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-noir-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-noir-400" />
          )}
        </div>
      </button>

      {/* Issues List */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-noir-700/50"
        >
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {issues.length === 0 ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">All checks passed!</span>
              </div>
            ) : (
              issues.map((issue, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-lg',
                    issue.type === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                    issue.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                    'bg-blue-500/10 border border-blue-500/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {issue.type === 'error' ? (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    ) : issue.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          issue.type === 'error' ? 'bg-red-500/20 text-red-300' :
                          issue.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        )}>
                          {issue.category}
                        </span>
                        <span className="text-sm font-medium text-white">{issue.message}</span>
                      </div>
                      <p className="text-xs text-noir-300 mb-2">{issue.details}</p>
                      {issue.fix && (
                        <p className="text-xs text-noir-400">
                          <strong className="text-noir-300">Fix:</strong> {issue.fix}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Tips */}
          <div className="p-4 border-t border-noir-700/50 bg-noir-800/30">
            <h4 className="text-xs font-semibold text-noir-300 mb-2">KDP Erotica Rules Summary</h4>
            <ul className="text-xs text-noir-400 space-y-1">
              <li>• All characters must be clearly 18+ (state this explicitly)</li>
              <li>• No explicit terms in title, subtitle, or cover</li>
              <li>• Use Romance categories instead of Erotica for more visibility</li>
              <li>• Include content warnings for dark themes</li>
              <li>• Disclose AI-generated content when publishing</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}

