'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { BodyState, GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { BODY_COLORS, BODY_NAMES } from '@/types/celestial-types';
import { updateBodies } from '@/lib/simulation-engine';

interface CelestialSimulationProps {
  initialConditions: GenerateInitialConditionsOutput | null;
  isRunning: boolean;
  simulationSpeed: number;
  simulationKey: string | number; // Used to force re-initialization
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BODY_BASE_RADIUS = 5; // Base radius for bodies, can be scaled by mass
const PATH_OPACITY = 0.7;
const TIME_STEP_BASE = 0.01; // Base time step for simulation logic

export function CelestialSimulation({
  initialConditions,
  isRunning,
  simulationSpeed,
  simulationKey,
}: CelestialSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const [bodies, setBodies] = useState<BodyState[]>([]);
  const [scale, setScale] = useState(1); // Scale factor for drawing
  const [originOffset, setOriginOffset] = useState({ x: 0, y: 0 }); // To center the view

  const initializeBodies = useCallback(() => {
    if (!initialConditions) return;

    const newBodies: BodyState[] = [
      initialConditions.body1,
      initialConditions.body2,
      initialConditions.body3,
    ].map((b, index) => ({
      id: `body-${index + 1}`,
      mass: b.mass,
      x: b.positionX,
      y: b.positionY,
      vx: b.velocityX,
      vy: b.velocityY,
      color: BODY_COLORS[index % BODY_COLORS.length],
      // Radius could be Math.cbrt(b.mass) * some_factor, or fixed for now
      radius: BODY_BASE_RADIUS * Math.max(1, Math.log10(Math.max(1,b.mass))), 
      path: [{ x: b.positionX, y: b.positionY }], // Start path with initial position
    }));
    setBodies(newBodies);

    // Basic auto-scaling logic based on initial positions
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    newBodies.forEach(b => {
      minX = Math.min(minX, b.x);
      maxX = Math.max(maxX, b.x);
      minY = Math.min(minY, b.y);
      maxY = Math.max(maxY, b.y);
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    setOriginOffset({ x: centerX, y: centerY });
    
    const spreadX = Math.max(1, maxX - minX); // Avoid division by zero if all points are same
    const spreadY = Math.max(1, maxY - minY);
    
    const scaleX = CANVAS_WIDTH / (spreadX * 1.5 || CANVAS_WIDTH); // Add padding
    const scaleY = CANVAS_HEIGHT / (spreadY * 1.5 || CANVAS_HEIGHT);
    setScale(Math.min(scaleX, scaleY, 1)); // Cap max scale to 1 to avoid over-zooming small systems

  }, [initialConditions]);

  useEffect(() => {
    initializeBodies();
  }, [initialConditions, simulationKey, initializeBodies]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply scaling and origin offset
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    ctx.save();
    ctx.translate(canvasCenterX, canvasCenterY); // Move origin to canvas center
    ctx.scale(scale, scale); // Apply zoom
    ctx.translate(-originOffset.x, -originOffset.y); // Pan to simulation center

    bodies.forEach((body) => {
      // Draw path
      if (body.path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(body.path[0].x, body.path[0].y);
        for (let i = 1; i < body.path.length; i++) {
          ctx.lineTo(body.path[i].x, body.path[i].y);
        }
        ctx.strokeStyle = `${body.color}${Math.floor(PATH_OPACITY * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1 / scale; // Keep path line width consistent regardless of zoom
        ctx.stroke();
      }

      // Draw body
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius / Math.sqrt(scale) , 0, 2 * Math.PI); // Scale radius less aggressively
      ctx.fillStyle = body.color;
      ctx.fill();
      
      // Optional: Draw body name
      // ctx.fillStyle = "white";
      // ctx.font = `${12 / scale}px sans-serif`;
      // ctx.fillText(BODY_NAMES[parseInt(body.id.split('-')[1]) -1], body.x + body.radius, body.y);
    });
    ctx.restore();

  }, [bodies, scale, originOffset]);

  useEffect(() => {
    draw(); // Initial draw
  }, [draw, bodies]); // Redraw if bodies state changes manually

  useEffect(() => {
    if (isRunning) {
      const simulate = () => {
        setBodies((prevBodies) => updateBodies(prevBodies, TIME_STEP_BASE * simulationSpeed));
        draw();
        animationFrameIdRef.current = requestAnimationFrame(simulate);
      };
      animationFrameIdRef.current = requestAnimationFrame(simulate);
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isRunning, simulationSpeed, draw]); // Removed `bodies` from deps to avoid loop with setBodies

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-border rounded-lg shadow-xl bg-black"
      data-ai-hint="galaxy space"
    />
  );
}
