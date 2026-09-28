# Prompt de Execução — Reorganização, Finalização e Governança do Projeto

## Objetivo geral

Reorganize os diretórios do projeto, finalize integralmente a última solicitação funcional, implemente toda a documentação pendente e prepare o frontend e o backend para evolução futura com uma estrutura de governança baseada no método BMAD.

A execução deve preservar o histórico Git, evitar perda de arquivos, validar o funcionamento dos dois projetos após a movimentação e documentar claramente o que foi concluído, o que permanece pendente e como o projeto deverá evoluir.

---

# 1. Regras obrigatórias de execução

1. Antes de mover, excluir, renomear ou sobrescrever qualquer arquivo:
   - analise a estrutura atual;
   - identifique os repositórios Git;
   - verifique alterações não commitadas;
   - registre o estado atual com `git status`;
   - não apague nenhum arquivo sem confirmar que ele foi movido ou substituído corretamente.

2. Não invente arquivos, estruturas, rotas, dependências, entidades ou funcionalidades que não existam sem documentar claramente que são uma nova implementação.

3. Sempre reutilize padrões, componentes, serviços, entidades, convenções e estruturas já existentes no projeto.

4. Não duplique lógica, componentes, estilos, contratos, models, DTOs, services, repositories ou documentação.

5. Não deixe código incompleto, comentado, simulado, com `TODO`, `mock` temporário ou função vazia sem registrar a pendência na documentação.

6. Toda alteração deve:
   - compilar;
   - passar nas validações disponíveis;
   - manter compatibilidade entre frontend e backend;
   - respeitar os padrões atuais do projeto;
   - ser documentada.

7. Em caso de dúvida que possa causar perda de dados, quebra de compatibilidade ou alteração arquitetural relevante, interrompa a execução e pergunte antes de continuar.

8. Não incluir senhas, tokens, chaves, segredos ou credenciais fixas no código-fonte. Use variáveis de ambiente, arquivos `.env.example`, secrets do GitHub ou mecanismos equivalentes.

9. Ao finalizar cada etapa, informe:
   - arquivos criados;
   - arquivos alterados;
   - arquivos movidos;
   - arquivos removidos;
   - validações executadas;
   - pendências encontradas.

---

# 2. Movimentação dos projetos

## Diretório de origem

```text
C:\Users\Meu Computador\Repos\caderno-tecnologia
```

Dentro desse diretório, localize os projetos:

```text
backend
frontend
```

## Diretório de destino

Mova os dois diretórios para:

```text
C:\Users\Meu Computador\Repos\github\projects\caderno-inteligente
```

A estrutura final deverá ser:

```text
C:\Users\Meu Computador\Repos\github\projects\caderno-inteligente
├── backend
└── frontend
```

## Regras para a movimentação

- Preserve as pastas `.git` existentes.
- Preserve o histórico de commits.
- Preserve arquivos ocultos.
- Preserve configurações locais necessárias.
- Não mova `node_modules`, binários, caches ou artefatos temporários se puderem ser recriados.
- Após a movimentação, valide:
  - `git status`;
  - `git remote -v`;
  - branch atual;
  - build do frontend;
  - build do backend;
  - testes disponíveis;
  - execução local dos dois projetos.

Se o diretório de destino não existir, crie-o.

---

# 3. Finalização da última solicitação funcional

Finalize integralmente a última solicitação relacionada ao módulo de autenticação, cadastro, aprovação de usuários, administração, perfil, navegação, breadcrumbs, tema, QA, segurança e integração entre frontend e backend.

Não considere a tarefa concluída enquanto houver funcionalidades parcialmente implementadas.

A implementação deve contemplar:

- cadastro de usuário;
- login tradicional;
- login com Google OAuth;
- validação no backend;
- fluxo de aprovação;
- painel administrativo;
- edição de perfil;
- upload de avatar;
- controle de status;
- autorização por perfil;
- logout;
- tratamento de token;
- navegação;
- botão Voltar;
- breadcrumbs;
- modo claro e escuro;
- mensagens de erro e sucesso;
- persistência no banco;
- auditoria;
- envio de e-mail;
- testes aplicáveis;
- documentação completa.

