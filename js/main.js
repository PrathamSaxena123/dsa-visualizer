/* ============================================
   MAIN.JS — DSA Visualizer App Controller
   Handles: UI state, rendering, animation loop
============================================ */

/* ===================================================
   STATE
=================================================== */
const state = {
  array: [],
  arraySize: 40,
  delay: 80,          // ms per animation frame
  algorithm: 'bubble',
  isSorting: false,
  comparisons: 0,
  swaps: 0,
  startTime: null,
  animationId: null,
  sortedIndices: new Set(),
  pivotIndices: new Set(),
};

/* ===================================================
   ALGORITHM METADATA
=================================================== */
const ALGO_INFO = {
  bubble: {
    name: 'Bubble Sort',
    badge: 'BUBBLE SORT',
    desc: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they\'re in the wrong order. The pass through the list is repeated until the list is sorted.',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
  },
  merge: {
    name: 'Merge Sort',
    badge: 'MERGE SORT',
    desc: 'Merge Sort divides the unsorted list into n sublists, each containing one element, then repeatedly merges sublists to produce new sorted sublists until only one remains.',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
  },
  quick: {
    name: 'Quick Sort',
    badge: 'QUICK SORT',
    desc: 'Quick Sort picks a pivot element and partitions the array around it — elements smaller go left, larger go right. It then recursively sorts both halves.',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
  },
};

/* ===================================================
   DOM REFERENCES
=================================================== */
const barsContainer   = document.getElementById('bars-container');
const startBtn        = document.getElementById('start-btn');
const generateBtn     = document.getElementById('generate-btn');
const resetBtn        = document.getElementById('reset-btn');
const sizeSlider      = document.getElementById('size-slider');
const sizeValue       = document.getElementById('size-value');
const algoBtns        = document.querySelectorAll('.algo-btn');
const speedBtns       = document.querySelectorAll('.speed-btn');
const statusDot       = document.getElementById('status-dot');
const statusText      = document.getElementById('status-text');
const algoBadge       = document.getElementById('algo-badge');
const algoDesc        = document.getElementById('algo-desc');
const bestCase        = document.getElementById('best-case');
const avgCase         = document.getElementById('avg-case');
const worstCase       = document.getElementById('worst-case');
const spaceCase       = document.getElementById('space-case');
const compCount       = document.getElementById('comparison-count');
const swapCount       = document.getElementById('swap-count');
const timeCount       = document.getElementById('time-count');
const modalOverlay    = document.getElementById('modal-overlay');
const modalCloseBtn   = document.getElementById('modal-close-btn');
const modalAlgo       = document.getElementById('modal-algo');
const modalSize       = document.getElementById('modal-size');
const modalComps      = document.getElementById('modal-comparisons');
const modalSwaps      = document.getElementById('modal-swaps');
const modalTime       = document.getElementById('modal-time');

/* ===================================================
   ARRAY GENERATION
=================================================== */
function generateArray(size = state.arraySize) {
  if (state.isSorting) return;

  state.array = [];
  state.sortedIndices = new Set();
  state.pivotIndices = new Set();

  for (let i = 0; i < size; i++) {
    state.array.push(Math.floor(Math.random() * 90) + 10);
  }

  resetCounters();
  renderBars(state.array);
  setStatus('ready', 'Ready to visualize');
}

