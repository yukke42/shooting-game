export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private keyPressCallbacks: Map<string, (() => void)[]> = new Map();
  private previousKeys: Map<string, boolean> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (event) => {
      this.keys.set(event.code, true);
      this.keys.set(event.key, true);
    });

    window.addEventListener('keyup', (event) => {
      this.keys.set(event.code, false);
      this.keys.set(event.key, false);
    });
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }

  public wasKeyJustPressed(key: string): boolean {
    const current = this.keys.get(key) || false;
    const previous = this.previousKeys.get(key) || false;
    return current && !previous;
  }

  public onKeyPress(key: string, callback: () => void): void {
    if (!this.keyPressCallbacks.has(key)) {
      this.keyPressCallbacks.set(key, []);
    }
    this.keyPressCallbacks.get(key)!.push(callback);
  }

  public update(): void {
    for (const [key, current] of this.keys) {
      const previous = this.previousKeys.get(key) || false;
      
      if (current && !previous) {
        const callbacks = this.keyPressCallbacks.get(key);
        if (callbacks) {
          callbacks.forEach(callback => callback());
        }
      }
      
      this.previousKeys.set(key, current);
    }
  }
}