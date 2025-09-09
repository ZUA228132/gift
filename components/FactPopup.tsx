import React from 'react';
import { type Toy } from '../types';

interface FactPopupProps {
  toy: Toy;
  fact: string | null;
  isLoading: boolean;
  onFetchFact: () => void;
  onClose: () => void;
}

const FactPopup: React.FC<FactPopupProps> = ({ toy, fact, isLoading, onFetchFact, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 text-center max-w-md w-full relative animate-pop-in">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-4xl font-light transition-colors">&times;</button>
        <h2 className="text-2xl font-bold text-cyan-300">You won a {toy.name}!</h2>
        <div className="my-6 h-24 flex justify-center items-center">
          {toy.imageUrl ? (
            <img src={toy.imageUrl} alt={toy.name} className="max-h-full max-w-full object-contain drop-shadow-lg" />
          ) : (
            <div className="text-8xl drop-shadow-lg">{toy.emoji}</div>
          )}
        </div>

        {fact ? (
          <div className="bg-black/20 p-4 rounded-lg shadow-inner">
            <p className="text-lg text-white">{fact}</p>
          </div>
        ) : (
          <button
            onClick={onFetchFact}
            disabled={isLoading}
            className={`px-8 py-4 text-white font-bold rounded-full transition-all duration-100 text-lg shadow-lg
            ${isLoading
              ? 'bg-slate-600/50 text-slate-400 shadow-inner cursor-not-allowed'
              : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 active:shadow-inner active:scale-95'
            }`}
          >
            {isLoading ? 'Thinking...' : 'Get a Fun Fact!'}
          </button>
        )}
      </div>
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FactPopup;