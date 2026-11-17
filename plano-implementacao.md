# Plano de Implementação — Versão Inicial

Objetivo
- Planejar a implementação da versão inicial de um jogo de palavras cruzadas em JavaScript puro, sem API, com suporte offline e funcionamento no navegador desktop. Não incluir palavras nem pistas nesta versão — apenas a infraestrutura para carregá-las quando forem fornecidas.

Restrições e premissas (fornecidas pelo usuário)
- Usar apenas JavaScript puro (sem frameworks). Questionar antes de adicionar qualquer biblioteca.
- Não usar API externa; tudo rodará localmente no cliente.
- Palavras/pistas serão fornecidas posteriormente; não incluí-las agora.
- Persistência temporária via localStorage é aceitável; não é necessário salvar permanente no servidor.
- Suporte offline requerido.
- Foco em web desktop (não mobile).
- Uma única puzzle visível, centralizado na página.

Escopo desta versão inicial
- Interface (SPA estática): carregar um puzzle (arquivo JSON fornecido pelo usuário), renderizar a grelha, permitir entrada do jogador, navegação por teclado, validação local de preenchimento e persistência temporária no localStorage.
- Suporte offline via Service Worker para cache dos ativos estáticos.
- Não incluir conteúdo de pistas/palavras reais; apenas um schema/placeholder para quando o conteúdo for fornecido.

Arquivos a criar / alterar
- Criar: index.html — estrutura HTML da aplicação (single page), container central.
- Criar: styles.css — estilos para desktop, grelha centralizada, foco acessível.
- Criar: app.js — lógica principal: carregar puzzle, renderizar grelha, input, navegação, validação mínima, persistência temporária.
- Criar: puzzle-schema.json — arquivo de exemplo/placeholder contendo o schema (sem palavras/pistas), descrevendo o formato esperado do puzzle (dimensões, células pretas, mapeamento de posições para across/down). NÃO incluir palavras nem pistas.
- Criar: sw.js — service worker para cache dos ativos e suporte offline.
- Criar: plano-implementacao.md (este arquivo).
- Opcional (documentação): README.md — instruções de uso e formato do puzzle esperado.

Componentes e responsabilidades
- UI Shell (index.html + styles.css)
  - Header simples (título), área central para o puzzle, controles mínimos (botões: "Reiniciar", "Limpar", "Carregar puzzle (JSON)").

- Puzzle Loader (app.js)
  - Carregar um arquivo JSON fornecido pelo usuário via input file ou arrastar-soltar.
  - Validar schema mínimo (largura, altura, array de células, números/indices de entrada).
  - Não carregar palavras/pistas automaticamente (espera-se que o usuário forneça depois); exibir placeholders para pistas quando ausentes.

- Grid Renderer (app.js)
  - Renderizar uma tabela/grid centralizada com células editáveis (input tipo text, maxlength=1) e células negras.
  - Numerar células inicializadoras de palavras (across/down) com pequenos badges.

- Input & Navigation (app.js)
  - Suportar entrada de letra em cada célula, navegação com setas, Tab/Shift+Tab, Enter para ir para próxima palavra.
  - Auto-mover o foco para a próxima célula da palavra quando uma letra é digitada.

- Regras de validação local (app.js)
  - Validação básica de formato (caracteres permitidos: A-Z). Não validar contra palavras reais nesta versão.
  - Indicar palavras completas (todas as células preenchidas) visualmente (ex.: borda/alteração de cor) — sem checagem de correção sem palavras.

- Persistência temporária (app.js)
  - Salvar estado atual do grid no localStorage com uma chave por puzzle (por ex.: crossword:current).
  - Carregar o estado salvo ao abrir a página (se existir).
  - Fornecer botão "Reiniciar" para limpar estado e localStorage relacionado.

- Offline (sw.js)
  - Service Worker que faz cache estático dos arquivos essenciais (index.html, styles.css, app.js, puzzle-schema.json) após primeiro acesso.
  - Verificar e documentar como forçar atualização do cache.

Modelo de dados (schema mínimo esperado)
- Exemplo de propriedades (arquivo puzzle-schema.json — sem palavras/pistas):
  - width: integer
  - height: integer
  - cells: array of length width*height com valores: letter|null (null para vazia), isBlack:boolean, number?:int
  - clues: { across: array, down: array } — opcional nesta versão (pode estar vazio)

Regras de negócio (comportamento esperado)
- A aplicação monta a grelha conforme o schema recebido; células marcadas como "black" não são editáveis.
- O jogador pode digitar somente uma letra por célula; caracteres inválidos são rejeitados.
- Ao preencher todas as células de uma palavra, o sistema apenas marca a palavra como "completa" — não faz verificação de acerto sem as palavras.
- O estado do jogador é mantido temporariamente no localStorage para recuperação em reload.
- A aplicação deve ser carregável e utilizável offline depois do primeiro acesso (assets em cache via Service Worker).

