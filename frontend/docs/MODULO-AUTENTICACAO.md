> **Este documento é a ESPECIFICAÇÃO funcional (requisitos) do módulo.**
> O **estado real de implementação, arquitetura, endpoints e pendências** está em
> [`autenticacao-autorizacao-usuarios.md`](autenticacao-autorizacao-usuarios.md).
> Prioridade atual: Reorganização + BMAD + Documentação (a implementação funcional
> completa — cadastro, aprovação, admin, perfil, OAuth, e-mail — está registrada
> como pendência no documento de estado).

# Objetivo

Implemente completamente o módulo de Autenticação, Cadastro de Usuários, Controle de Aprovação de Acesso, Perfil do Usuário, Navegação e Cenários de QA do sistema, seguindo as melhores práticas de arquitetura, UX, segurança, integração com Backend e organização do projeto.

Todo o fluxo deverá estar totalmente integrado ao Backend, utilizando persistência em banco de dados, validações, autenticação segura e documentação técnica.

---

# 1. Cadastro de Usuários

Desenvolva uma página exclusiva de cadastro de usuários contendo os seguintes campos:

- Nome completo
- Telefone (com máscara e validação)
- E-mail
- Senha
- Confirmar senha
- Avatar (upload de imagem local)

## Regras

- Todos os campos são obrigatórios.
- Validar formato do e-mail.
- Validar força mínima da senha.
- Confirmar igualdade entre senha e confirmação.
- Avatar deve aceitar somente imagens (PNG, JPG, JPEG e WebP).
- Exibir preview da imagem antes do envio.
- Armazenar o avatar no Backend.
- Persistir todas as informações no banco de dados.

---

# 2. Login

Implementar duas formas de autenticação:

## Login tradicional

- E-mail
- Senha

## Login com Google

Implementar autenticação utilizando Google OAuth.

Requisitos:

- Integração completa utilizando a API oficial do Google.
- Caso o usuário ainda não exista, criar automaticamente o cadastro.
- Caso já exista, realizar login normalmente.
- Sincronizar nome, e-mail e foto do Google.
- Validar todas as informações no Backend.

---

# 3. Fluxo de Aprovação de Usuários

Após um novo cadastro, o usuário NÃO poderá acessar o sistema imediatamente.

Status inicial:

- Pendente de Aprovação

Ao tentar realizar login:

Exibir mensagem informando que o acesso está aguardando aprovação do administrador.

Exemplo:

"Aguardando aprovação do administrador. Você receberá um e-mail quando seu acesso for liberado."

---

# 4. Painel Administrativo de Usuários

Criar um Dashboard exclusivo para administração dos usuários.

O Dashboard deverá possuir:

## Cards

- Total de usuários
- Usuários ativos
- Usuários pendentes
- Usuários bloqueados

## Tabela

Listar todos os usuários cadastrados.

Colunas:

- Avatar
- Nome
- E-mail
- Telefone
- Data de cadastro
- Último acesso
- Status
- Tipo de usuário
- Ações

Ações:

- Visualizar
- Editar
- Aprovar
- Reprovar
- Bloquear
- Desbloquear
- Excluir

Adicionar:

- Pesquisa
- Ordenação
- Paginação
- Filtro por Status

---

# 5. Aprovação de Usuário

Ao clicar em "Aprovar", abrir um Modal de confirmação.

Exemplo:

Título

"Aprovar usuário"

Mensagem

"Deseja liberar o acesso deste usuário ao sistema?"

Botões:

- Cancelar
- Aprovar

Após aprovação:

- Atualizar banco de dados.
- Alterar status para Ativo.
- Registrar auditoria.
- Enviar e-mail automático ao usuário.

Modelo:

Assunto:

"Acesso liberado"

Mensagem:

"Seu cadastro foi aprovado e seu acesso ao sistema já está disponível."

---

# 6. Usuário Administrador

Criar um administrador fixo.

E-mail:

elizabetesousafabri@gmail.com

Senha:

414100

Esse usuário deverá possuir permissões totais do sistema.

Somente usuários administradores poderão:

- Aprovar usuários
- Excluir usuários
- Bloquear usuários
- Gerenciar permissões

As credenciais NÃO deverão ficar hardcoded.

Utilizar Seed inicial do banco de dados.

---

# 7. Perfil do Usuário

Após login, criar tela "Meu Perfil".

