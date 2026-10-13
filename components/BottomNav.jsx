'use client';
import { Calendar, List, Camera, Plus } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onOpenScanner, onAddClass }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center justify-between">
      <button
        onClick={() => setActiveTab('grid')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
          activeTab === 'grid' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
        }`}
      >
        <Calendar className="w-5 h-5" />
        Timetable
      </button>

      <button
        onClick={onOpenScanner}
        className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-indigo-600 text-white shadow-lg ring-4 ring-white dark:ring-slate-900 active:scale-95 transition"
      >
        <Camera className="w-6 h-6" />
      </button>

      <button
        onClick={onAddClass}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition"
      >
        <Plus className="w-5 h-5" />
        Add Class
      </button>
    </div>
  );
}