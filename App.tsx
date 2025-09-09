import React, { useState, useEffect, useCallback, useRef } from 'react';
import ClawMachine from './components/ClawMachine';
import Controls from './components/Controls';
import PrizeDisplay from './components/PrizeDisplay';
import FactPopup from './components/FactPopup';
import AdminPanel from './components/AdminPanel';
import BalancePanel from './components/BalancePanel';
import ProfilePanel from './components/ProfilePanel';
import SettingsPanel from './components/SettingsPanel';
import { type Toy, ClawState, GameState, type WebAppUser, type UserSettings } from './types';
import { INITIAL_TOYS, CLAW_START_X, CLAW_START_Y, PRIZE_CHUTE_X, GAME_COST, INITIAL_BALANCE, DEFAULT_GRAB_CHANCE } from './constants';
import { getToyFact } from './services/geminiService';
import { Cog8ToothIcon, UserCircleIcon, WrenchScrewdriverIcon, HomeIcon } from '@heroicons/react/24/outline';

type ActivePanel = 'profile' | 'admin' | 'settings' | 'balance' | null;

const App: React.FC = () => {
  const [toys, setToys] = useState<Toy[]>([]);
  const [clawPos, setClawPos] = useState({ x: CLAW_START_X, y: CLAW_START_Y });
  const [clawState, setClawState] = useState<ClawState>(ClawState.Open);
  const [gameState, setGameState] = useState<GameState>(GameState.Ready);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [prizes, setPrizes] = useState<Toy[]>([]);
  const [factPopup, setFactPopup] = useState<{ toy: Toy | null; fact: string | null; isLoading: boolean }>({ toy: null, fact: null, isLoading: false });
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [grabChance, setGrabChance] = useState(DEFAULT_GRAB_CHANCE);
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [settings, setSettings] = useState<UserSettings>({ displayName: '' });

  const grabbedToyRef = useRef<Toy | null>(null);

  const loadToys = useCallback(() => {
    try {
      const stored = localStorage.getItem('hft-claw-custom-toys');
      const customToys = stored ? JSON.parse(stored) : [];
      const combinedToys = [
        ...INITIAL_TOYS, 
        ...customToys.map((t: any, i: number) => ({
          ...t,
          id: `custom-${t.id}`,
          x: 25 + (i % 8) * 9,
          y: 65 + Math.floor(i / 8) * 8,
          emoji: undefined
      }))];
      setToys(combinedToys);
    } catch (e) {
      console.error("Failed to load toys", e);
      setToys(INITIAL_TOYS);
    }
  }, []);

  useEffect(() => {
    // Load from LocalStorage
    try {
        const savedBalance = localStorage.getItem('hft-claw-balance');
        const savedPrizes = localStorage.getItem('hft-claw-prizes');
        const savedChance = localStorage.getItem('hft-claw-grabChance');
        
        if (savedBalance) setBalance(JSON.parse(savedBalance));
        if (savedPrizes) setPrizes(JSON.parse(savedPrizes));
        if (savedChance) setGrabChance(JSON.parse(savedChance));

    } catch (e) { console.error("Failed to load saved data", e); }
    
    // Load toys
    loadToys();

    // Init Telegram User
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        setUser(window.Telegram.WebApp.initDataUnsafe.user);
        setSettings({ displayName: window.Telegram.WebApp.initDataUnsafe.user.first_name });
    }
    window.Telegram?.WebApp?.ready();

  }, [loadToys]);

  const handleMove = useCallback((direction: 'left' | 'right') => {
    if (gameState !== GameState.Ready) return;
    setClawPos(prev => {
      const newX = prev.x + (direction === 'left' ? -2 : 2);
      return { ...prev, x: Math.max(20, Math.min(95, newX)) };
    });
  }, [gameState]);

  const handleGrab = useCallback(() => {
    if (gameState !== GameState.Ready || balance < GAME_COST) return;

    const newBalance = balance - GAME_COST;
    setBalance(newBalance);
    localStorage.setItem('hft-claw-balance', JSON.stringify(newBalance));
    setGameState(GameState.Dropping);

    let targetToy: Toy | null = null;
    let closestDistance = Infinity;
    toys.forEach(toy => {
      const distance = Math.abs(toy.x - clawPos.x);
      if (distance < 5 && toy.y > clawPos.y) {
         if (distance < closestDistance) {
           closestDistance = distance;
           targetToy = toy;
         }
      }
    });
    
    setTimeout(() => {
      setGameState(GameState.Closing);
      if (targetToy) setClawPos({ x: clawPos.x, y: targetToy.y - 5 });
      else setClawPos({ x: clawPos.x, y: 85 });
    }, 1500);

    setTimeout(() => {
      setClawState(ClawState.Closed);
      const isSuccess = Math.random() * 100 < grabChance;
      if (targetToy && isSuccess) {
        grabbedToyRef.current = targetToy;
        setToys(prevToys => prevToys.filter(t => t.id !== targetToy!.id));
      }
      setGameState(GameState.Lifting);
    }, 2000);

    setTimeout(() => {
       setClawPos({ x: clawPos.x, y: CLAW_START_Y });
       if (!grabbedToyRef.current) setClawState(ClawState.Open);
       setGameState(GameState.Returning);
    }, 3500);
    
    setTimeout(() => {
      setClawPos({ x: PRIZE_CHUTE_X, y: CLAW_START_Y });
      if (grabbedToyRef.current) setGameState(GameState.Dropped);
      else setGameState(GameState.Resetting);
    }, 5000);
    
    setTimeout(() => {
      if (grabbedToyRef.current) {
        setClawState(ClawState.Open);
        const newPrizes = [...prizes, grabbedToyRef.current];
        setPrizes(newPrizes);
        localStorage.setItem('hft-claw-prizes', JSON.stringify(newPrizes));
        setFactPopup({ toy: grabbedToyRef.current, fact: null, isLoading: false });
        grabbedToyRef.current = null;
      }
      setGameState(GameState.Resetting);
    }, 5500);
    
    setTimeout(() => {
      setClawPos({ x: CLAW_START_X, y: CLAW_START_Y });
      setGameState(GameState.Ready);
    }, 6500);
  }, [gameState, balance, clawPos, toys, grabChance, prizes]);
  
  const handleFetchFact = useCallback(async () => {
    if (!factPopup.toy) return;
    setFactPopup(prev => ({ ...prev, isLoading: true }));
    try {
      const fact = await getToyFact(factPopup.toy.name);
      setFactPopup(prev => ({ ...prev, fact, isLoading: false }));
    } catch (error) {
      console.error(error);
      setFactPopup(prev => ({ ...prev, fact: "Sorry, I couldn't think of a fact right now!", isLoading: false }));
    }
  }, [factPopup.toy]);

  const handleChanceChange = (chance: number) => {
    setGrabChance(chance);
    localStorage.setItem('hft-claw-grabChance', JSON.stringify(chance));
  }

  const handleAddBalance = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    localStorage.setItem('hft-claw-balance', JSON.stringify(newBalance));
    setActivePanel(null);
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen h-screen flex flex-col items-center justify-between font-sans p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-cyan-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

      <header className="w-full max-w-4xl flex justify-between items-center z-10">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
          NFT CLAW
        </h1>
        <button onClick={() => setActivePanel('balance')} className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-xl font-bold shadow-lg hover:bg-black/30 transition-colors">
          {balance} ⭐
        </button>
      </header>

      <main className="w-full max-w-4xl flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
        <div className="md:col-span-2">
          <ClawMachine toys={toys} clawPos={clawPos} clawState={clawState} />
        </div>
        <div className="flex flex-col gap-4">
          <Controls onMove={handleMove} onGrab={handleGrab} gameState={gameState} balance={balance} />
          <PrizeDisplay prizes={prizes} />
        </div>
      </main>

      <footer className="w-full max-w-md bg-black/20 backdrop-blur-xl border border-white/10 rounded-full shadow-lg p-2 z-10">
        <nav className="flex justify-around items-center">
            <button onClick={() => setActivePanel('profile')} className="flex flex-col items-center text-slate-400 hover:text-white transition-colors p-2 rounded-full">
                <UserCircleIcon className="h-7 w-7" />
                <span className="text-xs mt-1">Profile</span>
            </button>
            <button onClick={() => setActivePanel('admin')} className="flex flex-col items-center text-slate-400 hover:text-white transition-colors p-2 rounded-full">
                <WrenchScrewdriverIcon className="h-7 w-7" />
                <span className="text-xs mt-1">Admin</span>
            </button>
             <button onClick={() => setActivePanel('settings')} className="flex flex-col items-center text-slate-400 hover:text-white transition-colors p-2 rounded-full">
                <Cog8ToothIcon className="h-7 w-7" />
                <span className="text-xs mt-1">Settings</span>
            </button>
        </nav>
      </footer>

      {factPopup.toy && <FactPopup toy={factPopup.toy} fact={factPopup.fact} isLoading={factPopup.isLoading} onFetchFact={handleFetchFact} onClose={() => setFactPopup({ toy: null, fact: null, isLoading: false })} />}
      {activePanel === 'admin' && <AdminPanel onClose={() => setActivePanel(null)} onToysUpdate={loadToys} initialGrabChance={grabChance} onChanceChange={handleChanceChange} />}
      {activePanel === 'profile' && <ProfilePanel onClose={() => setActivePanel(null)} user={user} prizes={prizes} />}
      {activePanel === 'settings' && <SettingsPanel onClose={() => setActivePanel(null)} settings={settings} onSettingsChange={setSettings} />}
      {activePanel === 'balance' && <BalancePanel onClose={() => setActivePanel(null)} onAddBalance={handleAddBalance} />}
    </div>
  );
};
export default App;
