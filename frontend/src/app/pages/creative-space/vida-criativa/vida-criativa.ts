import { Component } from '@angular/core';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { Icon } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-vida-criativa',
  standalone: true,
  imports: [BackButtonComponent, Icon],
  templateUrl: './vida-criativa.html',
  styleUrl: './vida-criativa.scss',
})
export class VidaCriativa {}
