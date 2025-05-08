'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SimulationControlsProps = {
  isRunning: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  isLoading: boolean; // General loading state (e.g., for AI or reset)
};

export function SimulationControls({
  isRunning,
  onPlayPause,
  onReset,
  simulationSpeed,
  onSpeedChange,
  isLoading,
}: SimulationControlsProps) {
  return (
    <Card className="bg-card/80 shadow-lg">
      <CardHeader>
        <CardTitle>Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Button onClick={onPlayPause} disabled={isLoading} className="flex-1">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isRunning ? (
              <Pause className="mr-2 h-5 w-5" />
            ) : (
              <Play className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Loading...' : isRunning ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={onReset} disabled={isLoading || isRunning} variant="outline" className="flex-1">
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="speed-slider">Simulation Speed: {simulationSpeed.toFixed(1)}x</Label>
          <Slider
            id="speed-slider"
            min={0.1}
            max={5}
            step={0.1}
            value={[simulationSpeed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
