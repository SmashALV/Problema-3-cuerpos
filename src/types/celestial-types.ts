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
  body2: { mass: 10, positionX: 400, positionY: 0, velocityX: 0, velocityY: 1.4 }, // Increased distance, adjusted velocity
  body3: { mass: 1, positionX: 500, positionY: 0, velocityX: 0, velocityY: -0.7 }, // Increased distance, adjusted velocity
};

export interface PredefinedScenario {
  name: string;
  description: string;
}

export const PREDEFINED_SCENARIOS: PredefinedScenario[] = [
  {
    name: "Sun & Two Planets (Default)",
    description: "A sun-like star with two orbiting planets in a somewhat stable configuration, with significant separation. One planet is significantly larger than the other.",
  },
  {
    name: "Stable Figure-Eight",
    description: "Three equal-mass bodies in a stable, well-separated figure-eight periodic orbit. This known choreography should allow bodies to trace a clear figure-eight path over a significant area.",
  },
  {
    name: "Lagrangian Point L4/L5",
    description: "Two large bodies in a wide, stable orbit (e.g., a star and a large planet), and a third, much smaller body (e.g., an asteroid) positioned near one of the L4 or L5 Lagrangian points. This setup should form a clearly visible, near-stable equilateral triangle configuration.",
  },
  {
    name: "Hierarchical System",
    description: "A binary pair of stars (Body 1 and Body 2) with distinct separation and comparable masses, and a third, less massive body (Body 3) orbiting the center of mass of the binary pair at a significantly larger distance. The overall system should be spread out enough for clear visualization of the hierarchy.",
  },
  {
    name: "Chaotic Ejection",
    description: "Three bodies of comparable, moderate masses starting with enough initial separation to be distinct, but with positions and velocities that will lead to close, energetic encounters resulting in chaotic interaction and the eventual ejection of one body. Avoid immediate overlap or extreme initial closeness.",
  },
  {
    name: "Playful Triangle Dance",
    description: "Three bodies of equal mass, initially positioned at the vertices of a reasonably sized equilateral triangle. Their initial velocities should induce a complex, visible, and intertwined dance over a noticeable area while remaining bound, before potentially transitioning to chaotic behavior.",
  }
];

export const DEFAULT_CONFIGURATION_DESCRIPTION = PREDEFINED_SCENARIOS[0].description;

