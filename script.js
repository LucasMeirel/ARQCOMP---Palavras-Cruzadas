// Puzzle embutido para execução local (file://) e GitHub Pages
const PUZZLE = {
  "width": 16,
  "height": 14,
  "entries": [
    {
      "number": 1,
      "word": "ROM",
      "clue": "Memória que armazena a parte mais essencial de sua placa mãe.",
      "row": 0,
      "col": 7,
      "dir": "across"
    },
    {
      "number": 2,
      "word": "MEMORIADEMASSA",
      "clue": "Armazenamento permanente onde o seu sistema operacional está localizado, por exemplo.",
      "row": 0,
      "col": 9,
      "dir": "down"
    },
    {
      "number": 3,
      "word": "DUALCORE",
      "clue": "Quando um processador possui exatamente dois núcleos de processamento.",
      "row": 1,
      "col": 11,
      "dir": "down"
    },
    {
      "number": 4,
      "word": "RAM",
      "clue": "Memória temporária em segundo lugar na hierarquia de memórias, ou carneiro em Inglês",
      "row": 2,
      "col": 7,
      "dir": "across"
    },
    {
      "number": 5,
      "word": "ULA",
      "clue": "Componente que faz as contas em uma calculadora, ou uma dança típica Havaiana sem sua letra inicial.",
      "row": 2,
      "col": 11,
      "dir": "across"
    },
    {
      "number": 6,
      "word": "ADDRESSBUS",
      "clue": "Linha física que transporta “endereços”, similar à um transporte coletivo altamente usado.",
      "row": 2,
      "col": 13,
      "dir": "down"
    },
    {
      "number": 7,
      "word": "DMA",
      "clue": "Recurso de hardware que permite que os dispositivos de hardware acessem a memória do sistema independentemente da CPU.",
      "row": 3,
      "col": 0,
      "dir": "down"
    },
    {
      "number": 8,
      "word": "UC",
      "clue": "Componente que encaminha aquilo que você encaminha para outras partes (Mas não inverta o nome dela!).",
      "row": 3,
      "col": 5,
      "dir": "down"
    },
    {
      "number": 9,
      "word": "MICROCONTROLADOR",
      "clue": "Computador pequeno e completo, responsável por tarefas específicas e relativamente simples.",
      "row": 4,
      "col": 0,
      "dir": "across"
    },
    {
      "number": 10,
      "word": "REGISTRADORES",
      "clue": "Tipo de memória que fica no topo da hierarquia.",
      "row": 6,
      "col": 2,
      "dir": "across"
    },
    {
      "number": 11,
      "word": "EEPROM",
      "clue": "Tipo de memória comumente utilizada para manter dados mesmo após uma queda de energia.",
      "row": 6,
      "col": 3,
      "dir": "down"
    },
    {
      "number": 12,
      "word": "CACHE",
      "clue": "Memória volátil de altíssima velocidade que funciona como ponte intermediária entra o processador e a RAM. Ou remuneração de um artista.",
      "row": 8,
      "col": 5,
      "dir": "across"
    },
    {
      "number": 12,
      "word": "CPU",
      "clue": "Peça responsável pelo processamento de dados, ou o nome incorretamente dado à um gabinete.",
      "row": 8,
      "col": 5,
      "dir": "down"
    },
    {
      "number": 13,
      "word": "DATABUS",
      "clue": "Sistema de comunicação entre diferentes componentes em um computador.",
      "row": 10,
      "col": 8,
      "dir": "across"
    },
    {
      "number": 14,
      "word": "FLASH",
      "clue": "armazenamento não volátil comumente encontrada em SSDs, ou super-herói velocista",
      "row": 12,
      "col": 6,
      "dir": "across"
    }
  ]
};

const STORAGE_KEY = "arqcomp:cruzadinha:v1";

// Estado da aplicação
let boardState = []; // Matriz [row][col] com caracteres digitados
let cellMap = [];    // Matriz [row][col] com metadados da célula
let activeDirection = "across"; // "across" | "down"
let focusedCell = null; // { row, col }
let checkedResults = null; // Map de chave da palavra -> true (certa) | false (errada)
let installedWords = new Set(); // Conjunto de palavras já montadas na placa-mãe

