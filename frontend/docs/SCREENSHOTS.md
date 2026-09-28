# Screenshots

## `npm run screenshots`

Script: `scripts/screenshots.mjs` (Puppeteer, mesmo padrão do DoseCerta, Suplementos Store,
Carteira de Saúde e PDI).

```bash
cd backend/app && docker compose up -d mongo api        # login e conteúdo vêm da API
cd frontend && npm run screenshots                      # sobe ng serve :6115, captura, encerra
SHOTS_BASE_URL=http://localhost:6015 npm run screenshots  # reaproveita o npm start
SHOTS_API_URL=http://localhost:8096 npm run screenshots # backend em outra porta
SHOTS_EMAIL=voce@exemplo.com SHOTS_PASSWORD='***' npm run screenshots
SHOTS_VIEWPORTS=mobile npm run screenshots              # mobile | tablet | desktop
SHOTS_THEMES=light npm run screenshots                  # light | dark (padrão: os dois)
SHOTS_FULLPAGE=0 npm run screenshots                    # só a primeira dobra
```

Saída: `docs/screenshots/<NN>-<tela>-<viewport>[-dark].png`: login, dashboard, estudos e
labs, seção Backend, tópico Node.js, projetos (geral, pessoais, profissionais), culinária
(categorias, categoria, receita), vida criativa, painel financeiro e configurações.

- **Login:** quase todas as rotas passam pelo `authGuard`. O script faz
  `POST /api/v1/auth/login` (`SHOTS_EMAIL`/`SHOTS_PASSWORD`; padrão = admin de dev do
  `config.go`, `admin@techbook.dev` / `admin123`) e grava a sessão em `techbook.session`
  antes do carregamento. A tela de login é capturada numa aba sem sessão.
- **Tema:** `techbook.theme` (`light`/`dark`) gravado antes do carregamento; o
  `ThemeService` aplica a classe `app-dark` no `<html>`.
- **Dados de demonstração:** o banco sobe vazio. O script cria itens de estudo em
  `backend/nodejs`, projetos, a categoria `doces` e a receita `bolo-de-cenoura` via API e
  **remove tudo ao final** (a categoria `doces` é reaproveitada se já existir e, nesse
  caso, não é removida). `SHOTS_SEED=0` usa só os dados existentes; `SHOTS_KEEP_DATA=1`
  mantém os de demonstração.
- Verifica `GET /health` e confere se o serviço é o `tech-book-backend`. Outros projetos do
  portfólio também usam a porta 8080; com outra API na porta, o script aborta.
- `SHOTS_API_URL` diferente de `http://localhost:8080`: as chamadas do app são
  redirecionadas no navegador pelo domínio `Fetch` do CDP, só para as URLs da API
  (o `setRequestInterception` do Puppeteer deixava fontes externas pendentes).
- Página inteira: o viewport é esticado até a altura do documento, para elementos fixos
  não ficarem presos no meio da imagem.
- O `ng serve` temporário sobe como grupo de processos próprio e é derrubado com
  `kill(-pid)`.
- Chrome: cache do Puppeteer (`~/.cache/puppeteer`) ou do Playwright
  (`~/.cache/ms-playwright`). Se não houver: `npx @puppeteer/browsers install chrome@stable`
  ou `CHROME_PATH=/caminho/chrome`.
