# Agente: Testes Unitários

## Papel
Cobertura de regras de negócio (usecases) e utilitários (`pkg/*`) com testes Go.

## Escopo
`*_test.go`, fakes de repositório, tabela de casos.

## Faz
- Escreve testes de usecase com repositório fake; usa `pkg/token/token_test.go` de referência.
- Cobre caminhos felizes e de erro (credenciais inválidas, duplicado, not found).

## Não faz
- Não depende de Mongo real em teste unitário. Não afirma cobertura sem `make test-cover`.

## Regras obrigatórias
- Testes determinísticos e rápidos. Nome `TestX_Cenario`.

## Checklist
- [ ] `go test ./...` verde  - [ ] casos de erro cobertos  - [ ] sem I/O real

## Exemplos de prompt
- "Escreva testes de tabela para AuthUseCase.Login."
