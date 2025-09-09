import React from 'react';
import { GameState } from '../types';
import { GAME_COST } from '../constants';

interface ControlsProps {
  onMove: (direction: 'left' | 'right') => void;
  onGrab: () => void;
  gameState: GameState;
  balance: number;
}

const Controls: React.FC<ControlsProps> = ({ onMove, onGrab, gameState, balance }) => {
  const isMovementDisabled = gameState !== GameState.Ready;
  const isGrabDisabled = gameState !== GameState.Ready || balance < GAME_COST;

  return (
    <div className="w-full bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-inner flex justify-between items-center">
      <div className="flex gap-3">
        <button onPointerDown={() => onMove('left')} disabled={isMovementDisabled} className="w-16 h-16 bg-slate-700/50 rounded-full text-white text-3xl font-bold transition-all duration-100 active:bg-slate-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
          &larr;
        </button>
        <button onPointerDown={() => onMove('right')} disabled={isMovementDisabled} className="w-16 h-16 bg-slate-700/50 rounded-full text-white text-3xl font-bold transition-all duration-100 active:bg-slate-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
          &rarr;
        </button>
      </div>
      <button
        onClick={onGrab}
        disabled={isGrabDisabled}
        className="px-6 h-16 font-bold bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full text-lg sm:text-xl transition-all duration-100 active:scale-95 active:shadow-inner disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        GRAB / {GAME_COST} ⭐
      </button>
    </div>
  );
};

export default Controls;
