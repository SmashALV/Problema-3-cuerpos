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
const PARAM_TEXT_COLOR = "rgba(255, 255, 255, 0.8)"; // White text with some transparency for parameters
const PARAM_TEXT_OFFSET_Y = 15; // Vertical offset for text relative to body
const PARAM_LINE_HEIGHT_FACTOR = 1.2; // Factor for line height of parameter text

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
      radius: BODY_BASE_RADIUS * Math.max(1, Math.log10(Math.max(1,b.mass))), 
      path: [{ x: b.positionX, y: b.positionY }],
    }));
    setBodies(newBodies);

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
    
    const spreadX = Math.max(1, maxX - minX);
    const spreadY = Math.max(1, maxY - minY);
    
    const scaleX = CANVAS_WIDTH / (spreadX * 1.5 || CANVAS_WIDTH);
    const scaleY = CANVAS_HEIGHT / (spreadY * 1.5 || CANVAS_HEIGHT);
    setScale(Math.min(scaleX, scaleY, 1)); 

  }, [initialConditions]);

  useEffect(() => {
    initializeBodies();
  }, [initialConditions, simulationKey, initializeBodies]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    ctx.save();
    ctx.translate(canvasCenterX, canvasCenterY);
    ctx.scale(scale, scale);
    ctx.translate(-originOffset.x, -originOffset.y);

    bodies.forEach((body, index) => {
      // Draw path
      if (body.path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(body.path[0].x, body.path[0].y);
        for (let i = 1; i < body.path.length; i++) {
          ctx.lineTo(body.path[i].x, body.path[i].y);
        }
        ctx.strokeStyle = `${body.color}${Math.floor(PATH_OPACITY * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1 / scale;
        ctx.stroke();
      }

      // Draw body
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius / Math.sqrt(scale) , 0, 2 * Math.PI);
      ctx.fillStyle = body.color;
      ctx.fill();
      
      // Draw body parameters
      const fontSize = 10 / scale; // Adjust font size based on scale
      ctx.fillStyle = PARAM_TEXT_COLOR;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'left';

      const bodyName = BODY_NAMES[index % BODY_NAMES.length];
      const textLines = [
        `${bodyName}`,
        `Mass: ${body.mass.toFixed(1)}`,
        `Pos: (${body.x.toFixed(1)}, ${body.y.toFixed(1)})`,
        `Vel: (${body.vx.toFixed(1)}, ${body.vy.toFixed(1)})`,
      ];
      
      const textX = body.x + (body.radius / Math.sqrt(scale)) + (5 / scale) ; // Position text to the right of the body
      let textY = body.y - (PARAM_TEXT_OFFSET_Y / scale) * (textLines.length / 2); // Center text vertically

      textLines.forEach(line => {
        ctx.fillText(line, textX, textY);
        textY += fontSize * PARAM_LINE_HEIGHT_FACTOR;
      });
    });
    ctx.restore();

  }, [bodies, scale, originOffset]);

  useEffect(() => {
    draw();
  }, [draw, bodies]);

  useEffect(() => {
    if (isRunning) {
      const simulate = () => {
        setBodies((prevBodies) => updateBodies(prevBodies, TIME_STEP_BASE * simulationSpeed));
        // No need to call draw() here, as setBodies will trigger the other useEffect
        animationFrameIdRef.current = requestAnimationFrame(simulate);
      };
      animationFrameIdRef.current = requestAnimationFrame(simulate);
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      // Draw once when paused to ensure parameters are updated
      draw();
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isRunning, simulationSpeed, draw]); // Removed `bodies` from deps, draw is called when bodies change

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
