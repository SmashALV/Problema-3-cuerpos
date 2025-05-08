'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ConfigurationForm } from '@/components/configuration-form';
import { SimulationControls } from '@/components/simulation-controls';
import { CelestialSimulation } from '@/components/celestial-simulation';
import { SimulationParameters } from '@/components/simulation-parameters';
import type { GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { DEFAULT_INITIAL_CONDITIONS } from '@/types/celestial-types';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { getTranslatedText } from '@/lib/translations';

function PageContent() {
  const [initialConditions, setInitialConditions] = useState<GenerateInitialConditionsOutput | null>(DEFAULT_INITIAL_CONDITIONS);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1.0);
  const [simulationKey, setSimulationKey] = useState<string | number>(Date.now());
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { language } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const simulationContainerRef = useRef<HTMLDivElement>(null);

  const handleConditionsGenerated = useCallback((conditions: GenerateInitialConditionsOutput) => {
    setInitialConditions(conditions);
    setIsRunning(false); 
    setSimulationKey(Date.now()); 
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!initialConditions) return; 
    setIsRunning((prev) => !prev);
  }, [initialConditions]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSimulationKey(Date.now() + "_reset"); // Ensure key changes
    // Optionally, re-apply the current initialConditions to fully reset paths, etc.
    if (initialConditions) {
        // Creating a new object reference for initialConditions might be needed if CelestialSimulation memoizes heavily
        // For now, changing simulationKey is the primary mechanism for full reset.
    }
  }, [initialConditions]);

  const handleSpeedChange = useCallback((speed: number) => {
    setSimulationSpeed(speed);
  }, []);

  const handleUpdateConditionsFromFullscreen = useCallback((newConditions: GenerateInitialConditionsOutput) => {
    setInitialConditions(newConditions);
    setIsRunning(false);
    setSimulationKey(Date.now() + "_fullscreen_update");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!simulationContainerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await simulationContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        setIsFullscreen(false);
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
          setIsFullscreen(false);
        } catch (err) {
          console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);


  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
      {!isFullscreen && (
        <ScrollArea className="w-full md:w-[380px] md:h-screen border-r border-border">
          <div className="p-6 space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1 text-primary">
                {getTranslatedText('celestialOrbits', language)}
              </h1>
              <p className="text-sm text-muted-foreground">
                {getTranslatedText('visualizeThreeBody', language)}
              </p>
            </div>

            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{getTranslatedText('settings', language)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-toggle">{getTranslatedText('theme', language)}</Label>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="language-toggle">{getTranslatedText('language', language)}</Label>
                  <LanguageToggle />
                </div>
              </CardContent>
            </Card>
            <Separator />

            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{getTranslatedText('understandingThreeBodyProblem', language)}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>{getTranslatedText('threeBodyProblemParagraph1', language)}</p>
                <p>{getTranslatedText('threeBodyProblemParagraph2', language)}</p>
                <p>{getTranslatedText('threeBodyProblemParagraph3', language)}</p>
                <p>{getTranslatedText('threeBodyProblemParagraph4', language)}</p>
              </CardContent>
            </Card>
            
            <Separator />
            <ConfigurationForm onConditionsGenerated={handleConditionsGenerated} setIsLoadingAI={setIsLoadingAI} />
            <Separator />
            <SimulationControls
              isRunning={isRunning}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              simulationSpeed={simulationSpeed}
              onSpeedChange={handleSpeedChange}
              isLoading={isLoadingAI}
            />
            <Separator />
            <SimulationParameters initialConditions={initialConditions} />
            <Separator />
            <div className="text-xs text-muted-foreground pt-4">
              <p className="mt-2">{getTranslatedText('simulationDisclaimer', language)}</p>
            </div>
          </div>
        </ScrollArea>
      )}

      <main ref={simulationContainerRef} className={`flex-1 flex items-center justify-center overflow-auto ${isFullscreen ? 'w-screen h-screen bg-black' : 'p-4 md:p-8 bg-background md:bg-transparent'}`}>
        {initialConditions ? (
          <CelestialSimulation
            initialConditions={initialConditions}
            isRunning={isRunning}
            simulationSpeed={simulationSpeed}
            simulationKey={simulationKey}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onUpdateConditionsFromFullscreen={handleUpdateConditionsFromFullscreen}
            onPlayPauseFullscreen={handlePlayPause}
            onResetSimulationFullscreen={handleReset} // Pass the general reset
            onSpeedChangeFullscreen={handleSpeedChange}
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>{getTranslatedText('generateToStart', language)}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
}
