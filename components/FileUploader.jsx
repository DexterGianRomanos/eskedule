'use client';
import { useState } from 'react';
import { Upload, Camera, Sparkles, Loader2 } from 'lucide-react';

export default function FileUploader({ onScanComplete, openCamera }) {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        const mimeType = file.type;

        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data, mimeType }),
        });

        const data = await res.json();
        if (data.classes) {
          onScanComplete(data.classes);
        } else {
          alert('Could not parse schedule. Try a clearer image.');
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Error reading file');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-xl p-8 text-center bg-indigo-50/50 dark:bg-slate-900/40">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="font-medium text-slate-700 dark:text-slate-200">
              Gemini AI is scanning your schedule...
            </p>
            <p className="text-xs text-slate-400">Extracting courses, times, and rooms</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Scan or Upload Schedule
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-6">
              Drop your class schedule image, PDF, or syllabus. Eskedule will convert it into an interactive timetable.
            </p>

            <div className="flex flex-wrap items-center gap-3 justify-center">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition shadow-sm">
                <Upload className="w-4 h-4" />
                Upload Image / PDF
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
              </label>

              <button
                onClick={openCamera}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-sm transition"
              >
                <Camera className="w-4 h-4" />
                Use Camera
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}