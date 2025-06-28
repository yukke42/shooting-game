export class Background {
  private stars: { x: number; y: number; size: number; speed: number }[] = [];
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.generateStars();
  }

  private generateStars(): void {
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 50 + 25
      });
    }
  }

  public update(deltaTime: number): void {
    for (const star of this.stars) {
      star.y += star.speed * deltaTime / 1000;
      
      if (star.y > this.canvasHeight) {
        star.y = 0;
        star.x = Math.random() * this.canvasWidth;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#fff';
    
    for (const star of this.stars) {
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }
}