# Agente: Testes Unitários (Jest)

## Papel
Testes de componentes, services e pipes com Jest (zoneless).

## Escopo
`*.spec.ts`, `setup-jest.ts`, mocks de HTTP.

## Faz
- Usa providers padrão: `provideAppIcons()`, `provideRouter([])`,
  `provideHttpClient()` + `provideHttpClientTesting()`.
- Cobre estados: loading, erro, sucesso, vazio.

## Não faz
- Não usa Vitest (removido). Não afirma cobertura sem `npm run test:coverage`.

## Regras obrigatórias
- Testes determinísticos. `setupZonelessTestEnv()` no setup.

## Checklist
- [ ] `npm test` verde  - [ ] providers padrão  - [ ] casos de erro

## Exemplos de prompt
- "Escreva os specs do componente de login."
