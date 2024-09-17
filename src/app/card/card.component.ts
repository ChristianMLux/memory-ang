import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" 
         [class.flipped]="flipped" 
         [class.matched]="matched" 
         [class.dark-mode]="isDarkMode$ | async"
         (click)="onFlip()">
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">{{ value }}</div>
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
      background-color: #FF9800;
      color: white;
      transform: rotateY(180deg);
    }
    .card.matched .card-back {
      background-color: #4CAF50;
    }
    .card.dark-mode .card-front {
      background-color: #1565C0;
    }
    .card.dark-mode .card-back {
      background-color: #E65100;
    }
    .card.dark-mode.matched .card-back {
      background-color: #2E7D32;
    }
  `]
})
export class CardComponent {
  @Input() value: string = '';
  @Input() flipped: boolean = false;
  @Input() matched: boolean = false;
  @Output() flip = new EventEmitter<void>();

  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  onFlip() {
    if (!this.flipped && !this.matched) {
      this.flip.emit();
    }
  }
}