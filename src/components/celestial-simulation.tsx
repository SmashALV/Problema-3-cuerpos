
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
const BODY_BASE_RADIUS = 5; 
const PATH_OPACITY = 0.7;
const TIME_STEP_BASE = 0.01;
const PARAM_TEXT_COLOR = "rgba(54, 64, 77, 0.9)"; // Dark text for light pastel background
const PARAM_TEXT_OFFSET_Y = 15; 
const PARAM_LINE_HEIGHT_FACTOR = 1.2; 

export function CelestialSimulation({
  initialConditions,
  isRunning,
  simulationSpeed,
  simulationKey,
}: CelestialSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const [bodies, setBodies] = useState<BodyState[]>([]);
  const [scale, setScale] = useState(1);
  const [originOffset, setOriginOffset] = useState({ x: 0, y: 0 });
  const [bodyImages, setBodyImages] = useState<(HTMLImageElement | null)[]>([]);

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

  useEffect(() => {
    if (!initialConditions) return;

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Required for picsum.photos if canvas becomes tainted
        img.onload = () => resolve(img);
        img.onerror = (err) => {
          console.error("Failed to load image:", src, err);
          // Resolve with a null or a placeholder/error indicator if needed
          // For simplicity, we'll let it be null and fallback to circle
          resolve(new Image()); // Resolve with empty image to avoid breaking Promise.all
        }
        img.src = src;
      });
    
    // data-ai-hint for body1: "star sun", body2: "planet earth", body3: "planet jupiter" (example)
    // These are conceptual hints for the image sources.
    const seedSuffix = simulationKey ? `_${simulationKey}` : Date.now(); // Ensure variety
    const imagePromises = [
      loadImage(`https://picsum.photos/seed/star${seedSuffix}/60/60`), // Larger for "star"
      loadImage(`https://picsum.photos/seed/planetA${seedSuffix}/50/50`),
      loadImage(`https://picsum.photos/seed/planetB${seedSuffix}/40/40`),
    ];

    Promise.all(imagePromises)
      .then(setBodyImages)
      .catch(err => {
        console.error("Error loading body images:", err);
        setBodyImages([null, null, null]); // Set to nulls on error
      });
  }, [initialConditions, simulationKey]);


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

      // Draw body image or fallback circle
      const img = bodyImages[index];
      if (img?.complete && img.naturalHeight !== 0) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        // Scale image size based on body.radius, ensuring it's visible
        const baseDrawSize = Math.max(10, body.radius * 2.5); // Minimum size of 10px, scaled by radius
        const drawHeight = baseDrawSize / Math.sqrt(scale);
        const drawWidth = drawHeight * aspectRatio;
        ctx.drawImage(img, body.x - drawWidth / 2, body.y - drawHeight / 2, drawWidth, drawHeight);
      } else {
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius / Math.sqrt(scale) , 0, 2 * Math.PI);
        ctx.fillStyle = body.color;
        ctx.fill();
      }
      
      // Draw body parameters
      const fontSize = 10 / scale;
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
      
      const textX = body.x + (body.radius / Math.sqrt(scale)) + (5 / scale) ;
      let textY = body.y - (PARAM_TEXT_OFFSET_Y / scale) * (textLines.length / 2);

      textLines.forEach(line => {
        ctx.fillText(line, textX, textY);
        textY += fontSize * PARAM_LINE_HEIGHT_FACTOR;
      });
    });
    ctx.restore();

  }, [bodies, scale, originOffset, bodyImages]);

  useEffect(() => {
    draw();
  }, [draw, bodies, bodyImages]); // Redraw if bodyImages change too

  useEffect(() => {
    if (isRunning) {
      const simulate = () => {
        setBodies((prevBodies) => updateBodies(prevBodies, TIME_STEP_BASE * simulationSpeed));
        animationFrameIdRef.current = requestAnimationFrame(simulate);
      };
      animationFrameIdRef.current = requestAnimationFrame(simulate);
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      draw();
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isRunning, simulationSpeed, draw]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-border rounded-lg shadow-xl bg-background"
      data-ai-hint="cosmic starfield"
    />
  );
}
