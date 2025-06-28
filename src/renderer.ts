import { PlayerShip, Enemy, Bullet, ShipType, Difficulty, Score } from './types';
import { Background } from './entities/background';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
  }

  public clear(): void {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public renderBackground(background: Background): void {
    background.render(this.ctx);
  }

  public renderTitleScreen(): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('RETRO SHOOTER', this.width / 2, this.height / 2 - 100);
    
    this.ctx.font = '24px Courier New';
    this.ctx.fillText('Press ENTER to Start', this.width / 2, this.height / 2 + 50);
    
    this.ctx.font = '16px Courier New';
    this.ctx.fillText('Controls: Arrow Keys to Move, Space to Shoot', this.width / 2, this.height / 2 + 100);
  }

  public renderShipSelectScreen(selectedShip: ShipType): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '36px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SELECT SHIP', this.width / 2, 100);
    
    this.ctx.font = '20px Courier New';
    
    const ships = [
      { type: ShipType.SPEED, key: '1', name: 'SPEED TYPE', desc: 'Fast Movement, Low Defense' },
      { type: ShipType.DEFENSE, key: '2', name: 'DEFENSE TYPE', desc: 'High Defense, Slow Movement' },
      { type: ShipType.BALANCED, key: '3', name: 'BALANCED TYPE', desc: 'Balanced Stats' }
    ];
    
    ships.forEach((ship, index) => {
      const y = 200 + index * 80;
      const isSelected = ship.type === selectedShip;
      
      this.ctx.fillStyle = isSelected ? '#ff0' : '#fff';
      this.ctx.fillText(`[${ship.key}] ${ship.name}`, this.width / 2, y);
      
      this.ctx.font = '16px Courier New';
      this.ctx.fillStyle = '#aaa';
      this.ctx.fillText(ship.desc, this.width / 2, y + 25);
      this.ctx.font = '20px Courier New';
    });
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px Courier New';
    this.ctx.fillText('Press number key to select, ENTER to continue', this.width / 2, this.height - 50);
  }

  public renderDifficultySelectScreen(selectedDifficulty: Difficulty): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '36px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SELECT DIFFICULTY', this.width / 2, 150);
    
    this.ctx.font = '24px Courier New';
    
    const difficulties = [
      { type: Difficulty.EASY, key: 'E', name: 'EASY' },
      { type: Difficulty.NORMAL, key: 'N', name: 'NORMAL' },
      { type: Difficulty.HARD, key: 'H', name: 'HARD' }
    ];
    
    difficulties.forEach((diff, index) => {
      const y = 250 + index * 60;
      const isSelected = diff.type === selectedDifficulty;
      
      this.ctx.fillStyle = isSelected ? '#ff0' : '#fff';
      this.ctx.fillText(`[${diff.key}] ${diff.name}`, this.width / 2, y);
    });
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px Courier New';
    this.ctx.fillText('Press letter key to select, ENTER to start', this.width / 2, this.height - 50);
  }

  public renderPlayer(player: PlayerShip): void {
    this.ctx.fillStyle = this.getShipColor(player.type);
    this.ctx.fillRect(player.position.x - player.width / 2, player.position.y - player.height / 2, 
                      player.width, player.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(player.position.x - 2, player.position.y - player.height / 2 - 5, 4, 8);
    
    if (player.health < player.maxHealth) {
      this.renderHealthBar(player.position.x, player.position.y - player.height / 2 - 15, 
                          player.width, player.health / player.maxHealth);
    }
  }

  private getShipColor(shipType: ShipType): string {
    switch (shipType) {
      case ShipType.SPEED: return '#0f0';
      case ShipType.DEFENSE: return '#00f';
      case ShipType.BALANCED: return '#fff';
      default: return '#fff';
    }
  }

  public renderEnemy(enemy: Enemy): void {
    this.ctx.fillStyle = '#f00';
    this.ctx.fillRect(enemy.position.x - enemy.width / 2, enemy.position.y - enemy.height / 2,
                      enemy.width, enemy.height);
    
    if (enemy.health < enemy.maxHealth) {
      this.renderHealthBar(enemy.position.x, enemy.position.y - enemy.height / 2 - 10,
                          enemy.width, enemy.health / enemy.maxHealth);
    }
  }

  private renderHealthBar(x: number, y: number, width: number, healthRatio: number): void {
    this.ctx.fillStyle = '#444';
    this.ctx.fillRect(x - width / 2, y, width, 4);
    
    this.ctx.fillStyle = healthRatio > 0.5 ? '#0f0' : healthRatio > 0.25 ? '#ff0' : '#f00';
    this.ctx.fillRect(x - width / 2, y, width * healthRatio, 4);
  }

  public renderPlayerBullet(bullet: Bullet): void {
    this.ctx.fillStyle = '#0ff';
    this.ctx.fillRect(bullet.position.x - bullet.width / 2, bullet.position.y - bullet.height / 2,
                      bullet.width, bullet.height);
  }

  public renderEnemyBullet(bullet: Bullet): void {
    this.ctx.fillStyle = '#f80';
    this.ctx.fillRect(bullet.position.x - bullet.width / 2, bullet.position.y - bullet.height / 2,
                      bullet.width, bullet.height);
  }

  public renderPauseOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
    
    this.ctx.font = '20px Courier New';
    this.ctx.fillText('Press ESC to Resume', this.width / 2, this.height / 2 + 50);
  }

  public renderGameOverScreen(score: number, highScores: Score[]): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.width / 2, 150);
    
    this.ctx.font = '24px Courier New';
    this.ctx.fillText(`Final Score: ${score}`, this.width / 2, 220);
    
    this.ctx.font = '20px Courier New';
    this.ctx.fillText('HIGH SCORES', this.width / 2, 280);
    
    this.ctx.font = '16px Courier New';
    highScores.slice(0, 5).forEach((highScore, index) => {
      const y = 310 + index * 25;
      this.ctx.fillText(`${index + 1}. ${highScore.value} - ${highScore.ship.toUpperCase()}`, this.width / 2, y);
    });
    
    this.ctx.font = '20px Courier New';
    this.ctx.fillText('Press ENTER to Return to Title', this.width / 2, this.height - 50);
  }
}