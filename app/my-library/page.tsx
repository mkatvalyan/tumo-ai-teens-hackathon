'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function MyLibrary() {
  const { translations: t } = useLanguage();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [author, setAuthor] = useState('');
  const [minRating, setMinRating] = useState(4);
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  const genres = [
    { id: 'fantasy', name: t.genres.fantasy.name, description: t.genres.fantasy.description },
    { id: 'mystery', name: t.genres.mystery.name, description: t.genres.mystery.description },
    { id: 'romance', name: t.genres.romance.name, description: t.genres.romance.description },
    { id: 'sci-fi', name: t.genres.sciFi.name, description: t.genres.sciFi.description },
    { id: 'historical', name: t.genres.historical.name, description: t.genres.historical.description },
    { id: 'thriller', name: t.genres.thriller.name, description: t.genres.thriller.description },
    { id: 'literary', name: t.genres.literary.name, description: t.genres.literary.description },
    { id: 'young-adult', name: t.genres.youngAdult.name, description: t.genres.youngAdult.description }
  ];

  const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(g => g !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/recommend-books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genres: selectedGenres,
          author: author,
          minRating: minRating,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get book recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError('Failed to get book recommendations. Please try again.');
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
          <img src="/book-stack1.svg" alt="decorative books" className="w-full h-full animate-float-slow" />
        </div>
        <div className="absolute top-20 right-20 w-44 h-44 opacity-50 transform hover:scale-110 transition-transform duration-500">
          <img src="/book-stack2.svg" alt="decorative books" className="w-full h-full animate-float-medium" />
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
            <span>←</span> Back to Library
          </button>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif mb-6 relative inline-block">
            <span className="relative z-10">{t.libraryTitle}</span>
            <div className={`absolute -bottom-3 left-0 right-0 h-1 bg-current opacity-40 transform -rotate-1`}></div>
          </h1>
          <p className="italic font-serif text-xl">{t.librarySubtitle}</p>
        </div>

        <div className="bg-[#f3e4d0] dark:bg-[#2a1f1a] rounded-xl p-8 shadow-xl border-2 border-current relative backdrop-blur-sm bg-opacity-95">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedGenres.includes(genre.id)
                    ? theme === 'dark'
                      ? 'border-[#f3e4d0] bg-[#8b614a] bg-opacity-30'
                      : 'border-[#5c4434] bg-[#a3785e] bg-opacity-10'
                    : theme === 'dark'
                      ? 'border-[#8b614a] hover:border-[#f3e4d0] hover:bg-[#8b614a] hover:bg-opacity-20'
                      : 'border-[#a3785e] hover:border-[#5c4434] hover:bg-[#a3785e] hover:bg-opacity-5'
                }`}
              >
                <div className="font-serif">{genre.name}</div>
                <div className="text-sm mt-1 opacity-80">{genre.description}</div>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="author" className="block font-serif mb-2">
                {t.authorLabel}
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t.authorPlaceholder}
                className={`w-full p-4 rounded-lg bg-white dark:bg-[#1a1512] border-2 ${
                  theme === 'dark' ? 'border-[#8b614a]' : 'border-[#a3785e]'
                } focus:outline-none focus:ring-2 focus:ring-[#6b5544] font-serif`}
              />
            </div>

            <div>
              <label className="block font-serif mb-4">
                {t.minRatingLabel}
              </label>
              <div className="flex items-center justify-between gap-4 px-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setMinRating(rating)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      rating <= minRating
                        ? theme === 'dark'
                          ? 'border-[#f3e4d0] bg-[#8b614a] bg-opacity-30'
                          : 'border-[#5c4434] bg-[#a3785e] bg-opacity-10'
                        : theme === 'dark'
                          ? 'border-[#8b614a] hover:border-[#f3e4d0]'
                          : 'border-[#a3785e] hover:border-[#5c4434]'
                    }`}
                  >
                    <span className="font-serif">{rating}★</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || selectedGenres.length === 0}
              className={`mt-8 w-full px-8 py-4 ${
                theme === 'dark'
                  ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0]'
                  : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434]'
              } rounded-lg shadow-lg hover:bg-[#8b614a] transition-all border-2 font-serif text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-102 duration-300`}
            >
              {isLoading ? t.loading : t.getRecommendations}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-serif">
            {error}
          </div>
        )}

        {recommendations && (
          <div className="mt-8 bg-[#f3e4d0] dark:bg-[#2a1f1a] rounded-xl p-8 shadow-xl border-2 border-current relative backdrop-blur-sm bg-opacity-75">
            <h2 className="text-2xl font-serif mb-6">Your Recommended Books</h2>
            <div className="grid grid-cols-1 gap-8">
              {recommendations.split('\n\n').map((book, index) => {
                if (!book.trim()) return null;
                const lines = book.split('\n');
                const title = lines[0].replace(/^#+ /, '');
                const details = lines.slice(1);
                
                // Find the rating line (it contains ★)
                const ratingLine = details.find(line => line.includes('★')) || '';
                // Get the plot summary (lines between title and rating)
                const plotSummary = details.filter(line => !line.includes('★') && line.trim()).join('\n');
                
                return (
                  <div key={index} className="space-y-4">
                    {/* Book title and author box */}
                    {title && (
                      <div className={`bg-white dark:bg-[#1a1512] bg-opacity-75 rounded-lg p-6 border-2 ${
                        theme === 'dark' ? 'border-[#8b614a]' : 'border-[#a3785e]'
                      } shadow-md hover:shadow-xl transition-all duration-300 hover:border-current`}>
                        <h3 className="text-xl font-serif text-center">
                          {title}
                        </h3>
                      </div>
                    )}

                    {/* Plot summary box */}
                    {plotSummary && (
                      <div className={`bg-white dark:bg-[#1a1512] bg-opacity-75 rounded-lg p-6 border-2 ${
                        theme === 'dark' ? 'border-[#8b614a]' : 'border-[#a3785e]'
                      } shadow-md hover:shadow-xl transition-all duration-300 hover:border-current`}>
                        <div className="prose prose-sm max-w-none font-serif">
                          {plotSummary.split('\n').map((line, i) => (
                            line.trim() && <p key={i}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating box */}
                    {ratingLine && (
                      <div className={`bg-white dark:bg-[#1a1512] bg-opacity-75 rounded-lg p-6 border-2 ${
                        theme === 'dark' ? 'border-[#8b614a]' : 'border-[#a3785e]'
                      } shadow-md hover:shadow-xl transition-all duration-300 hover:border-current`}>
                        <p className="text-xl font-semibold font-serif text-center">
                          {ratingLine}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 