import { Score, Difficulty } from './types';

export class ScoreManager {
  private readonly STORAGE_KEY = 'retro-shooter-scores';
  private scores: Score[] = [];

  constructor() {
    this.loadScores();
  }

  private loadScores(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.scores = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load scores from localStorage:', error);
      this.scores = [];
    }
  }

  private saveScores(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.scores));
    } catch (error) {
      console.warn('Failed to save scores to localStorage:', error);
    }
  }

  public saveScore(score: Score): void {
    this.scores.push(score);
    this.scores.sort((a, b) => b.value - a.value);
    this.scores = this.scores.slice(0, 50);
    this.saveScores();
  }

  public getHighScores(difficulty?: Difficulty): Score[] {
    let filteredScores = this.scores;
    
    if (difficulty) {
      filteredScores = this.scores.filter(score => score.difficulty === difficulty);
    }
    
    return filteredScores.slice(0, 10);
  }

  public getPersonalBest(difficulty: Difficulty): number {
    const scores = this.getHighScores(difficulty);
    return scores.length > 0 ? scores[0].value : 0;
  }
}