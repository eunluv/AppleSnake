
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './components/GameBoard';
import GameOverModal from './components/GameOverModal';
import { GRID_SIZE, INITIAL_SNAKE_POSITION, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from './constants';
import { Position, Direction } from './types';

const App: React.FC = () => {
  const getRandomPosition = (snakeBody: Position[] = []): Position => {
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
  };

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState<Position>(getRandomPosition(INITIAL_SNAKE_POSITION));
  const directionRef = useRef<Direction>(Direction.RIGHT);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const resetGame = useCallback(() => {
    const initialSnake = INITIAL_SNAKE_POSITION;
    setSnake(initialSnake);
    setFood(getRandomPosition(initialSnake));
    directionRef.current = Direction.RIGHT;
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setIsGameOver(false);
    setIsRunning(true);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isRunning && !isGameOver) {
        setIsRunning(true);
    }

    const newDirection = e.key;
    const currentDirection = directionRef.current;

    switch (newDirection) {
      case 'ArrowUp':
        if (currentDirection !== Direction.DOWN) directionRef.current = Direction.UP;
        break;
      case 'ArrowDown':
        if (currentDirection !== Direction.UP) directionRef.current = Direction.DOWN;
        break;
      case 'ArrowLeft':
        if (currentDirection !== Direction.RIGHT) directionRef.current = Direction.LEFT;
        break;
      case 'ArrowRight':
        if (currentDirection !== Direction.LEFT) directionRef.current = Direction.RIGHT;
        break;
    }
  }, [isRunning, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isRunning || isGameOver) {
      return;
    }

    const gameInterval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (directionRef.current) {
          case Direction.UP:
            head.y -= 1;
            break;
          case Direction.DOWN:
            head.y += 1;
            break;
          case Direction.LEFT:
            head.x -= 1;
            break;
          case Direction.RIGHT:
            head.x += 1;
            break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setIsGameOver(true);
            setIsRunning(false);
            return prevSnake;
          }
        }

        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prevScore => prevScore + 1);
          setSpeed(prevSpeed => Math.max(MIN_SPEED, prevSpeed - SPEED_INCREMENT));
          setFood(getRandomPosition(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [isRunning, isGameOver, speed, food]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg mx-auto text-center">
        <h1 className="text-4xl font-bold text-green-400 mb-2">사과 게임</h1>
        <p className="text-gray-400 mb-4">Eat the apples (🍎) to grow!</p>
        
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg shadow-lg mb-4">
          <div className="text-lg">
            Score: <span className="font-bold text-yellow-400">{score}</span>
          </div>
           <div className="text-lg">
            Speed: <span className="font-bold text-blue-400">{((INITIAL_SPEED - speed) / SPEED_INCREMENT) + 1}</span>
          </div>
        </div>

        <GameBoard snake={snake} food={food} />

        {!isRunning && !isGameOver && (
          <div className="mt-6 text-xl text-gray-300 animate-pulse">
            Press any arrow key to start!
          </div>
        )}
      </div>

      {isGameOver && <GameOverModal score={score} onRestart={resetGame} />}
    </div>
  );
};

export default App;
