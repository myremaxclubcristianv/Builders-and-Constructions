'use client';

import React, { useEffect, useRef } from 'react';

export function Executive3DGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check for prefers-reduced-motion or low power
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Grid Parameters
    const numLines = isMobile ? 12 : 20;
    let angle = 0;

    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Ambient radial dark gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.3,
        10,
        width / 2,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, 'rgba(13, 16, 15, 0.4)');
      bgGrad.addColorStop(0.6, 'rgba(7, 9, 8, 0.85)');
      bgGrad.addColorStop(1, '#070908');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (prefersReducedMotion) {
        // Render static subtle grid on reduced motion
        ctx.strokeStyle = 'rgba(199, 166, 117, 0.04)';
        ctx.lineWidth = 0.5;
        const horizon = height * 0.45;
        for (let i = 0; i <= numLines; i++) {
          const x = (width / numLines) * i;
          ctx.beginPath();
          ctx.moveTo(x, horizon);
          ctx.lineTo((x - width / 2) * 2.5 + width / 2, height);
          ctx.stroke();
        }
        return;
      }

      angle += 0.0008;

      ctx.save();

      // Perspective horizon setup
      const horizonY = height * 0.38;
      const focalX = width / 2;

      // Volumetric architectural wireframe grid lines
      ctx.strokeStyle = 'rgba(199, 166, 117, 0.05)';
      ctx.lineWidth = 0.75;

      // Perspective longitudinal lines
      const span = width * 1.8;
      const step = span / numLines;

      for (let i = -numLines / 2; i <= numLines / 2; i++) {
        const startX = focalX + i * (step * 0.25);
        const endX = focalX + i * step + Math.sin(angle + i * 0.2) * 15;

        ctx.beginPath();
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, height + 100);
        ctx.stroke();
      }

      // Latitudinal ground planes (moving towards viewport)
      const numPlanes = isMobile ? 8 : 14;
      const speed = (angle * 40) % 1;

      for (let j = 0; j < numPlanes; j++) {
        const progress = ((j + speed) / numPlanes);
        const planeY = horizonY + Math.pow(progress, 2.2) * (height - horizonY + 100);
        const alpha = Math.sin(progress * Math.PI) * 0.06;

        ctx.strokeStyle = `rgba(199, 166, 117, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(0, planeY);
        ctx.lineTo(width, planeY);
        ctx.stroke();
      }

      // Floating intelligence node points (volumetric spatial depth)
      const nodes = isMobile ? 6 : 12;
      for (let n = 0; n < nodes; n++) {
        const nx = focalX + Math.sin(angle * 1.2 + n) * (width * 0.35);
        const ny = horizonY + Math.cos(angle * 0.8 + n * 1.5) * (height * 0.25) + 60;
        const nzAlpha = (Math.sin(angle + n) + 1) * 0.12;

        ctx.fillStyle = `rgba(212, 175, 55, ${nzAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(nx, ny, 1.5 + (nzAlpha * 3), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.45
      }}
      aria-hidden="true"
    />
  );
}
