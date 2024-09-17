import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
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