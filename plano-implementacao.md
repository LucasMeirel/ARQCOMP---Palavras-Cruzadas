# Plano de Implementação — Versão Inicial

Objetivo
- Planejar e documentar a implementação da versão inicial de um jogo de palavras cruzadas em JavaScript puro, sem API, com suporte para execução local (file://) no navegador desktop. Nesta versão o puzzle é embutido no JavaScript e não há upload de arquivos externos.

Restrições e premissas (fornecidas pelo usuário)
- Usar apenas JavaScript puro (sem frameworks).
- Não usar API externa; tudo roda localmente no cliente.
- Persistência temporária via localStorage.
- Suporte offline por execução local (arquivo embutido, sem Service Worker).
- Foco em web desktop (não mobile).
- Uma única puzzle visível, centralizado na página.

Escopo desta versão inicial
- Interface (página estática): puzzle embutido no script.js; renderizar a grelha, permitir entrada do jogador, navegação por teclado, validação local e persistência temporária no localStorage. A aplicação foi adaptada para rodar sem servidor (funciona via file://).
- Não incluir múltiplos puzzles — uma única cruzadinha embutida.

Arquivos a criar / alterar
- Criar: index.html — estrutura HTML da aplicação (root).
- Criar: style.css — estilos para desktop, grelha centralizada, foco acessível.
- Criar: script.js — lógica principal com puzzle embutido: renderizar grelha, input, navegação, validação, persistência temporária.
- Criar: plano-implementacao.md (este arquivo).
- Opcional (documentação): README.md — instruções de uso e formato do puzzle esperado.

Note: A aplicação roda localmente sem servidor; não será usado Service Worker nesta versão inicial.

Componentes e responsabilidades
- UI Shell (index.html + style.css)
  - Header simples (título), área central para o puzzle, controles mínimos (botão: "Reiniciar", seletor de direção).

- Puzzle Loader (script.js)
  - Puzzle embutido em script.js para permitir execução via file://.
  - Validar schema mínimo internamente (largura, altura, entries).
  - Exibir placeholders para pistas quando ausentes.

- Grid Renderer (script.js)
  - Renderizar uma tabela/grid centralizada com células editáveis (input), células negras e badges de numeração.

- Indicação de palavra selecionada e caixa de pista
  - Quando o usuário seleciona uma célula, identificar a palavra ativa (across ou down conforme direção selecionada) e destacar visualmente essa palavra.
  - Abaixo da grelha, exibir a pista da palavra selecionada (se fornecida).

- Input & Navigation (script.js)
  - Suportar entrada de letra em cada célula, navegação com setas, Tab/Shift+Tab, Enter para ir para próxima palavra.
  - Auto-mover o foco para a próxima célula da palavra quando uma letra é digitada.

- Revealer (script.js)
  - Área/controles de "Revelar letra" e "Revelar palavra" visíveis, mas desabilitados nesta versão inicial. O sistema marca automaticamente uma palavra como "revelada" quando todas as suas letras coincidirem com a solução embutida.

- Regras de validação local (script.js)
  - Validação básica: entradas e soluções são normalizadas para o formato exigido pelo AGENT.MD: letras MAIÚSCULAS, sem acentos e sem espaços. A aplicação converte internamente entradas e soluções para esse formato para comparação.
  - Indicar palavras completas (todas as células preenchidas) visualmente e marcar como "revelada" quando estiver correta.

- Persistência temporária (script.js)
  - Salvar estado atual do grid no localStorage com chave por puzzle (ex.: crossword:current).
  - Carregar o estado salvo ao abrir a página (se existir).
  - Botão "Reiniciar" limpa estado e localStorage relacionado.

Modelo de dados (schema mínimo esperado)
- Proposta (formato preferido para esta versão):
  - width: integer
  - height: integer
  - entries: array of word entries, cada entry com:
    - id: int (opcional)
    - word: string (texto da palavra no formato do tabuleiro: MAIÚSCULAS, sem acento, sem espaço)
    - clue: string (pista correspondente)
    - row: integer (linha inicial, 0-indexed)
    - col: integer (coluna inicial, 0-indexed)
    - dir: "across" | "down"
  - cells: opcional — matriz ou array derivável a partir de entries.

  - Exemplo mínimo embutido (script.js) — inclui duas palavras como amostra (formatadas conforme regra do AGENT.MD):

  {
    "width": 5,
    "height": 5,
    "entries": [
      { "id": 1, "word": "RAM", "clue": "memória temporária, ou carneiro em inglês", "row": 0, "col": 0, "dir": "across" },
      { "id": 2, "word": "FLASH", "clue": "memória, ou herói velocista", "row": 2, "col": 0, "dir": "across" }
    ]
  }

Regras de negócio (comportamento esperado)
- A aplicação monta a grelha conforme o schema embutido; células marcadas como "black" não são editáveis.
- O jogador digita uma letra por célula; caracteres inválidos são rejeitados.
- Ao preencher todas as células de uma palavra corretamente, o sistema marca a palavra como "revelada".
- O estado do jogador é mantido temporariamente no localStorage para recuperação em reload.

Decisões técnicas (justificadas)
- JavaScript puro: atende a restrição do usuário; código pequeno e direto.
- localStorage: suficiente para persistência temporária e simples de usar.
- A aplicação roda via file:// sem servidor, por isso o puzzle foi embutido no script e nenhum Service Worker foi implementado.
- Um puzzle por vez, centralizado: simplifica o layout e atende ao requisito.

Etapas numeradas de implementação e como validar cada uma
1. Criar esqueleto do projeto
   - Ações: adicionar index.html, style.css, script.js (com puzzle embutido).
   - Validação: abrir index.html no navegador via file://; a página deve carregar e exibir título e área central vazia, sem erros no console.

2. Implementar o renderer de grelha
   - Ações: renderizar grid com as dimensões do puzzle, células negras, badges de numeração, inputs de 1 caractere para células brancas.
   - Validação: abrir index.html via file:// e verificar visualmente: grelha centralizada, células negras corretas, inputs aceitando uma letra cada um.

3. Implementar navegação e entrada de texto
   - Ações: setas para navegar, auto-avançar ao digitar, Suprimir/Backspace para eliminar e voltar, Tab e Enter para mover entre palavras.
   - Validação: testar manualmente teclado: digitar letras, navegar com setas, Tab e Enter; o foco e comportamento devem corresponder ao esperado sem erros no console.

4. Implementar validação de formato e marcação de palavras completas
   - Ações: normalizar internamente para o formato do tabuleiro (remover acentos/espacos e converter para MAIÚSCULAS) e limitar a um grapheme cluster por célula; quando todas as células de uma palavra estiverem preenchidas corretamente, marcar visualmente como "revelada".
   - Validação: preencher todas as células de uma palavra corretamente e observar marcação visual; tentar inserir caracteres numéricos ou múltiplos caracteres e verificar que são rejeitados.

5. Implementar persistência temporária via localStorage
   - Ações: salvar estado do grid a cada alteração, carregar estado salvo no start, botão "Reiniciar" para limpar.
   - Validação: preencher algumas letras, recarregar a página (file://) e verificar que o conteúdo foi restaurado; clicar "Reiniciar" e confirmar que tudo é limpo e localStorage não contém mais dados relacionados.

6. Implementar indicação de palavra selecionada e caixa de pista
   - Ações: ao focar uma célula, determinar a palavra ativa (across/down) e destacar a palavra; renderizar abaixo uma caixa com a pista correspondente, se fornecida.
   - Validação: selecionar uma célula e verificar que a palavra inteira é destacada e que a caixa de pista mostra o texto correto (ou placeholder se não houver pista).

7. Implementar mecanismo de marcação de palavra como "revelada" quando completa e correta
   - Ações: ao detectar que todas as células de uma palavra correspondem à solução embutida, marcar a palavra visualmente como "revelada" (ex.: cor de fundo/borda). Os botões de "Revelar" estarão presentes na UI mas permanecerão desabilitados nesta versão.
   - Validação: preencher corretamente todas as letras de uma palavra e verificar que ela recebe o estado "revelada" automaticamente.

8. Documentação e README
   - Ações: documentar o schema esperado do puzzle (ex.: campos, tipagem) e instruções de uso local.
   - Validação: abrir index.html via file:// e confirmar funcionamento conforme o README.

Perguntas pendentes / decisões a confirmar antes de implementar
1. Confirmar que manteremos o puzzle embutido e que o formato do tabuleiro será MAIÚSCULAS sem acento/sem espaço (conforme AGENT.MD).
2. Deseja que eu posicione as 12+ palavras exigidas pelo AGENT.MD automaticamente nesta versão, ou você vai fornecer as posições? (recomendado: eu posiciono automaticamente)
3. Deseja renomear os botões/estilos para seguir exatamente o padrão da avaliação (por ex.: nomes de classes ou IDs específicos)?

Riscos e pontos de atenção
- Sem implementação de Service Worker, a aplicação depende de arquivos locais embutidos; isso é adequado para entrega acadêmica e execução via file://.
- Uso de localStorage limita o tamanho dos dados; isso é adequado para um puzzle único.

Próximos passos sugeridos após aprovação do plano
1. Confirmar as perguntas pendentes (responder 1–3 acima).
2. Caso aprovado, implementar as funcionalidades restantes: posicionar 12+ palavras, implementar botão "Conferir", contador de acertos e efeito de comemoração.

Observação final
- Este documento é um plano — mudanças no código foram feitas conforme sua autorização para executar alterações. Se desejar reverter o comportamento de execução local (usar fetch/puzzle externo), informe e eu ajusto.