---

# 4. Documento principal do módulo de autenticação

No frontend, localize:

```text
frontend/docs/modulo-autenticacao.md
```

Analise todo o conteúdo e implemente integralmente o que estiver solicitado.

Caso o nome do documento não represente mais corretamente o escopo, renomeie para um nome mais abrangente, por exemplo:

```text
frontend/docs/autenticacao-autorizacao-usuarios.md
```

ou:

```text
frontend/docs/modulo-identidade-e-acesso.md
```

O nome escolhido deve refletir corretamente:

- autenticação;
- autorização;
- cadastro;
- aprovação;
- perfil;
- administração de usuários;
- integração com backend;
- segurança;
- testes;
- fluxos de navegação.

Após a implementação, atualize o documento com:

- escopo final;
- arquitetura adotada;
- regras de negócio;
- endpoints utilizados;
- componentes criados;
- serviços criados;
- models e interfaces;
- fluxos;
- decisões técnicas;
- cenários de erro;
- validações;
- testes;
- pendências futuras.

---

# 5. Implementação do método BMAD

Após finalizar e validar o escopo atual, implemente uma estrutura BMAD para frontend e backend.

Antes da implementação, analise a arquitetura existente e adapte o método ao projeto. Não copie uma estrutura genérica sem relacioná-la ao contexto real do sistema.

## Estrutura esperada no frontend

```text
frontend/
├── .agents/
├── agentes/
└── docs/
```

## Estrutura esperada no backend

```text
backend/
├── .agents/
├── agentes/
└── docs/
```

## Conteúdo mínimo da pasta `.agents`

Crie instruções operacionais para agentes de IA, incluindo:

- contexto do projeto;
- arquitetura;
- padrões obrigatórios;
- regras de alteração;
- restrições;
- convenções de nomenclatura;
- checklist antes de editar;
- checklist depois de editar;
- regras de testes;
- regras de documentação;
- regras de segurança;
- regras de integração entre frontend e backend;
- política contra regressões;
- política para alteração de contratos;
- política de migrations;
- política de versionamento.

## Agentes mínimos do frontend

Crie agentes especializados para:

- arquitetura frontend;
- Angular;
- UI e design system;
- acessibilidade;
- autenticação;
- integração HTTP;
- estado global;
- testes unitários;
- testes E2E;
- performance;
- documentação;
- revisão de código;
- segurança frontend.

## Agentes mínimos do backend

Crie agentes especializados para:

- arquitetura backend;
- Go;
- API REST;
- autenticação e autorização;
- banco de dados;
- migrations;
- segurança;
- observabilidade;
- testes unitários;
- testes de integração;
- performance;
- documentação;
- revisão de código;
- Docker;
- CI/CD.

## Documentação do BMAD

Crie, em cada projeto, uma documentação explicando:

- o que é BMAD;
- por que está sendo usado;
- estrutura criada;
- responsabilidade de cada agente;
- como escolher o agente correto;
- fluxo recomendado de execução;
- limites de atuação;
- exemplos de prompts;
- checklist de validação;
- como evoluir a estrutura futuramente.

Sugestões de arquivos:

```text
docs/BMAD/bmad-visao-geral.md
docs/BMAD/bmad-agentes.md
docs/BMAD/bmad-fluxo-de-trabalho.md
docs/BMAD/bmad-governanca.md
```

---

# 6. Modelagem de dados e fluxogramas do backend

No backend, crie documentação visual e textual completa da arquitetura e dos relacionamentos.

## Arquivos esperados

```text
backend/docs/modelagem-fluxograma/modelagem-dados.md
backend/docs/modelagem-fluxograma/relacionamentos-entidades.md
backend/docs/modelagem-fluxograma/fluxos-backend.md
backend/docs/modelagem-fluxograma/arquitetura-backend.md
```

Crie também pelo menos um arquivo visual editável:

```text
backend/docs/auth/modelagem-dados.drawio
```

