import React, { useState, useEffect } from 'react';
import { type Toy } from '../types';

type StoredToy = Pick<Toy, 'id' | 'name' | 'imageUrl'>;

interface AdminPanelProps {
    onClose: () => void;
    onToysUpdate: () => void;
    initialGrabChance: number;
    onChanceChange: (chance: number) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onToysUpdate, initialGrabChance, onChanceChange }) => {
    const [customToys, setCustomToys] = useState<StoredToy[]>([]);
    const [newToyName, setNewToyName] = useState('');
    const [newToyImage, setNewToyImage] = useState<string | null>(null);
    const [grabChance, setGrabChance] = useState(initialGrabChance);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('hft-claw-custom-toys');
            if (stored) {
                setCustomToys(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load toys from localStorage", e);
        }
    }, []);

    const handleChanceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChance = parseInt(e.target.value, 10);
        setGrabChance(newChance);
        onChanceChange(newChance);
    };

    const saveToys = (toysToSave: StoredToy[]) => {
        try {
            localStorage.setItem('hft-claw-custom-toys', JSON.stringify(toysToSave));
            setCustomToys(toysToSave);
            onToysUpdate();
        } catch (e) {
            console.error("Failed to save toys to localStorage", e);
            alert("Error saving toys. Storage might be full.");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewToyImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddToy = () => {
        if (!newToyName || !newToyImage) {
            alert("Please provide a name and an image for the new prize.");
            return;
        }
        const newToy: StoredToy = {
            id: Date.now(),
            name: newToyName,
            imageUrl: newToyImage,
        };
        saveToys([...customToys, newToy]);
        setNewToyName('');
        setNewToyImage(null);
        const fileInput = document.getElementById('toy-image-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };
    
    const handleDeleteToy = (id: number | string) => {
        if (window.confirm("Are you sure you want to delete this prize?")) {
            const updatedToys = customToys.filter(toy => toy.id !== id);
            saveToys(updatedToys);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 max-w-2xl w-full relative">
                <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-white text-4xl font-light transition-colors">&times;</button>
                <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Panel</h2>

                <div className="bg-black/20 p-4 rounded-xl shadow-inner mb-6">
                    <h3 className="text-lg font-bold text-cyan-300 mb-2">Grab Success Chance: {grabChance}%</h3>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={grabChance}
                        onChange={handleChanceSliderChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                </div>

                <div className="bg-black/20 p-4 rounded-xl shadow-inner mb-6">
                    <h3 className="text-lg font-bold text-cyan-300 mb-3">Add New Prize</h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            id="toy-image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-200 file:text-violet-700 hover:file:bg-violet-300 transition-colors cursor-pointer"
                        />
                        <input 
                            type="text"
                            value={newToyName}
                            onChange={(e) => setNewToyName(e.target.value)}
                            placeholder="Prize Name"
                            className="bg-slate-700 text-white px-3 py-2 rounded-full w-full sm:w-auto border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        {newToyImage && <img src={newToyImage} alt="Preview" className="w-12 h-12 object-cover rounded-md" />}
                        <button
                            onClick={handleAddToy}
                            disabled={!newToyImage || !newToyName}
                            className="px-6 py-2.5 font-bold bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-full text-sm text-white text-center transition-all active:scale-95"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-cyan-300 mb-3">Custom Prizes</h3>
                    <div className="max-h-60 overflow-y-auto bg-black/20 p-2 rounded-xl shadow-inner">
                        {customToys.length > 0 ? (
                            customToys.map(toy => (
                                <div key={toy.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-lg mb-2">
                                    <div className="flex items-center gap-4">
                                        <img src={toy.imageUrl} alt={toy.name} className="w-10 h-10 object-cover rounded-md" />
                                        <span className="text-white">{toy.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteToy(toy.id)}
                                        className="px-3 py-1.5 font-bold bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 rounded-full text-xs text-white transition-all active:scale-95"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-4">No custom prizes yet. Add one above!</p>
                        )}
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};
export default AdminPanel;
