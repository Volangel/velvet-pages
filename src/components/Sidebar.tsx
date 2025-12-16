'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Users,
  ImageIcon,
  FileDown,
  Settings,
  Feather,
  Heart,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Story Generator', href: '/generator', icon: Sparkles },
  { name: 'My Books', href: '/books', icon: BookOpen },
  { name: 'Market Research', href: '/research', icon: TrendingUp },
];

const tools = [
  { name: 'Character Builder', href: '/characters', icon: Users },
  { name: 'Cover Designer', href: '/covers', icon: ImageIcon },
  { name: 'Export & Publish', href: '/export', icon: FileDown },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-noir-900/80 backdrop-blur-xl border-r border-noir-700/50 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-noir-700/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-velvet-500 to-velvet-700 flex items-center justify-center glow-soft">
            <Feather className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">
              Velvet Pages
            </h1>
            <p className="text-xs text-noir-400">KDP Erotica Creator</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 mb-6">
          <h2 className="text-xs font-semibold text-noir-500 uppercase tracking-wider mb-3 px-3">
            Create
          </h2>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive 
                        ? 'active text-white' 
                        : 'text-noir-400 hover:text-white'
                    )}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-velvet-400' : ''
                    )} />
                    {item.name}
                    {item.name === 'Market Research' && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-4">
          <h2 className="text-xs font-semibold text-noir-500 uppercase tracking-wider mb-3 px-3">
            Tools
          </h2>
          <ul className="space-y-1">
            {tools.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive 
                        ? 'active text-white' 
                        : 'text-noir-400 hover:text-white'
                    )}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 transition-colors',
                      isActive ? 'text-velvet-400' : ''
                    )} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-noir-700/50">
        <div className="card-noir rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-semibold">Profit Tips</span>
          </div>
          <ul className="text-xs text-noir-400 space-y-1">
            <li>• Series = 3x more revenue</li>
            <li>• KU + purchases = max income</li>
            <li>• Publish every 4-6 weeks</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
