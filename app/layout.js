import './globals.css';
import Header from '@/components/Header'; // or your header component path

export const metadata = {
  title: 'Eskedule - AI Schedule Scanner & Organizer',
  description: 'Scan your schedule picture or PDF using Gemini AI and turn it into an interactive timetable.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Eskedule',
  },
};

export const viewport = {
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/LOGOS.png" />
      </head>
      <body className="min-h-screen flex flex-col justify-between antialiased bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        
        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 px-6 mt-8 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} Eskedule. All rights reserved.</p>
            <p className="font-medium">
              Developed by <span className="font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Dexqt</span>
            </p>
          </div>
        </footer>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}