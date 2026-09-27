import React, { useEffect, useState, useRef } from 'react';

/**
 * InteractiveAuraBackground
 * Listens to mouse position and active drag (click + move).
 * Dynamically shifts background radial mesh gradients between Prussian Blue (#031130),
 * SalesPort Blue (#185DF1), and highlights of Alice Blue (#F3F7FE).
 */
export default function InteractiveAuraBackground() {
  const [coords, setCoords] = useState({ x: 50, y: 35 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragHueShift, setDragHueShift] = useState(0);
  const prevPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e) => {
      setIsDragging(true);
      prevPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e) => {
      const xPct = Math.round((e.clientX / window.innerWidth) * 100);
      const yPct = Math.round((e.clientY / window.innerHeight) * 100);
      setCoords({ x: xPct, y: yPct });

      if (isDragging) {
        const deltaX = e.clientX - prevPos.current.x;
        const deltaY = e.clientY - prevPos.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        setDragHueShift((prev) => (prev + distance * 0.4) % 40);
        prevPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  const primaryGlowX = coords.x;
  const primaryGlowY = coords.y;
  const secondaryGlowX = 100 - coords.x;
  const secondaryGlowY = 100 - coords.y;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-brand-night transition-colors duration-500">
      {/* Deep Base Tone: Prussian Blue Ambient Mesh */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(ellipse 1100px 750px at ${primaryGlowX}% ${primaryGlowY}%, #031130 0%, #010818 70%, #000000 100%)`,
          transition: isDragging ? 'none' : 'background 0.25s ease-out',
        }}
      />

      {/* Vibrant Spotlight: SalesPort Blue (#185DF1) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle ${isDragging ? 550 : 420}px at ${primaryGlowX}% ${primaryGlowY}%, rgba(24, 93, 241, ${
            isDragging ? 0.35 : 0.22
          }) 0%, rgba(3, 17, 48, 0.4) 45%, transparent 75%)`,
          transition: isDragging ? 'none' : 'background 0.2s ease-out',
        }}
      />

      {/* Dynamic Drag-Active Luminous Highlight: Alice Blue (#F3F7FE) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle ${isDragging ? 180 : 80}px at ${primaryGlowX}% ${primaryGlowY}%, rgba(243, 247, 254, ${
            isDragging ? 0.18 : 0.06
          }) 0%, transparent 60%)`,
          transition: isDragging ? 'none' : 'background 0.15s ease-out',
        }}
      />

      {/* Subtle Counter-balancing Deep Glow */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle 600px at ${secondaryGlowX}% ${secondaryGlowY}%, #071b4a 0%, transparent 70%)`,
        }}
      />

      {/* Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(243, 247, 254, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(243, 247, 254, 0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
