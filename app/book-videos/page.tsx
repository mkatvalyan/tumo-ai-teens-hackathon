'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function BookVideos() {
  const { translations: t } = useLanguage();
  const [bookTitle, setBookTitle] = useState('');
  const [videoData, setVideoData] = useState<{ videoId: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setVideoData(null);

    try {
      const searchQuery = encodeURIComponent(`${bookTitle} book review summary discussion`);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=AIzaSyCdyNtNjKuvYCcTN0XNDeBjDUSfy3GUpnA&maxResults=1&type=video`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        setVideoData({
          videoId: data.items[0].id.videoId,
          title: data.items[0].snippet.title
        });
      } else {
        setError(t.noVideosFound);
      }
    } catch (err) {
      setError(t.fetchError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${
      theme === 'dark' 
        ? 'bg-[#2a1f1a] text-[#f3e4d0]' 
        : 'bg-[#f3e4d0] bg-opacity-90 text-[#5c4434]'
    }`}>
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-[url('/vintage-paper.svg')] ${
          theme === 'dark' ? 'opacity-10' : 'opacity-30'
        }`}></div>
        
        {/* Animated book stacks */}
        <div className="absolute top-10 left-10 w-40 h-40 opacity-50 transform hover:scale-110 transition-transform duration-500">
          <img src="/book-stack1.svg" alt={t.decorativeBooks} className="w-full h-full animate-float-slow" />
        </div>
        <div className="absolute top-20 right-20 w-44 h-44 opacity-50 transform hover:scale-110 transition-transform duration-500">
          <img src="/book-stack2.svg" alt={t.decorativeBooks} className="w-full h-full animate-float-medium" />
        </div>

        {/* Decorative corner flourishes */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-25 transform -rotate-90">
          <svg viewBox="0 0 100 100">
            <path d="M10,10 Q50,10 50,50 T90,90" stroke="currentColor" fill="none" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-25 transform rotate-0">
          <svg viewBox="0 0 100 100">
            <path d="M90,10 Q50,10 50,50 T10,90" stroke="currentColor" fill="none" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto p-8 md:p-12 relative">
        {/* Back button */}
        <Link href="/">
          <button className={`mb-12 hover:text-[#8b614a] transition-colors duration-300 font-serif flex items-center gap-2 text-lg transform hover:translate-x-1`}>
            <span>←</span> {t.backToLibrary}
          </button>
        </Link>

        {/* Settings button and menu */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-12 h-12 rounded-full shadow-lg transition-all border-2 font-serif text-xl flex items-center justify-center transform hover:scale-110 duration-300 group ${
              theme === 'dark'
                ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0] hover:bg-[#a3785e]'
                : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434] hover:bg-[#8b614a]'
            }`}
            aria-label={t.settings}
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
            <div className={`absolute bottom-16 right-0 w-64 p-4 rounded-lg shadow-xl border-2 backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-[#2a1f1a] border-[#f3e4d0] text-[#f3e4d0]'
                : 'bg-[#f3e4d0] border-[#5c4434] text-[#5c4434]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-serif">{t.theme}</span>
                <button
                  onClick={toggleTheme}
                  className={`px-4 py-2 rounded-lg border font-serif text-sm transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0] hover:bg-[#a3785e]'
                      : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434] hover:bg-[#8b614a]'
                  }`}
                >
                  {theme === 'light' ? t.switchToDark : t.switchToLight}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-6 relative inline-block">
            <span className="relative z-10">{t.bookVideos}</span>
            <div className={`absolute -bottom-3 left-0 right-0 h-1 bg-current opacity-40 transform -rotate-1`}></div>
          </h1>
          <p className="italic font-serif text-xl">{t.findVideoReviews}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`rounded-xl p-8 md:p-10 shadow-xl border-2 relative backdrop-blur-sm transform hover:shadow-2xl transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-[#2a1f1a] border-[#f3e4d0]'
              : 'bg-[#f3e4d0] border-[#a3785e] bg-opacity-95'
          }`}>
            <div className="space-y-6">
              <div>
                <label htmlFor="bookTitle" className="block font-serif mb-4 text-lg">
                  {t.enterBookTitle}
                </label>
                <input
                  type="text"
                  id="bookTitle"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder={t.enterBookTitlePlaceholder}
                  className={`w-full p-4 rounded-lg border-2 font-serif focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-[#3a2f2a] border-[#f3e4d0] text-[#f3e4d0] placeholder-[#a3785e] focus:ring-[#a3785e]'
                      : 'bg-white border-[#a3785e] text-[#5c4434] placeholder-[#a3785e] focus:ring-[#8b614a]'
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!bookTitle.trim() || isLoading}
              className={`mt-8 w-full px-8 py-4 rounded-lg shadow-lg transition-all border-2 font-serif text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-102 duration-300 ${
                theme === 'dark'
                  ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0] hover:bg-[#a3785e]'
                  : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434] hover:bg-[#8b614a]'
              }`}
            >
              {isLoading ? t.searching : t.findVideo}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-serif">
            {error}
          </div>
        )}

        {videoData && (
          <div className={`mt-8 rounded-xl p-8 shadow-xl border-2 relative backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-[#2a1f1a] border-[#f3e4d0]'
              : 'bg-[#f3e4d0] border-[#a3785e] bg-opacity-95'
          }`}>
            <h2 className="text-2xl font-serif mb-6">{t.videoFound}</h2>
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border-2 border-[#a3785e]">
              <iframe
                src={`https://www.youtube.com/embed/${videoData.videoId}`}
                title={videoData.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <h3 className="mt-4 text-lg font-serif text-center">
              {videoData.title}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
} 