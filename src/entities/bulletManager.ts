import { Bullet } from '../types';

export class BulletManager {
  private playerBullets: Bullet[] = [];
  private enemyBullets: Bullet[] = [];
  private canvasHeight: number;

  constructor(canvasHeight = 600) {
    this.canvasHeight = canvasHeight;
  }

  public addPlayerBullet(bullet: Bullet): void {
    this.playerBullets.push(bullet);
  }

  public addEnemyBullet(bullet: Bullet): void {
    this.enemyBullets.push(bullet);
  }

  public update(deltaTime: number): void {
    this.updateBullets(this.playerBullets, deltaTime);
    this.updateBullets(this.enemyBullets, deltaTime);
    
    this.playerBullets = this.playerBullets.filter(bullet => 
      bullet.active && bullet.position.y > -bullet.height
    );
    
    this.enemyBullets = this.enemyBullets.filter(bullet => 
      bullet.active && bullet.position.y < this.canvasHeight + bullet.height
    );
  }

  private updateBullets(bullets: Bullet[], deltaTime: number): void {
    for (const bullet of bullets) {
      if (!bullet.active) continue;
      
      bullet.position.x += bullet.velocity.x * deltaTime / 1000;
      bullet.position.y += bullet.velocity.y * deltaTime / 1000;
      
      if (bullet.position.y < -bullet.height || bullet.position.y > this.canvasHeight + bullet.height) {
        bullet.active = false;
      }
    }
  }

  public getPlayerBullets(): Bullet[] {
    return this.playerBullets.filter(bullet => bullet.active);
  }

  public getEnemyBullets(): Bullet[] {
    return this.enemyBullets.filter(bullet => bullet.active);
  }

  public clear(): void {
    this.playerBullets = [];
    this.enemyBullets = [];
  }
}