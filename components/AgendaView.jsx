'use client';
import { formatTo12Hour } from '@/utils/formatTime';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AgendaView({ classes, onSelectClass }) {
  return (
    <div id="schedule-timetable-view" className="space-y-4">
      {DAYS.map((day) => {
        const dayClasses = classes.filter((cls) => cls.days.includes(day));
        if (dayClasses.length === 0) return null;

        return (
          <div key={day} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-sm text-indigo-600 dark:text-indigo-400 border-b pb-2 mb-3 border-slate-100 dark:border-slate-700">
              {day}
            </h3>
            <div className="space-y-2">
              {dayClasses.map((cls, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectClass(cls)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-indigo-50/50 dark:hover:bg-slate-700 cursor-pointer transition border border-slate-100 dark:border-slate-700"
                >
                  <div>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{cls.code}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{cls.name}</span>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Room: {cls.room || 'TBA'} • Instructor: {cls.instructor || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
                    {formatTo12Hour(cls.startTime)} - {formatTo12Hour(cls.endTime)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}