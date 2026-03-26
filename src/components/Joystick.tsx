import React, { useState, useRef, useEffect } from 'react';

interface JoystickProps {
  onDirectionChange: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

export default function Joystick({ onDirectionChange }: JoystickProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);
  const maxDistance = 40;
  const lastDirection = useRef<string | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!baseRef.current) return;

    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let newX = dx;
    let newY = dy;

    if (distance > maxDistance) {
      newX = (dx / distance) * maxDistance;
      newY = (dy / distance) * maxDistance;
    }

    setPosition({ x: newX, y: newY });

    if (distance > 15) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      let dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null = null;
      
      if (angle > -45 && angle <= 45) {
        dir = 'RIGHT';
      } else if (angle > 45 && angle <= 135) {
        dir = 'DOWN';
      } else if (angle > 135 || angle <= -135) {
        dir = 'LEFT';
      } else if (angle > -135 && angle <= -45) {
        dir = 'UP';
      }

      if (dir && dir !== lastDirection.current) {
        onDirectionChange(dir);
        lastDirection.current = dir;
      }
    } else {
      lastDirection.current = null;
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    lastDirection.current = null;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={baseRef}
      onPointerDown={handlePointerDown}
      className="relative w-32 h-32 border-4 border-[#0ff] bg-[#0a0a0a] flex items-center justify-center touch-none cursor-pointer"
    >
      {/* Grid lines inside joystick base */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)`,
        backgroundSize: `10px 10px`
      }}></div>

      {/* Crosshairs */}
      <div className="absolute w-full h-1 bg-[#0ff] opacity-50"></div>
      <div className="absolute h-full w-1 bg-[#0ff] opacity-50"></div>

      {/* The Stick */}
      <div 
        className={`absolute w-12 h-12 border-4 border-[#f0f] bg-[#050505] flex items-center justify-center z-10 ${isDragging ? 'scale-90' : 'scale-100 transition-transform duration-75'}`}
        style={isDragging ? { transform: `translate(${position.x}px, ${position.y}px)` } : { transform: `translate(0px, 0px)` }}
      >
        <div className="w-4 h-4 bg-[#f0f] animate-pulse"></div>
      </div>
    </div>
  );
}
