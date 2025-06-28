import { PlayerShip, Enemy, Bullet, ShipType, Difficulty, Score } from './types';
import { Background } from './entities/background';
import { ShipImageGenerator } from './assets/shipImages';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private imageCache: Map<string, ImageData> = new Map();

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
  }

  private getOrCreateImage(key: string, generator: () => ImageData): ImageData {
    if (!this.imageCache.has(key)) {
      this.imageCache.set(key, generator());
    }
    return this.imageCache.get(key)!;
  }

  public clear(): void {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public renderBackground(background: Background): void {
    background.render(this.ctx);
  }

  public renderGameUI(score: number, lives: number, timeRemaining: number): void {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 180, 120);
    
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(10, 10, 180, 120);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 20px Courier New';
    this.ctx.textAlign = 'left';
    
    this.ctx.fillText(`Score: ${score}`, 20, 35);
    this.ctx.fillText(`Lives: ${lives}`, 20, 65);
    
    const seconds = Math.ceil(timeRemaining / 1000);
    this.ctx.fillStyle = seconds <= 10 ? '#ff0000' : '#fff';
    this.ctx.fillText(`Time: ${seconds}s`, 20, 95);
    
    this.ctx.restore();
  }

  public renderTitleScreen(): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('RETRO SHOOTER', this.width / 2, this.height / 2 - 100);
    
    this.ctx.font = '24px Courier New';
    this.ctx.fillText('Press ENTER to Start', this.width / 2, this.height / 2 + 50);
    
    this.ctx.font = '18px Courier New';
    this.ctx.fillText('Press h for Help', this.width / 2, this.height / 2 + 100);
    
    this.ctx.font = '16px Courier New';
    this.ctx.fillText('Controls: Arrow Keys to Move, Space to Shoot', this.width / 2, this.height / 2 + 140);
  }

  public renderShipSelectScreen(_selectedShip: ShipType, selectedIndex: number): void {
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
      const isSelected = index === selectedIndex;
      
      this.ctx.fillStyle = isSelected ? '#ff0' : '#fff';
      this.ctx.fillText(`[${ship.key}] ${ship.name}`, this.width / 2, y);
      
      if (isSelected) {
        this.ctx.fillText('▶', this.width / 2 - 150, y);
      }
      
      this.ctx.font = '16px Courier New';
      this.ctx.fillStyle = '#aaa';
      this.ctx.fillText(ship.desc, this.width / 2, y + 25);
      this.ctx.font = '20px Courier New';
    });
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px Courier New';
    this.ctx.fillText('Use ↑↓ keys or number keys to select, ENTER to continue', this.width / 2, this.height - 50);
  }

  public renderDifficultySelectScreen(_selectedDifficulty: Difficulty, selectedIndex: number): void {
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
      const isSelected = index === selectedIndex;
      
      this.ctx.fillStyle = isSelected ? '#ff0' : '#fff';
      this.ctx.fillText(`[${diff.key}] ${diff.name}`, this.width / 2, y);
      
      if (isSelected) {
        this.ctx.fillText('▶', this.width / 2 - 100, y);
      }
    });
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '16px Courier New';
    this.ctx.fillText('Use ↑↓ keys or letter keys to select, ENTER to start', this.width / 2, this.height - 50);
  }

  public renderHelpScreen(): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '36px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('HELP - GAME RULES', this.width / 2, 80);
    
    this.ctx.font = '20px Courier New';
    this.ctx.textAlign = 'left';
    
    const helpText = [
      'OBJECTIVE:',
      '  • Survive for 30 seconds and get the highest score',
      '  • Destroy enemies to earn points',
      '',
      'CONTROLS:',
      '  • Arrow Keys: Move your ship',
      '  • Space: Shoot bullets',
      '  • h: Show this help screen',
      '  • ESC: Pause game / Return to menu',
      '',
      'SHIP TYPES:',
      '  • Speed: Fast movement, low defense',
      '  • Defense: High defense, slow movement',
      '  • Balanced: Average stats',
      '',
      'ENEMY TYPES:',
      '  • Normal (red): Basic enemy - 100 points',
      '  • Large (big red): Stronger enemy - 300 points',
      '  • Boss (huge red): Powerful enemy - 1000 points'
    ];
    
    helpText.forEach((line, index) => {
      const y = 140 + index * 25;
      if (line.startsWith('  ')) {
        this.ctx.font = '16px Courier New';
        this.ctx.fillStyle = '#ccc';
      } else if (line === '') {
        return;
      } else {
        this.ctx.font = '18px Courier New';
        this.ctx.fillStyle = '#ff0';
      }
      this.ctx.fillText(line, 50, y);
    });
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '18px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Press ESC or ENTER to return', this.width / 2, this.height - 20);
  }

  public renderPlayer(player: PlayerShip, isDamaged = false): void {
    this.ctx.save();
    
    if (isDamaged) {
      this.ctx.globalAlpha = Math.sin(Date.now() / 50) * 0.5 + 0.5;
      this.ctx.filter = 'hue-rotate(0deg) saturate(200%) brightness(150%)';
    }
    
    const shipTypeKey = player.type === ShipType.SPEED ? 'speed' : 
                       player.type === ShipType.DEFENSE ? 'defense' : 'balanced';
    const imageKey = `player-${shipTypeKey}-${player.width}-${player.height}`;
    
    const imageData = this.getOrCreateImage(imageKey, () => 
      ShipImageGenerator.generatePlayerShip(shipTypeKey as any, player.width, player.height)
    );
    
    this.ctx.putImageData(imageData, 
      player.position.x - player.width / 2, 
      player.position.y - player.height / 2
    );
    
    this.ctx.restore();
    
    if (player.health < player.maxHealth) {
      this.renderHealthBar(player.position.x, player.position.y - player.height / 2 - 15, 
                          player.width, player.health / player.maxHealth);
    }
  }


  public renderEnemy(enemy: Enemy): void {
    const enemyTypeKey = enemy.type === 'normal' ? 'normal' : 
                        enemy.type === 'large' ? 'large' : 'boss';
    const imageKey = `enemy-${enemyTypeKey}-${enemy.width}-${enemy.height}`;
    
    const imageData = this.getOrCreateImage(imageKey, () => 
      ShipImageGenerator.generateEnemyShip(enemyTypeKey as any, enemy.width, enemy.height)
    );
    
    this.ctx.putImageData(imageData, 
      enemy.position.x - enemy.width / 2, 
      enemy.position.y - enemy.height / 2
    );
    
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
    const imageKey = `bullet-player-${bullet.width}-${bullet.height}`;
    
    const imageData = this.getOrCreateImage(imageKey, () => 
      ShipImageGenerator.generateBulletImage('player', bullet.width, bullet.height)
    );
    
    this.ctx.putImageData(imageData, 
      bullet.position.x - bullet.width / 2, 
      bullet.position.y - bullet.height / 2
    );
  }

  public renderEnemyBullet(bullet: Bullet): void {
    const imageKey = `bullet-enemy-${bullet.width}-${bullet.height}`;
    
    const imageData = this.getOrCreateImage(imageKey, () => 
      ShipImageGenerator.generateBulletImage('enemy', bullet.width, bullet.height)
    );
    
    this.ctx.putImageData(imageData, 
      bullet.position.x - bullet.width / 2, 
      bullet.position.y - bullet.height / 2
    );
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