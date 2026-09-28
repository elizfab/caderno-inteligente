import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

const sectionChild = {
  path: '',
  loadComponent: () =>
    import('./pages/study-labs/study-section-page/study-section-page.component').then(
      (m) => m.StudySectionPageComponent,
    ),
};

const detailChild = {
  path: ':topic',
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./pages/study-labs/study-detail-page/study-detail-page.component').then(
          (m) => m.StudyDetailPageComponent,
        ),
    },
    {
      path: ':itemId',
      loadComponent: () =>
        import('./pages/study-labs/courses/course-detail/course-detail.component').then(
          (m) => m.CourseDetailComponent,
        ),
    },
  ],
};

export const routes: Routes = [
  // ── Rotas públicas (fora do shell autenticado) ────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'logout',
    loadComponent: () => import('./pages/logout/logout').then((m) => m.Logout),
  },

  // ── Rotas privadas (protegidas pelo authGuard) ───────────────────────────
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      { path: 'backend', children: [sectionChild, detailChild] },
      { path: 'banco-de-dados', children: [sectionChild, detailChild] },
      { path: 'cloud', children: [sectionChild, detailChild] },
      { path: 'containers-kubernetes', children: [sectionChild, detailChild] },
      { path: 'devops', children: [sectionChild, detailChild] },
      { path: 'frontend', children: [sectionChild, detailChild] },
      { path: 'inteligencia-artificial', children: [sectionChild, detailChild] },
      { path: 'observability', children: [sectionChild, detailChild] },
      { path: 'performance-engineering', children: [sectionChild, detailChild] },
      {
        path: 'estudos-labs',
        loadComponent: () =>
          import('./pages/study-labs/estudos-labs/estudos-labs.component').then(
            (m) => m.EstudosLabsComponent,
          ),
      },
      {
        path: 'projetos',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/projects/projetos').then((m) => m.Projetos),
          },
          {
            path: 'pessoais',
            loadComponent: () =>
              import('./pages/projects/projetos-pessoais/projetos-pessoais').then(
                (m) => m.ProjetosPessoais,
              ),
          },
          {
            path: 'profissionais',
            loadComponent: () =>
              import('./pages/projects/projetos-profissionais/projetos-profissionais').then(
                (m) => m.ProjetosProfissionais,
              ),
          },
        ],
      },
      { path: 'rollout-service', children: [sectionChild, detailChild] },
      {
        path: 'vida-criativa',
        loadComponent: () =>
          import('./pages/creative-space/vida-criativa/vida-criativa').then(
            (m) => m.VidaCriativa,
          ),
      },
      {
        path: 'painel-financeiro',
        loadComponent: () =>
          import('./pages/creative-space/painel-financeiro/painel-financeiro').then(
            (m) => m.PainelFinanceiro,
          ),
      },
      {
        path: 'culinaria',
        loadComponent: () => import('./pages/culinary/culinaria').then((m) => m.Culinaria),
      },
      {
        path: 'culinaria/:categorySlug',
        loadComponent: () =>
          import('./pages/culinary/culinary-category-page/culinary-category-page').then(
            (m) => m.CulinaryCategoryPage,
          ),
      },
      {
        path: 'culinaria/:categorySlug/:recipeSlug',
        loadComponent: () =>
          import('./pages/culinary/recipe-detail-page/recipe-detail-page').then(
            (m) => m.RecipeDetailPageComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'admin/usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin/users/admin-users').then((m) => m.AdminUsers),
      },
    ],
  },

  { path: '**', redirectTo: '/dashboard' },
];
