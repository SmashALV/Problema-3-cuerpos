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

export interface PredefinedScenario {
  name: string;
  description: string;
}

export const PREDEFINED_SCENARIOS: PredefinedScenario[] = [
  {
    name: "Sun & Two Planets (Default)",
    description: "A sun-like star with two orbiting planets in a somewhat stable configuration. One planet is significantly larger than the other.",
  },
  {
    name: "Stable Figure-Eight",
    description: "Three equal-mass bodies in a stable figure-eight periodic orbit. This is a known choreography where bodies trace a figure-eight path.",
  },
  {
    name: "Lagrangian Point L4/L5",
    description: "Two large bodies in a stable orbit (e.g., a star and a large planet), and a third, much smaller body (e.g., an asteroid) positioned near one of the L4 or L5 Lagrangian points relative to the two larger bodies, aiming for a co-orbital configuration forming a near-stable equilateral triangle.",
  },
  {
    name: "Hierarchical System",
    description: "A close binary pair of stars (Body 1 and Body 2) with comparable masses, and a third, less massive body (Body 3) orbiting the center of mass of the binary pair at a much larger distance, creating a stable hierarchical triple system.",
  },
  {
    name: "Chaotic Ejection",
    description: "Three bodies of comparable, moderate masses starting relatively close to each other with small initial velocities, designed to lead to a chaotic interaction where one body is eventually ejected from the system.",
  },
  {
    name: "Playful Triangle Dance",
    description: "Three bodies of equal mass, initially positioned at the vertices of an equilateral triangle, with initial velocities that cause them to engage in a complex, intertwined dance around each other while remaining bound before potentially transitioning to chaotic behavior.",
  }
];

export const DEFAULT_CONFIGURATION_DESCRIPTION = PREDEFINED_SCENARIOS[0].description;
