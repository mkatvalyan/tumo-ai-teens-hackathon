'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function ImTheAuthor() {
  const { translations: t, language } = useLanguage();
  const [bookIdea, setBookIdea] = useState('');
  const [pageLimit, setPageLimit] = useState(10);
  const [vocabularyLevel, setVocabularyLevel] = useState('B1');
  const [selectedFont, setSelectedFont] = useState('font-serif');
  const [fontSize, setFontSize] = useState(16);
  const [generatedContent, setGeneratedContent] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState('');
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

  // Split content into chapters/pages
  const chapters = generatedContent
    ? generatedContent.split(/Chapter \d+/g).filter(Boolean).map((content, index) => {
        const chapterContent = content.trim();
        return {
          title: `Chapter ${index + 1}`,
          content: chapterContent
        };
      })
    : [];

  // Handle the response data to extract title and content
  const handleBookResponse = (data: { title: string; content: string }) => {
    setBookTitle(data.title || 'My Story');
    setGeneratedContent(data.content);
  };

  const handleNextPage = () => {
    if (currentPage < chapters.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/write-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookIdea,
          pageLimit,
          vocabularyLevel,
          selectedFont,
          fontSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate book content');
      }

      const data = await response.json();
      handleBookResponse(data);
    } catch (err) {
      setError('Failed to generate book content. Please try again.');
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
            <span className="relative z-10">{t.imTheAuthor}</span>
            <div className={`absolute -bottom-3 left-0 right-0 h-1 bg-current opacity-40 transform -rotate-1`}></div>
          </h1>
          <p className="italic font-serif text-xl">{t.authorSubtitle}</p>
        </div>

        <div className="bg-[#f3e4d0] dark:bg-[#2a1f1a] rounded-xl p-8 shadow-xl border-2 border-current relative backdrop-blur-sm bg-opacity-95">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="bookIdea" className="block font-serif mb-2">
                {t.bookIdeaLabel}
              </label>
              <textarea
                id="bookIdea"
                value={bookIdea}
                onChange={(e) => setBookIdea(e.target.value)}
                placeholder={t.bookIdeaPlaceholder}
                className={`w-full h-40 p-4 rounded-lg bg-white dark:bg-[#1a1512] border-2 ${
                  theme === 'dark' ? 'border-[#8b614a]' : 'border-[#a3785e]'
                } focus:outline-none focus:ring-2 focus:ring-[#6b5544] font-serif resize-none`}
                required
              />
            </div>

            <div>
              <label htmlFor="pageLimit" className="block font-serif mb-2">
                {t.pageLimitLabel}
              </label>
              <input
                type="number"
                id="pageLimit"
                min="1"
                max="100"
                value={pageLimit}
                onChange={(e) => setPageLimit(Number(e.target.value))}
                className={`w-full p-4 rounded-lg bg-white dark:bg-[#1a1512] border-2 ${
                  theme === 'dark' ? 'border-[#8b614a]' : 'border-[#a3785e]'
                } focus:outline-none focus:ring-2 focus:ring-[#6b5544] font-serif`}
              />
            </div>

            {language === 'en' && t?.levels && (
              <div>
                <label htmlFor="vocabularyLevel" className="block font-serif mb-2">
                  {t.vocabularyLevelLabel}
                </label>
                <select
                  id="vocabularyLevel"
                  value={vocabularyLevel}
                  onChange={(e) => setVocabularyLevel(e.target.value)}
                  className={`w-full p-4 rounded-lg bg-white dark:bg-[#1a1512] border-2 ${
                    theme === 'dark' ? 'border-[#8b614a]' : 'border-[#a3785e]'
                  } focus:outline-none focus:ring-2 focus:ring-[#6b5544] font-serif`}
                >
                  {t.levels.a1 && <option value="A1">{t.levels.a1}</option>}
                  {t.levels.a2 && <option value="A2">{t.levels.a2}</option>}
                  {t.levels.b1 && <option value="B1">{t.levels.b1}</option>}
                  {t.levels.b2 && <option value="B2">{t.levels.b2}</option>}
                  {t.levels.c1 && <option value="C1">{t.levels.c1}</option>}
                  {t.levels.c2 && <option value="C2">{t.levels.c2}</option>}
                </select>
                <p className="mt-2 text-sm italic font-serif opacity-80">
                  {t.vocabularyLevelHelper}
                </p>
              </div>
            )}

            <div>
              <label className="block font-serif mb-2">
                {t.fontSettingsLabel}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fontFamily" className="block font-serif mb-2">
                    Font Style
                  </label>
                  <select
                    id="fontFamily"
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className={`w-full p-4 rounded-lg bg-white dark:bg-[#1a1512] border-2 ${
                      theme === 'dark' ? 'border-[#8b614a]' : 'border-[#a3785e]'
                    } focus:outline-none focus:ring-2 focus:ring-[#6b5544] font-serif`}
                  >
                    <option value="font-serif">Serif (Classic)</option>
                    <option value="font-garamond">Garamond</option>
                    <option value="font-baskerville">Baskerville</option>
                    <option value="font-times">Times New Roman</option>
                    <option value="font-georgia">Georgia</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fontSize" className="block font-serif mb-2">
                    Text Size
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      id="fontSize"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="flex-grow h-2 bg-current rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-serif min-w-[5rem]">{fontSize}px</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-8 w-full px-8 py-4 ${
                theme === 'dark'
                  ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0]'
                  : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434]'
              } rounded-lg shadow-lg hover:bg-[#8b614a] transition-all border-2 font-serif text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-102 duration-300`}
            >
              {isLoading ? t.loading : t.generateStory}
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-serif">
            {error}
          </div>
        )}

        {generatedContent && (
          <div className="mt-8 bg-[#f3e4d0] dark:bg-[#2a1f1a] rounded-xl p-8 shadow-xl border-2 border-current relative backdrop-blur-sm bg-opacity-75">
            <div className="relative aspect-[3/4] bg-white dark:bg-[#1a1512] rounded-lg shadow-2xl border-r-[20px] border-b-[2px] border-l-[2px] border-t-[2px] border-current overflow-hidden transform perspective-1000">
              {/* Page effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00000005] to-[#00000015]"></div>
              
              {/* Book spine effect */}
              <div className="absolute right-0 top-0 bottom-0 w-[20px] bg-current">
                <div className="h-full bg-gradient-to-l from-current to-transparent opacity-50"></div>
              </div>

              {/* Content */}
              <div className="p-12 h-full overflow-y-auto">
                {currentPage === 0 ? (
                  // Title page
                  <div className="h-full flex flex-col justify-center items-center">
                    <h1 className="text-6xl font-serif mb-8 text-center">
                      {bookTitle}
                    </h1>
                    <div className="w-32 h-1 bg-current my-8 opacity-50"></div>
                    <p className="text-xl italic font-serif">A Story Created with AI</p>
                  </div>
                ) : (
                  // Chapter pages
                  <>
                    <h1 className="text-4xl font-serif mb-8 text-center border-b-2 border-current pb-4">
                      {chapters[currentPage - 1].title}
                    </h1>
                    <div 
                      className={`prose prose-stone max-w-none whitespace-pre-wrap ${selectedFont}`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {chapters[currentPage - 1].content}
                    </div>
                  </>
                )}

                {/* Page number */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-serif">
                  Page {currentPage + 1} of {chapters.length + 1}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`px-6 py-3 ${
                  theme === 'dark'
                    ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0]'
                    : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434]'
                } rounded-lg shadow-lg hover:bg-[#8b614a] transition-all border-2 font-serif disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {t.previousPage}
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === chapters.length}
                className={`px-6 py-3 ${
                  theme === 'dark'
                    ? 'bg-[#8b614a] text-[#f3e4d0] border-[#f3e4d0]'
                    : 'bg-[#a3785e] text-[#f3e4d0] border-[#5c4434]'
                } rounded-lg shadow-lg hover:bg-[#8b614a] transition-all border-2 font-serif disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {t.nextPage}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 