/* ===================================================
   RENDERING
=================================================== */
function renderBars(array) {
  barsContainer.innerHTML = '';

  const maxVal = Math.max(...array);

  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${(value / maxVal) * 100}%`;
    bar.style.animationDelay = `${index * 8}ms`;
    bar.dataset.index = index;

    // Restore any sorted/pivot classes
    if (state.sortedIndices.has(index)) bar.classList.add('sorted');

    barsContainer.appendChild(bar);
  });
}

function getBarElements() {
  return barsContainer.querySelectorAll('.bar');
}

/* ===================================================
   ANIMATION ENGINE
=================================================== */
async function runAnimations(animations) {
  const bars = getBarElements();
  const maxVal = Math.max(...state.array);

  for (let i = 0; i < animations.length; i++) {
    if (!state.isSorting) break;   // Abort if reset pressed

    const frame = animations[i];
    const { type, indices, values } = frame;

    switch (type) {

      case 'compare':
        state.comparisons++;
        updateCounter(compCount, state.comparisons);
        indices.forEach(idx => {
          if (bars[idx]) {
            bars[idx].classList.remove('swapping', 'merging');
            bars[idx].classList.add('comparing');
          }
        });
        break;

      case 'swap':
        state.swaps++;
        updateCounter(swapCount, state.swaps);
        if (values) {
          indices.forEach((idx, i) => {
            if (bars[idx]) {
              bars[idx].classList.remove('comparing');
              bars[idx].classList.add('swapping');
              bars[idx].style.height = `${(values[i] / maxVal) * 100}%`;
            }
          });
        }
        break;

      case 'revert':
        indices.forEach(idx => {
          if (bars[idx] && !state.sortedIndices.has(idx) && !state.pivotIndices.has(idx)) {
            bars[idx].classList.remove('comparing', 'swapping', 'merging');
          }
        });
        break;

      case 'sorted':
        indices.forEach(idx => {
          if (bars[idx]) {
            bars[idx].classList.remove('comparing', 'swapping', 'merging', 'pivot');
            bars[idx].classList.add('sorted');
            state.sortedIndices.add(idx);
          }
        });
        break;

      case 'pivot':
        indices.forEach(idx => {
          if (bars[idx]) {
            bars[idx].classList.add('pivot');
            state.pivotIndices.add(idx);
          }
        });
        break;

      case 'unpivot':
        indices.forEach(idx => {
          if (bars[idx] && !state.sortedIndices.has(idx)) {
            bars[idx].classList.remove('pivot');
            state.pivotIndices.delete(idx);
          }
        });
        break;

      case 'mergeplace':
        state.swaps++;
        updateCounter(swapCount, state.swaps);
        if (values) {
          const idx = indices[0];
          if (bars[idx]) {
            bars[idx].classList.remove('sorted', 'comparing');
            bars[idx].classList.add('merging');
            bars[idx].style.height = `${(values[0] / maxVal) * 100}%`;
            state.sortedIndices.delete(idx);
          }
        }
        break;
    }

    // Update elapsed time
    if (state.startTime) {
      const elapsed = Date.now() - state.startTime;
      timeCount.textContent = `${elapsed}ms`;
    }

    // Wait for next frame
    await sleep(state.delay);
  }
}

/* ===================================================
   SORT DISPATCHER
=================================================== */
async function startSort() {
  if (state.isSorting) return;

  state.isSorting = true;
  state.comparisons = 0;
  state.swaps = 0;
  state.sortedIndices = new Set();
  state.pivotIndices = new Set();
  state.startTime = Date.now();

  setStatus('running', `Running ${ALGO_INFO[state.algorithm].name}...`);
  disableControls(true);

  let animations = [];

  switch (state.algorithm) {
    case 'bubble':
      animations = getBubbleSortAnimations(state.array);
      break;
    case 'merge':
      animations = getMergeSortAnimations(state.array);
      break;
    case 'quick':
      animations = getQuickSortAnimations(state.array);
      break;
  }

  await runAnimations(animations);

  if (state.isSorting) {
    // Mark ALL bars as sorted at the end (safety net)
    const bars = getBarElements();
    bars.forEach(bar => {
      bar.classList.remove('comparing', 'swapping', 'merging', 'pivot');
      bar.classList.add('sorted');
    });

    const elapsed = Date.now() - state.startTime;
    timeCount.textContent = `${elapsed}ms`;

    setStatus('done', 'Sorting complete! 🎉');
    state.isSorting = false;
    disableControls(false);

    // Show completion modal after a moment
    setTimeout(() => showModal(elapsed), 600);
  }
}

/* ===================================================
   RESET
=================================================== */
function resetSort() {
  state.isSorting = false;
  state.sortedIndices = new Set();
  state.pivotIndices = new Set();

  resetCounters();
  setStatus('ready', 'Ready to visualize');
  disableControls(false);
  renderBars(state.array);
}

/* ===================================================
   UI HELPERS
=================================================== */
function setStatus(type, text) {
  statusDot.className = 'status-dot';
  if (type === 'running') statusDot.classList.add('running');
  if (type === 'done')    statusDot.classList.add('done');
  statusText.textContent = text;
}

function resetCounters() {
  state.comparisons = 0;
  state.swaps = 0;
  compCount.textContent = '0';
  swapCount.textContent = '0';
  timeCount.textContent = '0ms';
}

function updateCounter(el, value) {
  el.textContent = value.toLocaleString();
}

function disableControls(disabled) {
  startBtn.disabled = disabled;
  generateBtn.disabled = disabled;
  sizeSlider.disabled = disabled;
  algoBtns.forEach(btn => btn.style.pointerEvents = disabled ? 'none' : 'all');
}

function updateAlgoInfo(algo) {
  const info = ALGO_INFO[algo];
  algoBadge.textContent = info.badge;
  algoDesc.textContent  = info.desc;
  bestCase.textContent  = info.best;
  avgCase.textContent   = info.avg;
  worstCase.textContent = info.worst;
  spaceCase.textContent = info.space;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ===================================================
   MODAL
=================================================== */
function showModal(elapsed) {
  const info = ALGO_INFO[state.algorithm];
  modalAlgo.textContent  = info.name;
  modalSize.textContent  = state.array.length;
  modalComps.textContent = state.comparisons.toLocaleString();
  modalSwaps.textContent = state.swaps.toLocaleString();
  modalTime.textContent  = `${elapsed}ms`;
  modalOverlay.classList.add('visible');
}

function hideModal() {
  modalOverlay.classList.remove('visible');
}

/* ===================================================
   EVENT LISTENERS
=================================================== */

// Algorithm selector
algoBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.isSorting) return;
    algoBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.algorithm = btn.dataset.algo;
    updateAlgoInfo(state.algorithm);
  });
});

// Speed selector
speedBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    speedBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.delay = parseInt(btn.dataset.speed);
  });
});

// Array size slider
sizeSlider.addEventListener('input', () => {
  if (state.isSorting) return;
  state.arraySize = parseInt(sizeSlider.value);
  sizeValue.textContent = state.arraySize;
  generateArray(state.arraySize);
});

// Action buttons
startBtn.addEventListener('click', startSort);
generateBtn.addEventListener('click', () => generateArray(state.arraySize));
resetBtn.addEventListener('click', resetSort);

// Modal close
modalCloseBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) hideModal();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!state.isSorting) startSort();
  }
  if (e.code === 'KeyR') {
    resetSort();
  }
  if (e.code === 'KeyN') {
    if (!state.isSorting) generateArray(state.arraySize);
  }
});

/* ===================================================
   INIT
=================================================== */
updateAlgoInfo(state.algorithm);
generateArray(state.arraySize);

console.log('%c DSA Visualizer Loaded ', 'background:#00f5a0; color:#0a0a0f; font-weight:bold; padding:4px 8px; border-radius:4px;');
console.log('%c Keyboard Shortcuts: [SPACE] Start | [R] Reset | [N] New Array', 'color:#8888aa; font-size:11px;');