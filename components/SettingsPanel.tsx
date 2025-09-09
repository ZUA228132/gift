import React, { useState } from 'react';
import { type UserSettings } from '../types';

interface SettingsPanelProps {
    onClose: () => void;
    settings: UserSettings;
    onSettingsChange: (newSettings: UserSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, settings, onSettingsChange }) => {
    const [displayName, setDisplayName] = useState(settings.displayName);

    const handleSave = () => {
        onSettingsChange({ ...settings, displayName });
        onClose(); // Close after saving
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-4xl font-light transition-colors">&times;</button>
                <h2 className="text-2xl font-bold text-white text-center mb-6">Settings</h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-cyan-300 mb-2">Display Name</label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-slate-700 text-white px-4 py-2 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={handleSave}
                        className="px-8 py-3 font-bold bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full text-lg transition-all active:scale-95 active:shadow-inner shadow-lg"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default SettingsPanel;
