'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  // Initialize state from localStorage or system preference on client side
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light'; // Default for SSR, will be updated on client
    }
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return storedTheme || (systemPrefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    // This effect runs only on the client after hydration
    // Update the theme based on initial localStorage/system preference check
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme: 'light' | 'dark';
    if (storedTheme) {
      initialTheme = storedTheme;
    } else {
      initialTheme = systemPrefersDark ? 'dark' : 'light';
    }
    setTheme(initialTheme);

    // Apply the initial theme to the document
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);


  useEffect(() => {
    // This effect runs whenever the theme state changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Render null on server or before hydration to avoid mismatch
  if (typeof window === 'undefined') {
    return <Button variant="outline" size="icon" aria-label="Toggle theme" disabled><Sun className="h-[1.2rem] w-[1.2rem]" /></Button>;
  }
  
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Sun className="h-[1.2rem] w-[1.2rem] transition-all" /> : <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />}
    </Button>
  );
}
