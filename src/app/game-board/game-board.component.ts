import { Component, computed, effect, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { HighscoreService, Highscore } from '../highscore.service';
import { ThemeService } from '../theme.service';

interface Card {
  id: number;
  imageUrl: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ScoreboardComponent],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  private highscoreService = inject(HighscoreService);
  public themeService = inject(ThemeService);

  cards = signal<Card[]>([]);
  moves = signal(0);
  gameCompleted = signal(false);
  flippedCards = signal<Card[]>([]);
  playerName = signal('');
  highscores = this.highscoreService.getHighscores();

  matchedPairs = computed(() => this.cards().filter(card => card.matched).length / 2);
  isNewHighscore = computed(() => this.gameCompleted() && this.highscoreService.isHighscore(this.moves()));

  ngOnInit() {
    this.initializeGame();
  }

  initializeGame() {
    const catIds = Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000));
    this.cards.set([...catIds, ...catIds]
      .map((id, index) => ({
        id: index,
        imageUrl: `https://cataas.com/cat?position=center&width=200&height=200&id=${id}`,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5));
    this.moves.set(0);
    this.gameCompleted.set(false);
    this.flippedCards.set([]);
    this.playerName.set('');
  }

  flipCard(card: Card) {
    if (!card.flipped && !card.matched && !this.gameCompleted() && this.flippedCards().length < 2) {
      this.cards.update(cards => 
        cards.map(c => c.id === card.id ? {...c, flipped: true} : c)
      );
      this.flippedCards.update(flipped => [...flipped, card]);
      
      if (this.flippedCards().length === 2) {
        this.moves.update(m => m + 1);
        this.checkForMatch();
      }
    }
  }

  checkForMatch() {
    setTimeout(() => {
      const [card1, card2] = this.flippedCards();
      if (card1.imageUrl === card2.imageUrl) {
        this.cards.update(cards => 
          cards.map(c => c.id === card1.id || c.id === card2.id ? {...c, matched: true} : c)
        );
      } else {
        this.cards.update(cards => 
          cards.map(c => c.id === card1.id || c.id === card2.id ? {...c, flipped: false} : c)
        );
      }
      this.flippedCards.set([]);
    }, 1000);
  }

  saveHighscore() {
    const name = this.playerName();
    if (name.trim()) {
      this.highscoreService.addHighscore(name, this.moves());
      this.playerName.set('');
    }
  }

  updatePlayerName(name: string) {
    this.playerName.set(name);
  }
}