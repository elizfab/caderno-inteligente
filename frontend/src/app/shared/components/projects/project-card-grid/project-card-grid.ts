import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BackButtonComponent } from '../../back-button/back-button';
import { Icon } from '../../icon/icon';
import { ProjectItem } from '../../../types/project.interface';

@Component({
  selector: 'app-project-card-grid',
  standalone: true,
  imports: [ButtonModule, RouterLink, TooltipModule, BackButtonComponent, Icon],
  templateUrl: './project-card-grid.html',
  styleUrl: './project-card-grid.scss',
})
export class ProjectCardGrid {
  @Input({ required: true }) pageTitle = '';
  @Input({ required: true }) pageDescription = '';
  @Input({ required: true }) items: ProjectItem[] = [];
  @Output() deleteRequest = new EventEmitter<ProjectItem>();
  @Output() editRequest = new EventEmitter<ProjectItem>();

  getAccentColor(item: ProjectItem): string {
    const match = (item.bannerColor ?? '').match(/#[0-9a-fA-F]{6}/);
    return match?.[0] ?? '#4f46e5';
  }

  openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  onIconError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  requestDelete(item: ProjectItem, event: Event): void {
    event.stopPropagation();
    this.deleteRequest.emit(item);
  }

  requestEdit(item: ProjectItem, event: Event): void {
    event.stopPropagation();
    this.editRequest.emit(item);
  }
}
