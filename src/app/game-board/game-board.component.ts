import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { HighscoreService, Highscore } from '../highscore.service';
import { ThemeService } from '../theme.service';
import { Observable } from 'rxjs';

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ScoreboardComponent],
  template: `
    <div class="game-board" [class.dark-mode]="isDarkMode$ | async">
      <app-scoreboard [moves]="moves"></app-scoreboard>
      <div class="cards">
        <app-card 
          *ngFor="let card of cards" 
          [value]="card.value" 
          [flipped]="card.flipped" 
          [matched]="card.matched"
          (flip)="flipCard(card)">
        </app-card>
      </div>
      <button (click)="initializeGame()">New Game</button>
      
      <div *ngIf="gameCompleted" class="game-completed">
        <h2>Game Completed!</h2>
        <p>You completed the game in {{ moves }} moves.</p>
        <div *ngIf="isNewHighscore" class="new-highscore">
          <p>New Highscore! Enter your name:</p>
          <input [(ngModel)]="playerName" placeholder="Your name">
          <button (click)="saveHighscore()">Save Score</button>
        </div>
      </div>

      <div class="highscores">
        <h3>Highscores</h3>
        <ol>
          <li *ngFor="let score of highscores">
            {{ score.name }} - {{ score.moves }} moves ({{ score.date | date:'short' }})
          </li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .game-board {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      transition: background-color 0.3s, color 0.3s;
    }
    .game-board.dark-mode {
      background-color: #222;
      color: #fff;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
      width: 100%;
    }
    button {
      width: 100%;
      padding: 10px;
      font-size: 18px;
      cursor: pointer;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #45a049;
    }
    .game-completed, .highscores {
      width: 100%;
      margin-top: 20px;
      padding: 15px;
      background-color: #f0f0f0;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: background-color 0.3s, color 0.3s;
    }
    .dark-mode .game-completed, .dark-mode .highscores {
      background-color: #444;
      color: #fff;
    }
    .new-highscore input {
      width: calc(100% - 22px);
      padding: 8px;
      margin-bottom: 10px;
    }
    .new-highscore button {
      width: 100%;
      padding: 10px;
      background-color: #008CBA;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .highscores ol {
      padding-left: 20px;
    }
    .highscores li {
      margin-bottom: 5px;
    }
  `]
})
export class GameBoardComponent implements OnInit {
  cards: Card[] = [];
  moves: number = 0;
  gameCompleted: boolean = false;
  isNewHighscore: boolean = false;
  playerName: string = '';
  highscores: Highscore[] = [];
  isDarkMode$: Observable<boolean>;
  flippedCards: Card[] = [];
  isChecking: boolean = false;

  constructor(
    private highscoreService: HighscoreService,
    private themeService: ThemeService
  ) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit() {
    this.initializeGame();
    this.loadHighscores();
  }

  initializeGame() {
    const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    this.cards = [...values, ...values]
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5);
    this.moves = 0;
    this.gameCompleted = false;
    this.isNewHighscore = false;
    this.playerName = '';
    this.flippedCards = [];
    this.isChecking = false;
  }

  flipCard(card: Card) {
    if (!card.flipped && !card.matched && !this.gameCompleted && !this.isChecking && this.flippedCards.length < 2) {
      card.flipped = true;
      this.flippedCards.push(card);
      
      if (this.flippedCards.length === 2) {
        this.isChecking = true;
        this.moves++;
        this.checkForMatch();
      }
    }
  }

  checkForMatch() {
    setTimeout(() => {
      const [card1, card2] = this.flippedCards;
      if (card1.value === card2.value) {
        card1.matched = card2.matched = true;
        this.flippedCards = [];
        if (this.cards.every(card => card.matched)) {
          this.gameCompleted = true;
          this.checkHighscore();
        }
      } else {
        card1.flipped = card2.flipped = false;
      }
      this.flippedCards = [];
      this.isChecking = false;
    }, 1000);
  }
  checkHighscore() {
    this.isNewHighscore = this.highscoreService.isHighscore(this.moves);
  }

  saveHighscore() {
    if (this.playerName.trim()) {
      this.highscoreService.addHighscore(this.playerName, this.moves);
      this.loadHighscores();
      this.isNewHighscore = false;
    }
  }

  loadHighscores() {
    this.highscores = this.highscoreService.getHighscores();
  }
}