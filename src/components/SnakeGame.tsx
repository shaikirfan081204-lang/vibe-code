import React, { useState, useEffect, useCallback, useRef } from 'react';
import Joystick from './Joystick';

// Grid settings
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && hasStarted && !gameOver) {
      setIsPaused(prev => !prev);
      return;
    }

    if (!hasStarted || gameOver || isPaused) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [hasStarted, gameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleJoystickDirection = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!hasStarted || gameOver || isPaused) return;
    const currentDir = directionRef.current;
    switch (dir) {
      case 'UP':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'DOWN':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'LEFT':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'RIGHT':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [hasStarted, gameOver, isPaused]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, hasStarted, highScore, generateFood]);

  useEffect(() => {
    if (hasStarted && !isPaused && !gameOver) {
      const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 8);
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, hasStarted, isPaused, gameOver, score]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 p-4">
      <div className="hidden md:flex flex-col items-center justify-center border-2 border-[#f0f] p-4 bg-[#050505]">
        <p className="text-[#f0f] text-xl mb-4 glitch-text" data-text="INPUT_DEV">INPUT_DEV</p>
        <Joystick onDirectionChange={handleJoystickDirection} />
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md">
        <div className="flex justify-between w-full mb-2 px-2 border-b-2 border-[#0ff] pb-2">
          <div className="text-[#0ff] text-2xl">
            SEQ: {score.toString().padStart(4, '0')}
          </div>
          <div className="text-[#f0f] text-2xl">
            MAX: {highScore.toString().padStart(4, '0')}
          </div>
        </div>

        <div 
          className="relative bg-[#050505] border-4 border-[#0ff] overflow-hidden screen-tear"
          style={{
            width: `${GRID_SIZE * CELL_SIZE}px`,
            height: `${GRID_SIZE * CELL_SIZE}px`,
          }}
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)`,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
            }}
          />

          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute ${isHead ? 'bg-[#f0f]' : 'bg-[#0ff]'}`}
                style={{
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  left: `${segment.x * CELL_SIZE}px`,
                  top: `${segment.y * CELL_SIZE}px`,
                }}
              />
            );
          })}

          <div
            className="absolute bg-[#f0f] animate-ping"
            style={{
              width: `${CELL_SIZE - 4}px`,
              height: `${CELL_SIZE - 4}px`,
              left: `${food.x * CELL_SIZE + 2}px`,
              top: `${food.y * CELL_SIZE + 2}px`,
            }}
          />

          {(!hasStarted || gameOver || isPaused) && (
            <div className="absolute inset-0 bg-[#050505]/90 flex flex-col items-center justify-center z-20 p-4 text-center border-4 border-[#f0f] m-2">
              {!hasStarted ? (
                <>
                  <h2 className="text-4xl text-[#0ff] mb-6 glitch-text" data-text="AWAITING_INPUT">
                    AWAITING_INPUT
                  </h2>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-[#0ff] text-[#050505] text-2xl hover:bg-[#f0f] hover:text-[#0ff] transition-colors"
                  >
                    [ EXECUTE ]
                  </button>
                </>
              ) : gameOver ? (
                <>
                  <h2 className="text-5xl text-[#f0f] mb-2 glitch-text" data-text="FATAL_ERROR">
                    FATAL_ERROR
                  </h2>
                  <p className="text-[#0ff] text-2xl mb-6">DATA CORRUPTED: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-[#f0f] text-[#050505] text-2xl hover:bg-[#0ff] hover:text-[#050505] transition-colors"
                  >
                    [ REBOOT ]
                  </button>
                </>
              ) : isPaused ? (
                <>
                  <h2 className="text-5xl text-[#0ff] mb-6 glitch-text" data-text="SYSTEM_HALT">
                    SYSTEM_HALT
                  </h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 bg-[#0ff] text-[#050505] text-2xl hover:bg-[#f0f] hover:text-[#050505] transition-colors"
                  >
                    [ RESUME ]
                  </button>
                </>
              ) : null}
            </div>
          )}
        </div>
        
        <div className="mt-8 flex flex-col items-center md:hidden border-2 border-[#f0f] p-4 bg-[#050505] w-full">
          <p className="text-[#f0f] text-xl mb-4 glitch-text" data-text="INPUT_DEV">INPUT_DEV</p>
          <Joystick onDirectionChange={handleJoystickDirection} />
        </div>
      </div>
    </div>
  );
}
