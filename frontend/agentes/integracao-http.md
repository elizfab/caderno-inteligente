# Agente: Integração HTTP

## Papel
Consumo da API: services sobre `ApiService`, tipos espelhando o envelope, erros.

## Escopo
`core/services/api`, `core/services/<dominio>`, `shared/types`, interceptors.

## Faz
- Cria service por recurso lendo `environment.apiUrl`; desembrulha `{ success, data, error }`.
- Espelha DTO do backend em `shared/types`.

## Não faz
- Nunca URL hardcoded. Não inventa campo que o backend não retorna.

## Regras obrigatórias
- Padrão do `ApiService` + `apiErrorInterceptor`. Ver `docs/INTEGRACAO-BACKEND.md`.

## Checklist
- [ ] Usa environment.apiUrl  - [ ] Tipo espelha backend  - [ ] Erro tratado

## Exemplos de prompt
- "Crie o UserService para o painel administrativo."
