
import React from 'react';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-red-500 rounded-lg shadow-xl p-8 text-center animate-fade-in-up">
        <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over</h2>
        <p className="text-xl mb-2">Your final score is:</p>
        <p className="text-5xl font-bold text-yellow-400 mb-8">{score}</p>
        <button
          onClick={onRestart}
          className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Restart Game
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameOverModal;
