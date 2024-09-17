import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" 
         [class.flipped]="flipped" 
         [class.matched]="matched"
         (click)="onFlip()">
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">
          <img [src]="imageUrl" alt="Card" />
        </div>
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
  `]
})
export class CardComponent {
  @Input() imageUrl!: string;
  @Input() flipped!: boolean;
  @Input() matched!: boolean;
  @Output() flip = new EventEmitter<void>();

  onFlip() {
    if (!this.flipped && !this.matched) {
      this.flip.emit();
    }
  }
}