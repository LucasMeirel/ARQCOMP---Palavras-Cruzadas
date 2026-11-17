# O desafio
Você vai criar um jogo de cruzadinha que roda no navegador para treinar os termos da aula de
Tópicos de Arquitetura Computacional. Quem jogar lê a pista e descobre a palavra. Para escrever
uma boa pista, você precisa entender o conceito, e é exatamente isso que esta atividade treina.
No fim, o seu jogo estará publicado na internet, com o código versionado no GitHub, como acontece
em projetos reais.
Ao final você deve conseguir
• Construir uma página em somente HTML, CSS e JavaScript que funcione no navegador;
• Subir este site no github como acessável


# Contexto
Esta será uma entrega de atividade avaliativa para um contexto acadêmico, realizada no primeiro semestre do curso de Arquitetura da Computação.
O projeto deve implementar uma programação condizente com o esperado para este semestre e deverá ser explicado após a entrega. 
Antes de realizar qualquer alteração, questione se a função implementada já foi explicada em aula.

# Parte 1 — As palavras e as pistas
Estas são as 16 palavras do jogo. Use no mínimo 12 delas no tabuleiro. Na coluna "No tabuleiro"
está a grafia que vai nas casas: letras maiúsculas, sem acento e sem espaço.

Nº Termo No tabuleiro
1 CPU CPU
2 ULA ULA
3 UC (Unidade de Controle) UC
4 registradores REGISTRADORES
5 RAM RAM
6 ROM ROM
7 EEPROM EEPROM
8 Flash FLASH
9 cache CACHE
10 memória de massa (armazenamento) MEMORIADEMASSA
11 DMA DMA
12 address bus (barramento de endereço) ADDRESSBUS
Nº Termo No tabuleiro
13 data bus (barramento de dados) DATABUS
14 microcontrolador MICROCONTROLADOR
15 dual core DUALCORE
16 quad core QUADCORE

Regras das pistas
• escreva com as suas palavras, com no máximo 15 palavras por pista;
• a pista não pode conter a resposta, nem parte dela, nem a sigla por extenso;
• a pista precisa estar correta e levar a uma única resposta.

Exemplo para ULA Pista
Ruim "Unidade Lógica e Aritmética." (é só a sigla por extenso: entrega a resposta)
Boa "Parte da CPU que faz as contas e as operações lógicas."


# Parte 2 — O jogo e Regras de aceitação
O jogo precisa cumprir todos estes requisitos:
1. Tabuleiro com no mínimo 12 palavras da lista, cruzadas entre si: cada palavra cruza com pelo
menos uma outra.
2. Pistas numeradas e separadas em Horizontais e Verticais.
3. O jogador digita as letras direto nas casas do tabuleiro.
4. Botão Conferir, que mostra quais palavras estão certas e quais estão erradas.
5. Contador de acertos, por exemplo: "8 de 12 palavras".
6. Botão Reiniciar, que limpa o tabuleiro.
7. Feito em HTML, CSS e JavaScript puros, com o arquivo index.html na raiz do projeto.
8. Efeito de comemoração e congratulação após acertar a resposta

Estrutura sugerida: index.html, style.css, script.js e README.md.
