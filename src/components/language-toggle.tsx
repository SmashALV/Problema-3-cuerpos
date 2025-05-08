// src/components/language-toggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react'; 

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'es' : 'en'));
  };

  if (!mounted) {
    // Render a placeholder button that is consistent with server rendering or a default state.
    // This ensures the initial client render matches the server output before language state is fully resolved.
    return (
      <Button variant="outline" size="icon" aria-label="Toggle language" disabled>
        <Globe className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  // Once mounted, render the actual interactive button based on the language from context
  return (
    <Button variant="outline" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
      <Globe className="h-[1.2rem] w-[1.2rem] mr-0 sm:mr-1" /> 
      <span className="uppercase hidden sm:inline">
        {language === 'en' ? 'ES' : 'EN'}
      </span>
    </Button>
  );
}
