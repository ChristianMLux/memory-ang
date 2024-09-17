import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { HighscoreService, Highscore } from '../highscore.service';

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
    <div class="game-board">
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
      
      <div *ngIf="gameCompleted">
        <h2>Game Completed!</h2>
        <p>You completed the game in {{ moves }} moves.</p>
        <div *ngIf="isNewHighscore">
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
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .highscores {
      margin-top: 20px;
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
  flippedCards: Card[] = [];
  isChecking: boolean = false;

  constructor(private highscoreService: HighscoreService) {}
  
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