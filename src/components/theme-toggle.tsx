// src/components/theme-toggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  // Initialize theme to 'light' to match server-side behavior for the initial render,
  // or what the server would render if it could execute this.
  // The actual theme will be determined on the client in useEffect.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Effect to run once on the client to determine and set the actual theme
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    setMounted(true); // Signal that client-side specific logic has run and component is mounted
  }, []);

  // Effect to apply theme changes to the document and localStorage
  useEffect(() => {
    // Only run this effect if the component is mounted and theme has been determined
    if (mounted) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (!mounted) {
    // Render a placeholder button that is consistent with server rendering or a default state.
    // This ensures the initial client render matches the server output, preventing hydration mismatch.
    // Using Sun icon as a default during this phase.
    return (
      <Button variant="outline" size="icon" aria-label="Toggle theme" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }
  
  // Once mounted and theme is determined, render the actual interactive button
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
    </Button>
  );
}
