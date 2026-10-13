'use client';
import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

export default function ClassModal({ isOpen, onClose, selectedClass, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    days: [],
    startTime: '08:00',
    endTime: '09:00',
    room: '',
    instructor: '',
  });

  useEffect(() => {
    if (selectedClass) {
      setFormData(selectedClass);
    } else {
      setFormData({
        id: Date.now().toString(),
        code: '',
        name: '',
        days: ['Mon'],
        startTime: '08:00',
        endTime: '09:00',
        room: '',
        instructor: '',
      });
    }
  }, [selectedClass]);

  if (!isOpen) return null;

  const toggleDay = (day) => {
    const current = formData.days || [];
    setFormData({
      ...formData,
      days: current.includes(day) ? current.filter((d) => d !== day) : [...current, day],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            {selectedClass ? 'Edit Class Details' : 'Add New Class'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Course Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. BSIT 101"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Computer Programming"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Days</label>
            <div className="flex gap-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                    formData.days?.includes(d)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Room / Location</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="Lab 1"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Instructor</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                placeholder="Prof. Smith"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          {selectedClass ? (
            <button
              type="button"
              onClick={() => onDelete(selectedClass.id || selectedClass.code)}
              className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          ) : <div />}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition"
            >
              Save Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}