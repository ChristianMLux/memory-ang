import { Injectable } from '@angular/core';

export interface Highscore {
  name: string;
  moves: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HighscoreService {
  private readonly STORAGE_KEY = 'memory-game-highscores';
  private readonly MAX_SCORES = 5;

  getHighscores(): Highscore[] {
    const scores = localStorage.getItem(this.STORAGE_KEY);
    return scores ? JSON.parse(scores) : [];
  }

  addHighscore(name: string, moves: number): void {
    const newScore: Highscore = { name, moves, date: new Date() };
    const scores = this.getHighscores();
    scores.push(newScore);
    scores.sort((a, b) => a.moves - b.moves);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores.slice(0, this.MAX_SCORES)));
  }

  isHighscore(moves: number): boolean {
    const scores = this.getHighscores();
    return scores.length < this.MAX_SCORES || moves < Math.max(...scores.map(s => s.moves));
  }
}