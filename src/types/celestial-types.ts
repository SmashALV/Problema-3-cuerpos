import type { GenerateInitialConditionsOutput } from "@/ai/flows/generate-initial-conditions";

export type { GenerateInitialConditionsOutput };

export interface BodyState {
  id: string;
  mass: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number; 
  path: { x: number; y: number }[];
}

export const BODY_COLORS = ['#FF4500', '#00CED1', '#9370DB']; // Orangered, DarkTurquoise, MediumPurple
export const BODY_NAMES = ['Alpha', 'Beta', 'Gamma'];

// Default initial conditions if AI fails or before first generation
export const DEFAULT_INITIAL_CONDITIONS: GenerateInitialConditionsOutput = {
  body1: { mass: 1000, positionX: 0, positionY: 0, velocityX: 0, velocityY: 0 },
  body2: { mass: 10, positionX: 200, positionY: 0, velocityX: 0, velocityY: 2 },
  body3: { mass: 1, positionX: 250, positionY: 0, velocityX: 0, velocityY: -1 },
};

export const DEFAULT_CONFIGURATION_DESCRIPTION = "A sun-like star with two orbiting planets in a somewhat stable configuration. One planet is significantly larger than the other.";
