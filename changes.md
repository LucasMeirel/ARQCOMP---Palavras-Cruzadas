# Changes

Este arquivo lista as alterações já feitas no repositório e as mudanças planejadas solicitadas pelo usuário.

Alterações já aplicadas
- Criado index.html com UI principal (header, controles, área de grelha, caixa de pista).
- Criado style.css (renomeado para style.css) com estilos iniciais para desktop.
- Criado script.js contendo a lógica do jogo adaptada para execução local (puzzle embutido no JS para permitir file://).
- Removido suporte a upload de JSON e fetch; puzzle foi embutido em script.js para execução sem servidor.
- Implementado render da grelha, inputs por célula, navegação por teclado e persistência no localStorage (chave: crossword:current).
- Implementado normalização interna das palavras e entradas para MAIÚSCULAS, sem acentos e sem espaços (conforme AGENT.MD).
- Removidos botões de revelar letra/palavra da UI.
- Ajustado tamanho dos elementos centrais (células, fontes e caixa de pista) para maior destaque.
- Adicionado efeito de confete (confetti) que é acionado ao completar todas as palavras corretamente.
- Atualizado README.md e plano-implementacao.md para refletir a execução local e as mudanças de arquitetura.

Arquivos criados
- index.html
- style.css
- script.js
- README.md (atualizado)
- plano-implementacao.md (atualizado)

Remoções
- puzzle-schema.json removido (puzzle embutido agora)
- app.js / styles.css nomes antigos removidos

Comportamento planejado / próximas mudanças possíveis (ainda não aplicadas)
- Preencher o tabuleiro com no mínimo 12 palavras da lista do AGENT.MD e posicioná-las de forma que todas cruzem conforme as regras (opcional: eu posso gerar automaticamente esse layout).
- Implementar botão "Conferir" que marca quais palavras estão corretas/erradas e exibe contador de acertos (ex.: "8 de 12 palavras").
- Gerar listagem de pistas separadas e numeradas em Horizontais / Verticais conforme requisito do AGENT.MD.
- Adicionar efeito visual adicional para palavras corretas/erradas (ex.: marcação verde/vermelha após Conferir).

Observações
- O projeto agora roda diretamente abrindo index.html (file://). Se futuramente desejar retornar a um modelo que carrega puzzles por fetch (servidor), será necessário reintroduzir fetch e/ou upload de JSON.
