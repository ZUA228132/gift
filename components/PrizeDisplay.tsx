import React from 'react';
import { type Toy } from '../types';

interface PrizeDisplayProps {
  prizes: Toy[];
}

const PrizeDisplay: React.FC<PrizeDisplayProps> = ({ prizes }) => {
  return (
    <div className="w-full bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-inner mt-auto">
      <h2 className="text-center text-cyan-300 font-bold mb-3 tracking-widest text-sm">PRIZES WON</h2>
      <div className="h-28 bg-black/20 rounded-lg p-2 flex items-center gap-2 overflow-x-auto">
        {prizes.length === 0 ? (
          <p className="w-full text-center text-gray-400">Your prize collection is empty.</p>
        ) : (
          prizes.filter(p => p).map((prize, index) => (
            <div key={`${prize.id}-${index}`} className="flex-shrink-0 bg-slate-700/50 p-2 rounded-lg flex flex-col items-center justify-center w-20 h-20 text-center">
              {prize.imageUrl ? (
                <img src={prize.imageUrl} alt={prize.name} className="w-10 h-10 object-contain"/>
              ) : (
                <span className="text-3xl">{prize.emoji}</span>
              )}
              <p className="text-xs text-white truncate w-full mt-1">{prize.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrizeDisplay;
