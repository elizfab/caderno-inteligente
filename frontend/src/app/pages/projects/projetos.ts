import { Component } from '@angular/core';
import { StudyCardItem } from '../../shared/types/content-template.interface';
import { StudyCardGrid } from '../../shared/components/study/study-card-grid/study-card-grid';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [StudyCardGrid],
  templateUrl: './projetos.html',
  styleUrl: './projetos.scss',
})
export class Projetos {
  readonly pageTitle = 'Projetos';
  readonly pageDescription =
    'Explore os projetos pessoais e profissionais desenvolvidos ao longo da jornada técnica.';

  readonly items: StudyCardItem[] = [
    {
      id: 1,
      title: 'Projetos Pessoais',
      description:
        'Projetos criados para estudo, portfólio, prática técnica e evolução profissional.',
      bannerColor: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      iconClass: 'user',
      skill: 'Portfólio',
      detailRoute: '/projetos/pessoais',
      buttonLabel: 'Abrir Projetos',
    },
    {
      id: 2,
      title: 'Projetos Profissionais',
      description:
        'Projetos relacionados à atuação profissional, plataforma, engenharia, automações e observabilidade.',
      bannerColor: 'linear-gradient(135deg, #047857, #059669)',
      iconClass: 'briefcase',
      skill: 'Profissional',
      detailRoute: '/projetos/profissionais',
      buttonLabel: 'Abrir Projetos',
    },
  ];
}
