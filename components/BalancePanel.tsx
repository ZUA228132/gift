import React from 'react';

interface BalancePanelProps {
    onClose: () => void;
    onAddBalance: (amount: number) => void;
}

const BalancePanel: React.FC<BalancePanelProps> = ({ onClose, onAddBalance }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 max-w-md w-full relative text-center">
                <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-4xl font-light transition-colors">&times;</button>
                <h2 className="text-2xl font-bold text-white text-center mb-6">Replenish Balance</h2>
                <p className="text-slate-300 mb-6">Need more stars? Get 100 for free!</p>
                <button 
                    onClick={() => onAddBalance(100)}
                    className="px-8 py-4 bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 font-bold rounded-full text-lg shadow-lg hover:from-yellow-500 transition-all active:scale-95 active:shadow-inner"
                >
                    Get 100 ⭐
                </button>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default BalancePanel;
