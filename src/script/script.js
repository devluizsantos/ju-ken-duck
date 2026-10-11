const buttons = document.querySelectorAll(".playerBtn");
const duckImg = document.getElementById("duck");

const duckMoves = document.querySelectorAll("#duckMoves div");
const playerMoves = document.querySelectorAll("#playerMoves button");

const modal = document.querySelector("dialog");
const play = document.getElementById("playBtn");

const music = document.getElementById("music");

modal.showModal();

const tracks = {
    main: { start: 29.5, end: 33 },
    win: { start: 0, end: 1 },
    lose: { start: 10, end: 13 },
    draw: { start: 8, end: 10 }
};

let currentTrack = tracks.main;

function playTrack(track, loop = false) {
    currentTrack = track;
    music.pause();
    music.currentTime = track.start;
    music.play();

    music.ontimeupdate = () => {
        if (music.currentTime >= currentTrack.end) {
            if (loop) {
                music.currentTime = currentTrack.start;
            } else {
                playTrack(tracks.main, true);
            }
        }
    };
}


play.onclick = () => {
    modal.close();
    music.volume = 0.4;
    playTrack(tracks.main, true);
};

const duckAnimations = {
    happy: [
        "src/images/at-cute.png",
        "src/images/bx-cute.png"
    ],

    angry: [
        "src/images/at-angry.png",
        "src/images/bx-angry.png"
    ],

    ok: [
        "src/images/at-bf.png",
        "src/images/at-ba.png",
        "src/images/at-ba.png"
    ],

    idle: [
        "src/images/bx-bf.png",
        "src/images/idle-bx.png"
    ]

};

let currentAnimation;
let gameLocked = false;

function animateDuck(mood) {
    clearInterval(currentAnimation);
    const frames = duckAnimations[mood];
    let frame = 0;

    currentAnimation = setInterval(() => {
        duckImg.src = frames[frame];
        frame++;
        if (frame >= frames.length) {
            frame = 0;
        }
    }, 300);
}

function duckChoose() {
    const options = [
        "rock",
        "paper",
        "scissors"
    ];
    return options[Math.floor(Math.random() * options.length)];
}

function whoWins(player, duck) {
    if (player === duck) {
        return "draw";
    }
    if (
        (player === "rock" && duck === "scissors") ||
        (player === "paper" && duck === "rock") ||
        (player === "scissors" && duck === "paper")
    ) {
        return "player";
    }
    return "duck";
}

function getDuckElement(move) {
    if (move === "rock") return duckMoves[0];
    if (move === "paper") return duckMoves[1];
    if (move === "scissors") return duckMoves[2];
}

function clearClasses() {
    playerMoves.forEach(btn => {
        btn.classList.remove(
            "selectPlayer",
            "winnerPlayer",
            "losePlayer",
            "drawPlayer"
        );
    });

    duckMoves.forEach(move => {
        move.classList.remove(
            "selectDuck",
            "winnerDuck",
            "loseDuck",
            "drawDuck"
        );
    });
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        if (gameLocked) return;
        gameLocked = true;
        clearClasses();
        const player = button.id;
        const duck = duckChoose();
        const duckElement = getDuckElement(duck);
        button.classList.add("selectPlayer");
        duckElement.classList.add("selectDuck");
        const result = whoWins(player, duck);

        setTimeout(() => {
            button.classList.remove("selectPlayer");
            duckElement.classList.remove("selectDuck");

            if (result === "player") {
                button.classList.add("winnerPlayer");
                duckElement.classList.add("loseDuck");
                playTrack(tracks.win);
                animateDuck("angry");
            }

            else if (result === "duck") {
                button.classList.add("losePlayer");
                duckElement.classList.add("winnerDuck");
                playTrack(tracks.lose);
                animateDuck("happy");
            }

            else {
                button.classList.add("drawPlayer");
                duckElement.classList.add("drawDuck");
                playTrack(tracks.draw);
                animateDuck("ok");
            }
        }, 1000);

        setTimeout(() => {
            clearClasses();
            animateDuck("idle");
            gameLocked = false;
        }, 3500);
    });
});

animateDuck("idle");