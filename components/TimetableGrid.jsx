'use client';
import { useState, useEffect } from 'react';
import { formatTo12Hour } from '@/utils/formatTime';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const START_MINUTES = 7 * 60; // 7:00 AM
const END_MINUTES = 20 * 60;  // 8:00 PM
const SLOT_DURATION = 30;     // 30 minutes
const SLOT_HEIGHT = 45;       // Pixels per 30 minutes

const TOTAL_SLOTS = (END_MINUTES - START_MINUTES) / SLOT_DURATION;
const SLOTS = Array.from({ length: TOTAL_SLOTS }, (_, i) => START_MINUTES + i * SLOT_DURATION);

const COLOR_PALETTE = [
  'bg-indigo-50 text-indigo-950 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-100 dark:border-indigo-800',
  'bg-emerald-50 text-emerald-950 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-100 dark:border-emerald-800',
  'bg-amber-50 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-100 dark:border-amber-800',
  'bg-rose-50 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-100 dark:border-rose-800',
  'bg-violet-50 text-violet-950 border-violet-300 dark:bg-violet-950/80 dark:text-violet-100 dark:border-violet-800',
  'bg-sky-50 text-sky-950 border-sky-300 dark:bg-sky-950/80 dark:text-sky-100 dark:border-sky-800',
];

export default function TimetableGrid({ classes, onSelectClass, onAddCustomSlot }) {
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    const dayIndex = new Date().getDay();
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    setTodayStr(dayMap[dayIndex]);
  }, []);

  const timeToMinutes = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  const minutesToTimeString = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const getClassStyle = (startMin, endMin) => {
    const top = ((startMin - START_MINUTES) / SLOT_DURATION) * SLOT_HEIGHT;
    const height = ((endMin - startMin) / SLOT_DURATION) * SLOT_HEIGHT;

    return { 
      top: `${Math.max(0, top)}px`, 
      height: `${Math.max(35, height - 2)}px`
    };
  };

  const formatGapDuration = (totalMinutes) => {
    if (totalMinutes < 60) {
      return `${totalMinutes} mins Break`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (mins === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} Break`;
    }
    return `${hours} hr ${mins} mins Break`;
  };

  const getFreeGapsForDay = (day) => {
    const dayClasses = classes
      .filter((cls) => cls.days.includes(day))
      .map((cls) => ({
        start: timeToMinutes(cls.startTime),
        end: timeToMinutes(cls.endTime),
      }))
      .sort((a, b) => a.start - b.start);

    if (dayClasses.length < 2) return [];

    const gaps = [];
    for (let i = 0; i < dayClasses.length - 1; i++) {
      const currentEnd = dayClasses[i].end;
      const nextStart = dayClasses[i + 1].start;
      const gapDurationMinutes = nextStart - currentEnd;

      if (gapDurationMinutes >= 30) {
        gaps.push({
          startMin: currentEnd,
          endMin: nextStart,
          startTimeStr: minutesToTimeString(currentEnd),
          endTimeStr: minutesToTimeString(nextStart),
          durationText: formatGapDuration(gapDurationMinutes),
        });
      }
    }
    return gaps;
  };

  return (
    <div 
      id="schedule-timetable-view" 
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-x-auto"
    >
      <div className="min-w-[1000px]">
        {/* Days Header */}
        <div className="grid grid-cols-8 gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-3 text-center font-bold text-slate-500">
          <div className="text-left pl-2 text-xs flex items-center">TIME</div>
          {DAYS.map((day) => {
            const isToday = day === todayStr;
            return (
              <div 
                key={day} 
                className={`py-2 rounded-xl uppercase tracking-wider text-xs transition-all ${
                  isToday
                    ? 'bg-indigo-600 text-white shadow-md font-extrabold ring-2 ring-indigo-400 dark:ring-indigo-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {day} {isToday && '• TODAY'}
              </div>
            );
          })}
        </div>

        {/* Timetable Body Canvas */}
        <div className="grid grid-cols-8 gap-3 relative" style={{ height: `${SLOTS.length * SLOT_HEIGHT}px` }}>
          {/* Time Labels Column */}
          <div className="relative h-full text-[11px] font-semibold text-slate-400 select-none">
            {SLOTS.map((min, i) => (
              <div 
                key={min} 
                className={`absolute left-0 right-0 flex items-center border-t ${
                  min % 60 === 0 
                    ? 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold' 
                    : 'border-slate-100/60 dark:border-slate-800/60'
                }`}
                style={{ top: `${i * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
              >
                <span className="-mt-11 bg-white dark:bg-slate-900 pr-1">
                  {formatTo12Hour(minutesToTimeString(min))}
                </span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {DAYS.map((day) => {
            const isToday = day === todayStr;
            const freeGaps = getFreeGapsForDay(day);

            return (
              <div 
                key={day} 
                className={`relative border-l h-full rounded-b-xl transition-colors ${
                  isToday 
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60' 
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                {/* Horizontal Grid Rows */}
                {SLOTS.map((min, i) => (
                  <div 
                    key={i} 
                    className={`absolute left-0 right-0 pointer-events-none border-t ${
                      min % 60 === 0 
                        ? 'border-slate-200/80 dark:border-slate-700/80' 
                        : 'border-slate-100/50 dark:border-slate-800/40'
                    }`}
                    style={{ top: `${i * SLOT_HEIGHT}px`, height: `${SLOT_HEIGHT}px` }}
                  />
                ))}

                {/* Free Time Gap Cards (Formal Styling) */}
                {freeGaps.map((gap, idx) => (
                  <div
                    key={`gap-${idx}`}
                    onClick={() => onAddCustomSlot && onAddCustomSlot(day, gap.startTimeStr, gap.endTimeStr)}
                    style={getClassStyle(gap.startMin, gap.endMin)}
                    className="absolute left-0.5 right-0.5 rounded-xl p-1.5 border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition cursor-pointer flex flex-col items-center justify-center text-center z-0 group"
                  >
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {gap.durationText}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                      + Add Session
                    </span>
                  </div>
                ))}

                {/* Class Cards */}
                {classes
                  .filter((cls) => cls.days.includes(day))
                  .map((cls, idx) => {
                    const colorClass = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                    const startMin = timeToMinutes(cls.startTime);
                    const endMin = timeToMinutes(cls.endTime);

                    return (
                      <div
                        key={cls.id || idx}
                        onClick={() => onSelectClass(cls)}
                        style={getClassStyle(startMin, endMin)}
                        className={`absolute left-0.5 right-0.5 rounded-xl p-2 border transition cursor-pointer shadow-xs block overflow-visible ${colorClass} ${
                          isToday ? 'ring-2 ring-indigo-400/80 shadow-md scale-[1.01] z-10' : 'z-10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-extrabold text-[11px] tracking-tight">{cls.code}</span>
                          {cls.room && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 shrink-0">
                              {cls.room}
                            </span>
                          )}
                        </div>

                        <div 
                          className="text-[10px] font-semibold opacity-90 mb-1" 
                          style={{ lineHeight: '1.2', display: 'block' }}
                        >
                          {cls.name}
                        </div>

                        <div 
                          className="text-[9px] font-medium opacity-80 pt-0.5 border-t border-black/10 dark:border-white/10" 
                          style={{ lineHeight: '1.3' }}
                        >
                          <div>{formatTo12Hour(cls.startTime)} - {formatTo12Hour(cls.endTime)}</div>
                          {cls.instructor && <div className="text-slate-600 dark:text-slate-300 font-normal">{cls.instructor}</div>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}