// Referências de elementos da interface
const gridEl = document.getElementById("crossword-grid");
const cluesAcrossEl = document.getElementById("clues-across");
const cluesDownEl = document.getElementById("clues-down");
const scoreCounterEl = document.getElementById("score-counter");
const directionBtn = document.getElementById("btn-direction");
const directionLabelEl = document.getElementById("direction-label");
const checkBtn = document.getElementById("btn-check");
const resetBtn = document.getElementById("btn-reset");
const activeClueTagEl = document.getElementById("active-clue-tag");
const activeClueTextEl = document.getElementById("active-clue-text");
const celebrationOverlayEl = document.getElementById("celebration-overlay");
const confettiContainerEl = document.getElementById("confetti-container");
const closeCelebrationBtn = document.getElementById("btn-close-celebration");
const restartCelebrationBtn = document.getElementById("btn-restart-celebration");
const moboProgressEl = document.getElementById("mobo-progress");
const moboLegendEl = document.getElementById("mobo-legend");
const motherboardSvgEl = document.getElementById("motherboard-svg");

// Normaliza caractere para letra maiúscula sem acento (A-Z)
function normalizeLetter(raw) {
  if (!raw) return "";
  const cleaned = raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();
  return cleaned.length > 0 ? cleaned[cleaned.length - 1] : "";
}

function entryKey(entry) {
  return `${entry.number}-${entry.dir}`;
}

// Constrói o mapa lógico do tabuleiro a partir das palavras do PUZZLE
function buildCellMap() {
  cellMap = Array.from({ length: PUZZLE.height }, () =>
    Array.from({ length: PUZZLE.width }, () => ({
      isPlayable: false,
      solution: "",
      number: null,
      entries: []
    }))
  );

  PUZZLE.entries.forEach((entry) => {
    for (let i = 0; i < entry.word.length; i++) {
      const r = entry.row + (entry.dir === "down" ? i : 0);
      const c = entry.col + (entry.dir === "across" ? i : 0);
      const cell = cellMap[r][c];
      cell.isPlayable = true;
      cell.solution = entry.word[i];
      if (i === 0) {
        cell.number = entry.number;
      }
      cell.entries.push(entry);
    }
  });
}

function createEmptyBoardState() {
  return Array.from({ length: PUZZLE.height }, () =>
    Array.from({ length: PUZZLE.width }, () => "")
  );
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boardState));
  } catch (e) {
    // Ignora falhas de armazenamento caso localStorage esteja bloqueado
  }
}

function loadState() {
  boardState = createEmptyBoardState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length === PUZZLE.height) {
      for (let r = 0; r < PUZZLE.height; r++) {
        if (Array.isArray(parsed[r]) && parsed[r].length === PUZZLE.width) {
          for (let c = 0; c < PUZZLE.width; c++) {
            if (cellMap[r][c].isPlayable) {
              boardState[r][c] = normalizeLetter(parsed[r][c]);
            }
          }
        }
      }
    }
  } catch (e) {
    boardState = createEmptyBoardState();
  }
}

// Renderiza a grelha HTML
function renderGrid() {
  gridEl.innerHTML = "";
  gridEl.style.gridTemplateColumns = `repeat(${PUZZLE.width}, var(--cell-size))`;
  gridEl.style.gridTemplateRows = `repeat(${PUZZLE.height}, var(--cell-size))`;

  for (let r = 0; r < PUZZLE.height; r++) {
    for (let c = 0; c < PUZZLE.width; c++) {
      const meta = cellMap[r][c];
      const cellDiv = document.createElement("div");
      cellDiv.className = meta.isPlayable ? "cell" : "cell black";
      cellDiv.dataset.row = r;
      cellDiv.dataset.col = c;

      if (meta.isPlayable) {
        if (meta.number !== null) {
          const numSpan = document.createElement("span");
          numSpan.className = "cell-number";
          numSpan.textContent = meta.number;
          cellDiv.appendChild(numSpan);
        }

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 2;
        input.autocomplete = "off";
        input.spellcheck = false;
        input.className = "cell-input";
        input.value = boardState[r][c] || "";
        input.setAttribute("aria-label", `Linha ${r + 1}, Coluna ${c + 1}`);

        input.addEventListener("focus", () => handleCellFocus(r, c));
        input.addEventListener("click", () => handleCellClick(r, c));
        input.addEventListener("input", (e) => handleCellInput(e, r, c));
        input.addEventListener("keydown", (e) => handleCellKeyDown(e, r, c));

        cellDiv.appendChild(input);
      }

      gridEl.appendChild(cellDiv);
    }
  }
}

