
import React from 'react';
import { Position } from '../types';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  snake: Position[];
  food: Position;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food }) => {
  const boardSize = 500; // Fixed size for the container
  const tileSize = boardSize / GRID_SIZE;

  return (
    <div 
      className="relative bg-gray-800 border-4 border-green-500 rounded-lg shadow-2xl"
      style={{ 
        width: `${boardSize}px`, 
        height: `${boardSize}px`,
        backgroundImage: `
          linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: `${tileSize}px ${tileSize}px`,
       }}
    >
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute flex items-center justify-center text-lg transition-all duration-75"
          style={{
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            left: `${segment.x * tileSize}px`,
            top: `${segment.y * tileSize}px`,
            transform: 'scale(1.1)',
          }}
        >
          {index === 0 ? '🐍' : '🟢'}
        </div>
      ))}
      <div
        className="absolute flex items-center justify-center text-lg"
        style={{
          width: `${tileSize}px`,
          height: `${tileSize}px`,
          left: `${food.x * tileSize}px`,
          top: `${food.y * tileSize}px`,
          transform: 'scale(1.1)',
        }}
      >
        🍎
      </div>
    </div>
  );
};

export default GameBoard;
