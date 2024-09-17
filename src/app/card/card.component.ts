import {Component, Output, EventEmitter, input} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import { ThemeService } from '../theme.service';
import { Observable } from 'rxjs';
import {Card} from "../game-board/game-board.component";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  template: `
    <div class="card"
         [class.flipped]="card().flipped"
         [class.matched]="card().matched"
         [class.dark-mode]="isDarkMode$ | async"
         (click)="onFlip()">
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">
          <img [src]="card().imageUrl" alt="Cat" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      perspective: 1000px;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.3s, background-color 0.3s, color 0.3s;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    }
    .card:hover {
      transform: scale(1.05);
      box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    }
    .card-inner {
      position: absolute;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .card.flipped .card-inner {
      transform: rotateY(180deg);
    }
    .card-front, .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
    }
    .card-front {
      background-color: #2196F3;
      color: white;
    }
    .card-back {
      background-color: white;
      transform: rotateY(180deg);
    }
    .card-back img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card.matched .card-back {
      background-color: #4CAF50;
    }
    .card.dark-mode .card-front {
      background-color: #1565C0;
    }
    .card.dark-mode .card-back {
      background-color: #333;
    }
  `]
})
export class CardComponent {
  card = input.required<Card>();
  @Output() flip = new EventEmitter<void>();

  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  onFlip() {
    if (!this.card().flipped && !this.card().matched) {
      this.flip.emit();
    }
  }
}
