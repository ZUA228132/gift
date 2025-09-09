import React from 'react';
import { type WebAppUser, type Toy } from '../types';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface ProfilePanelProps {
    onClose: () => void;
    user: WebAppUser | null;
    prizes: Toy[];
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose, user, prizes }) => {
    const displayName = user?.first_name || 'Player';
    const profilePic = user?.photo_url;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 max-w-md w-full relative flex flex-col" style={{height: '80vh'}}>
                <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-4xl font-light transition-colors">&times;</button>
                <div className="flex flex-col items-center mb-6">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-2 border-cyan-400 shadow-lg"/>
                    ) : (
                        <UserCircleIcon className="w-24 h-24 text-slate-500" />
                    )}
                    <h2 className="text-2xl font-bold text-white text-center mt-4">{displayName}</h2>
                </div>

                <h3 className="text-lg font-bold text-cyan-300 mb-3 text-center tracking-widest">PRIZE COLLECTION</h3>
                <div className="flex-grow bg-black/20 p-2 rounded-xl shadow-inner overflow-y-auto">
                    {prizes.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {prizes.filter(p => p).map((prize, index) => (
                                <div key={`${prize.id}-${index}`} className="bg-slate-700/50 p-2 rounded-lg flex flex-col items-center justify-center aspect-square text-center">
                                    {prize.imageUrl ? (
                                        <img src={prize.imageUrl} alt={prize.name} className="w-12 h-12 object-contain"/>
                                    ) : (
                                        <span className="text-4xl">{prize.emoji}</span>
                                    )}
                                    <p className="text-xs text-white truncate w-full mt-1">{prize.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 pt-10">You haven't won any prizes yet!</p>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ProfilePanel;
