import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.flipped]="flipped" [class.matched]="matched" (click)="onFlip()">
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">{{ value }}</div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      width: 100px;
      height: 100px;
      perspective: 1000px;
      cursor: pointer;
    }
    .card-inner {
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
      border: 2px solid #333;
      border-radius: 5px;
    }
    .card-front {
      background-color: #f0f0f0;
    }
    .card-back {
      background-color: #fff;
      transform: rotateY(180deg);
    }
  `]
})
export class CardComponent {
  @Input() value: string = '';
  @Input() flipped: boolean = false;
  @Input() matched: boolean = false;
  @Output() flip = new EventEmitter<void>();

  onFlip() {
    if (!this.flipped && !this.matched) {
      this.flip.emit();
    }
  }
}
