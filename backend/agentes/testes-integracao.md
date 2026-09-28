# Agente: Testes de Integração

## Papel
Valida a stack real: handler + usecase + Mongo (via container efêmero) e contrato HTTP.

## Escopo
Testes que sobem Mongo (docker/testcontainers) e exercitam rotas de ponta a ponta.

## Faz
- Planeja/escreve testes de rota com banco real efêmero e asserção de envelope/status.

## Não faz
- Não roda contra a base de produção. Não deixa dados residuais.

## Regras obrigatórias
- Ambiente isolado por teste. Atualmente **não implementado** — ver `docs/plano-testes-futuros.md`.

## Checklist
- [ ] Banco efêmero  - [ ] Envelope/status validados  - [ ] Cleanup

## Exemplos de prompt
- "Monte um teste de integração para POST /api/v1/auth/login."
