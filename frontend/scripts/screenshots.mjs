/**
 * Captura screenshots de cada tela do Caderno Inteligente (mesmo padrão do DoseCerta,
 * Suplementos Store, Carteira de Saúde e PDI).
 *
 * Pré-requisito: backend do Caderno Inteligente rodando (login e conteúdo vêm da API).
 * Em backend/app:
 *   docker compose up -d mongo api
 *
 * Uso:
 *   npm run screenshots              -> sobe ng serve na porta 6115, captura e encerra
 *   SHOTS_BASE_URL=http://localhost:6015 npm run screenshots
 *                                    -> usa um servidor já rodando (não sobe outro)
 *   SHOTS_API_URL=http://localhost:8080 -> backend usado no login, no seed e nas capturas; se
 *                                    for diferente do apiUrl do environment.ts, as chamadas
 *                                    do app são redirecionadas para ele no navegador
 *   SHOTS_EMAIL / SHOTS_PASSWORD     -> credenciais do login (padrão: admin de dev do
 *                                    config.go — admin@techbook.dev / admin123)
 *   SHOTS_VIEWPORTS=mobile,desktop   -> restringe os viewports (mobile, tablet, desktop)
 *   SHOTS_THEMES=light,dark          -> temas capturados (padrão: light,dark)
 *   SHOTS_FULLPAGE=0                 -> captura só a primeira dobra (padrão: página inteira)
 *   SHOTS_SEED=0                     -> não cria dados de demonstração (usa o que já existe)
 *   SHOTS_KEEP_DATA=1                -> mantém os dados de demonstração ao final
 *   CHROME_PATH=/caminho/chrome      -> força um binário específico
 *
 * Saída: docs/screenshots/<NN>-<tela>-<viewport>[-dark].png
 *
 * Quase todas as rotas passam pelo authGuard: o script faz login via API e grava a
 * sessão em `techbook.session` (mesmo formato do AuthService) antes do carregamento.
 * O tema vai em `techbook.theme` (ThemeService, classe `app-dark` no <html>).
 * O banco sobe vazio (mongo-init.js só cria collections e índices), então o script
 * cria itens de estudo, projetos e receitas via API e apaga tudo ao terminar.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'screenshots');
const PORT = process.env.SHOTS_PORT || '6115';
const BASE = (process.env.SHOTS_BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const APP_API = 'http://localhost:8080'; // apiUrl de src/app/environment/environment.ts
const API = (process.env.SHOTS_API_URL || APP_API).replace(/\/$/, '');
const EMAIL = process.env.SHOTS_EMAIL || 'admin@techbook.dev';
const PASSWORD = process.env.SHOTS_PASSWORD || 'admin123';
const FULL_PAGE = process.env.SHOTS_FULLPAGE !== '0';
const SEED = process.env.SHOTS_SEED !== '0';
const KEEP_DATA = process.env.SHOTS_KEEP_DATA === '1';
const SETTLE_MS = 1800; // espera animações de entrada e respostas da API
const THEME_KEY = 'techbook.theme'; // ThemeService
const SESSION_KEY = 'techbook.session'; // AuthService

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Chama a API e desembrulha o envelope { success, data, error }. */
const api = async (method, url, body, token) => {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}: ${json?.error ?? res.statusText}`);
  return json?.data;
};

// ---------------------------------------------------------------------------
// Dados de demonstração (criados antes, removidos depois)
// ---------------------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);

const DEMO_STUDY_ITEMS = [
  { section: 'backend', topic: 'nodejs', courseName: 'Node.js — APIs REST com Express', status: 'Em andamento', date: today, url: 'https://nodejs.org/docs' },
  { section: 'backend', topic: 'nodejs', courseName: 'Streams e Event Loop na prática', status: 'Concluído', date: today, url: 'https://nodejs.org/en/learn' },
  { section: 'backend', topic: 'nodejs', courseName: 'Testes com Jest e Supertest', status: 'Não iniciado', date: today, url: 'https://jestjs.io' },
];

const DEMO_PROJECTS = [
  { name: 'Dose Certa', type: 'pessoal', description: 'Controle de medicações, exames e medidas de saúde.', tags: ['Angular', 'Go', 'MongoDB'], slug: 'dose-certa', bannerColor: 'linear-gradient(135deg, #b23a68, #ff8899)', active: true, order: 1 },
  { name: 'Suplementos Store', type: 'pessoal', description: 'E-commerce de suplementos com carrinho e checkout.', tags: ['Angular', 'Go'], slug: 'suplementos-store', bannerColor: 'linear-gradient(135deg, #047857, #10b981)', active: true, order: 2 },
  { name: 'Painel de Observabilidade', type: 'profissional', description: 'Dashboards e alertas de serviços em produção.', tags: ['Grafana', 'Prometheus'], slug: 'painel-observabilidade', bannerColor: 'linear-gradient(135deg, #4f46e5, #7c3aed)', active: true, order: 1 },
];

const DEMO_CATEGORY = { slug: 'doces', name: 'Doces', description: 'Sobremesas caseiras e receitas afetivas.', tag: 'Doces', color: '#db2777', icon: 'cake', order: 1, active: true };

const DEMO_RECIPE = {
  categorySlug: 'doces', name: 'Bolo de cenoura com cobertura', slug: 'bolo-de-cenoura',
  description: 'Bolo fofinho de liquidificador com cobertura de chocolate.',
  prepTimeMinutes: 20, cookTimeMinutes: 40, servingsStr: '12 fatias', difficulty: 'Fácil', status: 'Testada',
  tags: ['bolo', 'lanche'], ingredients: ['3 cenouras médias', '3 ovos', '1 xícara de óleo', '2 xícaras de açúcar', '2 xícaras de farinha', '1 colher de fermento'],
  preparationSteps: ['Bata cenoura, ovos e óleo no liquidificador.', 'Misture açúcar e farinha, depois o fermento.', 'Asse a 180 °C por 40 minutos.'],
  estimatedCost: 18.5, personalRating: 5, tested: true, active: true,
};

/** Cria os dados via API e devolve uma função que desfaz tudo. */
const seedDemoData = async (token) => {
  const created = { studyItems: [], projects: [], recipes: [], categories: [] };

  const cleanup = async () => {
    const ignore = () => {};
    for (const id of created.recipes) await api('DELETE', `/api/v1/culinary/recipes/${id}`, null, token).catch(ignore);
    for (const id of created.categories) await api('DELETE', `/api/v1/culinary/categories/${id}`, null, token).catch(ignore);
    for (const id of created.projects) await api('DELETE', `/api/v1/projects/${id}`, null, token).catch(ignore);
    for (const id of created.studyItems) await api('DELETE', `/api/v1/study-items/${id}`, null, token).catch(ignore);
  };

  try {
    for (const item of DEMO_STUDY_ITEMS) {
      created.studyItems.push((await api('POST', '/api/v1/study-items', item, token)).id);
    }
    for (const project of DEMO_PROJECTS) {
      created.projects.push((await api('POST', '/api/v1/projects', project, token)).id);
    }
    // Slug de categoria é único (mongo-init.js): reaproveita "doces" se já existir
    // e, nesse caso, não a remove no cleanup.
    const categories = (await api('GET', '/api/v1/culinary/categories', null, token)) ?? [];
    let category = categories.find((c) => c.slug === DEMO_CATEGORY.slug);
    if (!category) {
      category = await api('POST', '/api/v1/culinary/categories', DEMO_CATEGORY, token);
      created.categories.push(category.id);
    }
    const recipe = await api('POST', '/api/v1/culinary/recipes', { ...DEMO_RECIPE, categoryId: category.id }, token);
    created.recipes.push(recipe.id);
  } catch (err) {
    await cleanup();
    throw err;
  }

  return cleanup;
};

// ---------------------------------------------------------------------------
// Telas
// ---------------------------------------------------------------------------

/**
 * Telas capturadas. `public: true` abre sem sessão (tela de login). As rotas
 * `/culinaria/doces...` usam os slugs dos dados de demonstração acima.
 */
const SCREENS = [
  { name: '01-login', path: '/login', public: true },
  { name: '02-dashboard', path: '/dashboard' },
  { name: '03-estudos-labs', path: '/estudos-labs' },
  { name: '04-backend', path: '/backend' },
  { name: '05-backend-nodejs', path: '/backend/nodejs' },
  { name: '06-projetos', path: '/projetos' },
  { name: '07-projetos-pessoais', path: '/projetos/pessoais' },
  { name: '08-projetos-profissionais', path: '/projetos/profissionais' },
  { name: '09-culinaria', path: '/culinaria' },
  { name: '10-culinaria-categoria', path: '/culinaria/doces' },
  { name: '11-receita', path: '/culinaria/doces/bolo-de-cenoura' },
  { name: '12-vida-criativa', path: '/vida-criativa' },
  { name: '13-painel-financeiro', path: '/painel-financeiro' },
  { name: '14-configuracoes', path: '/settings' },
];

const ALL_VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 834, height: 1194 },
  desktop: { width: 1440, height: 900 },
};
const VIEWPORTS = (process.env.SHOTS_VIEWPORTS || 'mobile,desktop')
  .split(',')
  .map((k) => k.trim())
  .filter((k) => ALL_VIEWPORTS[k])
  .map((k) => ({ key: k, ...ALL_VIEWPORTS[k] }));
const THEMES = (process.env.SHOTS_THEMES || 'light,dark')
  .split(',')
  .map((t) => t.trim())
  .filter((t) => t === 'light' || t === 'dark');

const findChrome = () => {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const caches = [
    path.join(homedir(), '.cache/puppeteer/chrome'),
    path.join(homedir(), '.cache/ms-playwright'),
  ];
  for (const base of caches) {
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base).sort().reverse()) {
      for (const rel of [
        'chrome-linux64/chrome',
        'chrome-linux/chrome',
        'chrome-headless-shell-linux64/chrome-headless-shell',
      ]) {
        const bin = path.join(base, dir, rel);
        if (existsSync(bin)) return bin;
      }
    }
  }
  for (const bin of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (existsSync(bin)) return bin;
  }
  return null;
};

const waitForServer = async (url, timeoutMs = 120000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return true;
    } catch {
      /* ainda subindo */
    }
    await wait(1000);
  }
  return false;
};

/**
 * Confirma que quem responde em API é o backend do Caderno Inteligente. Outros projetos
 * do portfólio usam a mesma porta 8080 — o /health devolve o nome do banco em `service`.
 */
const checkBackend = async () => {
  try {
    const res = await fetch(`${API}/health`);
    const body = await res.json();
    if (!res.ok) return `Backend respondeu ${res.status} em ${API}/health.`;
    if (!String(body?.service ?? '').includes('tech-book')) {
      return `O backend em ${API} é "${body?.service}", não o Caderno Inteligente. Pare o outro projeto ou use SHOTS_API_URL.`;
    }
    return null;
  } catch {
    return `Backend indisponível em ${API}/health.`;
  }
};

/**
 * Redireciona as chamadas do app (APP_API) para API quando forem diferentes.
 * Usa o domínio Fetch do CDP só com o padrão da API: o setRequestInterception do
 * Puppeteer intercepta tudo e deixa fontes externas (Google Fonts) pendentes.
 */
const redirectApi = async (page) => {
  if (API === APP_API) return;
  const cdp = await page.createCDPSession();
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: `${APP_API}/*` }] });
  cdp.on('Fetch.requestPaused', ({ requestId, request }) => {
    cdp
      .send('Fetch.continueRequest', { requestId, url: API + request.url.slice(APP_API.length) })
      .catch(() => {});
  });
};

/** Abre uma aba com tema (e sessão, se houver) gravados antes de qualquer script do app. */
const newPage = async (context, viewport, theme, session) => {
  const page = await context.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height });
  await redirectApi(page);
  await page.evaluateOnNewDocument(
    (themeKey, themeValue, sessionKey, sessionValue) => {
      localStorage.setItem(themeKey, themeValue);
      if (sessionValue) localStorage.setItem(sessionKey, sessionValue);
      else localStorage.removeItem(sessionKey);
    },
    THEME_KEY,
    theme,
    SESSION_KEY,
    session ? JSON.stringify(session) : '',
  );
  return page;
};