// Renderiza os chips da legenda da placa-mãe
function renderMotherboardLegend() {
  moboLegendEl.innerHTML = "";
  PUZZLE.entries.forEach((entry) => {
    const chip = document.createElement("span");
    chip.className = "mobo-chip";
    chip.dataset.word = entry.word;
    chip.textContent = entry.word;
    moboLegendEl.appendChild(chip);
  });
}

// Renderiza as listas de pistas Horizontais e Verticais
function renderClues() {
  cluesAcrossEl.innerHTML = "";
  cluesDownEl.innerHTML = "";

  PUZZLE.entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "clue-item";
    li.dataset.key = entryKey(entry);
    li.innerHTML = `<span class="clue-num">${entry.number}.</span> ${entry.clue}`;

    li.addEventListener("click", () => {
      activeDirection = entry.dir;
      updateDirectionLabel();
      focusCell(entry.row, entry.col);
    });

    if (entry.dir === "across") {
      cluesAcrossEl.appendChild(li);
    } else {
      cluesDownEl.appendChild(li);
    }
  });
}

function getInputAt(r, c) {
  return gridEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"] .cell-input`);
}

function focusCell(r, c) {
  const input = getInputAt(r, c);
  if (input) {
    input.focus();
  }
}

function getActiveEntry() {
  if (!focusedCell) return null;
  const meta = cellMap[focusedCell.row][focusedCell.col];
  if (!meta || !meta.isPlayable) return null;

  let match = meta.entries.find((e) => e.dir === activeDirection);
  if (!match && meta.entries.length > 0) {
    match = meta.entries[0];
    activeDirection = match.dir;
    updateDirectionLabel();
  }
  return match || null;
}

function handleCellFocus(r, c) {
  focusedCell = { row: r, col: c };
  updateHighlights();
}

function handleCellClick(r, c) {
  if (focusedCell && focusedCell.row === r && focusedCell.col === c) {
    const meta = cellMap[r][c];
    if (meta.entries.length > 1) {
      activeDirection = activeDirection === "across" ? "down" : "across";
      updateDirectionLabel();
      updateHighlights();
    }
  }
}

function handleCellInput(e, r, c) {
  const letter = normalizeLetter(e.target.value);
  e.target.value = letter;
  boardState[r][c] = letter;

  if (checkedResults) {
    checkedResults = null;
  }

  saveState();
  updateScoreAndMotherboard(true);
  updateHighlights();

  if (letter) {
    moveToNextCellInWord(r, c);
  }
}

