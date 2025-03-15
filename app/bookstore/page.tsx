'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function Bookstore() {
  const { translations: t } = useLanguage();
  const [bookTitle, setBookTitle] = useState('');
  const [bookResults, setBookResults] = useState<null | {
    title: string;
    retailers: Array<{
      name: string;
      price: string;
      url: string;
      format: string;
    }>;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setBookResults(null);

    try {
      const response = await fetch('/api/find-book-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: bookTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to find book prices');
      }

      const data = await response.json();
      setBookResults(data);
    } catch (err) {
      setError('Failed to find book prices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3e4d0] bg-opacity-90 relative overflow-x-hidden">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/vintage-paper.svg')] opacity-30"></div>
        
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
            <path d="M10,10 Q50,10 50,50 T90,90" stroke="#5c4434" fill="none" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-25 transform rotate-0">
          <svg viewBox="0 0 100 100">
            <path d="M90,10 Q50,10 50,50 T10,90" stroke="#5c4434" fill="none" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto p-8 md:p-12 relative">
        {/* Back button */}
        <Link href="/">
          <button className="mb-12 text-[#5c4434] hover:text-[#8b614a] transition-colors duration-300 font-serif flex items-center gap-2 text-lg transform hover:translate-x-1">
            <span>←</span> {t.backToLibrary}
          </button>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-[#5c4434] mb-6 relative inline-block">
            <span className="relative z-10">{t.bookstoreTitle}</span>
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-[#a3785e] opacity-40 transform -rotate-1"></div>
          </h1>
          <p className="text-[#8b614a] italic font-serif text-xl">{t.bookstoreSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-[#f3e4d0] rounded-xl p-8 md:p-10 shadow-xl border-2 border-[#a3785e] relative backdrop-blur-sm bg-opacity-95 transform hover:shadow-2xl transition-all duration-500">
            <div className="space-y-6">
              <div>
                <label htmlFor="bookTitle" className="block text-[#5c4434] font-serif mb-4 text-lg">
                  {t.enterBookTitle}
                </label>
                <input
                  type="text"
                  id="bookTitle"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder={t.enterBookTitlePlaceholder}
                  className="w-full p-4 rounded-lg bg-white border-2 border-[#a3785e] text-[#5c4434] placeholder-[#a3785e] focus:outline-none focus:ring-2 focus:ring-[#8b614a] font-serif"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !bookTitle.trim()}
              className="mt-8 w-full px-8 py-4 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-lg hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] font-serif text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-102 duration-300"
            >
              {isLoading ? t.searchingBookstores : t.findBookPrices}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-serif">
            {t.bookstoreError}
          </div>
        )}

        {bookResults && (
          <div className="mt-8 bg-[#f3e4d0] rounded-xl p-8 shadow-xl border-2 border-[#a3785e] relative backdrop-blur-sm bg-opacity-95">
            <h2 className="text-2xl font-serif text-[#5c4434] mb-6">{t.resultsFor} "{bookResults.title}"</h2>
            <div className="space-y-6">
              {bookResults.retailers.map((retailer, index) => (
                <a
                  key={index}
                  href={retailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border-2 border-[#a3785e] hover:border-[#5c4434] transition-all hover:shadow-md bg-white bg-opacity-50 group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-serif text-[#5c4434] group-hover:text-[#8b614a] transition-colors">
                        {retailer.name}
                      </h3>
                      <p className="text-sm text-[#8b614a] mt-1">
                        {retailer.format}
                      </p>
                    </div>
                    <div className="text-xl font-serif text-[#5c4434] group-hover:text-[#8b614a] transition-colors">
                      {retailer.price}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 