ou, quando mais adequado:

```text
backend/docs/auth/fluxo-autenticacao.drawio
```

## Conteúdo mínimo

Documente:

- entidades;
- campos;
- tipos;
- identificadores;
- relacionamentos;
- cardinalidades;
- índices;
- constraints;
- timestamps;
- soft delete, se aplicável;
- status;
- perfis;
- permissões;
- auditoria;
- tokens;
- sessões;
- aprovação de usuários;
- upload de avatar;
- notificações;
- fluxo de autenticação;
- fluxo de autorização;
- fluxo administrativo;
- fluxo de recuperação de acesso, se existir.

Inclua diagramas Mermaid dentro dos arquivos Markdown quando isso facilitar a leitura.

---

# 7. Documentação futura do Swagger/OpenAPI

Crie uma documentação específica para a futura implementação do Swagger/OpenAPI no backend.

Arquivo sugerido:

```text
backend/docs/swagger-openapi.md
```

A documentação deve explicar:

- objetivo;
- biblioteca recomendada para Go;
- instalação;
- configuração;
- anotações;
- geração da especificação;
- exposição da rota;
- autenticação no Swagger;
- documentação de request e response;
- documentação de erros;
- versionamento da API;
- exemplos de endpoints;
- integração com CI;
- validação da especificação;
- checklist de implementação;
- riscos;
- pendências.

Não implemente Swagger agora, salvo se ele já fizer parte do escopo ativo. Registre claramente como item futuro.

---

# 8. Mapa de testes e qualidade

Crie documentação separando claramente:

## Já implementado

Mapeie o que realmente existe hoje:

- testes unitários;
- testes de integração;
- testes E2E;
- coverage;
- lint;
- formatação;
- validações de build;
- pipelines;
- análise estática;
- testes de contrato;
- testes de API;
- testes de performance;
- testes de segurança.

## Ainda não implementado

Documente o plano futuro para:

- testes unitários;
- coverage;
- testes de integração;
- testes de contrato;
- testes de API;
- testes de performance;
- testes de acessibilidade;
- testes de segurança;
- testes de regressão;
- testes de carga;
- testes de concorrência.

Não afirme que uma ferramenta está implementada sem validar arquivos, dependências, scripts e execução real.

## Arquivos sugeridos

Frontend:

```text
frontend/docs/qualidade-e-testes.md
frontend/docs/plano-testes-futuros.md
```

Backend:

```text
backend/docs/qualidade-e-testes.md
backend/docs/plano-testes-futuros.md
```

Cada documento deve conter uma tabela com:

| Item | Status | Evidência | Arquivo/Comando | Pendência | Prioridade |
| ---- | ------ | --------- | --------------- | --------- | ---------- |

---

# 9. README e documentação de uso do frontend

Atualize ou crie:

```text
frontend/README.md
```

O README deve conter:

- visão geral;
- stack;
- requisitos;
- versão do Node.js;
- versão do npm;
- versão do Angular;
- como clonar;
- como entrar no diretório;
- como instalar dependências;
- como executar;
- como executar em outra porta;
- como gerar build;
- como executar testes;
- como gerar coverage;
- como executar lint;
- como configurar variáveis de ambiente;
- estrutura de pastas;
- scripts disponíveis;
- integração com backend;
- solução de problemas;
- política de contribuição;
- comandos Git principais;
- referência para as demais documentações.

Exemplo de fluxo:

```bash
git clone <URL_DO_REPOSITORIO>
cd frontend
npm install
npm run start
```

Todos os comandos devem corresponder aos scripts reais do `package.json`.

---

# 10. README e documentação de uso do backend

Atualize ou crie:

```text
backend/README.md
```

Altere o backend para utilizar:

```text
Go 1.25
```

Atualize os arquivos compatíveis, incluindo, quando existirem:

- `go.mod`;
- Dockerfile;
- workflows;
- documentação;
- scripts;
- arquivos de versão;
- ferramentas;
- imagens base.

## Requisitos obrigatórios documentados

O usuário deve ter instalado:

