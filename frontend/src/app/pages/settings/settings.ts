import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, ToggleSwitchModule, Icon],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  profile = {
    name: '',
    email: '',
  };

  preferences = {
    darkMode: false,
    notifications: true,
  };

  saveProfile(): void {
    console.log('Perfil salvo:', this.profile);
  }
}
