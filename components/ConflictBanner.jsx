'use client';
import { AlertTriangle } from 'lucide-react';

export default function ConflictBanner({ conflicts }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 text-amber-900 dark:text-amber-200">
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-sm">Schedule Overlap Detected!</h4>
        <div className="text-xs space-y-1 mt-1">
          {conflicts.map((conf, i) => (
            <p key={i}>
              <strong className="font-medium">{conf.classA.code}</strong> overlaps with{' '}
              <strong className="font-medium">{conf.classB.code}</strong> on {conf.days.join(', ')}.
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}