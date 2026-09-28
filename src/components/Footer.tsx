import React from 'react';

interface FooterProps {
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ currentLanguage, darkMode }) => {
  const t = {
    EN: {
      copyright: '© 2024 TradingView Inc. All rights reserved. Look first / Then leap.',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      cookies: 'Cookies',
      status: 'Status',
    },
    IT: {
      copyright: '© 2024 TradingView Inc. Tutti i diritti riservati. Look first / Then leap.',
      terms: 'Termini di Servizio',
      privacy: 'Informativa sulla Privacy',
      cookies: 'Cookie',
      status: 'Stato dei Sistemi',
    },
  }[currentLanguage];

  return (
    <footer className={`border-t py-8 text-xs text-[#787b86] transition-colors ${
      darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg className={`w-6 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 36 28">
            <path d="M14 0H8L0 28H6L14 0Z"></path>
            <path d="M22 0H16L24 28H30L22 0Z"></path>
            <path d="M27 6C27 2.68629 29.6863 0 33 0C36.3137 0 39 2.68629 39 6C39 9.31371 36.3137 12 33 12C29.6863 12 27 9.31371 27 6Z"></path>
          </svg>
          <span>{t.copyright}</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#terms" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'}`}>
            {t.terms}
          </a>
          <a href="#privacy" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'}`}>
            {t.privacy}
          </a>
          <a href="#cookies" className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'}`}>
            {t.cookies}
          </a>
          <a href="#status" className={`transition-colors flex items-center gap-1.5 ${darkMode ? 'hover:text-white' : 'hover:text-black'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.status}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
