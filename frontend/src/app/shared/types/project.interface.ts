export type ProjectType = 'pessoal' | 'profissional';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  tags: string[];
  repoUrl?: string;
  deployUrl?: string;
  slug: string;
  bannerColor: string;
  imageUrl?: string;
  imageAlt?: string;
  detailRoute?: string;
  active: boolean;
  order: number;
}

export interface ProjectItem {
  id: number;
  apiId?: string;
  title: string;
  description: string;
  tags: string[];
  iconClass: string;
  iconUrl?: string;
  bannerColor: string;
  imageUrl?: string;
  imageAlt?: string;
  repoUrl?: string;
  deployUrl?: string;
  detailRoute?: string;
}


export interface CreateProjectDto {
  name: string;
  type: ProjectType;
  description: string;
  tags: string[];
  repoUrl?: string;
  deployUrl?: string;
  slug: string;
  bannerColor: string;
  imageUrl?: string;
  imageAlt?: string;
  detailRoute?: string;
  active: boolean;
  order: number;
}

export interface UpdateProjectDto {
  name: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  deployUrl?: string;
  bannerColor: string;
  imageUrl?: string;
  imageAlt?: string;
  detailRoute?: string;
  active: boolean;
  order: number;
}
