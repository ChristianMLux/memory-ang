import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from './game-board/game-board.component';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GameBoardComponent],
  template: `
    <div [class.dark-mode]="themeService.darkMode()">
      <button (click)="toggleDarkMode()">Toggle Dark Mode</button>
      <app-game-board></app-game-board>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .dark-mode {
      background-color: #333;
      color: #fff;
    }
    button {
      margin: 10px;
      padding: 5px 10px;
    }
  `]
})
export class AppComponent {
  constructor(public themeService: ThemeService) {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}