'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Camera, RefreshCw } from 'lucide-react';

export default function CameraModal({ isOpen, onClose, onCapture }) {
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    let activeStream = null;

    if (isOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((mediaStream) => {
          activeStream = mediaStream;
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error('Camera Access Error:', err);
          alert('Unable to access camera. Please check permissions or HTTP/HTTPS settings.');
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    onClose();
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    setIsScanning(true);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType: 'image/jpeg' }),
      });

      const data = await res.json();

      if (data.classes && Array.isArray(data.classes)) {
        onCapture(data.classes);
        handleClose();
      } else {
        alert(data.error || 'Could not parse schedule from captured image.');
      }
    } catch (err) {
      console.error('Camera Upload Error:', err);
      alert('Failed to process camera image.');
    } finally {
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Scan Schedule with Camera
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center">
          {isScanning ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Gemini AI is analyzing your captured schedule...
              </p>
            </div>
          ) : (
            <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => videoRef.current?.play()}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {!isScanning && (
          <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCapture}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" /> Capture & Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
