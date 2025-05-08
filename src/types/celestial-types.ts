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

export const BODY_COLORS = ['#FFB347', '#B2FFFF', '#E6E6FA']; // Pastel Orange, Pale Cyan, Lavender
export const BODY_NAMES = ['Alpha', 'Beta', 'Gamma'];

// Default initial conditions if AI fails or before first generation
export const DEFAULT_INITIAL_CONDITIONS: GenerateInitialConditionsOutput = {
  body1: { mass: 1200, positionX: 0, positionY: 0, velocityX: 0, velocityY: 0 },
  body2: { mass: 15, positionX: 250, positionY: 0, velocityX: 0, velocityY: 2.0 },
  body3: { mass: 5, positionX: -450, positionY: 0, velocityX: 0, velocityY: -1.2 },
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
  },
  {
    name: "Binary with Distant Orbiter",
    description: "A close binary system (Body 1 and Body 2) of two stars with comparable masses, orbiting their common center of mass. A third, much less massive planet (Body 3) orbits this binary system from a significantly greater distance, ensuring its path is relatively stable and clearly distinct from the inner binary's motion. The overall system should be widespread enough to clearly distinguish the two levels of orbit."
  },
  {
    name: "Slingshot Maneuver",
    description: "A scenario where a relatively light body (e.g., Body 3) approaches a significantly more massive single body (e.g., Body 1, with Body 2 being negligible or very far away) or a tight binary system on a specific trajectory. This interaction should result in a gravitational slingshot, causing Body 3 to be accelerated and ejected from the system or drastically alter its orbit. Focus on a clear transfer of energy and change in trajectory."
  },
  {
    name: "Near-Collision Chaos",
    description: "Three bodies of comparable, moderate to high masses start in a relatively compact configuration but with enough separation to be distinct. Their initial velocities are set to ensure they undergo several very close, non-colliding encounters. The goal is to demonstrate highly unpredictable, chaotic motion arising from these near-misses, with orbits rapidly changing and bodies being flung around. Avoid immediate ejection, aim for sustained chaos."
  },
  {
    name: "Resonant Chain (Attempt)",
    description: "Attempt to set up a resonant orbital chain, similar to Jupiter's Galilean moons, but with three bodies. For example, Body 2 orbits Body 1, and Body 3 orbits Body 1 such that their orbital periods are in a simple integer ratio (e.g., 1:2 or 2:3). Masses can vary, with Body 1 being dominant. This configuration may be delicate and could devolve into chaos, but the initial setup should aim for resonance over a clear, large-scale area."
  }
];

export const DEFAULT_CONFIGURATION_DESCRIPTION = PREDEFINED_SCENARIOS[0].description;
