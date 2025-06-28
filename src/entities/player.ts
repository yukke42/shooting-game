import { PlayerShip, ShipType, Vector2, Bullet } from '../types';
import { InputManager } from '../input';

export class Player implements PlayerShip {
  public position: Vector2;
  public velocity: Vector2 = { x: 0, y: 0 };
  public width!: number;
  public height!: number;
  public active = true;
  public type: ShipType;
  public health!: number;
  public maxHealth!: number;
  public fireRate!: number;
  public lastFired = 0;
  
  private speed!: number;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(shipType: ShipType, startPosition: Vector2, canvasWidth = 800, canvasHeight = 600) {
    this.type = shipType;
    this.position = { ...startPosition };
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.setupShipStats();
  }

  private setupShipStats(): void {
    switch (this.type) {
      case ShipType.SPEED:
        this.width = 20;
        this.height = 30;
        this.maxHealth = 2;
        this.speed = 350;
        this.fireRate = 150;
        break;
      case ShipType.DEFENSE:
        this.width = 30;
        this.height = 35;
        this.maxHealth = 5;
        this.speed = 200;
        this.fireRate = 300;
        break;
      case ShipType.BALANCED:
        this.width = 25;
        this.height = 32;
        this.maxHealth = 3;
        this.speed = 275;
        this.fireRate = 200;
        break;
    }
    
    this.health = this.maxHealth;
  }

  public update(deltaTime: number, input: InputManager): void {
    this.velocity.x = 0;
    this.velocity.y = 0;
    
    if (input.isKeyPressed('ArrowLeft')) {
      this.velocity.x = -this.speed;
    }
    if (input.isKeyPressed('ArrowRight')) {
      this.velocity.x = this.speed;
    }
    if (input.isKeyPressed('ArrowUp')) {
      this.velocity.y = -this.speed;
    }
    if (input.isKeyPressed('ArrowDown')) {
      this.velocity.y = this.speed;
    }
    
    this.position.x += this.velocity.x * deltaTime / 1000;
    this.position.y += this.velocity.y * deltaTime / 1000;
    
    this.position.x = Math.max(this.width / 2, Math.min(this.canvasWidth - this.width / 2, this.position.x));
    this.position.y = Math.max(this.height / 2, Math.min(this.canvasHeight - this.height / 2, this.position.y));
  }

  public fire(): Bullet | null {
    const now = Date.now();
    if (now - this.lastFired < this.fireRate) {
      return null;
    }
    
    this.lastFired = now;
    
    return {
      position: { x: this.position.x, y: this.position.y - this.height / 2 },
      velocity: { x: 0, y: -500 },
      width: 4,
      height: 10,
      active: true,
      damage: 1,
      isPlayerBullet: true
    };
  }
}