Permitir alteração de:

- Nome
- Telefone
- Senha
- Avatar

O e-mail não poderá ser alterado.

Alterações deverão ser persistidas no Backend.

---

# 8. Login

Adicionar na tela de Login:

Botão

"Criar conta"

Ao clicar:

Opção 1 (recomendada):

Abrir Modal de Cadastro.

Caso a arquitetura não permita, redirecionar para a página de Cadastro.

---

# 9. Fluxo do Login

Após aprovação:

- Login deverá funcionar imediatamente.
- Backend deverá validar:
  - Usuário
  - Senha
  - Status
  - Permissões
- Gerar Token JWT.
- Renovar Token automaticamente quando necessário.
- Implementar Logout seguro.

---

# 10. Botão Voltar

Revisar TODOS os botões "Voltar" existentes no sistema.

Garantir funcionamento correto considerando:

- Navegação via Sidebar.
- Breadcrumbs.
- Navegação direta por URL.
- Refresh da página.
- Histórico do navegador.
- Deep Links.

Caso não exista histórico válido:

Redirecionar para a página padrão correspondente.

---

# 11. Tema Claro e Escuro

Implementar Theme Switch.

Adicionar botão para alternar:

- Light Mode
- Dark Mode

Requisitos:

- Persistir preferência do usuário.
- Aplicar automaticamente no próximo acesso.
- Utilizar CSS Variables.
- Compatível com PrimeNG.

---

# 12. Navegação

Validar toda navegação da aplicação.

Garantir funcionamento de:

- Sidebar
- Action Buttons
- Breadcrumbs
- Botão Voltar
- Router
- Links internos
- Navegação entre módulos

Corrigir qualquer inconsistência encontrada.

---

# 13. Breadcrumbs

Ao acessar qualquer trilha de estudos, verificar:

- Breadcrumbs dinâmicos.
- Links clicáveis.
- Atualização automática.
- Navegação correta.

Criar cenários automatizados de validação.

---

# 14. Cenários de QA

Criar testes cobrindo:

## Login

- Login válido
- Login inválido
- Usuário bloqueado
- Usuário pendente
- Token expirado
- Logout
- Renovação de Token

---

## Cadastro

- Cadastro válido
- Campos obrigatórios
- Senha inválida
- E-mail duplicado
- Upload de Avatar
- Cadastro via Google

---

## Perfil

- Alteração de Nome
- Alteração de Senha
- Upload de Avatar
- Persistência dos dados

---

## Administração

- Aprovação
- Reprovação
- Exclusão
- Bloqueio
- Pesquisa
- Filtros
- Paginação

---

## Navegação

Validar:

- Sidebar
- Breadcrumbs
- Router
- Botão Voltar
- Refresh
- Deep Links

---

# 15. Testes de Performance

Executar cenários de performance para:

- Login
- Logout
- Cadastro
- Aprovação
- Alteração de Perfil
- Upload de Avatar
- Consultas
- Inclusão de registros
- Atualização
- Exclusão

Medir:

- Tempo médio
- Tempo máximo
- Percentis (P50, P90 e P95)
- Throughput
- Erros
- Tempo de resposta do Backend
- Tempo de renderização da interface

Documentar todos os resultados.

---

# 16. Auditoria

Registrar em banco:

- Login
- Logout
- Cadastro
- Aprovação
- Exclusão
- Alterações cadastrais
- Upload de Avatar
- Alteração de senha

Cada registro deverá possuir:

- Usuário
- Data
- Hora
- Ação
- IP (quando disponível)

---

# 17. Documentação

Ao finalizar a implementação, gerar documentação completa contendo:

- Arquitetura adotada.
- Fluxo de autenticação.
- Fluxo de aprovação.
- Integração com Google OAuth.
- Estrutura das APIs.
- Modelo de banco de dados.
- Regras de negócio.
- Controle de permissões.
- Estrutura dos componentes.
- Fluxos de navegação.
- Cenários de QA executados.
- Testes de performance realizados.
- Evidências das validações.
- Melhorias implementadas.
- Pendências identificadas.
- Sugestões de evolução futura.

Nenhuma funcionalidade deverá permanecer parcialmente implementada. Todo o fluxo deve estar totalmente funcional, integrado ao Backend, validado, documentado e seguindo boas práticas de arquitetura, segurança, acessibilidade, responsividade e experiência do usuário.