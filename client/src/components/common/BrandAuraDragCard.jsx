import React, { useState, useRef } from 'react';
import { Sparkles, Move, Eye, Check } from 'lucide-react';

/**
 * BrandAuraDragCard
 * Interactive component directly reflecting the user's provided palette:
 * - Prussian Blue: #031130
 * - SalesPort Blue: #185DF1
 * - Alice Blue: #F3F7FE
 * Allows direct mouse dragging to morph the gradient live!
 */
export default function BrandAuraDragCard({ onGradientShift }) {
  const [dragProgress, setDragProgress] = useState(55); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    handleDrag(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    handleDrag(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleDrag = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percentage = Math.round((offsetX / rect.width) * 100);
    setDragProgress(percentage);
    if (onGradientShift) onGradientShift(percentage);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className={`relative select-none cursor-ew-resize rounded-2xl p-6 transition-all duration-300 border ${
        isDragging
          ? 'border-salesport shadow-2xl shadow-salesport/40 scale-[1.01]'
          : 'border-brand-border hover:border-salesport/60 shadow-xl shadow-black/50'
      }`}
      style={{
        background: `radial-gradient(ellipse 400px 250px at ${dragProgress}% 40%, rgba(24, 93, 241, 0.45) 0%, rgba(3, 17, 48, 0.95) 60%, #010818 100%)`,
      }}
    >
      {/* Top Banner / Brand Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-salesport/20 border border-salesport/40 flex items-center justify-center text-salesport">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-alice font-bold text-lg tracking-tight">Dynamic Color Mesh</h3>
            <p className="text-xs text-alice-muted">Interactive Drag-Reactive Palette</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-salesport/15 border border-salesport/30 text-xs font-semibold text-alice">
          <Move className="w-3.5 h-3.5 text-salesport animate-pulse" />
          <span>{isDragging ? 'Dragging...' : 'Drag Here'}</span>
        </div>
      </div>

      {/* Main Interactive Gradient Canvas */}
      <div
        className="relative h-28 rounded-xl overflow-hidden mb-6 border border-salesport/30 shadow-inner flex items-center justify-center transition-all duration-150"
        style={{
          background: `linear-gradient(${dragProgress * 3.6}deg, #031130 0%, #185DF1 ${dragProgress}%, #F3F7FE 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        
        {/* Floating Thumb Indicator */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-alice shadow-[0_0_12px_#F3F7FE] flex items-center justify-center transition-all duration-75"
          style={{ left: `${dragProgress}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-salesport border-2 border-alice shadow-lg flex items-center justify-center text-[10px] font-bold text-alice">
            {dragProgress}%
          </div>
        </div>

        <div className="relative z-10 text-center pointer-events-none px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
          <span className="text-xs uppercase tracking-widest text-alice font-semibold block">
            {isDragging ? 'Shifting Chroma...' : 'Click & Drag to Morph'}
          </span>
        </div>
      </div>

      {/* Palette Color Chips matching provided reference */}
      <div className="grid grid-cols-3 gap-3">
        {/* Chip 1: Prussian Blue */}
        <div className="rounded-xl p-3 bg-[#031130] border border-blue-900/40 text-left transition-transform hover:-translate-y-0.5">
          <div className="text-xs font-semibold text-alice/90 truncate">Prussian Blue</div>
          <div className="text-[10px] font-mono text-alice-muted mt-1 uppercase tracking-wider">HEX: 031130</div>
          <div className="mt-2.5 w-full h-1.5 rounded-full bg-[#031130] border border-white/20" />
        </div>

        {/* Chip 2: SalesPort Blue */}
        <div className="rounded-xl p-3 bg-[#185DF1] border border-blue-400/40 text-left transition-transform hover:-translate-y-0.5 shadow-md shadow-salesport/20">
          <div className="text-xs font-semibold text-alice truncate">SalesPort Blue</div>
          <div className="text-[10px] font-mono text-alice/90 mt-1 uppercase tracking-wider">HEX: 185DF1</div>
          <div className="mt-2.5 w-full h-1.5 rounded-full bg-[#185DF1] border border-white/40" />
        </div>

        {/* Chip 3: Alice Blue */}
        <div className="rounded-xl p-3 bg-[#F3F7FE] border border-white/60 text-left transition-transform hover:-translate-y-0.5">
          <div className="text-xs font-semibold text-[#031130] truncate">Alice Blue</div>
          <div className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-wider">HEX: F3F7FE</div>
          <div className="mt-2.5 w-full h-1.5 rounded-full bg-[#F3F7FE] border border-[#031130]/30" />
        </div>
      </div>
    </div>
  );
}
