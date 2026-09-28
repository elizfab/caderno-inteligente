import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BackButtonComponent } from '../../back-button/back-button';
import { Icon } from '../../icon/icon';
import { StudyCardItem } from '../../../types/content-template.interface';


@Component({
  selector: 'app-study-card-grid',
  standalone: true,
  imports: [ButtonModule, RouterLink, TooltipModule, BackButtonComponent, Icon],
  templateUrl: './study-card-grid.html',
  styleUrl: './study-card-grid.scss',
})
export class StudyCardGrid {
  @Input({ required: true }) pageTitle = '';
  @Input({ required: true }) pageDescription = '';
  @Input({ required: true }) items: StudyCardItem[] = [];
  @Output() deleteRequest = new EventEmitter<StudyCardItem>();
  @Output() editRequest = new EventEmitter<StudyCardItem>();

  getAccentColor(item: StudyCardItem): string {
    const match = (item.bannerColor ?? '').match(/#[0-9a-fA-F]{6}/);
    return match?.[0] ?? '#4f46e5';
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  onIconError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  requestDelete(item: StudyCardItem, event: Event): void {
    event.stopPropagation();
    this.deleteRequest.emit(item);
  }

  requestEdit(item: StudyCardItem, event: Event): void {
    event.stopPropagation();
    this.editRequest.emit(item);
  }
}
