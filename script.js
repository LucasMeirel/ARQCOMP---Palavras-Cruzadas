// script.js — implementação inicial adaptada para carregamento local (sem servidor)
(function(){
  // Puzzle embutido para permitir execução via file:// sem fetch
  const PUZZLE = {
    "width": 5,
    "height": 5,
    "entries": [
      { "id": 1, "word": "RAM", "clue": "memória temporária, ou carneiro em inglês", "row": 0, "col": 0, "dir": "across" },
      { "id": 2, "word": "FLASH", "clue": "memória, ou herói velocista", "row": 2, "col": 0, "dir": "across" }
    ]
  }

  const resetBtn = document.getElementById('reset')
  const gridContainer = document.getElementById('gridContainer')
  const clueText = document.getElementById('clueText')
  const clueLabel = document.getElementById('clueLabel')
  const directionSelect = document.getElementById('direction')

  const STORAGE_KEY = 'crossword:current'

  let puzzle = null
  let state = { cells: {} } // map "r,c" -> letter
  let active = { row:0, col:0, dir: 'across' }
  let celebrated = false

  // Normalize input and solutions to match AGENT.MD requirements:
  // - uppercase letters
  // - remove diacritics (accents)
  // - remove spaces
  function norm(s){
    if(!s && s!=='') return ''
    return String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .toUpperCase()
  }

  function saveState(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }catch(e){/* ignore */}
  }
  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      if(raw) state = JSON.parse(raw)
    }catch(e){state = {cells:{}}}
  }

  function clearState(){ state = { cells: {} }; saveState() }

  // build matrix from entries
  function buildMatrix(p){
    const mat = Array.from({length:p.height}, ()=>Array.from({length:p.width}, ()=>({black:true, letter:null, numbers:[]})))
    // place entries
    p.entries.forEach((e, idx)=>{
      const word = norm(e.word)
      let r = e.row, c = e.col
      for(let i=0;i<word.length;i++){
        if(r<0||r>=p.height||c<0||c>=p.width) break
        mat[r][c].black = false
        mat[r][c].solution = mat[r][c].solution || word[i]
        mat[r][c].entryIds = mat[r][c].entryIds || []
        mat[r][c].entryIds.push(e.id || idx+1)
        if(e.dir === 'across') c++
        else r++
      }
    })
    return mat
  }

  function computeNumbers(mat){
    let n = 1
    const height = mat.length, width = mat[0].length
    for(let r=0;r<height;r++){
      for(let c=0;c<width;c++){
        if(mat[r][c].black) continue
        const startAcross = (c===0 || mat[r][c-1].black) && (c+1<width && !mat[r][c+1].black)
        const startDown = (r===0 || mat[r-1][c].black) && (r+1<height && !mat[r+1][c].black)
        if(startAcross || startDown){
          mat[r][c].number = n++
        }
      }
    }
  }

  function findEntryAt(r,c,dir){
    if(!puzzle) return null
    const entries = puzzle.entries.filter(e=>{
      if(e.dir!==dir) return false
      let rr=e.row, cc=e.col
      for(let i=0;i<e.word.length;i++){
        if(rr===r && cc===c) return true
        if(e.dir==='across') cc++
        else rr++
      }
      return false
    })
    return entries[0]||null
  }

  function render(){
    gridContainer.innerHTML = ''
    if(!puzzle) return
    const mat = buildMatrix(puzzle)
    computeNumbers(mat)

    const grid = document.createElement('div')
    grid.className = 'grid'
    grid.style.gridTemplateColumns = `repeat(${puzzle.width}, 44px)`
    gridContainer.appendChild(grid)

    for(let r=0;r<puzzle.height;r++){
      for(let c=0;c<puzzle.width;c++){
        const cell = document.createElement('div')
        cell.className = 'cell'
        if(mat[r][c].black){ cell.classList.add('black'); grid.appendChild(cell); continue }
        if(mat[r][c].number) {
          const num = document.createElement('div')
          num.className = 'number'
          num.textContent = mat[r][c].number
          cell.appendChild(num)
        }
        const input = document.createElement('input')
        input.setAttribute('maxlength','1')
        input.dataset.r = r
        input.dataset.c = c
        input.value = state.cells[`${r},${c}`] || ''
        input.addEventListener('focus', onFocus)
        input.addEventListener('input', onInput)
        input.addEventListener('keydown', onKeyDown)
        cell.appendChild(input)
        grid.appendChild(cell)
      }
    }

    // restore active highlight
    highlightActive()
    updateClueBox()
  }

  function onFocus(e){
    const r = parseInt(e.target.dataset.r,10)
    const c = parseInt(e.target.dataset.c,10)
    active.row = r; active.col = c
    active.dir = directionSelect.value
    highlightActive()
    updateClueBox()
  }

  function onInput(e){
    const el = e.target
    const r = parseInt(el.dataset.r,10), c = parseInt(el.dataset.c,10)
    // limit to one grapheme cluster (basic): use Array.from
    const v = Array.from(el.value)[0] || ''
    const nv = norm(v)
    el.value = nv
    state.cells[`${r},${c}`] = nv
    saveState()
    // auto advance
    moveForward(r,c)
    checkReveals()
  }

  function onKeyDown(e){
    const el = e.target
    const r = parseInt(el.dataset.r,10), c = parseInt(el.dataset.c,10)
    if(e.key === 'ArrowRight') { e.preventDefault(); focusAt(r, c+1); return }
    if(e.key === 'ArrowLeft') { e.preventDefault(); focusAt(r, c-1); return }
    if(e.key === 'ArrowUp') { e.preventDefault(); focusAt(r-1, c); return }
    if(e.key === 'ArrowDown') { e.preventDefault(); focusAt(r+1, c); return }
    if(e.key === 'Backspace'){
      if(!el.value){
        // move back
        const prev = moveBackward(r,c)
        if(prev) focusAt(prev.r, prev.c)
      } else {
        // clear
        el.value = ''
        state.cells[`${r},${c}`] = ''
        saveState()
      }
    }
  }

  function focusAt(r,c){
    const sel = gridContainer.querySelector(`input[data-r='${r}'][data-c='${c}']`)
    if(sel) sel.focus()
  }

  function moveForward(r,c){
    const dir = directionSelect.value
    let nr = r, nc = c
    if(dir === 'across') nc = c+1
    else nr = r+1
    focusAt(nr,nc)
  }
  function moveBackward(r,c){
    const dir = directionSelect.value
    if(dir === 'across') return {r, c: c-1}
    return {r: r-1, c}
  }

  function highlightActive(){
    const inputs = gridContainer.querySelectorAll('.cell')
    inputs.forEach(x=>x.classList.remove('active'))
    const activeInputs = gridContainer.querySelectorAll(`input[data-r='${active.row}'][data-c='${active.col}']`)
    // highlight active word
    const entry = findEntryAt(active.row, active.col, active.dir)
    if(entry){
      let r = entry.row, c = entry.col
      for(let i=0;i<entry.word.length;i++){
        const cell = gridContainer.querySelector(`input[data-r='${r}'][data-c='${c}']`)
        if(cell) cell.parentElement.classList.add('active')
        if(entry.dir === 'across') c++
        else r++
      }
    } else {
      const single = gridContainer.querySelector(`input[data-r='${active.row}'][data-c='${active.col}']`)
      if(single) single.parentElement.classList.add('active')
    }
  }

  function updateClueBox(){
    const entry = findEntryAt(active.row, active.col, active.dir)
    if(entry){
      clueLabel.textContent = `Pista (#${entry.id || ''})`
      clueText.textContent = entry.clue || 'Sem pista'
    } else {
      clueLabel.textContent = 'Pista'
      clueText.textContent = 'Nenhuma pista'
    }
  }

  function checkReveals(){
    // mark entries that are fully correct
    if(!puzzle) return
    puzzle.entries.forEach(e=>{
      let r=e.row,c=e.col, ok=true
      for(let i=0;i<e.word.length;i++){
        const expected = norm(e.word[i])
        const got = state.cells[`${r},${c}`] || ''
        if(got !== expected) { ok=false; break }
        if(e.dir==='across') c++
        else r++
      }
      e.revealed = !!ok
    })
    // update UI
    // walk grid and set .revealed on cells that belong to revealed entries
    for(let r=0;r<puzzle.height;r++){
      for(let c=0;c<puzzle.width;c++){
        const cell = gridContainer.querySelector(`.cell:nth-child(${r*puzzle.width + c + 1})`)
        if(!cell) continue
        // determine if any entry covering this cell is revealed
        const revealed = puzzle.entries.some(e=>{
          let rr=e.row, cc=e.col
          for(let i=0;i<e.word.length;i++){
            if(rr===r && cc===c) return !!e.revealed
            if(e.dir==='across') cc++
            else rr++
          }
          return false
        })
        if(revealed) cell.classList.add('revealed')
        else cell.classList.remove('revealed')
      }
    }

    // check complete puzzle and celebrate once
    const total = puzzle.entries.length
    const revealedCount = puzzle.entries.filter(e=>e.revealed).length
    if(total>0 && revealedCount === total && !celebrated){
      celebrated = true
      launchConfetti()
    }
  }

  // confetti: lightweight DOM-based confetti for local use
  function launchConfetti(){
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '50%'
    container.style.top = '20px'
    container.style.width = '0'
    container.style.height = '0'
    container.style.pointerEvents = 'none'
    document.body.appendChild(container)

    const colors = ['#f94144','#f3722c','#f9c74f','#90be6d','#43aa8b','#577590']
    const pieces = 60
    for(let i=0;i<pieces;i++){
      const p = document.createElement('div')
      p.className = 'confetti-piece'
      p.style.background = colors[Math.floor(Math.random()*colors.length)]
      p.style.left = (Math.random()*200 - 100) + 'px'
      p.style.top = '0px'
      p.style.opacity = Math.random()*0.8 + 0.6
      p.style.transform = `translateX(${Math.random()*200-100}px) rotate(${Math.random()*360}deg)`
      p.style.animationDuration = (2+Math.random()*2) + 's'
      p.style.animationDelay = (Math.random()*0.3) + 's'
      container.appendChild(p)
      // remove piece after animation
      setTimeout(()=>{ if(p.parentElement) p.parentElement.removeChild(p) }, 4500)
    }
    // remove container after timeout
    setTimeout(()=>{ if(container.parentElement) container.parentElement.removeChild(container) }, 5000)
  }

  // loader
  function loadPuzzleFromObject(obj){
    // basic validation and normalization
    const p = {
      width: obj.width|0,
      height: obj.height|0,
      entries: (obj.entries||[]).map((e, idx)=>({
        id: e.id || idx+1,
        word: norm(e.word||''),
        clue: e.clue||'',
        row: e.row|0,
        col: e.col|0,
        dir: e.dir || 'across'
      }))
    }
    puzzle = p
    loadState()
    render()
    checkReveals()
  }

  resetBtn.addEventListener('click', ()=>{ clearState(); render(); })
  directionSelect.addEventListener('change', ()=>{ active.dir = directionSelect.value; highlightActive(); updateClueBox() })

  // init: load embedded puzzle so the app works under file:// protocol
  loadPuzzleFromObject(PUZZLE)

  // expose for debug
  window._crossword = { loadPuzzleFromObject }

})()
