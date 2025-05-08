'use client';

import React from 'react';
import type { GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BODY_NAME_KEYS } from '@/types/celestial-types';
import { useLanguage } from '@/contexts/language-context';
import { getTranslatedText } from '@/lib/translations';

interface SimulationParametersProps {
  initialConditions: GenerateInitialConditionsOutput | null;
}

export function SimulationParameters({ initialConditions }: SimulationParametersProps) {
  const { language } = useLanguage();

  if (!initialConditions) {
    return (
      <Card className="bg-card/80 shadow-lg">
        <CardHeader>
          <CardTitle>{getTranslatedText('initialBodyParameters', language)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{getTranslatedText('noParametersLoaded', language)}</p>
        </CardContent>
      </Card>
    );
  }

  const bodies = [
    { nameKey: BODY_NAME_KEYS[0], data: initialConditions.body1 },
    { nameKey: BODY_NAME_KEYS[1], data: initialConditions.body2 },
    { nameKey: BODY_NAME_KEYS[2], data: initialConditions.body3 },
  ];

  return (
    <Card className="bg-card/80 shadow-lg">
      <CardHeader>
        <CardTitle>{getTranslatedText('initialBodyParameters', language)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bodies.map((bodyItem, index) => (
          <div key={`param-body-${index}`} className="p-3 border border-border rounded-md bg-muted/30 shadow-sm">
            <h3 className="font-semibold text-primary mb-2">{getTranslatedText(bodyItem.nameKey, language)}</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                <strong>{getTranslatedText('mass', language)}:</strong> 
                <span className="ml-1 font-mono text-foreground">{bodyItem.data.mass.toFixed(2)} units</span>
              </li>
              <li>
                <strong>{getTranslatedText('positionXY', language)}:</strong> 
                <span className="ml-1 font-mono text-foreground">({bodyItem.data.positionX.toFixed(2)}, {bodyItem.data.positionY.toFixed(2)})</span>
              </li>
              <li>
                <strong>{getTranslatedText('velocityVxVy', language)}:</strong> 
                <span className="ml-1 font-mono text-foreground">({bodyItem.data.velocityX.toFixed(2)}, {bodyItem.data.velocityY.toFixed(2)})</span>
              </li>
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
