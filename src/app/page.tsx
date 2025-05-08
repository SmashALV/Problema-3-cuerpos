'use client';

import React, { useState, useCallback } from 'react';
import { ConfigurationForm } from '@/components/configuration-form';
import { SimulationControls } from '@/components/simulation-controls';
import { CelestialSimulation } from '@/components/celestial-simulation';
import type { GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { DEFAULT_INITIAL_CONDITIONS } from '@/types/celestial-types';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const [initialConditions, setInitialConditions] = useState<GenerateInitialConditionsOutput | null>(DEFAULT_INITIAL_CONDITIONS);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1.0);
  const [simulationKey, setSimulationKey] = useState<string | number>(Date.now());
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleConditionsGenerated = useCallback((conditions: GenerateInitialConditionsOutput) => {
    setInitialConditions(conditions);
    setIsRunning(false); // Stop simulation when new conditions are loaded
    setSimulationKey(Date.now()); // Force re-initialization of simulation component
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!initialConditions) return; // Don't start if no conditions
    setIsRunning((prev) => !prev);
  }, [initialConditions]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    // Optionally, reset to default or last generated. Here, we stick to current `initialConditions` but reset state via key.
    // If you want to reset to truly default, uncomment next line:
    // setInitialConditions(DEFAULT_INITIAL_CONDITIONS); 
    setSimulationKey(Date.now());
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setSimulationSpeed(speed);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
      {/* Controls Panel */}
      <ScrollArea className="w-full md:w-[380px] md:h-screen border-r border-border">
        <div className="p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Celestial Orbits</h1>
            <p className="text-sm text-muted-foreground">
              Visualize the three-body problem with AI-generated scenarios.
            </p>
          </div>
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
           <div className="text-xs text-muted-foreground pt-4">
            <p>Keyboard shortcut: <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Ctrl/Cmd</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">B</kbd> to toggle sidebar (if using SidebarProvider).</p>
            <p className="mt-2">This simulation provides a simplified model. Actual celestial mechanics are more complex.</p>
          </div>
        </div>
      </ScrollArea>

      {/* Simulation Area */}
      <main className="flex-1 flex items-center justify-center p-4 bg-black/50 md:bg-transparent md:p-8">
        {initialConditions ? (
          <CelestialSimulation
            initialConditions={initialConditions}
            isRunning={isRunning}
            simulationSpeed={simulationSpeed}
            simulationKey={simulationKey}
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Generate initial conditions to start the simulation.</p>
          </div>
        )}
      </main>
    </div>
  );
}