/**
 * Captura a página inteira esticando o viewport até a altura do documento: o
 * fullPage do Puppeteer deixa elementos `position: fixed` presos na 1ª dobra.
 */
const capture = async (page, viewport, out) => {
  if (!FULL_PAGE) {
    await page.screenshot({ path: out });
    return;
  }
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewport({ width: viewport.width, height });
  await wait(300);
  await page.screenshot({ path: out });
  await page.setViewport({ width: viewport.width, height: viewport.height });
};

const main = async () => {
  const chrome = findChrome();
  if (!chrome) {
    console.error(
      'Chrome não encontrado. Rode `npx @puppeteer/browsers install chrome@stable` ou defina CHROME_PATH.',
    );
    process.exit(1);
  }

  const backendError = await checkBackend();
  if (backendError) {
    console.error(`${backendError}\nSuba a API antes: docker compose up -d mongo api (em backend/app).`);
    process.exit(1);
  }

  let session;
  try {
    session = await api('POST', '/api/v1/auth/login', { email: EMAIL, password: PASSWORD });
  } catch (err) {
    console.error(`Login falhou para ${EMAIL} (${err.message}).\nDefina SHOTS_EMAIL e SHOTS_PASSWORD com um usuário ativo.`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  // Sem SHOTS_BASE_URL, sobe um ng serve temporário. `detached` cria um grupo de
  // processos próprio: o kill(-pid) derruba o npx E o ng filho.
  let server = null;
  if (!process.env.SHOTS_BASE_URL) {
    console.log(`Subindo ng serve na porta ${PORT}...`);
    server = spawn('npx', ['ng', 'serve', '--port', PORT], {
      cwd: ROOT,
      stdio: 'ignore',
      detached: true,
    });
  }

  let cleanup = null;
  try {
    if (SEED) {
      console.log('Criando dados de demonstração na API...');
      cleanup = await seedDemoData(session.token);
    }

    if (!(await waitForServer(BASE))) {
      throw new Error(`Servidor não respondeu em ${BASE}`);
    }
    console.log(
      `Servidor pronto em ${BASE}. Capturando ${SCREENS.length} telas x ${VIEWPORTS.length} viewport(s) x ${THEMES.length} tema(s)...`,
    );

    const browser = await puppeteer.launch({
      executablePath: chrome,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });

    for (const theme of THEMES) {
      for (const viewport of VIEWPORTS) {
        // Contexto isolado por viewport/tema: localStorage zerado entre as combinações
        const context = await browser.createBrowserContext();
        const privatePage = await newPage(context, viewport, theme, session);
        const publicPage = await newPage(context, viewport, theme, null);

        for (const screen of SCREENS) {
          const page = screen.public ? publicPage : privatePage;
          // O Chrome não captura aba em segundo plano: traz a aba da vez para frente.
          await page.bringToFront();
          await page.goto(`${BASE}${screen.path}`, { waitUntil: 'networkidle0', timeout: 60000 });
          await wait(SETTLE_MS);

          const suffix = theme === 'dark' ? '-dark' : '';
          const out = path.join(OUT_DIR, `${screen.name}-${viewport.key}${suffix}.png`);
          await capture(page, viewport, out);
          console.log(`  ${path.relative(ROOT, out)}`);
        }

        await context.close();
      }
    }

    await browser.close();
    console.log(`\nConcluído: screenshots em ${path.relative(ROOT, OUT_DIR)}`);
  } finally {
    if (cleanup && !KEEP_DATA) {
      console.log('Removendo dados de demonstração...');
      await cleanup();
    }
    if (server?.pid) {
      try {
        process.kill(-server.pid, 'SIGTERM');
      } catch {
        /* já encerrado */
      }
    }
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
