// const url = new URL("http://localhost:8000")
const url = new URL("https://math-game-api.herokuapp.com");
let headersList = {
    "Content-Type": "application/json"
}
let currentLevel = 0; // order of the question

let currentSelection; // the answer has just been selected
let currentClick; // button has just been click
let point = 0; // point of user
let interval; // set interval for the countdown timer

let control = document.getElementById('control');
let message = document.getElementById('message');
let questions = document.getElementById('question');
let buttonA = document.getElementById('buttonA');
let buttonB = document.getElementById('buttonB');
let buttonC = document.getElementById('buttonC');
let buttonD = document.getElementById('buttonD');
let timer = document.getElementById('time');
let ordinal = document.getElementById('ordinal');


// handle when click on the controller
function handle() {
    if (currentLevel === -1) {
        restart();
        return;
    }

    if (currentLevel > 0) {
        check(currentLevel);
    }

    document.getElementById('control').innerText = 'Next';
    if (currentLevel < 10)
        ordinal.innerText = 'Ordinal number: ' + (currentLevel + 1);
    else {
        clearInterval(interval);
        ordinal.innerText = 'Complete the game';
        timer.innerText = 'Done';
        control.innerText = 'Again';
        setTimeout(() => {
            questions.innerText = 'Your point: ' + point;
            console.log('point final: ' + point);
        }, 2000)
        // point = -1;
        currentLevel = -1;
        return;
    }

    currentClick = document.getElementsByClassName('button-active');
    if (currentClick.length > 0)
        currentClick[0].className = currentClick[0].className.replace(' button-active', '');

    // get data question from api
    fetch(`${url}play`, {
        method: "POST",
        body: "{\n    \"number\":" + currentLevel + "\n}",
        headers: headersList
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        let {question, A, B, C, D} = data;
        questions.innerText = question;
        buttonA.innerText = A;
        buttonB.innerText = B;
        buttonC.innerText = C;
        buttonD.innerText = D;
        console.log(data);
    })
    currentLevel++;

    document.getElementById('time').innerText = '00:15';
    // clear interval existing
    clearInterval(interval);
    time();
}

// save the selected answer
function selected(select) {
    if (currentLevel === 0 || currentLevel > 10) return;
    switch (select) {
        case 'a':
            currentSelection = buttonA.innerText;
            break;
        case 'b':
            currentSelection = buttonB.innerText;
            break;
        case 'c':
            currentSelection = buttonC.innerText;
            break;
        case 'd':
            currentSelection = buttonD.innerText;
            break;

        default:
            break;
    }
    console.log('currentSelection: ' + currentSelection);
}

// check the answer when submit
function check(currentLevel) {

    // get check key from API
    let number = currentLevel - 1;
    console.log(number);
    console.log('currentLevel' + currentLevel)
    console.log(currentSelection);
    fetch(`${url}play/check`, {
        method: "POST",
        body: "{\n    \"number\": " + number + ",\n    \"choice\": \"" + currentSelection + "\"\n}",
        headers: headersList
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        console.log(data);
        if (data === "correct") {
            point++;
            console.log('point check: ' + point);
            message.classList.add('message-correct');
        } else
            message.classList.add('message-wrong');
        message.style.display = 'block';

        setTimeout(function () {
            message.classList.remove('message-correct');
            message.classList.remove('message-wrong');
            message.style.display = 'none';
        }, 500)
    })
}

// add click handle, change color on click
let items = document.getElementsByClassName('item');
for (const key in items) {
    if (Object.hasOwnProperty.call(items, key)) {
        const item = items[key];
        item.addEventListener('click', function () {
            currentClick = document.getElementsByClassName('button-active');
            if (currentClick.length > 0)
                currentClick[0].className = currentClick[0].className.replace(' button-active', '');
            this.className += ' button-active';
        })
    }
}

// set the timer for each question
function time() {
    let timer = 60 * 0.25 - 1;
    let display = document.getElementById('time');

    interval = setInterval(
        function timeout() {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = minutes + ":" + seconds;

            if (--timer < 0)
                handle();
        }, 1000)
}

// reset the game
function restart() {
    point = 0;
    currentLevel = 0;

    control.innerText = 'Start';
    ordinal.innerText = 'You have 15s for each question';
    timer.innerText = '00:15';
    questions.innerText = 'Click to start';
    buttonA.innerText = 'A';
    buttonB.innerText = 'B';
    buttonC.innerText = 'C';
    buttonD.innerText = 'D';
    clearInterval(interval);
}