Decisões técnicas (justificadas)
- JavaScript puro: atende a restrição do usuário; código pequeno e direto.
- localStorage: suficiente para persistência temporária e simples de usar; IndexedDB seria excessivo para esta versão.
- Service Worker para offline: padrão web para permitir cache e offline sem servidor.
- Um puzzle por vez, centralizado: simplifica o layout e atende ao requisito.
- Não incluir verificação de palavras nesta versão (sem pistas/dicionário fornecido).

Etapas numeradas de implementação e como validar cada uma
1. Criar esqueleto do projeto
   - Ações: adicionar index.html, styles.css, app.js, puzzle-schema.json (placeholder) e sw.js vazio.
   - Validação: abrir index.html no navegador via file:// ou servidor local simples; a página deve carregar e exibir título e área central vazia, sem erros no console.

2. Implementar o loader de puzzle (input file)
   - Ações: permitir ao usuário selecionar um arquivo JSON que segue o schema mínimo; parse e validação básica do formato.
   - Validação: arrastar/selecionar um arquivo puzzle-schema.json — o app deve aceitar o arquivo, mostrar um status "Puzzle carregado" e não quebrar se o arquivo estiver vazio de pistas.

3. Implementar o renderer de grelha
   - Ações: renderizar grid com as dimensões do puzzle, células negras, badges de numeração, inputs de 1 caractere para células brancas.
   - Validação: carregar um schema de teste (sem palavras) e verificar visualmente: grelha centralizada, células negras corretas, inputs aceitando uma letra cada um.

4. Implementar navegação e entrada de texto
   - Ações: setas para navegar, auto-avançar ao digitar, Suprimir/Backspace para eliminar e voltar, Tab e Enter para mover entre palavras.
   - Validação: testar manualmente teclado: digitar letras, navegar com setas, Tab e Enter; o foco e comportamento devem corresponder ao esperado sem erros no console.

5. Implementar validação de formato e marcação de palavras completas
   - Ações: aceitar somente A-Z (maiúsculas; conversão automática se necessário); quando todas as células de uma palavra estiverem preenchidas, marcar visualmente como "completa".
   - Validação: preencher todas as células de uma palavra e observar marcação visual; tentar inserir caracteres numéricos ou múltiplos caracteres e verificar que são rejeitados.

6. Implementar persistência temporária via localStorage
   - Ações: salvar estado do grid a cada alteração (debounced), carregar estado salvo no start, botão "Reiniciar" para limpar.
   - Validação: preencher algumas letras, recarregar a página e verificar que o conteúdo foi restaurado; clicar "Reiniciar" e confirmar que tudo é limpo e localStorage não contém mais dados relacionados.

7. Adicionar Service Worker para suporte offline
   - Ações: implementar sw.js que faça cache dos arquivos estáticos essenciais e sirva do cache quando offline.
   - Validação: abrir a página com rede, então desligar rede e recarregar a página — a aplicação deve continuar funcional (ao menos UI e interações locais) sem erros de carregamento de arquivos.

8. Documentação e README
   - Ações: documentar o schema esperado do puzzle (ex.: campos, tipagem) e instruções de como fornecer o JSON de pistas/palavras posteriormente.
   - Validação: seguir o README para construir um JSON de teste (sem palavras) e carregar via UI sem erros.

Perguntas pendentes / decisões a confirmar antes de implementar
1. Comportamento em relação a letras acentuadas ou alfabetos não latinos — devo aceitar apenas A-Z (ASCII) nesta versão? (recomendado: A-Z)
2. Deseja recursos de ajuda/revelação (revelar letra, revelar palavra) nesta versão inicial? Se sim, qual é a política de uso (limitada, paga, ilimitada)?
3. Como deverá ser o formato exato do JSON de puzzle quando for fornecido (ex.: lista de palavras com posições e direções, ou uma matriz de células)? Posso propor um schema (estilo width/height + cells) no README?
4. Necessita de marcação visual adicional (ex.: indicação de palavra selecionada across/down, seleção com mouse)?
5. Para o service worker: qual é a política de atualização de cache (atualizar automaticamente, pedir ao usuário)?

Riscos e pontos de atenção
- Sem pistas/palavras não é possível validar se as entradas estão corretas — a aplicação só pode marcar completude de palavras.
- Uso de localStorage limita o tamanho dos dados; isso é adequado para um puzzle único, mas não para um grande conjunto de puzzles.
- Service Worker requer HTTPS para deploy; em ambiente local usar localhost funciona para testes.

Próximos passos sugeridos após aprovação do plano
1. Confirmar as perguntas pendentes (responder 1–5 acima).
2. Aprovar o schema JSON proposto no README para que eu possa usar como contrato para carregar puzzles quando implementarmos.
3. Após aprovação, implementar as etapas 1–8 conforme numeradas.

Observação final
- Este documento é um plano — nenhuma alteração no código será feita até receber sua confirmação e/ou respostas às perguntas pendentes.
