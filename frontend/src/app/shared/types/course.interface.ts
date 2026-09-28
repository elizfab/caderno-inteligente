export interface CourseTopic {
  id: string;
  sectionSlug: string;
  slug: string;
  label: string;
  description: string;
  bannerColor: string;
  iconClass: string;
  skill: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}

export interface CreateCourseTopicDto {
  sectionSlug: string;
  slug: string;
  label: string;
  description: string;
  bannerColor: string;
  iconClass: string;
  skill: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}

export interface UpdateCourseTopicDto {
  label: string;
  description: string;
  bannerColor: string;
  iconClass: string;
  skill: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}

export interface CourseSection {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerColor: string;
  iconClass: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}

export interface CreateCourseSectionDto {
  slug: string;
  name: string;
  description: string;
  bannerColor: string;
  iconClass: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}

export interface UpdateCourseSectionDto {
  name: string;
  description: string;
  bannerColor: string;
  iconClass: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}
