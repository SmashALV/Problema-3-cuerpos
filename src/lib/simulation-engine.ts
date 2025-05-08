import type { BodyState } from '@/types/celestial-types';

const G = 1; // Gravitational constant
const MAX_PATH_LENGTH = 500; // Max number of points in a body's path trail
const SOFTENING_FACTOR = 0.1; // To prevent extreme forces at very close distances

function calculateForces(bodies: BodyState[]): { fx: number, fy: number }[] {
  const forces = bodies.map(() => ({ fx: 0, fy: 0 }));

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const bodyA = bodies[i];
      const bodyB = bodies[j];

      const dx = bodyB.x - bodyA.x;
      const dy = bodyB.y - bodyA.y;
      const distSq = dx * dx + dy * dy + SOFTENING_FACTOR * SOFTENING_FACTOR; // Add softening
      const dist = Math.sqrt(distSq);

      if (dist === 0) continue;

      const force = (G * bodyA.mass * bodyB.mass) / distSq;
      const forceX = (force * dx) / dist;
      const forceY = (force * dy) / dist;

      forces[i].fx += forceX;
      forces[i].fy += forceY;
      forces[j].fx -= forceX;
      forces[j].fy -= forceY;
    }
  }
  return forces;
}

export function updateBodies(currentBodies: BodyState[], dt: number): BodyState[] {
  const forces = calculateForces(currentBodies);

  return currentBodies.map((body, i) => {
    const accelerationX = forces[i].fx / body.mass;
    const accelerationY = forces[i].fy / body.mass;

    const newVx = body.vx + accelerationX * dt;
    const newVy = body.vy + accelerationY * dt;

    const newX = body.x + newVx * dt;
    const newY = body.y + newVy * dt;
    
    const newPath = [...body.path, { x: newX, y: newY }];
    if (newPath.length > MAX_PATH_LENGTH) {
      newPath.shift();
    }

    return {
      ...body,
      vx: newVx,
      vy: newVy,
      x: newX,
      y: newY,
      path: newPath,
    };
  });
}
