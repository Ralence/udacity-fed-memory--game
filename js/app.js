/*
 * Create a list that holds all of your cards
 * Create all the global variables needed for the code to work
 */
const cards = [...document.querySelectorAll('.card')];     // Selacts all the cards and spread them to the array
const deck = document.querySelector('.deck');              // Slect the deck
const restartButton = document.querySelector('.restart');  // Select the restart button
const modal = document.querySelector('.modal');            // Selec the modal to show after winning
const playAgainBtn = modal.querySelector('.play-again');   // Select play again btn from the modal
const closeModal = modal.querySelector('.close-mod');      // Close modal btn
const starContainer = document.querySelector('.stars');    // Star container used to copy the stars HTML and style to modal
const stars = [...document.querySelectorAll('.fa-star')];  // Star elements used for updating the score
let starCounter = 1;   // Counts stars to be deleted from the score
let opened = [];       // Stores active cards
let matched = [];      // Stores matched cards
let movesCounter = 0;  // Stores number of moves made in the game

// Add timer object with all the related functionality
 
const timer = {
    timerHTML: document.querySelector('.timer'),
    mins: document.querySelector('.minutes'),
    secs: document.querySelector('.seconds'),
    
    counter : 0,
    
    countTime() {
        timer.counter++;
        if (timer.counter<10) {
            timer.secs.innerHTML =`0${timer.counter}`;
        } else if (timer.counter>=10 && timer.counter <60) {
            timer.secs.innerHTML = timer.counter;
        } else {
            timer.secs.innerHTML = timer.counter % 60 < 10 ? `0${timer.counter % 60}` : timer.counter % 60;
            timer.mins.innerHTML = Math.floor(timer.counter / 60) < 10 ? `0${Math.floor(timer.counter / 60)}` : Math.floor(timer.counter / 60);
        }
    },
    t: '0',
    startCount() {
        timer.t = setInterval(timer.countTime, 1000);
    },
    stopCount() {
        clearInterval(timer.t);
    }
};

// Shuffle function from http://stackoverflow.com/a/2450976

/*
 * The shuffle function will 
 *   - shuffle the cards array 
 *   - call on the printCards function tu update the position of the cards
 */

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    printCards(array);
}

// calls shuffle function to update the page content
shuffle(cards);

function printCards(array) {
    deck.innerHTML = "";
	
	array.map(item => deck.appendChild(item));
}

/*
 * handleClick function starts the game implements the logic and calls the functions
 *   - displayCard
 *   - incrementMoves
 *   - timer.startCount to start the timer
 *   - updateStars to update the game score
 */

function handleClick(e) {
    // Added conditional statement to fix double click bug
    if (opened.includes(e.target) || e.target.nodeName === 'I') return;
    // Prevents opening more than two cards at the same time
    if (opened.length === 2) return;
    displayCard(e.target);
    incrementMoves(e);
    if (movesCounter === 1) timer.startCount();
    updateStars();
}

function displayCard(card) {
    card.classList.add('open', 'show');
    opened.push(card);
    
    if (opened.length === 2) {
        handleMatch();
    }
}

function handleMatch() {
    if (opened[0].innerHTML === opened[1].innerHTML) {
        opened.forEach(card => card.classList.add('good-match'));
        setTimeout(goodMatch, 800);
    } else {
        opened.forEach(card => card.classList.add('bad-match'));
        setTimeout(badMatch, 800);
    }
}

function goodMatch() {
    opened.forEach(card => card.classList = 'card match');
    opened.forEach(card => card.removeEventListener('click', handleClick));
    matched.push(opened);
    opened = [];

    if (matched.length === 8) {
        endGame();
    }
}

function badMatch() {
    opened.forEach(card => card.classList = 'card');
    opened = [];
}

function incrementMoves(e) {
        movesCounter += 1;
        document.querySelector('.moves').innerHTML = movesCounter;
}

function endGame() {
    timer.stopCount();
    showModal();
}

function showModal() {
    modal.querySelector('.mod-time').innerHTML = timer.timerHTML.innerHTML;
    modal.querySelector('.stars').innerHTML = starContainer.innerHTML;
    modal.querySelector('.moves').textContent += movesCounter;
    modal.classList.add('modal-show');
}

function updateStars() {
    if (movesCounter < 25) {
        return;
    } else if (movesCounter === 25) {
        stars[stars.length - starCounter].style.color = '#80808054';
        starCounter++;
    } else if (movesCounter % 5 === 0 && movesCounter > 25 && movesCounter < 50) {
        stars[stars.length - starCounter].style.color = '#80808054';
        starCounter++;
    } 
}

function restartGame() {
    document.location.reload(true);
}

// Event listeners for the cards and the restart button
cards.forEach(card => card.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);

// Event listeners for modal
playAgainBtn.addEventListener('click', restartGame);
closeModal.addEventListener('click', function() {
    modal.classList.remove('modal-show');
    });