import { Injectable, signal, effect } from '@angular/core';

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

  private highscores = signal<Highscore[]>([]);

  constructor() {
    this.loadHighscores();
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.highscores()));
    });
  }

  private loadHighscores() {
    const storedScores = localStorage.getItem(this.STORAGE_KEY);
    if (storedScores) {
      this.highscores.set(JSON.parse(storedScores));
    }
  }

  getHighscores() {
    return this.highscores;
  }

  addHighscore(name: string, moves: number) {
    const newScore: Highscore = { name, moves, date: new Date() };
    this.highscores.update(scores => {
      const newScores = [...scores, newScore].sort((a, b) => a.moves - b.moves);
      return newScores.slice(0, this.MAX_SCORES);
    });
  }

  isHighscore(moves: number): boolean {
    const scores = this.highscores();
    return scores.length < this.MAX_SCORES || moves < Math.max(...scores.map(s => s.moves));
  }
}