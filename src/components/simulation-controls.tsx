
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

const MIN_SPEED = 0.1;
const MAX_SPEED = 30;

export function SimulationControls({
  isRunning,
  onPlayPause,
  onReset,
  simulationSpeed,
  onSpeedChange,
  isLoading,
}: SimulationControlsProps) {
  const [speedInputValue, setSpeedInputValue] = useState<string>(simulationSpeed.toString());

  useEffect(() => {
    setSpeedInputValue(simulationSpeed.toFixed(1));
  }, [simulationSpeed]);

  const handleSpeedInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeedInputValue(event.target.value);
  };

  const handleSpeedInputBlur = () => {
    let newSpeed = parseFloat(speedInputValue);
    if (isNaN(newSpeed)) {
      newSpeed = MIN_SPEED;
    }
    newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, newSpeed));
    onSpeedChange(newSpeed);
    setSpeedInputValue(newSpeed.toFixed(1));
  };

  const handleSpeedInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSpeedInputBlur();
      (event.target as HTMLInputElement).blur(); // Remove focus
    }
  };

  return (
    <Card className="bg-card/80 shadow-lg">
      <CardHeader>
        <CardTitle>Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Button onClick={onPlayPause} disabled={isLoading} className="flex-1">
            {isLoading && !isRunning ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : isRunning ? (
              <Pause className="mr-2 h-5 w-5" />
            ) : (
              <Play className="mr-2 h-5 w-5" />
            )}
            {isLoading && !isRunning ? 'Loading...' : isRunning ? 'Pause' : 'Play'}
          </Button>
          <Button onClick={onReset} disabled={isLoading || isRunning} variant="outline" className="flex-1">
            {isLoading && isRunning ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <RotateCcw className="mr-2 h-5 w-5" />
            )}
            Reset
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="speed-slider">Simulation Speed</Label>
            <span className="text-sm text-muted-foreground">{simulationSpeed.toFixed(1)}x</span>
          </div>
          <div className="flex items-center space-x-2">
            <Slider
              id="speed-slider"
              min={MIN_SPEED}
              max={MAX_SPEED}
              step={0.1}
              value={[simulationSpeed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              disabled={isLoading}
              className="flex-grow"
            />
            <Input
              type="number"
              value={speedInputValue}
              onChange={handleSpeedInputChange}
              onBlur={handleSpeedInputBlur}
              onKeyDown={handleSpeedInputKeyDown}
              min={MIN_SPEED}
              max={MAX_SPEED}
              step={0.1}
              disabled={isLoading}
              className="w-20 h-9 text-sm"
              aria-label="Simulation speed input"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

