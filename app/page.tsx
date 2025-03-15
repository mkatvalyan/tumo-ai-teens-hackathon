'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';

export default function Page() {
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'default'>('default');
  const { language, setLanguage, translations: t } = useLanguage();

  useEffect(() => {
    // Check system preference on mount
    if (theme === 'default') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'default') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${
      theme === 'dark' 
        ? 'bg-[#2a1f1a] text-[#f3e4d0]' 
        : 'bg-[#f3e4d0] bg-opacity-90 text-[#5c4434]'
    }`}>
      {/* Enhanced decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-[url('/vintage-paper.svg')] ${
          theme === 'dark' ? 'opacity-10' : 'opacity-30'
        }`}></div>
        
        {/* Animated book stacks */}
        <div className="absolute top-10 left-10 w-40 h-40 opacity-50 transform hover:scale-110 transition-transform duration-500">
          <img src="/book-stack1.svg" alt="decorative books" className="w-full h-full animate-float-slow" />
        </div>
        <div className="absolute top-20 right-20 w-44 h-44 opacity-50 transform hover:scale-110 transition-transform duration-500">
          <img src="/book-stack2.svg" alt="decorative books" className="w-full h-full animate-float-medium" />
        </div>
        <div className="absolute bottom-40 left-20 w-40 h-40 opacity-50 transform hover:scale-110 transition-transform duration-500">
          <img src="/book-stack3.svg" alt="decorative books" className="w-full h-full animate-float-fast" />
        </div>

        {/* Decorative corner flourishes */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-25 transform -rotate-90">
          <svg viewBox="0 0 100 100">
            <path d="M10,10 Q50,10 50,50 T90,90" stroke="#5c4434" fill="none" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-25 transform rotate-0">
          <svg viewBox="0 0 100 100">
            <path d="M90,10 Q50,10 50,50 T10,90" stroke="#5c4434" fill="none" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* Settings button and menu */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`w-12 h-12 rounded-full shadow-lg transition-all border-2 font-serif text-xl flex items-center justify-center transform hover:scale-110 duration-300 group ${
            theme === 'dark'
              ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0] hover:bg-[#a3785e]'
              : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434] hover:bg-[#8b614a]'
          }`}
          aria-label={t?.settings}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {showSettings && (
          <div className={`absolute bottom-16 right-0 w-72 p-4 rounded-lg shadow-xl border-2 backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-[#2a1f1a] border-[#f3e4d0] text-[#f3e4d0]'
              : 'bg-[#f3e4d0] border-[#5c4434] text-[#5c4434]'
          }`}>
            <div className="space-y-6">
              <div>
                <p className="font-serif text-lg mb-3">{t?.theme}</p>
                <div className="flex flex-col gap-2">
                  {(['light', 'dark', 'default'] as const).map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      className={`px-4 py-2 rounded-lg border-2 font-serif text-sm transition-all ${
                        theme === themeOption
                          ? theme === 'dark'
                            ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0]'
                            : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434]'
                          : theme === 'dark'
                            ? 'bg-transparent text-[#f3e4d0] border-[#8b614a] hover:bg-[#8b614a]'
                            : 'bg-transparent text-[#5c4434] border-[#a3785e] hover:bg-[#a3785e] hover:text-[#f3e4d0]'
                      }`}
                    >
                      {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-serif text-lg mb-3">{t?.language}</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 rounded-lg border-2 font-serif text-sm transition-all ${
                      language === 'en'
                        ? theme === 'dark'
                          ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0]'
                          : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434]'
                        : theme === 'dark'
                          ? 'bg-transparent text-[#f3e4d0] border-[#8b614a] hover:bg-[#8b614a]'
                          : 'bg-transparent text-[#5c4434] border-[#a3785e] hover:bg-[#a3785e] hover:text-[#f3e4d0]'
                    }`}
                  >
                    {t?.english}
                  </button>
                  <button
                    onClick={() => setLanguage('am')}
                    className={`px-4 py-2 rounded-lg border-2 font-serif text-sm transition-all ${
                      language === 'am'
                        ? theme === 'dark'
                          ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0]'
                          : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434]'
                        : theme === 'dark'
                          ? 'bg-transparent text-[#f3e4d0] border-[#8b614a] hover:bg-[#8b614a]'
                          : 'bg-transparent text-[#5c4434] border-[#a3785e] hover:bg-[#a3785e] hover:text-[#f3e4d0]'
                    }`}
                  >
                    {t?.armenian}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8 md:p-12 max-w-5xl mx-auto relative -mt-20">
        <div className="text-center transform hover:scale-105 transition-transform duration-700">
          <h1 className="text-7xl font-serif text-[#5c4434] mb-6 relative inline-block">
            <span className="relative z-10">{t?.title}</span>
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-[#a3785e] opacity-40 transform -rotate-1"></div>
          </h1>
          <p className="text-[#8b614a] italic text-xl mt-6 mb-16 font-serif">{t?.subtitle}</p>
        </div>

        <div className="flex justify-center w-full">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link href="/my-library">
                <button className="group w-full md:w-auto px-16 py-8 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-xl hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] text-2xl font-serif relative overflow-hidden transform hover:scale-105 duration-500">
                  <span className="relative z-10">{t?.myLibrary}</span>
                  <div className="absolute inset-0 bg-[#5c4434] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out opacity-20"></div>
                </button>
              </Link>
              <Link href="/im-the-author">
                <button className="group w-full md:w-auto px-16 py-8 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-xl hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] text-2xl font-serif relative overflow-hidden transform hover:scale-105 duration-500">
                  <span className="relative z-10">{t?.imTheAuthor}</span>
                  <div className="absolute inset-0 bg-[#5c4434] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out opacity-20"></div>
                </button>
              </Link>
              <Link href="/book-videos">
                <button className="group w-full md:w-auto px-16 py-8 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-xl hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] text-2xl font-serif relative overflow-hidden transform hover:scale-105 duration-500">
                  <span className="relative z-10">{t?.bookVideos}</span>
                  <div className="absolute inset-0 bg-[#5c4434] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out opacity-20"></div>
                </button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col md:flex-row gap-6">
                <Link href="/bookstore">
                  <button className="group w-full md:w-auto px-16 py-8 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-xl hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] text-2xl font-serif relative overflow-hidden transform hover:scale-105 duration-500">
                    <span className="relative z-10">{t?.bookstore}</span>
                    <div className="absolute inset-0 bg-[#5c4434] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out opacity-20"></div>
                  </button>
                </Link>
                <Link href="/author-info">
                  <button className="group w-full md:w-auto px-16 py-8 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-xl hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] text-2xl font-serif relative overflow-hidden transform hover:scale-105 duration-500">
                    <span className="relative z-10">{t?.behindStory}</span>
                    <div className="absolute inset-0 bg-[#5c4434] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out opacity-20"></div>
                  </button>
                </Link>
                <Link href="/character-creator">
                  <button className="group w-full md:w-auto px-16 py-8 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-xl hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] text-2xl font-serif relative overflow-hidden transform hover:scale-105 duration-500">
                    <span className="relative z-10">{t?.who}</span>
                    <div className="absolute inset-0 bg-[#5c4434] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out opacity-20"></div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
