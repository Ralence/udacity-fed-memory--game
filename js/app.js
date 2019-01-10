/*
 * Create a list that holds all of your cards
 */
const cards = [...document.querySelectorAll('.card')];
const deck = document.querySelector('.deck');
const restartButton = document.querySelector('.restart');
const modal = document.querySelector('.modal');
let opened = [];
let matched = [];
let movesCounter = 0;


/*
 * Add timer object
 */
const timer = {
    timerHTML: document.querySelector('.timer'),
    mins: document.querySelector('.minutes'),
    secs: document.querySelector('.seconds'),
    
    counter : 0,
    
    countTime() {
        timer.counter++;
        if(timer.counter<10) {
            timer.secs.innerHTML =`0${timer.counter}`;
        } else if(timer.counter>=10 && timer.counter <60) {
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



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

shuffle(cards);

// Shuffle function from http://stackoverflow.com/a/2450976


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    printCards(array);
}

function printCards(array) {
    deck.innerHTML = "";
	
	array.map(item => deck.appendChild(item));
}

function handleClick(e) {
    // Added conditional statement to fix double click bug
    if(opened.includes(e.target) || e.target.nodeName === 'I') return;
    // Prevents opening more than two cards at the same time
    if(opened.length === 2) return;
    displayCard(e.target);
    incrementMoves(e);
    if(movesCounter === 1) timer.startCount();
}

function displayCard(card) {
    card.classList.add('open', 'show');
    opened.push(card);
    
    if(opened.length === 2) {
        handleMatch();
    }
}

function handleMatch() {
    if(opened[0].innerHTML === opened[1].innerHTML) {
        setTimeout(goodMatch, 200);
    } else {
        setTimeout(badMatch, 1000);
    }
}

function goodMatch() {
    opened.forEach(card => card.classList = 'card match');
    opened.forEach(card => card.removeEventListener('click', handleClick));
    matched.push(opened);
    opened = [];

    if(matched.length === 8) {
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
    modal.querySelector('.moves').textContent += movesCounter;
    modal.classList.add('modal-show');

}

function restartGame() {
    document.location.reload(true);
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 cards.forEach(card => card.addEventListener('click', handleClick));
 restartButton.addEventListener('click', restartGame)