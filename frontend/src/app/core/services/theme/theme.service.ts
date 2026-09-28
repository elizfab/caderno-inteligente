import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'techbook.theme';
const DARK_CLASS = 'app-dark';

/**
 * Alterna entre tema claro e escuro. A preferência é persistida em
 * localStorage e aplicada no <html> via classe `app-dark` (compatível
 * com o darkModeSelector do PrimeNG e com CSS variables). Safe para SSR.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.restore());

  constructor() {
    // Aplica a classe sempre que o modo muda (inclui a carga inicial).
    effect(() => {
      const mode = this.mode();
      if (typeof document === 'undefined') return;
      document.documentElement.classList.toggle(DARK_CLASS, mode === 'dark');
      if (this.hasStorage()) {
        localStorage.setItem(STORAGE_KEY, mode);
      }
    });
  }

  toggle(): void {
    this.mode.update((m) => (m === 'dark' ? 'light' : 'dark'));
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  private restore(): ThemeMode {
    if (this.hasStorage()) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private hasStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
