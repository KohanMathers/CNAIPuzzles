const LEVELS = {
    easy: [
        {
            sentence: 'The cat chased the mouse until it got tired.',
            pronoun: 'it',
            correctAnswer: 'the cat',
            answerChoices: ['the cat', 'the mouse'],
        },
        {
            sentence: 'The dog chased the ball until it rolled under the fence.',
            pronoun: 'it',
            correctAnswer: 'the ball',
            answerChoices: ['the dog', 'the ball'],
        },
        {
            sentence: 'The boy dropped the plate and it shattered on the floor.',
            pronoun: 'it',
            correctAnswer: 'the plate',
            answerChoices: ['the boy', 'the plate'],
        },
        {
            sentence: 'The gardener watered the plant because it looked wilted.',
            pronoun: 'it',
            correctAnswer: 'the plant',
            answerChoices: ['the gardener', 'the plant'],
        },
        {
            sentence: 'The chef burned the toast because it was left in the toaster too long.',
            pronoun: 'it',
            correctAnswer: 'the toast',
            answerChoices: ['the chef', 'the toast'],
        },
        {
            sentence: 'The wind blew the papers off the desk and they scattered across the room.',
            pronoun: 'they',
            correctAnswer: 'the papers',
            answerChoices: ['the wind', 'the papers'],
        },
        {
            sentence: 'The girl fed the puppy because it was hungry.',
            pronoun: 'it',
            correctAnswer: 'the puppy',
            answerChoices: ['the girl', 'the puppy'],
        },
        {
            sentence: 'The teacher erased the whiteboard because it was covered in old notes.',
            pronoun: 'it',
            correctAnswer: 'the whiteboard',
            answerChoices: ['the teacher', 'the whiteboard'],
        },
        {
            sentence: 'The waiter cleared the table because it was covered in crumbs.',
            pronoun: 'it',
            correctAnswer: 'the table',
            answerChoices: ['the waiter', 'the table'],
        },
        {
            sentence: 'The farmer milked the cow because it was full.',
            pronoun: 'it',
            correctAnswer: 'the cow',
            answerChoices: ['the farmer', 'the cow'],
        },
        {
            sentence: 'The nurse bandaged the wound because it was bleeding.',
            pronoun: 'it',
            correctAnswer: 'the wound',
            answerChoices: ['the nurse', 'the wound'],
        },
        {
            sentence: 'The mechanic replaced the tire because it was flat.',
            pronoun: 'it',
            correctAnswer: 'the tire',
            answerChoices: ['the mechanic', 'the tire'],
        },
        {
            sentence: 'The painter repainted the fence because it had faded.',
            pronoun: 'it',
            correctAnswer: 'the fence',
            answerChoices: ['the painter', 'the fence'],
        },
        {
            sentence: 'The kids popped the balloon and it burst with a loud bang.',
            pronoun: 'it',
            correctAnswer: 'the balloon',
            answerChoices: ['the kids', 'the balloon'],
        },
        {
            sentence: 'The postman delivered the parcel because it had arrived early.',
            pronoun: 'it',
            correctAnswer: 'the parcel',
            answerChoices: ['the postman', 'the parcel'],
        },
        {
            sentence: 'The children fed the ducks until they waddled away.',
            pronoun: 'they',
            correctAnswer: 'the ducks',
            answerChoices: ['the children', 'the ducks'],
        },
        {
            sentence: 'The worker trimmed the hedge because it had grown too tall.',
            pronoun: 'it',
            correctAnswer: 'the hedge',
            answerChoices: ['the worker', 'the hedge'],
        },
        {
            sentence: 'The photographer adjusted the lens because it was blurry.',
            pronoun: 'it',
            correctAnswer: 'the lens',
            answerChoices: ['the photographer', 'the lens'],
        },
    ],
    medium: [
        {
            sentence: 'The gardeners planted the flowers in the spring because they bloom beautifully.',
            pronoun: 'they',
            correctAnswer: 'the flowers',
            answerChoices: ['the gardeners', 'the flowers'],
        },
        {
            sentence: 'The bakers decorated the cookies with icing because they looked plain.',
            pronoun: 'they',
            correctAnswer: 'the cookies',
            answerChoices: ['the bakers', 'the cookies'],
        },
        {
            sentence: 'The librarians organized the books by genre because they were scattered everywhere.',
            pronoun: 'they',
            correctAnswer: 'the books',
            answerChoices: ['the librarians', 'the books'],
        },
        {
            sentence: 'The parents praised the children because they behaved so well.',
            pronoun: 'they',
            correctAnswer: 'the children',
            answerChoices: ['the parents', 'the children'],
        },
        {
            sentence: 'The singers thanked the musicians because they played wonderfully.',
            pronoun: 'they',
            correctAnswer: 'the musicians',
            answerChoices: ['the singers', 'the musicians'],
        },
        {
            sentence: 'The employees respected the managers because they were always fair.',
            pronoun: 'they',
            correctAnswer: 'the managers',
            answerChoices: ['the employees', 'the managers'],
        },
        {
            sentence: 'The scientists studied the whales because they were migrating south.',
            pronoun: 'they',
            correctAnswer: 'the whales',
            answerChoices: ['the scientists', 'the whales'],
        },
        {
            sentence: 'The artists sold the paintings because they needed the money.',
            pronoun: 'they',
            correctAnswer: 'the artists',
            answerChoices: ['the artists', 'the paintings'],
        },
        {
            sentence: 'The students thanked the professors because they explained the topic so clearly.',
            pronoun: 'they',
            correctAnswer: 'the professors',
            answerChoices: ['the students', 'the professors'],
        },
        {
            sentence: 'The coaches benched the players because they were injured.',
            pronoun: 'they',
            correctAnswer: 'the players',
            answerChoices: ['the coaches', 'the players'],
        },
        {
            sentence: 'The judges disqualified the runners because they had false-started.',
            pronoun: 'they',
            correctAnswer: 'the runners',
            answerChoices: ['the judges', 'the runners'],
        },
        {
            sentence: 'The reporters interviewed the survivors because they had witnessed the accident.',
            pronoun: 'they',
            correctAnswer: 'the survivors',
            answerChoices: ['the reporters', 'the survivors'],
        },
        {
            sentence: 'The customers complained to the waiters because they were rude.',
            pronoun: 'they',
            correctAnswer: 'the waiters',
            answerChoices: ['the customers', 'the waiters'],
        },
        {
            sentence: 'The editors rejected the writers because they missed the deadline.',
            pronoun: 'they',
            correctAnswer: 'the writers',
            answerChoices: ['the editors', 'the writers'],
        },
        {
            sentence: 'The trainers praised the dogs because they obeyed every command.',
            pronoun: 'they',
            correctAnswer: 'the dogs',
            answerChoices: ['the trainers', 'the dogs'],
        },
        {
            sentence: 'The pilots reassured the passengers because they were nervous.',
            pronoun: 'they',
            correctAnswer: 'the passengers',
            answerChoices: ['the pilots', 'the passengers'],
        },
        {
            sentence: 'The doctors thanked the volunteers because they donated blood.',
            pronoun: 'they',
            correctAnswer: 'the volunteers',
            answerChoices: ['the doctors', 'the volunteers'],
        },
        {
            sentence: 'The directors fired the actors because they kept missing rehearsals.',
            pronoun: 'they',
            correctAnswer: 'the actors',
            answerChoices: ['the directors', 'the actors'],
        },
    ],
    hard: [
        {
            sentence: 'The piano does not fit in the music room because it is too small.',
            pronoun: 'it',
            correctAnswer: 'the music room',
            answerChoices: ['the piano', 'the music room'],
        },
        {
            sentence: 'The trophy does not fit in the brown suitcase because it is too large.',
            pronoun: 'it',
            correctAnswer: 'the trophy',
            answerChoices: ['the trophy', 'the brown suitcase'],
        },
        {
            sentence: 'The suitcase does not fit in the closet because it is too small.',
            pronoun: 'it',
            correctAnswer: 'the closet',
            answerChoices: ['the suitcase', 'the closet'],
        },
        {
            sentence: 'The sofa would not fit through the doorway because it was too wide.',
            pronoun: 'it',
            correctAnswer: 'the sofa',
            answerChoices: ['the sofa', 'the doorway'],
        },
        {
            sentence: 'The truck could not pass under the bridge because it was too tall.',
            pronoun: 'it',
            correctAnswer: 'the truck',
            answerChoices: ['the truck', 'the bridge'],
        },
        {
            sentence: 'The bookshelf would not fit against the wall because it was too long.',
            pronoun: 'it',
            correctAnswer: 'the bookshelf',
            answerChoices: ['the bookshelf', 'the wall'],
        },
        {
            sentence: 'The mattress would not fit in the van because it was too big.',
            pronoun: 'it',
            correctAnswer: 'the mattress',
            answerChoices: ['the mattress', 'the van'],
        },
        {
            sentence: 'The key would not turn in the lock because it was too rusty.',
            pronoun: 'it',
            correctAnswer: 'the lock',
            answerChoices: ['the key', 'the lock'],
        },
        {
            sentence: 'The letter would not fit in the envelope because it was too small.',
            pronoun: 'it',
            correctAnswer: 'the envelope',
            answerChoices: ['the letter', 'the envelope'],
        },
        {
            sentence: 'The table would not fit through the door because it was too wide.',
            pronoun: 'it',
            correctAnswer: 'the table',
            answerChoices: ['the table', 'the door'],
        },
        {
            sentence: 'The boat could not enter the harbor because it was too shallow.',
            pronoun: 'it',
            correctAnswer: 'the harbor',
            answerChoices: ['the boat', 'the harbor'],
        },
        {
            sentence: 'The wardrobe would not fit up the stairs because it was too narrow.',
            pronoun: 'it',
            correctAnswer: 'the stairs',
            answerChoices: ['the wardrobe', 'the stairs'],
        },
        {
            sentence: 'The tent would not fit in the backpack because it was too small.',
            pronoun: 'it',
            correctAnswer: 'the backpack',
            answerChoices: ['the tent', 'the backpack'],
        },
        {
            sentence: 'The car would not fit in the garage because it was too long.',
            pronoun: 'it',
            correctAnswer: 'the car',
            answerChoices: ['the car', 'the garage'],
        },
        {
            sentence: 'The rug would not fit in the room because it was too large.',
            pronoun: 'it',
            correctAnswer: 'the rug',
            answerChoices: ['the rug', 'the room'],
        },
        {
            sentence: 'The ladder would not reach the roof because it was too short.',
            pronoun: 'it',
            correctAnswer: 'the ladder',
            answerChoices: ['the ladder', 'the roof'],
        },
        {
            sentence: 'The cake would not fit in the oven because it was too big.',
            pronoun: 'it',
            correctAnswer: 'the cake',
            answerChoices: ['the cake', 'the oven'],
        },
        {
            sentence: 'The pipe would not fit through the wall because it was too thick.',
            pronoun: 'it',
            correctAnswer: 'the pipe',
            answerChoices: ['the pipe', 'the wall'],
        },
    ],
};

