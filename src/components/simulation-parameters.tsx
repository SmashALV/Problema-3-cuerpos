'use client';

import React from 'react';
import type { GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BODY_NAMES } from '@/types/celestial-types';

interface SimulationParametersProps {
  initialConditions: GenerateInitialConditionsOutput | null;
}

export function SimulationParameters({ initialConditions }: SimulationParametersProps) {
  if (!initialConditions) {
    return (
      <Card className="bg-card/80 shadow-lg">
        <CardHeader>
          <CardTitle>Initial Body Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No parameters loaded. Generate initial conditions.</p>
        </CardContent>
      </Card>
    );
  }

  const bodies = [
    { name: BODY_NAMES[0], data: initialConditions.body1 },
    { name: BODY_NAMES[1], data: initialConditions.body2 },
    { name: BODY_NAMES[2], data: initialConditions.body3 },
  ];

  return (
    <Card className="bg-card/80 shadow-lg">
      <CardHeader>
        <CardTitle>Initial Body Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bodies.map((bodyItem, index) => (
          <div key={`param-body-${index}`} className="p-3 border border-border rounded-md bg-muted/30 shadow-sm">
            <h3 className="font-semibold text-primary mb-2">{bodyItem.name}</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                <strong>Mass:</strong> 
                <span className="ml-1 font-mono text-foreground">{bodyItem.data.mass.toFixed(2)} units</span>
              </li>
              <li>
                <strong>Position (X, Y):</strong> 
                <span className="ml-1 font-mono text-foreground">({bodyItem.data.positionX.toFixed(2)}, {bodyItem.data.positionY.toFixed(2)})</span>
              </li>
              <li>
                <strong>Velocity (Vx, Vy):</strong> 
                <span className="ml-1 font-mono text-foreground">({bodyItem.data.velocityX.toFixed(2)}, {bodyItem.data.velocityY.toFixed(2)})</span>
              </li>
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
