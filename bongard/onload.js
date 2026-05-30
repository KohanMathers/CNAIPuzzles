function showPuzzle() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('puzzle').style.display = 'flex';
    startPuzzleMode();
}

function showInfinite() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('puzzle').style.display = 'flex';
    startInfiniteMode();
}

function showHTP() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('puzzle').style.display = 'none';
    document.getElementById('htp').style.display = 'block';
}

function backToMenu() {
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('puzzle').style.display = 'none';
    document.getElementById('htp').style.display = 'none';
}

document.getElementById('start-btn').addEventListener('click', showPuzzle);
document.getElementById('infinite-btn').addEventListener('click', showInfinite);
document.getElementById('htp-btn').addEventListener('click', showHTP);
document.getElementById('back-btn').addEventListener('click', backToMenu);