const START_SEQUENCE = [
    'easy', 'easy', 'easy',
    'medium', 'medium', 'medium',
    'hard', 'hard', 'hard',
];

let currentDifficulty = 'easy';
let currentPuzzle = null;
let selectedAnswer = null;
let gameMode = null;
let startIndex = 0;
let checkLocked = false;

function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderSentence(level) {
    const box = document.getElementById('sentence-box');
    box.innerHTML = '';
    const parts = level.sentence.split(new RegExp(`\\b(${level.pronoun})\\b`, 'gi'));
    parts.forEach(part => {
        if (part.toLowerCase() === level.pronoun.toLowerCase()) {
            const mark = document.createElement('span');
            mark.className = 'pronoun-highlight';
            mark.textContent = part;
            box.appendChild(mark);
        } else {
            box.appendChild(document.createTextNode(part));
        }
    });
}

function renderChoices(level) {
    document.getElementById('question-text').textContent = `What does "${level.pronoun}" refer to?`;

    const choicesEl = document.getElementById('choices');
    choicesEl.innerHTML = '';

    shuffle(level.answerChoices).forEach(choice => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';

        const radio = document.createElement('span');
        radio.className = 'radio-circle';

        const label = document.createElement('span');
        label.className = 'choice-label';
        label.textContent = choice;

        btn.appendChild(radio);
        btn.appendChild(label);

        btn.addEventListener('click', () => {
            if (checkLocked) return;
            selectedAnswer = choice;
            document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            hideResult();
        });

        choicesEl.appendChild(btn);
    });
}

