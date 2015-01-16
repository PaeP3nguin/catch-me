// Get DOM elements
var box = $("#box");
var counter = $("#counter");
var losescreen = $("#losescreen");
var timer = $("#timer");
var restart = $("#restart");

var boxMessages = ["Catch me!", "Nice job!", "Ouch", "Faster!", "Whoosh", "Boxbox", "Zoom", "Splat", "Biff", "Pow", "Boom", "Stop :(", "#swerve", "Go 'cats!"];
var currentMessage = 0;
var randomMessage = 0;

// Variables
var intervalID = null; // ID to reference the interval trigger with
var maxY = $(window).height() - 130;
var maxX = $(window).width() - 130;
var timerBarWidth; // Width of the timer bar in px
var randomColor; // Color of the box and restart button
var score = 0;
var timeLeft; // Remaining time in ms
var chaseTime = 1000; // The time in ms that you get to try to catch the box
var difficultyInterval = 5;
var running = false; // Is the mouseover running? Ensures only on instance of mouseover runs at a time

var topCoord; // The y coordinate to set the box to
var leftCoord; // The x coordinate to set the box to

/* Functions */

// Triggers when you catch the box
box.mouseover(function () {
    if (running === true) {
        return;
    }
    running = true;
    topCoord = 1 + Math.ceil(Math.random() * maxY);
    leftCoord = 1 + Math.ceil(Math.random() * maxX);
    doWork();
    startTimer();
});

function doWork() {
    box.animate({
        top: topCoord,
        left: leftCoord,
        margin: 0
    }, {
        duration: 100,
        queue: false,
        complete: (function () {
            updateScore();
            running = false;
        })
    });
}

function updateScore() {
    score++;
    if (score % difficultyInterval === 0) {
        randomColor = "#000000".replace(/0/g, function () {
            return (~~ (Math.random() * 16)).toString(16);
        });
        box.css({
            "background-color": randomColor
        });
        while (randomMessage === currentMessage) {
            randomMessage = Math.floor(Math.random() * (boxMessages.length + 1));
        }
        currentMessage = randomMessage;
        box.text(boxMessages[randomMessage]);

    }
    counter.text(score);
    counter.animate({
        fontSize: "28px",
        margin: "4px 0 0 0"
    }, {
        duration: 100,
        queue: false,
        complete: (function () {
            counter.animate({
                fontSize: "20px",
                margin: "0px 0 0 0"
            }, {
                duration: 200,
                queue: false
            });
        })
    });
}

// Starts the timer!
function startTimer() {
    if (score % difficultyInterval === 0) {
        if (chaseTime >= 200) {
            chaseTime -= 50;
        }
    }
    timeLeft = chaseTime;
    if (intervalID === null) {
        intervalID = setInterval(tick, 1);
    }
}

function tick() {
    timeLeft -= 1;
    timer.text(timeLeft);
    timerBarWidth = timeLeft / chaseTime * $(window).width();
    timer.css("width", timerBarWidth + "px");
    if (timeLeft <= 0) {
        gameOver();
    }
}

function gameOver() {
    clearInterval(intervalID);
    intervalID = null;
    running = false;
    losescreen.text(losescreen.text() + " " + score);
    losescreen.css({
        opacity: 1,
            'z-index': 1
    });
    restart.css({
        "background-color": randomColor,
        opacity: 1,
            'z-index': 2
    });
}

function restartGame() {
    box.css({
        top: "50%",
        left: "50%",
        margin: "-50px 0 0 -50px"
    });
    score = 0;
    counter.text(score);
    chaseTime = 1000;
    timeLeft = chaseTime;
    timer.text(timeLeft);
    timer.css("width", "100%");
    losescreen.text("You lost! Your final score was");
    losescreen.css({
        opacity: 0,
            'z-index': -1
    });
    restart.css({
        opacity: 0,
            'z-index': -1
    });
}

restart.click(function () {
    restartGame();
});
