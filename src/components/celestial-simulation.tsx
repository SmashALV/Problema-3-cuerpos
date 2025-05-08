'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { BodyState, GenerateInitialConditionsOutput } from '@/types/celestial-types';
import { BODY_COLORS, BODY_NAME_KEYS } from '@/types/celestial-types';
import { updateBodies } from '@/lib/simulation-engine';
import { useLanguage } from '@/contexts/language-context';
import { getTranslatedText } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { FullscreenSimulationControls } from './fullscreen-simulation-controls';

interface CelestialSimulationProps {
  initialConditions: GenerateInitialConditionsOutput | null;
  isRunning: boolean;
  simulationSpeed: number;
  simulationKey: string | number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onUpdateConditionsFromFullscreen: (newConditions: GenerateInitialConditionsOutput) => void;
  onPlayPauseFullscreen: () => void;
  onResetSimulationFullscreen: () => void;
  onSpeedChangeFullscreen: (speed: number) => void;
}

const BODY_BASE_RADIUS = 5;
const PATH_OPACITY = 0.7;
const TIME_STEP_BASE = 0.01;
const PARAM_TEXT_COLOR = "rgba(224, 239, 245, 0.9)";
const PARAM_TEXT_OFFSET_Y = 15;
const PARAM_LINE_HEIGHT_FACTOR = 1.2;
const BACKGROUND_COLOR_DARK = '#000020'; // Deep space color
const STAR_COUNT = 200;

interface Star {
  x: number; // Relative position (0-1)
  y: number; // Relative position (0-1)
  radius: number;
  alpha: number;
}

