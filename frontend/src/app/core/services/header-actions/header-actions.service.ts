import { Injectable, signal } from '@angular/core';

/**
 * Ação contextual exibida no header global.
 * Cada página registra suas próprias ações (ex: "Cadastrar nova área
 * de estudo" em /estudos-labs) e as remove ao ser destruída — assim o
 * botão só aparece na página correspondente.
 */
export interface HeaderAction {
  id: string;
  label: string;
  /** Nome do ícone Lucide (ex: "plus"). */
  icon?: string;
  /** Estilo visual do botão. */
  variant?: 'accent' | 'primary';
  /** Texto do tooltip (default: label). */
  tooltip?: string;
  run: () => void;
}

@Injectable({ providedIn: 'root' })
export class HeaderActionsService {
  readonly actions = signal<HeaderAction[]>([]);

  /** Registra as ações da página atual (substitui as anteriores). */
  set(actions: HeaderAction[]): void {
    this.actions.set(actions);
  }

  /** Remove todas as ações — chamar no ngOnDestroy da página. */
  clear(): void {
    this.actions.set([]);
  }
}
