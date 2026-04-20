const COLOURS = {
    0: '#e5e7eb',
    1: '#ef3e40',
    2: '#4673b9',
    3: '#eabb5c',
    4: '#a7c839',
};

let selectedColour = 1;
let colourNum = 2;
let answerAfterGrid = null;
let userGrid = null;

function randomColours(grid, n, maxNonZero = 6) {
    const rows = grid.length;
    const cols = grid[0].length;
    const total = rows * cols;

    const nonZeroCount = Math.floor(Math.random() * (maxNonZero - 2)) + 3;

    const flat = Array(total).fill(0);
    for (let i = 0; i < nonZeroCount; i++) {
        flat[i] = Math.floor(Math.random() * (n - 1)) + 1;
    }

    for (let i = total - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flat[i], flat[j]] = [flat[j], flat[i]];
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = flat[i * cols + j];
        }
    }

    return grid;
}

const RULES = [
    (g) => g.map(row => [...row].reverse()),
    (g) => [...g].reverse(),
    (g) => g[0].map((_, i) => g.map(row => row[i]).reverse()),
    (g) => g[0].map((_, i) => g.map(row => row[row.length - 1 - i])),
    (g) => [...g].reverse().map(row => [...row].reverse()),
];

function generateLevel(n, rule) {
    const beforeGrid = randomColours([[0, 0, 0], [0, 0, 0], [0, 0, 0]], n);
    const afterGrid = rule(beforeGrid);
    return { before: beforeGrid, after: afterGrid };
}

function renderGrid(grid, el) {
    el.innerHTML = '';
    for (const row of grid) {
        for (const val of row) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.background = COLOURS[val] ?? COLOURS[0];
            el.appendChild(cell);
        }
    }
}

function renderEditableGrid(grid, el) {
    el.innerHTML = '';
    grid.forEach((row, r) => {
        row.forEach((val, c) => {
            const cell = document.createElement('div');
            cell.className = 'cell editable';
            cell.style.background = COLOURS[val] ?? COLOURS[0];
            cell.addEventListener('click', () => {
                userGrid[r][c] = selectedColour;
                cell.style.background = COLOURS[selectedColour];
                hideResult();
            });
            el.appendChild(cell);
        });
    });
}

function buildColourPicker(n) {
    const picker = document.getElementById('colour-picker');
    picker.innerHTML = '';
    const available = [0, ...Array.from({ length: n - 1 }, (_, i) => i + 1)];
    available.forEach(val => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch' + (val === selectedColour ? ' selected' : '');
        swatch.style.background = COLOURS[val];
        swatch.addEventListener('click', () => {
            selectedColour = val;
            document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
        });
        picker.appendChild(swatch);
    });
    if (selectedColour >= n) {
        selectedColour = 1;
        picker.querySelector('.swatch:nth-child(2)').classList.add('selected');
    }
}

function hideResult() {
    const result = document.getElementById('result');
    result.style.display = 'none';
}

function checkAnswer() {
    const flat = userGrid.flat();
    const correct = answerAfterGrid.flat();
    const ok = flat.every((v, i) => v === correct[i]);

    const result = document.getElementById('result');
    result.style.display = 'inline-block';
    result.className = ok ? 'correct' : 'wrong';
    result.textContent = ok ? 'Correct!' : 'Not quite — try again';
}

function startPuzzle() {
    hideResult();

    const rule = RULES[Math.floor(Math.random() * RULES.length)];
    const ex1 = generateLevel(colourNum, rule);
    const ex2 = generateLevel(colourNum, rule);
    const ans = generateLevel(colourNum, rule);

    answerAfterGrid = ans.after;
    userGrid = Array.from({ length: 3 }, () => Array(3).fill(0));

    renderGrid(ex1.before, document.querySelector('#example-1 .before'));
    renderGrid(ex1.after, document.querySelector('#example-1 .after'));
    renderGrid(ex2.before, document.querySelector('#example-2 .before'));
    renderGrid(ex2.after, document.querySelector('#example-2 .after'));
    renderGrid(ans.before, document.querySelector('#answer .before'));
    renderEditableGrid(userGrid, document.querySelector('#answer .editable-grid'));

    console.log(ex1.before.flat(), ex1.after.flat());
    console.log(ex2.before.flat(), ex2.after.flat());
    console.log(ans.before.flat(), ans.after.flat());

    buildColourPicker(colourNum);
}

document.querySelectorAll('#colour-btns button').forEach(btn => {
    btn.addEventListener('click', () => {
        colourNum = parseInt(btn.dataset.n);
        document.querySelectorAll('#colour-btns button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        startPuzzle();
    });
});

document.getElementById('check-btn').addEventListener('click', checkAnswer);

startPuzzle();