export function CelestialSimulation({
  initialConditions,
  isRunning,
  simulationSpeed,
  simulationKey,
  isFullscreen,
  onToggleFullscreen,
  onUpdateConditionsFromFullscreen,
  onPlayPauseFullscreen,
  onResetSimulationFullscreen,
  onSpeedChangeFullscreen,
}: CelestialSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const [bodies, setBodies] = useState<BodyState[]>([]);
  const [scale, setScale] = useState(1);
  const [originOffset, setOriginOffset] = useState({ x: 0, y: 0 });
  const [bodyImages, setBodyImages] = useState<(HTMLImageElement | null)[]>([]);
  const { language } = useLanguage();
  const [stars, setStars] = useState<Star[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 }); // Default size

  // Initialize stars with relative positions
  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      newStars.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.5 + 0.5,
      });
    }
    setStars(newStars);
  }, []);

  const updateCanvasDimensions = useCallback(() => {
    if (canvasRef.current) {
      const parent = canvasRef.current.parentElement;
      if (parent) {
        const newWidth = parent.clientWidth;
        const newHeight = parent.clientHeight;
        if (newWidth > 0 && newHeight > 0) {
          setCanvasSize({ width: newWidth, height: newHeight });
          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;
        }
      }
    }
  }, []);
  
  useEffect(() => {
    updateCanvasDimensions(); // Initial setup
    const resizeObserver = new ResizeObserver(updateCanvasDimensions);
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }
    return () => resizeObserver.disconnect();
  }, [isFullscreen, updateCanvasDimensions]);


  const initializeBodies = useCallback(() => {
    if (!initialConditions || canvasSize.width === 0 || canvasSize.height === 0) return;

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

    const spreadX = Math.max(100, maxX - minX); // Ensure minimum spread for scale calculation
    const spreadY = Math.max(100, maxY - minY);

    // Adjust scale factor for better initial view, ensure some padding
    const scaleX = canvasSize.width / (spreadX * 1.5 || canvasSize.width);
    const scaleY = canvasSize.height / (spreadY * 1.5 || canvasSize.height);
    setScale(Math.min(scaleX, scaleY, 1)); // Cap max scale at 1

  }, [initialConditions, canvasSize]);

  useEffect(() => {
    initializeBodies();
  }, [initialConditions, simulationKey, initializeBodies]);

  useEffect(() => {
    if (!initialConditions) return;

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve) => { // Removed reject to always resolve
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (_err) => {
          // console.error("Failed to load image:", src, err); // Removed to prevent console error spam
          const fallbackImg = new Image(); // Create an empty image as fallback
          resolve(fallbackImg); // Resolve with empty image on error
        }
        img.src = src;
      });
      
    // Use a combination of simulationKey and current time to ensure unique image URLs on resets
    const imageSeedSuffix = `${simulationKey}-${Date.now()}`;
    const imagePromises = [
      loadImage(`https://picsum.photos/seed/star${imageSeedSuffix}/60/60`),
      loadImage(`https://picsum.photos/seed/planetA${imageSeedSuffix}/50/50`),
      loadImage(`https://picsum.photos/seed/planetB${imageSeedSuffix}/40/40`),
    ];

    Promise.all(imagePromises)
      .then(loadedImages => {
        setBodyImages(loadedImages.map(img => img.naturalHeight !== 0 ? img : null));
      })
      .catch(err => { 
        console.warn("Error processing body images after attempting to load (this should be rare):", err);
        setBodyImages([null, null, null]);
      });
  }, [initialConditions, simulationKey]);


  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || canvas.width === 0 || canvas.height === 0) return;

    ctx.fillStyle = BACKGROUND_COLOR_DARK;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x * canvas.width, star.y * canvas.height, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();
    });

    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    ctx.save();
    ctx.translate(canvasCenterX, canvasCenterY);
    ctx.scale(scale, scale);
    ctx.translate(-originOffset.x, -originOffset.y);

    bodies.forEach((body, index) => {
      if (body.path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(body.path[0].x, body.path[0].y);
        for (let i = 1; i < body.path.length; i++) {
          ctx.lineTo(body.path[i].x, body.path[i].y);
        }
        ctx.strokeStyle = `${body.color}${Math.floor(PATH_OPACITY * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = Math.max(0.5, 1 / scale); // Ensure minimum line width
        ctx.stroke();
      }

      const img = bodyImages[index];
      const displayRadius = Math.max(2, body.radius / Math.sqrt(scale)); // Ensure min radius
      if (img?.complete && img.naturalHeight !== 0) {
        const baseDrawSize = Math.max(10, displayRadius * 2.5); 
        let imgDrawHeight = baseDrawSize;
        let imgDrawWidth = imgDrawHeight * (img.naturalWidth / img.naturalHeight);
        
        const diameter = Math.min(imgDrawWidth, imgDrawHeight);
        const radiusForClip = diameter / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(body.x, body.y, radiusForClip, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;
        if (img.naturalWidth > img.naturalHeight) {
            sWidth = img.naturalHeight;
            sx = (img.naturalWidth - img.naturalHeight) / 2;
        } else if (img.naturalHeight > img.naturalWidth) {
            sHeight = img.naturalWidth;
            sy = (img.naturalHeight - img.naturalWidth) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, body.x - radiusForClip, body.y - radiusForClip, diameter, diameter);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(body.x, body.y, displayRadius, 0, 2 * Math.PI);
        ctx.fillStyle = body.color;
        ctx.fill();
      }

      const fontSize = Math.max(8, 10 / scale); // Ensure min font size
      ctx.fillStyle = PARAM_TEXT_COLOR;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'left';

      const bodyName = getTranslatedText(body.nameKey, language);
      const textLines = [
        `${bodyName}`,
        `${getTranslatedText('mass', language)}: ${body.mass.toFixed(1)}`,
        `${getTranslatedText('positionXY', language)}: (${body.x.toFixed(1)}, ${body.y.toFixed(1)})`,
        `${getTranslatedText('velocityVxVy', language)}: (${body.vx.toFixed(1)}, ${body.vy.toFixed(1)})`,
      ];

      const textX = body.x + displayRadius + (5 / scale);
      let textY = body.y - (PARAM_TEXT_OFFSET_Y / scale * (textLines.length / 2 - 0.5));

      textLines.forEach(line => {
        ctx.fillText(line, textX, textY);
        textY += fontSize * PARAM_LINE_HEIGHT_FACTOR;
      });
    });
    ctx.restore();

  }, [bodies, scale, originOffset, bodyImages, language, stars, canvasSize]);

  useEffect(() => {
    draw();
  }, [draw, bodies, bodyImages, canvasSize]); // Redraw when canvasSize changes

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
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="border border-border rounded-lg shadow-xl w-full h-full"
        data-ai-hint="cosmic starfield"
      />
      {!isFullscreen && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-background/70 hover:bg-background"
          onClick={onToggleFullscreen}
          aria-label={getTranslatedText('toggleFullscreen', language)}
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      )}
      {isFullscreen && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-20 bg-background/70 hover:bg-background"
            onClick={onToggleFullscreen}
            aria-label={getTranslatedText('toggleFullscreen', language)}
          >
            <Minimize2 className="h-5 w-5" />
          </Button>
          <FullscreenSimulationControls
            initialConditions={initialConditions}
            isRunning={isRunning}
            simulationSpeed={simulationSpeed}
            onUpdateConditions={onUpdateConditionsFromFullscreen}
            onPlayPause={onPlayPauseFullscreen}
            onResetSimulation={onResetSimulationFullscreen}
            onSpeedChange={onSpeedChangeFullscreen}
            language={language}
          />
        </>
      )}
    </div>
  );
}
