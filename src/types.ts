export interface Vector2 {
  x: number;
  y: number;
}

export interface GameObject {
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  active: boolean;
}

export interface PlayerShip extends GameObject {
  type: ShipType;
  health: number;
  maxHealth: number;
  fireRate: number;
  lastFired: number;
}

export interface Enemy extends GameObject {
  type: EnemyType;
  health: number;
  maxHealth: number;
  score: number;
  fireRate?: number;
  lastFired?: number;
}

export interface Bullet extends GameObject {
  damage: number;
  isPlayerBullet: boolean;
}

export interface PowerUp extends GameObject {
  type: PowerUpType;
}

export enum ShipType {
  SPEED = 'speed',
  DEFENSE = 'defense', 
  BALANCED = 'balanced'
}

export enum EnemyType {
  NORMAL = 'normal',
  LARGE = 'large',
  BOSS = 'boss'
}

export enum PowerUpType {
  HEALTH = 'health',
  WEAPON = 'weapon',
  SCORE = 'score'
}

export enum GameState {
  TITLE = 'title',
  SHIP_SELECT = 'ship_select',
  DIFFICULTY_SELECT = 'difficulty_select',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over'
}

export enum Difficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard'
}

export interface GameConfig {
  difficulty: Difficulty;
  selectedShip: ShipType;
}

export interface Score {
  value: number;
  difficulty: Difficulty;
  ship: ShipType;
  date: number;
}