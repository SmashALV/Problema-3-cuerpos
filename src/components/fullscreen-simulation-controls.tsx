'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Save, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getTranslatedText } from '@/lib/translations';
import type { Language } from '@/contexts/language-context';
import { BODY_NAME_KEYS } from '@/types/celestial-types';

interface FullscreenSimulationControlsProps {
  initialConditions: GenerateInitialConditionsOutput | null;
  isRunning: boolean;
  simulationSpeed: number;
  onUpdateConditions: (newConditions: GenerateInitialConditionsOutput) => void;
  onPlayPause: () => void;
  onResetSimulation: () => void;
  onSpeedChange: (speed: number) => void;
  language: Language;
}

type BodyFormData = {
  mass: string;
  positionX: string;
  positionY: string;
  velocityX: string;
  velocityY: string;
};

const MIN_SPEED = 0.1;
const MAX_SPEED_SLIDER = 30;
const MAX_SPEED_INPUT_FIELD = 1000;

export function FullscreenSimulationControls({
  initialConditions,
  isRunning,
  simulationSpeed,
  onUpdateConditions,
  onPlayPause,
  onResetSimulation,
  onSpeedChange,
  language,
}: FullscreenSimulationControlsProps) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [localConditions, setLocalConditions] = useState<GenerateInitialConditionsOutput | null>(null);
  const [formBodies, setFormBodies] = useState<BodyFormData[]>([]);
  const [speedInputValue, setSpeedInputValue] = useState<string>(simulationSpeed.toString());

  useEffect(() => {
    if (initialConditions) {
      setLocalConditions(JSON.parse(JSON.stringify(initialConditions))); // Deep copy
      const bodiesData = [initialConditions.body1, initialConditions.body2, initialConditions.body3];
      setFormBodies(
        bodiesData.map((b) => ({
          mass: b.mass.toString(),
          positionX: b.positionX.toString(),
          positionY: b.positionY.toString(),
          velocityX: b.velocityX.toString(),
          velocityY: b.velocityY.toString(),
        }))
      );
    }
  }, [initialConditions]);

  useEffect(() => {
    setSpeedInputValue(simulationSpeed.toFixed(1));
  }, [simulationSpeed]);

  const handleInputChange = useCallback(
    (bodyIndex: number, field: keyof BodyFormData, value: string) => {
      setFormBodies((prev) =>
        prev.map((body, index) =>
          index === bodyIndex ? { ...body, [field]: value } : body
        )
      );
    },
    []
  );

  const handleApplyChanges = useCallback(() => {
    if (!localConditions || formBodies.length !== 3) return;

    const updatedBody1 = {
      mass: parseFloat(formBodies[0].mass) || 0,
      positionX: parseFloat(formBodies[0].positionX) || 0,
      positionY: parseFloat(formBodies[0].positionY) || 0,
      velocityX: parseFloat(formBodies[0].velocityX) || 0,
      velocityY: parseFloat(formBodies[0].velocityY) || 0,
    };
    const updatedBody2 = {
      mass: parseFloat(formBodies[1].mass) || 0,
      positionX: parseFloat(formBodies[1].positionX) || 0,
      positionY: parseFloat(formBodies[1].positionY) || 0,
      velocityX: parseFloat(formBodies[1].velocityX) || 0,
      velocityY: parseFloat(formBodies[1].velocityY) || 0,
    };
    const updatedBody3 = {
      mass: parseFloat(formBodies[2].mass) || 0,
      positionX: parseFloat(formBodies[2].positionX) || 0,
      positionY: parseFloat(formBodies[2].positionY) || 0,
      velocityX: parseFloat(formBodies[2].velocityX) || 0,
      velocityY: parseFloat(formBodies[2].velocityY) || 0,
    };
    
    onUpdateConditions({
      body1: updatedBody1,
      body2: updatedBody2,
      body3: updatedBody3,
    });
  }, [formBodies, localConditions, onUpdateConditions]);


  const handleSpeedInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeedInputValue(event.target.value);
  };

  const handleSpeedInputBlur = () => {
    let newSpeed = parseFloat(speedInputValue);
    if (isNaN(newSpeed)) newSpeed = MIN_SPEED;
    newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED_INPUT_FIELD, newSpeed));
    onSpeedChange(newSpeed);
    setSpeedInputValue(newSpeed.toFixed(1));
  };
  
  const handleSpeedInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSpeedInputBlur();
      (event.target as HTMLInputElement).blur();
    }
  };

  if (!localConditions) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-20 bg-background/70 hover:bg-background text-foreground"
        onClick={() => setPanelOpen(!panelOpen)}
        aria-label={panelOpen ? getTranslatedText('closePanel', language) : getTranslatedText('openPanel', language)}
      >
        {panelOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
      </Button>

      {panelOpen && (
        <div className="absolute top-0 left-0 h-full w-80 bg-background/90 backdrop-blur-sm p-4 z-10 shadow-xl">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-6 text-foreground">
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">{getTranslatedText('simulationControlsTitle', language)}</h2>
              
              {/* General Controls */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button onClick={onPlayPause} className="flex-1">
                    {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isRunning ? getTranslatedText('pause', language) : getTranslatedText('play', language)}
                  </Button>
                  <Button onClick={onResetSimulation} variant="outline" className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {getTranslatedText('reset', language)}
                  </Button>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <Label htmlFor="speed-slider-fullscreen" className="text-sm">{getTranslatedText('simulationSpeed', language)}</Label>
                        <span className="text-xs text-muted-foreground">{simulationSpeed.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Slider
                        id="speed-slider-fullscreen"
                        min={MIN_SPEED}
                        max={MAX_SPEED_SLIDER}
                        step={0.1}
                        value={[Math.min(simulationSpeed, MAX_SPEED_SLIDER)]}
                        onValueChange={(value) => onSpeedChange(value[0])}
                        className="flex-grow"
                        />
                        <Input
                        type="number"
                        value={speedInputValue}
                        onChange={handleSpeedInputChange}
                        onBlur={handleSpeedInputBlur}
                        onKeyDown={handleSpeedInputKeyDown}
                        min={MIN_SPEED}
                        max={MAX_SPEED_INPUT_FIELD}
                        step={0.1}
                        className="w-20 h-8 text-xs"
                        aria-label={getTranslatedText('simulationSpeedInputLabel', language)}
                        />
                    </div>
                </div>
              </div>

              {/* Body Parameters */}
              <h3 className="text-lg font-medium border-b pb-1 mb-2">{getTranslatedText('bodyParameters', language)}</h3>
              {formBodies.map((body, bodyIndex) => (
                <div key={bodyIndex} className="space-y-2 p-3 border rounded-md bg-muted/30">
                  <h4 className="font-semibold text-primary">{getTranslatedText(BODY_NAME_KEYS[bodyIndex], language)}</h4>
                  {(Object.keys(body) as Array<keyof BodyFormData>).map((field) => (
                    <div key={field} className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor={`fs-body-${bodyIndex}-${field}`} className="text-xs col-span-1 capitalize">
                        {getTranslatedText(field === 'mass' ? 'mass' : field.startsWith('position') ? `position${field.slice(-1)}` : `velocity${field.slice(-1)}`, language)}
                      </Label>
                      <Input
                        id={`fs-body-${bodyIndex}-${field}`}
                        type="number"
                        value={body[field]}
                        onChange={(e) => handleInputChange(bodyIndex, field, e.target.value)}
                        className="h-8 text-xs col-span-2"
                      />
                    </div>
                  ))}
                </div>
              ))}
              <Button onClick={handleApplyChanges} className="w-full mt-4">
                <Save className="mr-2 h-4 w-4" />
                {getTranslatedText('applyChanges', language)}
              </Button>
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
}