function handleCellKeyDown(e, r, c) {
  if (e.key === "Backspace") {
    e.preventDefault();
    if (boardState[r][c] !== "") {
      boardState[r][c] = "";
      e.target.value = "";
      if (checkedResults) checkedResults = null;
      saveState();
      updateScoreAndMotherboard(false);
      updateHighlights();
    } else {
      moveToPrevCellInWord(r, c);
    }
    return;
  }

  if (e.key === "Delete") {
    e.preventDefault();
    boardState[r][c] = "";
    e.target.value = "";
    if (checkedResults) checkedResults = null;
    saveState();
    updateScoreAndMotherboard(false);
    updateHighlights();
    return;
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    activeDirection = "across";
    updateDirectionLabel();
    moveStep(r, c, 0, 1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    activeDirection = "across";
    updateDirectionLabel();
    moveStep(r, c, 0, -1);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    activeDirection = "down";
    updateDirectionLabel();
    moveStep(r, c, 1, 0);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeDirection = "down";
    updateDirectionLabel();
    moveStep(r, c, -1, 0);
  } else if (e.key === "Enter" || e.key === "Tab") {
    e.preventDefault();
    moveToNextWord(e.shiftKey ? -1 : 1);
  }
}

function moveStep(r, c, dr, dc) {
  let nr = r + dr;
  let nc = c + dc;
  while (nr >= 0 && nr < PUZZLE.height && nc >= 0 && nc < PUZZLE.width) {
    if (cellMap[nr][nc].isPlayable) {
      focusCell(nr, nc);
      return;
    }
    nr += dr;
    nc += dc;
  }
}

function moveToNextCellInWord(r, c) {
  const entry = getActiveEntry();
  if (!entry) return;
  const nr = r + (entry.dir === "down" ? 1 : 0);
  const nc = c + (entry.dir === "across" ? 1 : 0);
  if (
    nr < entry.row + (entry.dir === "down" ? entry.word.length : 1) &&
    nc < entry.col + (entry.dir === "across" ? entry.word.length : 1)
  ) {
    focusCell(nr, nc);
  }
}

function moveToPrevCellInWord(r, c) {
  const entry = getActiveEntry();
  if (!entry) return;
  const pr = r - (entry.dir === "down" ? 1 : 0);
  const pc = c - (entry.dir === "across" ? 1 : 0);
  if (pr >= entry.row && pc >= entry.col) {
    focusCell(pr, pc);
  }
}

function moveToNextWord(step) {
  const current = getActiveEntry();
  let idx = current ? PUZZLE.entries.indexOf(current) : -1;
  const nextIdx = (idx + step + PUZZLE.entries.length) % PUZZLE.entries.length;
  const nextEntry = PUZZLE.entries[nextIdx];
  activeDirection = nextEntry.dir;
  updateDirectionLabel();
  focusCell(nextEntry.row, nextEntry.col);
}

function updateDirectionLabel() {
  directionLabelEl.textContent = activeDirection === "across" ? "Horizontal" : "Vertical";
}

// Atualiza destaques visuais do tabuleiro, pistas e estados de acerto/erro
function updateHighlights() {
  const activeEntry = getActiveEntry();

  if (activeEntry) {
    const dirName = activeEntry.dir === "across" ? "Horizontal" : "Vertical";
    activeClueTagEl.textContent = `${activeEntry.number} — ${dirName}`;
    activeClueTextEl.textContent = activeEntry.clue;
  } else {
    activeClueTagEl.textContent = "Selecione uma célula";
    activeClueTextEl.textContent = "Clique em qualquer casa branca do tabuleiro para ver a pista correspondente.";
  }

  const activeCoords = new Set();
  if (activeEntry) {
    for (let i = 0; i < activeEntry.word.length; i++) {
      const r = activeEntry.row + (activeEntry.dir === "down" ? i : 0);
      const c = activeEntry.col + (activeEntry.dir === "across" ? i : 0);
      activeCoords.add(`${r},${c}`);
    }
  }

  const correctCoords = new Set();
  const wrongCoords = new Set();

  if (checkedResults) {
    PUZZLE.entries.forEach((entry) => {
      const res = checkedResults.get(entryKey(entry));
      for (let i = 0; i < entry.word.length; i++) {
        const r = entry.row + (entry.dir === "down" ? i : 0);
        const c = entry.col + (entry.dir === "across" ? i : 0);
        if (res === true) {
          correctCoords.add(`${r},${c}`);
        } else if (res === false) {
          wrongCoords.add(`${r},${c}`);
        }
      }
    });
  }

  const cells = gridEl.querySelectorAll(".cell");
  cells.forEach((cellEl) => {
    const r = Number(cellEl.dataset.row);
    const c = Number(cellEl.dataset.col);
    const coord = `${r},${c}`;

    cellEl.classList.remove("in-active-word", "is-focused", "word-correct", "word-wrong");

    if (wrongCoords.has(coord)) {
      cellEl.classList.add("word-wrong");
    } else if (correctCoords.has(coord)) {
      cellEl.classList.add("word-correct");
    }

    if (activeCoords.has(coord)) {
      cellEl.classList.add("in-active-word");
    }

    if (focusedCell && focusedCell.row === r && focusedCell.col === c) {
      cellEl.classList.add("is-focused");
    }
  });

  const clueItems = document.querySelectorAll(".clue-item");
  clueItems.forEach((item) => {
    const key = item.dataset.key;
    item.classList.remove("active", "correct", "wrong");

    if (activeEntry && entryKey(activeEntry) === key) {
      item.classList.add("active");
    }

    if (checkedResults && checkedResults.has(key)) {
      const res = checkedResults.get(key);
      if (res === true) item.classList.add("correct");
      if (res === false) item.classList.add("wrong");
    }
  });
}

// Verifica quantas palavras estão totalmente corretas
function evaluateWords() {
  let correctCount = 0;
  const results = new Map();
  const currentCorrectWords = new Set();

  PUZZLE.entries.forEach((entry) => {
    let userWord = "";
    for (let i = 0; i < entry.word.length; i++) {
      const r = entry.row + (entry.dir === "down" ? i : 0);
      const c = entry.col + (entry.dir === "across" ? i : 0);
      userWord += boardState[r][c] || "";
    }

    if (userWord === entry.word) {
      correctCount++;
      results.set(entryKey(entry), true);
      currentCorrectWords.add(entry.word);
    } else {
      results.set(entryKey(entry), false);
    }
  });

  return { correctCount, total: PUZZLE.entries.length, results, currentCorrectWords };
}

// Atualiza o contador de acertos e monta/desmonta os componentes na placa-mãe
function updateScoreAndMotherboard(animateNew = true) {
  const { correctCount, total, currentCorrectWords } = evaluateWords();
  scoreCounterEl.textContent = `${correctCount} de ${total} palavras`;

  const percent = Math.round((correctCount / total) * 100);
  moboProgressEl.textContent = `${percent}% montado`;

  // Atualiza cada peça gráfica no SVG da placa-mãe
  const parts = motherboardSvgEl.querySelectorAll(".mobo-part");
  parts.forEach((partEl) => {
    const word = partEl.dataset.word;
    const isNowCorrect = currentCorrectWords.has(word);
    const wasInstalled = installedWords.has(word);

    if (isNowCorrect) {
      partEl.classList.add("installed");
      if (!wasInstalled && animateNew) {
        partEl.classList.remove("just-installed");
        void partEl.offsetWidth; // reinicia animação CSS
        partEl.classList.add("just-installed");
      }
    } else {
      partEl.classList.remove("installed", "just-installed");
    }
  });

  // Atualiza chips da legenda abaixo da placa-mãe
  const chips = moboLegendEl.querySelectorAll(".mobo-chip");
  chips.forEach((chip) => {
    const word = chip.dataset.word;
    if (currentCorrectWords.has(word)) {
      chip.classList.add("installed");
    } else {
      chip.classList.remove("installed");
    }
  });

  installedWords = currentCorrectWords;
}

// Botão Conferir: marca palavras certas/erradas, atualiza contador e celebra se 100% corretas
function handleCheck() {
  const { correctCount, total, results } = evaluateWords();
  checkedResults = results;
  updateScoreAndMotherboard(true);
  updateHighlights();

  if (correctCount === total) {
    triggerCelebration();
  }
}

// Botão Reiniciar: limpa tabuleiro, placa-mãe e localStorage
function handleReset() {
  boardState = createEmptyBoardState();
  checkedResults = null;
  installedWords = new Set();

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignora
  }

  for (let r = 0; r < PUZZLE.height; r++) {
    for (let c = 0; c < PUZZLE.width; c++) {
      if (cellMap[r][c].isPlayable) {
        const input = getInputAt(r, c);
        if (input) input.value = "";
      }
    }
  }

  updateScoreAndMotherboard(false);
  updateHighlights();
  celebrationOverlayEl.classList.add("hidden");

  const first = PUZZLE.entries[0];
  if (first) {
    activeDirection = first.dir;
    updateDirectionLabel();
    focusCell(first.row, first.col);
  }
}

