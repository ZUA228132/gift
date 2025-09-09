import React from 'react';
import { type Toy, ClawState } from '../types';

interface ClawProps {
  pos: { x: number; y: number };
  state: ClawState;
}

const Claw: React.FC<ClawProps> = ({ pos, state }) => {
  const armHeight = pos.y;
  const clawOpenTransform = state === ClawState.Open ? 'rotate(30deg)' : 'rotate(-10deg)';
  const clawClosedTransform = state === ClawState.Open ? 'rotate(-30deg)' : 'rotate(10deg)';

  return (
    <div
      className="absolute top-0 transition-all duration-100 ease-linear"
      style={{ left: `${pos.x}%`, transform: 'translateX(-50%)', height: '100%', width: '4%' }}
    >
      {/* Arm */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-lg shadow-lg"
        style={{ height: `${armHeight}%` }}
      />
      {/* Claw Base */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-b from-slate-200 to-slate-400 border-2 border-slate-500 rounded-full flex items-center justify-center transition-all duration-100 ease-linear"
        style={{ top: `${pos.y}%` }}
      >
        <div className="w-6 h-6 bg-slate-300 rounded-full shadow-inner"></div>
        {/* Claw Fingers */}
        <div
          className="absolute w-2 h-10 bg-gradient-to-b from-slate-300 to-slate-500 border border-slate-600 rounded-b-lg origin-top-right transition-transform duration-300"
          style={{ transform: clawOpenTransform, left: '50%', top: '50%', zIndex: -1 }}
        />
        <div
          className="absolute w-2 h-10 bg-gradient-to-b from-slate-300 to-slate-500 border border-slate-600 rounded-b-lg origin-top-left transition-transform duration-300"
          style={{ transform: clawClosedTransform, right: '50%', top: '50%', zIndex: -1 }}
        />
         <div
          className="absolute w-2 h-10 bg-gradient-to-b from-slate-300 to-slate-500 border border-slate-600 rounded-b-lg origin-top transition-transform duration-300"
          style={{ transform: 'rotate(0deg)', top: '50%', zIndex: -2 }}
        />
      </div>
    </div>
  );
};

interface ToyIconProps {
  toy: Toy;
}

const ToyIcon: React.FC<ToyIconProps> = ({ toy }) => (
  <div
    className="absolute transition-all duration-100 ease-linear flex items-center justify-center"
    style={{ 
      left: `${toy.x}%`, 
      top: `${toy.y}%`, 
      transform: 'translate(-50%, -50%)',
      filter: 'drop-shadow(3px 3px 3px rgba(0,0,0,0.4))'
    }}
  >
    {toy.imageUrl ? (
      <img src={toy.imageUrl} alt={toy.name} className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
    ) : (
      <span className="text-4xl sm:text-5xl">{toy.emoji}</span>
    )}
  </div>
);

interface ClawMachineProps {
  toys: Toy[];
  clawPos: { x: number; y: number };
  clawState: ClawState;
}

const ClawMachine: React.FC<ClawMachineProps> = ({ toys, clawPos, clawState }) => {
  return (
    <div className="relative w-full aspect-[4/3] bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-800/10 to-purple-800/20 z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-900/10 z-0"></div>

      {/* Prize Chute */}
      <div className="absolute bottom-0 left-0 w-[27%] h-full bg-black/20 z-10 border-r border-white/10">
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cyan-300 font-bold text-xs sm:text-sm tracking-widest opacity-70">PRIZES</div>
      </div>

      <div className="relative w-full h-full z-20">
        {toys.map(toy => (
          <ToyIcon key={toy.id} toy={toy} />
        ))}
        <Claw pos={clawPos} state={clawState} />
      </div>
      
      {/* Glass Glare Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none z-30">
        <div className="absolute top-0 left-[-150%] w-3/4 h-full bg-gradient-to-r from-transparent to-white/5 transform -skew-x-16 animate-glare" />
      </div>
      <style>{`
        @keyframes glare {
          0% { left: -150%; }
          100% { left: 150%; }
        }
        .animate-glare {
          animation: glare 6s linear infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default ClawMachine;