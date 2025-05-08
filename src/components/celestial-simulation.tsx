'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { BodyState, GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { BODY_COLORS, BODY_NAME_KEYS } from '@/types/celestial-types';
import { updateBodies } from '@/lib/simulation-engine';
import { useLanguage } from '@/contexts/language-context';
import { getTranslatedText } from '@/lib/translations';

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
const PARAM_TEXT_COLOR_LIGHT = "rgba(54, 64, 77, 0.9)"; 
const PARAM_TEXT_COLOR_DARK = "rgba(224, 239, 245, 0.9)";
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
  const { language } = useLanguage();
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // Track theme changes for canvas text color
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setCurrentTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    setCurrentTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light'); // Initial check
    return () => observer.disconnect();
  }, []);

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
      nameKey: BODY_NAME_KEYS[index % BODY_NAME_KEYS.length],
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
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => {
          console.error("Failed to load image:", src, err);
          resolve(new Image()); 
        }
        img.src = src;
      });
    
    const seedSuffix = simulationKey ? `_${simulationKey}` : Date.now();
    const imagePromises = [
      loadImage(`https://picsum.photos/seed/star${seedSuffix}/60/60`),
      loadImage(`https://picsum.photos/seed/planetA${seedSuffix}/50/50`),
      loadImage(`https://picsum.photos/seed/planetB${seedSuffix}/40/40`),
    ];

    Promise.all(imagePromises)
      .then(setBodyImages)
      .catch(err => {
        console.error("Error loading body images:", err);
        setBodyImages([null, null, null]);
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
        const baseDrawSize = Math.max(10, body.radius * 2.5);
        let imgDrawHeight = baseDrawSize / Math.sqrt(scale);
        let imgDrawWidth = imgDrawHeight * aspectRatio;
        
        const diameter = Math.min(imgDrawWidth, imgDrawHeight); // Ensure circular clipping
        const radiusForClip = diameter / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(body.x, body.y, radiusForClip, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        // Draw image centered to fill the clipped circle
        // If image is not square, this will crop it to fit the circle
        if (imgDrawWidth > imgDrawHeight) { // Landscape or square
            imgDrawHeight = diameter;
            imgDrawWidth = diameter * aspectRatio;
        } else { // Portrait
            imgDrawWidth = diameter;
            imgDrawHeight = diameter / aspectRatio;
        }
        // Ensure the image covers the circle area before clipping.
        // The smaller dimension of the image should match the diameter of the circle.
        let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;
        const targetDiameter = diameter;
        
        if (img.naturalWidth > img.naturalHeight) { // Landscape
            sWidth = img.naturalHeight;
            sx = (img.naturalWidth - img.naturalHeight) / 2;
        } else if (img.naturalHeight > img.naturalWidth) { // Portrait
            sHeight = img.naturalWidth;
            sy = (img.naturalHeight - img.naturalWidth) / 2;
        }


        ctx.drawImage(
            img,
            sx, sy, sWidth, sHeight, // Source rectangle (cropped to square)
            body.x - targetDiameter / 2, body.y - targetDiameter / 2, // Destination x, y
            targetDiameter, targetDiameter // Destination width, height
        );
        
        ctx.restore(); // Restore context to remove clipping
      } else {
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius / Math.sqrt(scale) , 0, 2 * Math.PI);
        ctx.fillStyle = body.color;
        ctx.fill();
      }
      
      // Draw body parameters
      const fontSize = 10 / scale;
      ctx.fillStyle = currentTheme === 'dark' ? PARAM_TEXT_COLOR_DARK : PARAM_TEXT_COLOR_LIGHT;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'left';

      const bodyName = getTranslatedText(body.nameKey as 'alpha' | 'beta' | 'gamma', language);
      const textLines = [
        `${bodyName}`,
        `${getTranslatedText('mass', language)}: ${body.mass.toFixed(1)}`,
        `${getTranslatedText('positionXY', language)}: (${body.x.toFixed(1)}, ${body.y.toFixed(1)})`,
        `${getTranslatedText('velocityVxVy', language)}: (${body.vx.toFixed(1)}, ${body.vy.toFixed(1)})`,
      ];
      
      const textX = body.x + (body.radius / Math.sqrt(scale)) + (5 / scale) ;
      let textY = body.y - (PARAM_TEXT_OFFSET_Y / scale) * (textLines.length / 2);

      textLines.forEach(line => {
        ctx.fillText(line, textX, textY);
        textY += fontSize * PARAM_LINE_HEIGHT_FACTOR;
      });
    });
    ctx.restore();

  }, [bodies, scale, originOffset, bodyImages, language, currentTheme]);

  useEffect(() => {
    draw();
  }, [draw, bodies, bodyImages]); 

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
      draw(); // Ensure a final draw when paused
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isRunning, simulationSpeed, draw]); // Removed updateBodies from dependencies as it's stable

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