function hideResult() {
    const result = document.getElementById('result');
    result.style.display = 'none';
}

function showResult(text, className) {
    const result = document.getElementById('result');
    result.style.display = 'inline-block';
    result.className = className;
    result.textContent = text;
}

function loadPuzzle(difficulty) {
    currentDifficulty = difficulty;
    checkLocked = false;
    selectedAnswer = null;
    hideResult();

    const pool = LEVELS[difficulty];
    currentPuzzle = pool[Math.floor(Math.random() * pool.length)];

    renderSentence(currentPuzzle);
    renderChoices(currentPuzzle);

    if (gameMode === 'infinite') {
        document.querySelectorAll('#difficulty-btns button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
        });
    }
}

function populateDifficultyButtons() {
    document.querySelectorAll('#difficulty-btns button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentDifficulty = btn.dataset.difficulty;
            document.querySelectorAll('#difficulty-btns button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadPuzzle(currentDifficulty);
        });
    });
}

function startPuzzleMode() {
    gameMode = 'start';
    startIndex = 0;
    document.getElementById('difficulty-toolbar').style.display = 'none';
    loadPuzzle(START_SEQUENCE[startIndex]);
}

function startInfiniteMode() {
    gameMode = 'infinite';
    document.getElementById('difficulty-toolbar').style.display = 'flex';
    document.querySelectorAll('#difficulty-btns button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === currentDifficulty);
    });
    loadPuzzle(currentDifficulty);
}

function checkAnswer() {
    if (checkLocked) return;

    if (!selectedAnswer) {
        showResult('Pick an answer first', 'wrong');
        return;
    }

    const ok = selectedAnswer === currentPuzzle.correctAnswer;

    if (!ok) {
        showResult('Not quite — try again', 'wrong');
        return;
    }

    checkLocked = true;

    if (gameMode === 'start') {
        startIndex++;
        if (startIndex >= START_SEQUENCE.length) {
            showResult('Sequence complete! Well done!', 'correct');
            setTimeout(() => {
                document.getElementById('puzzle').style.display = 'none';
                document.getElementById('menu').style.display = 'flex';
            }, 2000);
        } else {
            showResult('Correct!', 'correct');
            setTimeout(() => loadPuzzle(START_SEQUENCE[startIndex]), 2000);
        }
    } else {
        showResult('Correct!', 'correct');
        setTimeout(() => loadPuzzle(currentDifficulty), 2000);
    }
}

populateDifficultyButtons();

document.getElementById('check-btn').addEventListener('click', checkAnswer);

window.startPuzzleMode = startPuzzleMode;
window.startInfiniteMode = startInfiniteMode;
