import { GameState, Difficulty, ShipType, GameConfig, Vector2 } from './types';
import { InputManager } from './input';
import { Renderer } from './renderer';
import { Player } from './entities/player';
import { EnemyManager } from './entities/enemyManager';
import { BulletManager } from './entities/bulletManager';
import { Background } from './entities/background';
import { ScoreManager } from './scoreManager';

export class Game {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private inputManager: InputManager;
  private scoreManager: ScoreManager;
  
  private gameState: GameState = GameState.TITLE;
  private config: GameConfig = {
    difficulty: Difficulty.NORMAL,
    selectedShip: ShipType.BALANCED
  };
  
  private player: Player | null = null;
  private enemyManager: EnemyManager | null = null;
  private bulletManager: BulletManager | null = null;
  private background: Background;
  
  private lastTime = 0;
  private score = 0;
  private lives = 3;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    
    this.renderer = new Renderer(ctx);
    this.inputManager = new InputManager();
    this.scoreManager = new ScoreManager();
    this.background = new Background(canvas.width, canvas.height);
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.inputManager.onKeyPress('Enter', () => this.handleEnterKey());
    this.inputManager.onKeyPress('1', () => this.selectShip(ShipType.SPEED));
    this.inputManager.onKeyPress('2', () => this.selectShip(ShipType.DEFENSE));
    this.inputManager.onKeyPress('3', () => this.selectShip(ShipType.BALANCED));
    this.inputManager.onKeyPress('e', () => this.selectDifficulty(Difficulty.EASY));
    this.inputManager.onKeyPress('n', () => this.selectDifficulty(Difficulty.NORMAL));
    this.inputManager.onKeyPress('h', () => this.selectDifficulty(Difficulty.HARD));
    this.inputManager.onKeyPress('Escape', () => this.togglePause());
  }

  private handleEnterKey(): void {
    switch (this.gameState) {
      case GameState.TITLE:
        this.gameState = GameState.SHIP_SELECT;
        break;
      case GameState.SHIP_SELECT:
        this.gameState = GameState.DIFFICULTY_SELECT;
        break;
      case GameState.DIFFICULTY_SELECT:
        this.startGame();
        break;
      case GameState.GAME_OVER:
        this.resetGame();
        break;
    }
  }

  private selectShip(shipType: ShipType): void {
    if (this.gameState === GameState.SHIP_SELECT) {
      this.config.selectedShip = shipType;
      this.gameState = GameState.DIFFICULTY_SELECT;
    }
  }

  private selectDifficulty(difficulty: Difficulty): void {
    if (this.gameState === GameState.DIFFICULTY_SELECT) {
      this.config.difficulty = difficulty;
      this.startGame();
    }
  }

  private startGame(): void {
    this.gameState = GameState.PLAYING;
    this.score = 0;
    this.lives = 3;
    
    this.player = new Player(this.config.selectedShip, {
      x: this.canvas.width / 2,
      y: this.canvas.height - 50
    });
    
    this.enemyManager = new EnemyManager(this.config.difficulty, this.canvas.width, this.canvas.height);
    this.bulletManager = new BulletManager();
    
    this.updateScoreDisplay();
    this.updateLivesDisplay();
  }

  private resetGame(): void {
    this.gameState = GameState.TITLE;
    this.player = null;
    this.enemyManager = null;
    this.bulletManager = null;
  }

  private togglePause(): void {
    if (this.gameState === GameState.PLAYING) {
      this.gameState = GameState.PAUSED;
    } else if (this.gameState === GameState.PAUSED) {
      this.gameState = GameState.PLAYING;
    }
  }

  private updateScoreDisplay(): void {
    const scoreElement = document.getElementById('scoreDisplay');
    if (scoreElement) {
      scoreElement.textContent = `Score: ${this.score}`;
    }
  }

  private updateLivesDisplay(): void {
    const livesElement = document.getElementById('livesDisplay');
    if (livesElement) {
      livesElement.textContent = `Lives: ${this.lives}`;
    }
  }

  public update(deltaTime: number): void {
    this.inputManager.update();
    
    this.background.update(deltaTime);
    
    if (this.gameState !== GameState.PLAYING) {
      return;
    }

    if (this.player && this.enemyManager && this.bulletManager) {
      this.player.update(deltaTime, this.inputManager);
      
      if (this.inputManager.isKeyPressed(' ')) {
        const bullet = this.player.fire();
        if (bullet) {
          this.bulletManager.addPlayerBullet(bullet);
        }
      }
      
      this.enemyManager.update(deltaTime);
      this.bulletManager.update(deltaTime);
      
      this.checkCollisions();
      
      if (this.lives <= 0) {
        this.gameOver();
      }
    }
  }

  private checkCollisions(): void {
    if (!this.player || !this.enemyManager || !this.bulletManager) return;

    const enemies = this.enemyManager.getEnemies();
    const playerBullets = this.bulletManager.getPlayerBullets();
    const enemyBullets = this.bulletManager.getEnemyBullets();
    
    const newEnemyBullets = this.enemyManager.getEnemyBullets();
    for (const bullet of newEnemyBullets) {
      this.bulletManager.addEnemyBullet(bullet);
    }

    for (const bullet of playerBullets) {
      for (const enemy of enemies) {
        if (this.isColliding(bullet, enemy)) {
          bullet.active = false;
          enemy.health -= bullet.damage;
          
          if (enemy.health <= 0) {
            enemy.active = false;
            this.score += enemy.score;
            this.updateScoreDisplay();
          }
        }
      }
    }

    for (const bullet of enemyBullets) {
      if (this.isColliding(bullet, this.player)) {
        bullet.active = false;
        this.player.health -= bullet.damage;
        
        if (this.player.health <= 0) {
          this.lives--;
          this.updateLivesDisplay();
          this.player.health = this.player.maxHealth;
        }
      }
    }

    for (const enemy of enemies) {
      if (this.isColliding(enemy, this.player)) {
        enemy.active = false;
        this.lives--;
        this.updateLivesDisplay();
      }
    }
  }

  private isColliding(obj1: { position: Vector2; width: number; height: number }, 
                     obj2: { position: Vector2; width: number; height: number }): boolean {
    return obj1.position.x < obj2.position.x + obj2.width &&
           obj1.position.x + obj1.width > obj2.position.x &&
           obj1.position.y < obj2.position.y + obj2.height &&
           obj1.position.y + obj1.height > obj2.position.y;
  }

  private gameOver(): void {
    this.gameState = GameState.GAME_OVER;
    this.scoreManager.saveScore({
      value: this.score,
      difficulty: this.config.difficulty,
      ship: this.config.selectedShip,
      date: Date.now()
    });
  }

  public render(): void {
    this.renderer.clear();
    
    switch (this.gameState) {
      case GameState.TITLE:
        this.renderer.renderTitleScreen();
        break;
      case GameState.SHIP_SELECT:
        this.renderer.renderShipSelectScreen(this.config.selectedShip);
        break;
      case GameState.DIFFICULTY_SELECT:
        this.renderer.renderDifficultySelectScreen(this.config.difficulty);
        break;
      case GameState.PLAYING:
      case GameState.PAUSED:
        this.renderGame();
        if (this.gameState === GameState.PAUSED) {
          this.renderer.renderPauseOverlay();
        }
        break;
      case GameState.GAME_OVER:
        this.renderGame();
        this.renderer.renderGameOverScreen(this.score, this.scoreManager.getHighScores(this.config.difficulty));
        break;
    }
  }

  private renderGame(): void {
    this.renderer.renderBackground(this.background);
    
    if (this.player) {
      this.renderer.renderPlayer(this.player);
    }
    
    if (this.enemyManager) {
      for (const enemy of this.enemyManager.getEnemies()) {
        this.renderer.renderEnemy(enemy);
      }
    }
    
    if (this.bulletManager) {
      for (const bullet of this.bulletManager.getPlayerBullets()) {
        this.renderer.renderPlayerBullet(bullet);
      }
      for (const bullet of this.bulletManager.getEnemyBullets()) {
        this.renderer.renderEnemyBullet(bullet);
      }
    }
  }

  public start(): void {
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      
      this.update(deltaTime);
      this.render();
      
      requestAnimationFrame(gameLoop);
    };
    
    requestAnimationFrame(gameLoop);
  }
}