// Efeito de comemoração e congratulação quando todas as palavras estiverem corretas
function triggerCelebration() {
  confettiContainerEl.innerHTML = "";
  const colors = ["#2563eb", "#16a34a", "#eab308", "#dc2626", "#9333ea", "#06b6d4"];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.animationDuration = `${2 + Math.random() * 2.2}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    confettiContainerEl.appendChild(piece);
  }

  celebrationOverlayEl.classList.remove("hidden");
}

// Eventos dos botões principais
directionBtn.addEventListener("click", () => {
  activeDirection = activeDirection === "across" ? "down" : "across";
  updateDirectionLabel();
  updateHighlights();
  if (focusedCell) {
    focusCell(focusedCell.row, focusedCell.col);
  }
});

checkBtn.addEventListener("click", handleCheck);
resetBtn.addEventListener("click", handleReset);

closeCelebrationBtn.addEventListener("click", () => {
  celebrationOverlayEl.classList.add("hidden");
});

restartCelebrationBtn.addEventListener("click", handleReset);

// Inicialização da aplicação
function init() {
  buildCellMap();
  loadState();
  renderGrid();
  renderMotherboardLegend();
  renderClues();
  updateScoreAndMotherboard(false);

  const first = PUZZLE.entries[0];
  if (first) {
    activeDirection = first.dir;
    updateDirectionLabel();
    focusCell(first.row, first.col);
  }
}

init();
