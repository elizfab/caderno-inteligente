import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudyDetailTemplate } from '../../../shared/components/study/study-detail-template/study-detail-template';
import { getSectionBySlug, getTopicBySlug, SectionConfig, TopicConfig } from '../../../core/constants/panel-topics';


@Component({
  selector: 'app-study-detail-page',
  standalone: true,
  imports: [StudyDetailTemplate],
  templateUrl: './study-detail-page.component.html',
  styleUrl: './study-detail-page.component.scss',
})
export class StudyDetailPageComponent implements OnInit {
  section: SectionConfig | undefined;
  topic: TopicConfig | undefined;
  sectionSlug = '';
  topicSlug = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const allSegments = this.route.snapshot.pathFromRoot
      .flatMap((r) => r.url)
      .map((s) => s.path)
      .filter(Boolean);

    this.sectionSlug = allSegments[0] ?? '';
    this.topicSlug = allSegments[1] ?? '';
    this.section = getSectionBySlug(this.sectionSlug);
    this.topic = this.topicSlug ? getTopicBySlug(this.sectionSlug, this.topicSlug) : undefined;
  }

  get pageTitle(): string {
    return this.topic?.label ?? this.section?.label ?? 'Detalhe';
  }

  get pageDescription(): string {
    return this.topic?.description ?? this.section?.description ?? '';
  }

  get accentColor(): string {
    const gradient = this.topic?.bannerColor ?? this.section?.bannerColor ?? '';
    const match = gradient.match(/#[0-9a-fA-F]{6}/);
    return match?.[0] ?? '#4f46e5';
  }
}
