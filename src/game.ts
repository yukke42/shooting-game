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
  private previousGameState: GameState = GameState.TITLE;
  private config: GameConfig = {
    difficulty: Difficulty.NORMAL,
    selectedShip: ShipType.BALANCED
  };
  
  private selectedMenuIndex = 0;
  private gameTime = 30000;
  private gameStartTime = 0;
  private damageFlashTime = 0;
  
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
    this.inputManager.onKeyPress('ArrowUp', () => this.handleMenuNavigation(-1));
    this.inputManager.onKeyPress('ArrowDown', () => this.handleMenuNavigation(1));
    this.inputManager.onKeyPress('1', () => this.selectShip(ShipType.SPEED));
    this.inputManager.onKeyPress('2', () => this.selectShip(ShipType.DEFENSE));
    this.inputManager.onKeyPress('3', () => this.selectShip(ShipType.BALANCED));
    this.inputManager.onKeyPress('e', () => this.selectDifficulty(Difficulty.EASY));
    this.inputManager.onKeyPress('n', () => this.selectDifficulty(Difficulty.NORMAL));
    this.inputManager.onKeyPress('h', () => this.selectDifficulty(Difficulty.HARD));
    this.inputManager.onKeyPress('h', () => this.showHelp());
    this.inputManager.onKeyPress('H', () => this.showHelp());
    this.inputManager.onKeyPress('Escape', () => this.handleEscapeKey());
  }

  private handleEnterKey(): void {
    switch (this.gameState) {
      case GameState.TITLE:
        this.gameState = GameState.SHIP_SELECT;
        this.selectedMenuIndex = 0;
        break;
      case GameState.SHIP_SELECT:
        this.selectShipByIndex(this.selectedMenuIndex);
        this.gameState = GameState.DIFFICULTY_SELECT;
        this.selectedMenuIndex = 0;
        break;
      case GameState.DIFFICULTY_SELECT:
        this.selectDifficultyByIndex(this.selectedMenuIndex);
        this.startGame();
        break;
      case GameState.HELP:
        this.gameState = this.previousGameState;
        break;
      case GameState.GAME_OVER:
        this.resetGame();
        break;
    }
  }

  private handleMenuNavigation(direction: number): void {
    switch (this.gameState) {
      case GameState.SHIP_SELECT:
        this.selectedMenuIndex = Math.max(0, Math.min(2, this.selectedMenuIndex + direction));
        break;
      case GameState.DIFFICULTY_SELECT:
        this.selectedMenuIndex = Math.max(0, Math.min(2, this.selectedMenuIndex + direction));
        break;
    }
  }

  private selectShipByIndex(index: number): void {
    const ships = [ShipType.SPEED, ShipType.DEFENSE, ShipType.BALANCED];
    this.config.selectedShip = ships[index];
  }

  private selectDifficultyByIndex(index: number): void {
    const difficulties = [Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD];
    this.config.difficulty = difficulties[index];
  }

  private showHelp(): void {
    this.previousGameState = this.gameState;
    this.gameState = GameState.HELP;
  }

  private handleEscapeKey(): void {
    switch (this.gameState) {
      case GameState.HELP:
        this.gameState = this.previousGameState;
        break;
      case GameState.PLAYING:
        this.gameState = GameState.PAUSED;
        break;
      case GameState.PAUSED:
        this.gameState = GameState.PLAYING;
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
    this.gameStartTime = Date.now();
    
    this.player = new Player(this.config.selectedShip, {
      x: this.canvas.width / 2,
      y: this.canvas.height - 50
    });
    
    this.enemyManager = new EnemyManager(this.config.difficulty, this.canvas.width, this.canvas.height);
    this.bulletManager = new BulletManager();
    
    this.updateScoreDisplay();
    this.updateLivesDisplay();
    this.updateTimeDisplay();
  }

  private resetGame(): void {
    this.gameState = GameState.TITLE;
    this.player = null;
    this.enemyManager = null;
    this.bulletManager = null;
  }

  private updateTimeDisplay(): void {
    // UI is now rendered in Canvas
  }

  private updateScoreDisplay(): void {
    // UI is now rendered in Canvas
  }

  private updateLivesDisplay(): void {
    // UI is now rendered in Canvas
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
      
      const currentTime = Date.now();
      const remainingTime = this.gameTime - (currentTime - this.gameStartTime);
      
      if (remainingTime <= 0) {
        this.gameOver();
      } else {
        this.updateTimeDisplay();
      }
      
      if (this.lives <= 0) {
        this.gameOver();
      }
    }
    
    if (this.damageFlashTime > 0) {
      this.damageFlashTime -= deltaTime;
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
          this.damageFlashTime = 1000;
        } else {
          this.damageFlashTime = 300;
        }
      }
    }

    for (const enemy of enemies) {
      if (this.isColliding(enemy, this.player)) {
        enemy.active = false;
        this.lives--;
        this.updateLivesDisplay();
        this.damageFlashTime = 1000;
      }
    }
  }

  private isColliding(obj1: { position: Vector2; width: number; height: number }, 
                     obj2: { position: Vector2; width: number; height: number }): boolean {
    const x1 = obj1.position.x - obj1.width / 2;
    const y1 = obj1.position.y - obj1.height / 2;
    const x2 = obj2.position.x - obj2.width / 2;
    const y2 = obj2.position.y - obj2.height / 2;
    
    return x1 < x2 + obj2.width &&
           x1 + obj1.width > x2 &&
           y1 < y2 + obj2.height &&
           y1 + obj1.height > y2;
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
        this.renderer.renderShipSelectScreen(this.config.selectedShip, this.selectedMenuIndex);
        break;
      case GameState.DIFFICULTY_SELECT:
        this.renderer.renderDifficultySelectScreen(this.config.difficulty, this.selectedMenuIndex);
        break;
      case GameState.HELP:
        this.renderer.renderHelpScreen();
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
      this.renderer.renderPlayer(this.player, this.damageFlashTime > 0);
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
    
    const currentTime = Date.now();
    const remainingTime = Math.max(0, this.gameTime - (currentTime - this.gameStartTime));
    this.renderer.renderGameUI(this.score, this.lives, remainingTime);
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