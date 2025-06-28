import { Enemy, EnemyType, Difficulty, Bullet } from '../types';

export class EnemyManager {
  private enemies: Enemy[] = [];
  private difficulty: Difficulty;
  private canvasWidth: number;
  private canvasHeight: number;
  private lastSpawn = 0;
  private spawnRate: number;

  constructor(difficulty: Difficulty, canvasWidth: number, canvasHeight: number) {
    this.difficulty = difficulty;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.spawnRate = this.getSpawnRate();
  }

  private getSpawnRate(): number {
    switch (this.difficulty) {
      case Difficulty.EASY: return 2000;
      case Difficulty.NORMAL: return 1500;
      case Difficulty.HARD: return 1000;
      default: return 1500;
    }
  }

  private getDifficultyMultiplier(): number {
    switch (this.difficulty) {
      case Difficulty.EASY: return 0.7;
      case Difficulty.NORMAL: return 1.0;
      case Difficulty.HARD: return 1.5;
      default: return 1.0;
    }
  }

  public update(deltaTime: number): void {
    const now = Date.now();
    
    if (now - this.lastSpawn > this.spawnRate) {
      this.spawnEnemy();
      this.lastSpawn = now;
    }
    
    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      
      enemy.position.x += enemy.velocity.x * deltaTime / 1000;
      enemy.position.y += enemy.velocity.y * deltaTime / 1000;
      
      if (enemy.position.y > this.canvasHeight + enemy.height) {
        enemy.active = false;
      }
    }
    
    this.enemies = this.enemies.filter(enemy => enemy.active);
  }

  private spawnEnemy(): void {
    const rand = Math.random();
    let enemyType: EnemyType;
    
    if (rand < 0.7) {
      enemyType = EnemyType.NORMAL;
    } else if (rand < 0.95) {
      enemyType = EnemyType.LARGE;
    } else {
      enemyType = EnemyType.BOSS;
    }
    
    const enemy = this.createEnemy(enemyType);
    this.enemies.push(enemy);
  }

  private createEnemy(type: EnemyType): Enemy {
    const multiplier = this.getDifficultyMultiplier();
    const x = Math.random() * (this.canvasWidth - 40) + 20;
    
    const baseEnemy: Enemy = {
      position: { x, y: -20 },
      velocity: { x: 0, y: 80 },
      width: 25,
      height: 25,
      active: true,
      type,
      health: 1,
      maxHealth: 1,
      score: 100
    };
    
    switch (type) {
      case EnemyType.NORMAL:
        baseEnemy.velocity.y = 80 * multiplier;
        baseEnemy.health = Math.ceil(1 * multiplier);
        baseEnemy.maxHealth = baseEnemy.health;
        baseEnemy.score = 100;
        break;
        
      case EnemyType.LARGE:
        baseEnemy.width = 40;
        baseEnemy.height = 40;
        baseEnemy.velocity.y = 60 * multiplier;
        baseEnemy.health = Math.ceil(3 * multiplier);
        baseEnemy.maxHealth = baseEnemy.health;
        baseEnemy.score = 300;
        baseEnemy.fireRate = 2000;
        baseEnemy.lastFired = 0;
        break;
        
      case EnemyType.BOSS:
        baseEnemy.width = 60;
        baseEnemy.height = 60;
        baseEnemy.velocity.y = 40 * multiplier;
        baseEnemy.health = Math.ceil(8 * multiplier);
        baseEnemy.maxHealth = baseEnemy.health;
        baseEnemy.score = 1000;
        baseEnemy.fireRate = 1000;
        baseEnemy.lastFired = 0;
        break;
    }
    
    return baseEnemy;
  }

  public getEnemies(): Enemy[] {
    return this.enemies.filter(enemy => enemy.active);
  }

  public getEnemyBullets(): Bullet[] {
    const bullets: Bullet[] = [];
    const now = Date.now();
    
    for (const enemy of this.enemies) {
      if (!enemy.active || !enemy.fireRate || !enemy.lastFired) continue;
      
      if (now - enemy.lastFired > enemy.fireRate) {
        const bullet: Bullet = {
          position: { x: enemy.position.x, y: enemy.position.y + enemy.height / 2 },
          velocity: { x: 0, y: 200 },
          width: 3,
          height: 8,
          active: true,
          damage: 1,
          isPlayerBullet: false
        };
        
        bullets.push(bullet);
        enemy.lastFired = now;
      }
    }
    
    return bullets;
  }
}