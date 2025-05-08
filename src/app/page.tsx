'use client';

import React, { useState, useCallback } from 'react';
import { ConfigurationForm } from '@/components/configuration-form';
import { SimulationControls } from '@/components/simulation-controls';
import { CelestialSimulation } from '@/components/celestial-simulation';
import { SimulationParameters } from '@/components/simulation-parameters';
import type { GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { DEFAULT_INITIAL_CONDITIONS } from '@/types/celestial-types';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-primary">Celestial Orbits</h1>
            <p className="text-sm text-muted-foreground">
              Visualize the three-body problem with AI-generated scenarios.
            </p>
          </div>

          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Understanding the Three-Body Problem</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                The "three-body problem" in physics and classical mechanics concerns the motion of three point masses under their mutual gravitational attraction, as described by Newton's law of universal gravitation.
              </p>
              <p>
                Unlike the two-body problem (e.g., a single planet orbiting a star), which has simple, predictable elliptical solutions, the three-body problem generally does not have a closed-form solution. This means there isn't a straightforward mathematical formula to predict the bodies' paths for all time.
              </p>
              <p>
                The behavior of a three-body system is often chaotic. This means that even tiny changes in the initial positions or velocities of the bodies can lead to drastically different trajectories and outcomes over time, making long-term prediction extremely difficult.
              </p>
              <p>
                This simulation allows you to explore some of these fascinating and complex orbital dances. Use the controls to generate different initial scenarios, often with AI assistance, and observe the intricate patterns that emerge.
              </p>
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
            <p>Keyboard shortcut: <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Ctrl/Cmd</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">B</kbd> to toggle sidebar (if using SidebarProvider).</p>
            <p className="mt-2">This simulation provides a simplified model. Actual celestial mechanics are more complex.</p>
          </div>
        </div>
      </ScrollArea>

      {/* Simulation Area */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
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
