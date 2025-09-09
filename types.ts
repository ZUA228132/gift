// Fix: Define and export types to resolve placeholder errors and module resolution issues.
export interface Toy {
  id: number | string;
  name: string;
  emoji?: string; 
  x: number; // position percentage
  y: number; // position percentage
  imageUrl?: string; // For custom toys
}

export enum ClawState {
  Open = 'OPEN',
  Closed = 'CLOSED',
}

export enum GameState {
  Ready = 'READY', 
  Moving = 'MOVING', 
  Dropping = 'DROPPING', 
  Closing = 'CLOSING', 
  Lifting = 'LIFTING', 
  Returning = 'RETURNING', 
  Dropped = 'DROPPED', 
  Resetting = 'RESETTING', 
}

// For Telegram integration and user profile
export interface WebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface UserSettings {
  displayName: string;
}

// Add a placeholder for the global Telegram object
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe: {
          user?: WebAppUser;
        };
        ready: () => void;
      }
    }
  }
}
