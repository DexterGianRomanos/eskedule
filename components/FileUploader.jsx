'use client';
import { useState } from 'react';
import { Upload, Camera, Sparkles, Loader2 } from 'lucide-react';

export default function FileUploader({ onScanComplete, openCamera }) {
  const [loading, setLoading] = useState(false);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB. Please upload a smaller image or PDF.');
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const dataUrl = await convertFileToBase64(file);
      const base64Data = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/jpeg';

      if (!base64Data) {
        throw new Error('Failed to read file contents.');
      }

      // Perform API request
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error while parsing schedule');
      }

      // Calculate elapsed time and enforce a minimum 3-second loader display
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 3000; // 3000ms = 3 seconds
      if (elapsedTime < minLoadingTime) {
        await new Promise((resolve) => setTimeout(resolve, minLoadingTime - elapsedTime));
      }

      if (data.classes && Array.isArray(data.classes) && data.classes.length > 0) {
        onScanComplete(data.classes);
      } else {
        alert('Could not find any clear schedule data. Try a clearer image or document.');
      }
    } catch (err) {
      console.error('File Upload Error:', err);
      alert(err.message || 'Error processing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-xl p-8 text-center bg-indigo-50/50 dark:bg-slate-900/40">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-6 animate-fade-in">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="font-semibold text-base text-slate-800 dark:text-slate-100">
              Gemini AI is scanning your schedule...
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analyzing timetable layout, course codes, and room assignments
            </p>
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
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      handleFileUpload(selectedFile);
                      e.target.value = '';
                    }
                  }}
                />
              </label>

              <button
                type="button"
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