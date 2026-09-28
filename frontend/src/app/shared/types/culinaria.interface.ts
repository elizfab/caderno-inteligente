export interface CulinaryCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  tag: string;
  color: string;
  icon: string;
  imageUrl?: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCulinaryCategoryDto {
  name: string;
  slug: string;
  description: string;
  tag: string;
  color: string;
  icon: string;
  imageUrl?: string;
  order: number;
  active: boolean;
}

export interface UpdateCulinaryCategoryDto {
  name: string;
  description: string;
  tag: string;
  color: string;
  icon: string;
  imageUrl?: string;
  order: number;
  active: boolean;
}

export interface CulinaryRecipe {
  id: string;
  categoryId: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servingsStr: string;
  difficulty: string;
  status: string;
  tags: string[];
  imageUrl?: string;
  youtubeUrl?: string;
  sourceUrl?: string;
  ingredients: string[];
  preparationSteps: string[];
  utensils?: string;
  tips?: string;
  substitutions?: string;
  storageInstructions?: string;
  estimatedCost: number;
  personalRating: number;
  tested: boolean;
  testedAt?: string;
  notes?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCulinaryRecipeDto {
  categoryId: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servingsStr: string;
  difficulty: string;
  status: string;
  tags: string[];
  imageUrl?: string;
  youtubeUrl?: string;
  sourceUrl?: string;
  ingredients: string[];
  preparationSteps: string[];
  utensils?: string;
  tips?: string;
  substitutions?: string;
  storageInstructions?: string;
  estimatedCost: number;
  personalRating: number;
  tested: boolean;
  notes?: string;
  active: boolean;
}

export interface UpdateCulinaryRecipeDto extends CreateCulinaryRecipeDto {}
