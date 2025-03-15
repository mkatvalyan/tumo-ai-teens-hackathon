'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function CharacterCreator() {
  const { translations: t } = useLanguage();
  const [characterDescription, setCharacterDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('digital-art');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const artStyles = [
    { id: 'digital-art', name: t.artStyles.styles.digitalArt.name, description: t.artStyles.styles.digitalArt.description },
    { id: 'watercolor', name: t.artStyles.styles.watercolor.name, description: t.artStyles.styles.watercolor.description },
    { id: 'pencil-sketch', name: t.artStyles.styles.pencilSketch.name, description: t.artStyles.styles.pencilSketch.description },
    { id: 'oil-painting', name: t.artStyles.styles.oilPainting.name, description: t.artStyles.styles.oilPainting.description },
    { id: 'manga', name: t.artStyles.styles.manga.name, description: t.artStyles.styles.manga.description },
    { id: 'storybook', name: t.artStyles.styles.storybook.name, description: t.artStyles.styles.storybook.description },
    { id: 'woodcut', name: t.artStyles.styles.woodcut.name, description: t.artStyles.styles.woodcut.description },
    { id: 'fantasy', name: t.artStyles.styles.fantasy.name, description: t.artStyles.styles.fantasy.description }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: characterDescription,
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate character image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(t.characterError);
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
          <img src="/book-stack1.svg" alt={t.decorativeBooks} className="w-full h-full animate-float-slow" />
        </div>
        <div className="absolute top-20 right-20 w-44 h-44 opacity-50 transform hover:scale-110 transition-transform duration-500">
          <img src="/book-stack2.svg" alt={t.decorativeBooks} className="w-full h-full animate-float-medium" />
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
            <span className="relative z-10">{t.whoTitle}</span>
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-[#a3785e] opacity-40 transform -rotate-1"></div>
          </h1>
          <p className="text-[#8b614a] italic font-serif text-xl">{t.whoSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-[#f3e4d0] rounded-xl p-8 md:p-10 shadow-xl border-2 border-[#a3785e] relative backdrop-blur-sm bg-opacity-95 transform hover:shadow-2xl transition-all duration-500">
            <div className="space-y-10">
              <div>
                <label htmlFor="artStyle" className="block text-[#5c4434] font-serif mb-4 text-lg">
                  {t.artStyles.title}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {artStyles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 md:p-6 rounded-lg border-2 text-left transition-all transform hover:scale-102 duration-300 ${
                        selectedStyle === style.id
                          ? 'border-[#5c4434] bg-[#a3785e] bg-opacity-10 shadow-md'
                          : 'border-[#a3785e] hover:border-[#5c4434] hover:bg-[#a3785e] hover:bg-opacity-5'
                      }`}
                    >
                      <div className="font-serif text-[#5c4434] text-lg">{style.name}</div>
                      <div className="text-sm text-[#8b614a] mt-2">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="characterDescription" className="block text-[#5c4434] font-serif mb-4 text-lg">
                  {t.characterDescription.label}
                </label>
                <textarea
                  id="characterDescription"
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder={t.characterDescription.placeholder}
                  className="w-full h-48 p-6 rounded-lg bg-white border-2 border-[#a3785e] text-[#5c4434] placeholder-[#a3785e] focus:outline-none focus:ring-2 focus:ring-[#8b614a] font-serif resize-none transition-shadow duration-300 hover:shadow-md"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full px-8 py-4 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-lg hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] font-serif text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-102 duration-300"
            >
              {isLoading ? t.creatingCharacter : t.generateCharacter}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-serif">
            {error}
          </div>
        )}

        {generatedImage && (
          <div className="mt-8 bg-[#f3e4d0] rounded-xl p-8 shadow-xl border-2 border-[#a3785e] relative backdrop-blur-sm bg-opacity-95">
            <h2 className="text-2xl font-serif text-[#5c4434] mb-4">{t.yourCharacter}</h2>
            <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-xl border-2 border-[#a3785e]">
              <img
                src={generatedImage}
                alt={t.yourCharacter}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => window.open(generatedImage, '_blank')}
                className="px-4 py-2 text-[#5c4434] hover:text-[#8b614a] transition-colors duration-300 font-serif"
              >
                {t.viewFullSize}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 