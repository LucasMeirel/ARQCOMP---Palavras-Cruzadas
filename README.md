# Palavras Cruzadas — Versão Inicial

Este repositório contém uma base mínima para um jogo de palavras cruzadas em JavaScript puro (sem frameworks). O objetivo desta versão é prover uma interface local, offline (execução local); o puzzle está embutido no JavaScript para permitir execução via file://.

Como usar
- Abra a pasta em um servidor local simples (recomendado) ou abra index.html diretamente no navegador (algumas funcionalidades dependem de fetch e podem requerer servidor). Um servidor simples em Python pode ser executado com:

  python -m http.server 8000

 - O puzzle está embutido no JavaScript. A página foi adaptada para rodar sem servidor — você pode abrir index.html diretamente (protocolo file://) no navegador e o jogo será carregado.

Formato de puzzle (schema)
- Internamente o app espera um objeto com as mesmas propriedades (width, height, entries). Nesta versão, o puzzle está embutido no arquivo script.js e não é necessário fornecer um JSON externo.

Notas de implementação
- Persistência temporária: o estado do grid é salvo no localStorage (chave: crossword:current) e restaurado ao recarregar a página.
- Revelação automática: quando todas as letras de uma entrada coincidirem com a solução, a palavra é marcada visualmente como "revelada".
- Service Worker não está incluído nesta versão inicial — a aplicação é pensada para execução local.

Arquivo de exemplo
- O exemplo de puzzle (RAM e FLASH) está embutido em script.js nesta versão.
