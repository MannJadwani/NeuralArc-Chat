import { useState, useEffect, useCallback } from 'react';

interface DragHandleProps {
  onResize: (delta: number) => void;
  direction?: 'horizontal' | 'vertical';
}

export function DragHandle({ onResize, direction = 'horizontal' }: DragHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const delta = direction === 'horizontal' ? e.movementX : e.movementY;
      onResize(delta);
    }
  }, [isDragging, onResize, direction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`${
        direction === 'horizontal' 
          ? 'w-1 cursor-col-resize hover:w-1.5' 
          : 'h-1 cursor-row-resize hover:h-1.5'
      } bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 ${
        isDragging ? 'bg-gray-400 dark:bg-gray-500' : ''
      }`}
    />
  );
} 