- Go 1.25;
- Git;
- Docker;
- Docker Compose;
- ferramenta de migrations, quando aplicável;
- banco de dados necessário;
- demais dependências reais do projeto.

## Conteúdo do README

- visão geral;
- arquitetura;
- stack;
- requisitos;
- como clonar;
- como entrar no diretório;
- como baixar dependências;
- como configurar variáveis de ambiente;
- como executar localmente;
- como executar via Docker;
- como executar Docker Compose;
- como parar containers;
- como remover containers;
- como visualizar logs;
- como executar testes;
- como gerar coverage;
- como executar lint;
- como executar migrations;
- como popular banco;
- como acessar healthcheck;
- como configurar autenticação;
- como solucionar erros comuns;
- scripts e comandos disponíveis;
- estrutura de pastas;
- referência para a documentação técnica.

Exemplos de comandos que devem ser validados antes de documentar:

```bash
git clone <URL_DO_REPOSITORIO>
cd backend
go mod download
go run ./cmd/api
```

Docker:

```bash
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

Não documente comandos que não funcionem no projeto real.

---

# 11. Validações obrigatórias ao final

## Frontend

Execute e valide, conforme os scripts existentes:

```bash
npm install
npm run build
npm test
npm run lint
```

Quando houver:

```bash
npm run test:coverage
npm run e2e
```

## Backend

Execute e valide:

```bash
go version
go mod tidy
go build ./...
go test ./...
go vet ./...
```

Quando houver Docker:

```bash
docker compose config
docker compose build
docker compose up -d
docker compose ps
```

## Integração

Validar:

- frontend inicia;
- backend inicia;
- frontend acessa o backend;
- variáveis de ambiente estão corretas;
- CORS funciona;
- login funciona;
- cadastro funciona;
- aprovação funciona;
- rotas protegidas funcionam;
- logout funciona;
- persistência funciona;
- erros são tratados;
- documentação corresponde ao comportamento real.

---

# 12. Entregáveis finais

Ao concluir, entregue um relatório com:

## Movimentação

- origem;
- destino;
- diretórios movidos;
- validação dos repositórios;
- branches;
- remotes;
- status final.

## Implementação

- funcionalidades concluídas;
- funcionalidades corrigidas;
- integrações realizadas;
- endpoints criados ou alterados;
- componentes criados ou alterados;
- entidades criadas ou alteradas;
- migrations criadas;
- configurações alteradas.

## BMAD

- estrutura criada;
- agentes criados;
- finalidade de cada agente;
- documentação criada.

## Documentação

Liste todos os arquivos:

- criados;
- alterados;
- renomeados;
- removidos.

## Testes

Informe:

- comandos executados;
- resultados;
- coverage encontrado;
- falhas;
- pendências;
- riscos.

## Estado futuro

Crie uma tabela final:

| Área | Pronto | Parcial | Não iniciado | Próxima ação | Prioridade |
| ---- | -----: | ------: | -----------: | ------------ | ---------- |

---

# 13. Critérios de aceite

A tarefa somente será considerada concluída quando:

- os diretórios estiverem no destino correto;
- o histórico Git estiver preservado;
- frontend e backend compilarem;
- a última solicitação funcional estiver finalizada;
- o documento de autenticação estiver atualizado;
- a estrutura BMAD estiver criada nos dois projetos;
- os agentes estiverem documentados;
- a modelagem do backend estiver documentada;
- os fluxos estiverem representados;
- o plano de Swagger estiver documentado;
- o mapa de testes atual e futuro estiver documentado;
- o README do frontend estiver completo;
- o README do backend estiver completo;
- o backend estiver atualizado para Go 1.25;
- os comandos documentados tiverem sido validados;
- todas as pendências estiverem registradas;
- não houver perda de arquivos;
- não houver segredos expostos no repositório.

Ao encontrar qualquer impedimento real, informe exatamente:

- qual é o problema;
- em qual arquivo ocorre;
- qual impacto causa;
- quais opções existem;
- qual solução é recomendada;
- o que depende de confirmação.
