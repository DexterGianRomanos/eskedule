'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FileUploader from '@/components/FileUploader';
import CameraModal from '@/components/CameraModal';
import TimetableGrid from '@/components/TimetableGrid';
import AgendaView from '@/components/AgendaView';
import ClassModal from '@/components/ClassModal';
import ConflictBanner from '@/components/ConflictBanner';
import Mascot from '@/components/Mascot';
import { checkConflicts } from '@/utils/parseSchedule';
import { downloadICS } from '@/utils/exportIcs';
import { LayoutGrid, List } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [classes, setClasses] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const conflicts = checkConflicts(classes);

  const handleScanComplete = (scannedClasses) => {
    const rawList = Array.isArray(scannedClasses)
      ? scannedClasses
      : scannedClasses?.classes || [];

    if (!Array.isArray(rawList) || rawList.length === 0) {
      alert('No valid classes extracted. Please try another image.');
      return;
    }

    const mapped = rawList.map((c, i) => ({ ...c, id: Date.now() + i }));
    setClasses(mapped);
  };

  const handleExportImage = async () => {
    const el = document.getElementById('schedule-timetable-view');
    if (!el) return;
    
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        logging: false,
        windowWidth: el.scrollWidth + 50,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'Eskedule_Class_Schedule.png';
      link.click();
    } catch (e) {
      console.error('Failed to export schedule image:', e);
      alert('Could not export PNG image.');
    }
  };

  const handleSaveClass = (updatedClass) => {
    if (selectedClass) {
      setClasses(classes.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
    } else {
      setClasses([...classes, { ...updatedClass, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const handleDeleteClass = (id) => {
    setClasses(classes.filter((c) => c.id !== id));
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12 relative">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onExportIcs={() => downloadICS(classes)}
        onExportImage={handleExportImage}
        onAddClass={() => {
          setSelectedClass(null);
          setIsModalOpen(true);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6 space-y-6">
        <FileUploader
          onScanComplete={handleScanComplete}
          openCamera={() => setIsCameraOpen(true)}
        />

        <ConflictBanner conflicts={conflicts} />

        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500">
            Total Classes: <span className="font-bold text-slate-800 dark:text-slate-100">{classes.length}</span>
          </div>

          <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Timetable
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                viewMode === 'agenda'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <List className="w-4 h-4" /> Agenda
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <TimetableGrid
            classes={classes}
            onSelectClass={(cls) => {
              setSelectedClass(cls);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <AgendaView
            classes={classes}
            onSelectClass={(cls) => {
              setSelectedClass(cls);
              setIsModalOpen(true);
            }}
          />
        )}
      </main>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleScanComplete}
      />

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClass(null);
        }}
        selectedClass={selectedClass}
        onSave={handleSaveClass}
        onDelete={handleDeleteClass}
      />

      <Mascot hasConflicts={conflicts.length > 0} classCount={classes.length} />
    </div>
  );
}
