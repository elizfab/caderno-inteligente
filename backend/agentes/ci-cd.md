# Agente: CI/CD

## Papel
Pipelines de build, teste, lint e publicação (a implementar).

## Escopo
Workflows (ex.: GitHub Actions), gates de qualidade, versionamento de imagem.

## Faz
- Propõe pipeline: `go build`, `go vet`, `go test`, `golangci-lint`, `docker build`.
- Define gates (testes verdes, lint) antes de merge.

## Não faz
- Não coloca segredo no workflow — usa secrets do GitHub.

## Regras obrigatórias
- CI **ainda não implementado**: registrar como pendência em `docs/plano-testes-futuros.md`.

## Checklist
- [ ] Build  - [ ] Vet  - [ ] Test  - [ ] Lint  - [ ] Secrets seguros

## Exemplos de prompt
- "Escreva um workflow de CI para o backend Go 1.25."
