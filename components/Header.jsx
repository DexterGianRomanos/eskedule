'use client';
import Image from 'next/image';
import { Moon, Sun, Download, Image as ImageIcon, Plus } from 'lucide-react';
import InstallPwaButton from './InstallPwaButton';

export default function Header({ darkMode, setDarkMode, onExportIcs, onExportImage, onAddClass }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
            <Image
              src="/LOGOS.png"
              alt="Eskedule Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent leading-tight">
              Eskedule
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">AI Student Schedule Scanner</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {/* PWA Install Button */}
          <InstallPwaButton />

          <button
            onClick={onAddClass}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> 
            <span>Add Class</span>
          </button>
          
          <button
            onClick={onExportImage}
            title="Export PNG"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition shrink-0"
          >
            <ImageIcon className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">PNG</span>
          </button>

          <button
            onClick={onExportIcs}
            title="Export ICS"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">.ICS</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}