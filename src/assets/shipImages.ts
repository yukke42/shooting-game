export class ShipImageGenerator {
  private static canvas = document.createElement('canvas');
  private static ctx = this.canvas.getContext('2d')!;

  public static generatePlayerShip(type: 'speed' | 'defense' | 'balanced', width: number, height: number): ImageData {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    switch (type) {
      case 'speed':
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 2);
        this.ctx.lineTo(centerX - 6, height - 4);
        this.ctx.lineTo(centerX - 2, height - 6);
        this.ctx.lineTo(centerX + 2, height - 6);
        this.ctx.lineTo(centerX + 6, height - 4);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(centerX - 1, centerY - 2, 2, 4);
        break;

      case 'defense':
        this.ctx.fillStyle = '#0066ff';
        this.ctx.fillRect(centerX - 8, 4, 16, height - 8);
        this.ctx.fillRect(centerX - 6, 2, 12, height - 4);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(centerX - 1, centerY - 3, 2, 6);
        break;

      case 'balanced':
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 2);
        this.ctx.lineTo(centerX - 8, height - 6);
        this.ctx.lineTo(centerX - 3, height - 6);
        this.ctx.lineTo(centerX, height - 2);
        this.ctx.lineTo(centerX + 3, height - 6);
        this.ctx.lineTo(centerX + 8, height - 6);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(centerX - 1, centerY - 2, 2, 4);
        break;
    }

    return this.ctx.getImageData(0, 0, width, height);
  }

  public static generateEnemyShip(type: 'normal' | 'large' | 'boss', width: number, height: number): ImageData {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    switch (type) {
      case 'normal':
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, height - 2);
        this.ctx.lineTo(centerX - 6, 4);
        this.ctx.lineTo(centerX + 6, 4);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.fillRect(centerX - 1, centerY - 1, 2, 2);
        break;

      case 'large':
        this.ctx.fillStyle = '#cc0000';
        this.ctx.fillRect(centerX - 12, 2, 24, height - 4);
        this.ctx.fillRect(centerX - 8, 0, 16, height);
        
        this.ctx.fillStyle = '#ff6600';
        this.ctx.fillRect(centerX - 2, centerY - 4, 4, 8);
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(centerX - 1, centerY - 2, 2, 4);
        break;

      case 'boss':
        this.ctx.fillStyle = '#990000';
        this.ctx.fillRect(centerX - 20, 4, 40, height - 8);
        this.ctx.fillRect(centerX - 16, 0, 32, height);
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(centerX - 6, centerY - 8, 12, 16);
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(centerX - 2, centerY - 4, 4, 8);
        
        this.ctx.fillStyle = '#ff6600';
        this.ctx.fillRect(centerX - 1, centerY - 2, 2, 4);
        break;
    }

    return this.ctx.getImageData(0, 0, width, height);
  }

  public static generateBulletImage(type: 'player' | 'enemy', width: number, height: number): ImageData {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    
    if (type === 'player') {
      this.ctx.fillStyle = '#00ffff';
      this.ctx.fillRect(centerX - 1, 0, 2, height);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(centerX - 0.5, 0, 1, height);
    } else {
      this.ctx.fillStyle = '#ff8800';
      this.ctx.fillRect(centerX - 1, 0, 2, height);
      
      this.ctx.fillStyle = '#ffaa00';
      this.ctx.fillRect(centerX - 0.5, 0, 1, height);
    }

    return this.ctx.getImageData(0, 0, width, height);
  }
}