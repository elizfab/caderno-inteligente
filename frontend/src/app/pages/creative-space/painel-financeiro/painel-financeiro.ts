import { Component } from '@angular/core';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { Icon } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-painel-financeiro',
  standalone: true,
  imports: [BackButtonComponent, Icon],
  templateUrl: './painel-financeiro.html',
  styleUrl: './painel-financeiro.scss',
})
export class PainelFinanceiro {}
