import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scoreboard">
      <div>Moves: {{ moves }}</div>
    </div>
  `,
  styles: [`
    .scoreboard {
      margin-bottom: 10px;
      font-size: 18px;
    }
  `]
})
export class ScoreboardComponent {
  @Input() moves: number = 0;
}