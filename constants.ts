import { type Toy } from './types';

// Machine dimensions are handled as percentages of the container
export const MACHINE_WIDTH = 100; // Represents 100%
export const MACHINE_HEIGHT = 100; // Represents 100%

export const CLAW_START_X = 50; // %
export const CLAW_START_Y = 10; // %
export const PRIZE_CHUTE_X = 15; // %

export const GAME_COST = 25;
export const INITIAL_BALANCE = 200;
export const DEFAULT_GRAB_CHANCE = 80; // in percent

export const INITIAL_TOYS: Toy[] = [
  { id: 1, emoji: '🧸', name: 'Teddy Bear', x: 25, y: 70 },
  { id: 2, emoji: '🚀', name: 'Rocket', x: 40, y: 80 },
  { id: 3, emoji: '🦄', name: 'Unicorn', x: 55, y: 75 },
  { id: 4, emoji: '🚗', name: 'Race Car', x: 70, y: 85 },
  { id: 5, emoji: '🦖', name: 'Dinosaur', x: 85, y: 70 },
  { id: 6, emoji: '🤖', name: 'Robot', x: 30, y: 88 },
  { id: 7, emoji: '⚽', name: 'Soccer Ball', x: 65, y: 68 },
  { id: 8, emoji: '⭐', name: 'Star', x: 50, y: 85 },
  { id: 9, emoji: '👽', name: 'Alien', x: 80, y: 82 },
  { id: 10, emoji: '💎', name: 'Diamond', x: 35, y: 65 },
  { id: 11, emoji: '🍕', name: 'Pizza Slice', x: 60, y: 90 },
  { id: 12, emoji: '🎮', name: 'Controller', x: 75, y: 60 },
  { id: 13, emoji: '🐙', name: 'Octopus', x: 45, y: 68 },
  { id: 14, emoji: '👑', name: 'Crown', x: 90, y: 88 },
  { id: 15, emoji: '🍓', name: 'Strawberry', x: 28, y: 80 },
];