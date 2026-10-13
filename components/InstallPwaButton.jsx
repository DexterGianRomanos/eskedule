'use client';
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide if already running inside standalone app mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("To install Eskedule: Tap your browser's menu (⋮) and select 'Add to Home screen' or 'Install App'.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // Shows button even if browser hasn't fired beforeinstallprompt yet
  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition shrink-0"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install App</span>
    </button>
  );
}