'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function Who() {
  const { translations: t } = useLanguage();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', { email, message });
    // Reset form
    setEmail('');
    setMessage('');
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

        {/* Team Members Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif text-[#5c4434] mb-4 text-center">{t.teamMembers.title}</h2>
          <p className="text-[#8b614a] text-center mb-8 font-serif">{t.teamMembers.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.teamMembers.members.map((member, index) => (
              <div key={index} className="bg-white bg-opacity-50 rounded-xl p-6 shadow-lg border-2 border-[#a3785e] hover:shadow-xl transition-all">
                <h3 className="text-xl font-serif text-[#5c4434] mb-2">{member.name}</h3>
                <p className="text-[#8b614a] font-serif mb-4">{member.role}</p>
                <p className="text-[#5c4434] font-serif">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-[#5c4434] mb-8 text-center">{t.contactUs}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[#5c4434] font-serif mb-2">
                {t.contactEmail}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-lg bg-white border-2 border-[#a3785e] text-[#5c4434] focus:outline-none focus:ring-2 focus:ring-[#8b614a] font-serif"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-[#5c4434] font-serif mb-2">
                {t.contactMessage}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full p-4 rounded-lg bg-white border-2 border-[#a3785e] text-[#5c4434] focus:outline-none focus:ring-2 focus:ring-[#8b614a] font-serif"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-8 py-4 bg-[#a3785e] text-[#f3e4d0] rounded-lg shadow-lg hover:bg-[#8b614a] transition-all border-2 border-[#5c4434] font-serif text-xl"
            >
              {t.sendMessage}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 