let target = 1;
let startTime = null;
let timerInterval = null;
let lastClickTime = null;
let focusBonus = 0;
const gridSize = 5;

const gridElement = document.getElementById('grid-container');
const timerDisplay = document.getElementById('timer');
const bonusDisplay = document.getElementById('focus-bonus');
const targetDisplay = document.getElementById('target-number');
const resultOverlay = document.getElementById('result-overlay');

function initGame() {
    // UI Reset
    resultOverlay.style.display = 'none';
    target = 1;
    focusBonus = 0;
    targetDisplay.textContent = target;
    bonusDisplay.textContent = "0";
    clearInterval(timerInterval);
    timerDisplay.textContent = "0.00";
    startTime = null;
    
    // Generate 1-25 and Shuffle
    let numbers = Array.from({length: gridSize * gridSize}, (_, i) => i + 1);
    numbers.sort(() => Math.random() - 0.5);
    
    renderGrid(numbers);
    updateBestTime();
}

function renderGrid(numbers) {
    // Clear previous cells
    const cells = gridElement.querySelectorAll('.cell');
    cells.forEach(c => c.remove());

    numbers.forEach(num => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = num;
        cell.onclick = () => handleCellClick(num, cell);
        gridElement.appendChild(cell);
    });
}

function handleCellClick(num, element) {
    if (!startTime) {
        startTime = Date.now();
        lastClickTime = startTime;
        timerInterval = setInterval(updateTimer, 10);
    }

    if (num === target) {
        const now = Date.now();
        const reactionTime = now - lastClickTime;

        // Bonus if found in less than 900ms
        if (reactionTime < 900 && target > 1) {
            focusBonus += 50; 
            bonusDisplay.textContent = focusBonus;
        }

        element.classList.add('correct');
        lastClickTime = now;
        target++;
        
        if (target > (gridSize * gridSize)) {
            winGame();
        } else {
            targetDisplay.textContent = target;
        }
    } else {
        // Penalty for mistakes
        element.classList.add('wrong');
        focusBonus = Math.max(0, focusBonus - 100); 
        bonusDisplay.textContent = focusBonus;
        setTimeout(() => element.classList.remove('wrong'), 200);
    }
}

function updateTimer() {
    const rawDelta = Date.now() - startTime;
    const adjustedDelta = (rawDelta - focusBonus) / 1000;
    timerDisplay.textContent = Math.max(0, adjustedDelta).toFixed(2);
}

function updateBestTime() {
    const best = localStorage.getItem('schulte-best');
    const bestText = best ? `${best}s` : "--";
    document.getElementById('best-score').textContent = `Best: ${bestText}`;
    document.getElementById('overlay-best').textContent = bestText;
}

function winGame() {
    clearInterval(timerInterval);
    const finalTime = timerDisplay.textContent;
    document.getElementById('final-time').textContent = finalTime;
    document.getElementById('final-bonus').textContent = focusBonus;
    
    const best = localStorage.getItem('schulte-best');
    if (!best || parseFloat(finalTime) < parseFloat(best)) {
        localStorage.setItem('schulte-best', finalTime);
    }
    
    updateBestTime();
    resultOverlay.style.display = 'flex';
}

// Initial session setup
initGame();