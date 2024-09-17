import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSignal = signal<boolean>(false);

  get darkMode() {
    return this.darkModeSignal.asReadonly();
  }

  toggleDarkMode() {
    this.darkModeSignal.update(value => !value);
  }
}