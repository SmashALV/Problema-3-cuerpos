'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react'; 

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'es' : 'en'));
  };

  // Avoid rendering on server or before hydration if language state isn't ready
  if (typeof window === 'undefined') {
     return <Button variant="outline" size="icon" aria-label="Toggle language" disabled><Globe className="h-[1.2rem] w-[1.2rem]" /></Button>;
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
      <Globe className="h-[1.2rem] w-[1.2rem] mr-0 sm:mr-1" /> 
      <span className="uppercase hidden sm:inline">{language === 'en' ? 'ES' : 'EN'}</span>
    </Button>
  );
}
