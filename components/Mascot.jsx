'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Mascot({ hasConflicts, classCount }) {
  const [message, setMessage] = useState("Hi! I'm Eddy. Upload your schedule to get started!");
  const [mood, setMood] = useState('idle');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (hasConflicts) {
      setMessage('Watch out! I noticed a schedule conflict in your classes.');
      setMood('warning');
    } else if (classCount > 0) {
      setMessage(`Awesome! You have ${classCount} classes scheduled cleanly.`);
      setMood('happy');
    } else {
      setMessage("Hi! Drop a schedule image or take a photo to organize your classes!");
      setMood('idle');
    }
  }, [hasConflicts, classCount]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 max-w-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 pointer-events-auto relative text-xs font-medium flex items-start gap-2.5"
          >
            {mood === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
            {mood === 'happy' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
            {mood === 'idle' && <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />}

            <span>{message}</span>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 text-[10px]"
            >
              ?
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 pointer-events-auto cursor-pointer transition-colors ${
          mood === 'warning'
            ? 'bg-amber-500 border-amber-300 text-white'
            : mood === 'happy'
            ? 'bg-emerald-500 border-emerald-300 text-white'
            : 'bg-indigo-600 border-indigo-400 text-white'
        }`}
      >
        <Bot className="w-7 h-7" />
      </motion.button>
    </div>
  );
}
