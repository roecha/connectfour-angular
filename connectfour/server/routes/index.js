const { v4: uuidv4 } = require("uuid");
var express = require("express");
var router = express.Router();
var app1 = express();
let userDb = require("../models/user.js");

// DB
let Token = require("../models/token.js");
let Theme = require("../models/theme.js");
let Metadata = require("../models/metadata.js");
let Game = require("../models/game.js");
let Error = require("../models/error.js");
const app = require("../app.js");

let gamesList = {};
let tokenList = [
    new Token(0, "Rayman", "/assets/rayman.jpg"),
    new Token(1, "Vault Boy", "/assets/vaultboy.png"),
    new Token(2, "Cowboy", "/assets/horse.jpg"),
    new Token(3, "Cup Head", "/assets/cuphead.jpg"),
    new Token(4, "Space Cadet", "/assets/NMS.jpg"),
];

let defaultThemeList = {};

//Default theme
let currentTheme = new Theme(
    "#FF0000",
    tokenList[Object.keys(tokenList)[0]],
    tokenList[Object.keys(tokenList)[1]]
);

// Gets the metadata of a user
function getMetadata(playerID) {
    if (defaultThemeList[playerID]) {
        return new Metadata(tokenList, defaultThemeList[playerID]);
    }
    return new Metadata(tokenList, currentTheme);
}

function getToken(id) {
    return tokenList[id];
}

function createGame(color, playerToken, computerToken, playerID) {
    let newBoard = [
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "],
    ];

    const newGame = new Game(
        new Theme(color, getToken(playerToken), getToken(computerToken)),
        "UNFINISHED",
        new Date().toDateString(),
        null,
        newBoard
    );

    // Add player to the game list
    if (!gamesList[playerID]) {
        gamesList[playerID] = {};
    }
    gamesList[playerID][newGame.id] = newGame;
    return newGame;
}

function getGameFromID(gid, playerID) {
    return gamesList[playerID][gid];
}

function updateGameBoard(gid, move, isPlayer, playerID) {
    let game = gamesList[playerID][gid];
    let compMove = Math.floor(Math.random() * 7);
    for (let i = 4; i >= 0; i--) {
        if (game.grid[i][move] == " ") {
            if (isPlayer) {
                game.grid[i][move] = "X";
                break;
            } else {
                game.grid[i][move] = "O";
                break;
            }
        }
    }

    // Check if the game is finished
    let winner = checkWin(gid, playerID);
    if (winner !== " ") {
        gamesList[playerID][gid].finish = new Date().toDateString();
        if (winner === "X") {
            game.status = "VICTORY";
        } else if (winner === "O") {
            game.status = "LOSS";
        } else {
            game.status = "TIE";
        }
        return game;
    }

    // Computers turn
    if (isPlayer) {
        // makes sure computer places in a valid spot
        while (!checkAvailable(compMove, gid, playerID)) {
            compMove = Math.floor(Math.random() * 7);
        }
        updateGameBoard(gid, compMove, false, playerID);
    }
    return game;
}

// Makes sure a move is valid
function checkAvailable(move, gid, playerID) {
    if (gamesList[playerID][gid].grid[0][move] != " ") {
        return false;
    }
    return true;
}

function checkWin(gid, playerID) {
    const gameBoard = gamesList[playerID][gid].grid;
    // Check rows
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            if (
                gameBoard[i][j] !== " " &&
                gameBoard[i][j] === gameBoard[i][j + 1] &&
                gameBoard[i][j] === gameBoard[i][j + 2] &&
                gameBoard[i][j] === gameBoard[i][j + 3]
            ) {
                return gameBoard[i][j];
            }
        }
    }
    // Check columns
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 2; j++) {
            if (
                gameBoard[j][i] !== " " &&
                gameBoard[j][i] === gameBoard[j + 1][i] &&
                gameBoard[j][i] === gameBoard[j + 2][i] &&
                gameBoard[j][i] === gameBoard[j + 3][i]
            ) {
                return gameBoard[j][i];
            }
        }
    }
    // Check diagonals
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            if (
                gameBoard[i][j] !== " " &&
                gameBoard[i][j] === gameBoard[i + 1][j + 1] &&
                gameBoard[i][j] === gameBoard[i + 2][j + 2] &&
                gameBoard[i][j] === gameBoard[i + 3][j + 3]
            ) {
                return gameBoard[i][j];
            }
        }
    }
    for (let i = 0; i < 2; i++) {
        for (let j = 3; j < 7; j++) {
            if (
                gameBoard[i][j] !== " " &&
                gameBoard[i][j] === gameBoard[i + 1][j - 1] &&
                gameBoard[i][j] === gameBoard[i + 2][j - 2] &&
                gameBoard[i][j] === gameBoard[i + 3][j - 3]
            ) {
                return gameBoard[i][j];
            }
        }
    }

    // check for a tie
    for (let i = 0; i < 7; i++) {cd
        if (gameBoard[0][i] === " ") {
            break;
        } else {
            if (i == 6) {
                return "tie";
            }
        }
    }
    // no winner
    return " ";
}

new userDb.User("bilbo@mordor.org", "111111111", "");
new userDb.User("frodo@mordor.org", "222222222", "");
new userDb.User("samwise@mordor.org", "333333333", "");

/////////////////// END OF DB ///////////////////////

router.all("*", (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else if (req.session) {
        req.session.regenerate((err) => {
            res.redirect("/");
        });
    } else {
        res.redirect("/");
    }
});

router.get("/meta", function (req, res, next) {
    res.status(200).send(getMetadata(req.session.user._id));
});

/* Get the list of games at this sid */
router.get("/", function (req, res, next) {
    if (gamesList[req.session.user._id]) {
        res.send(Object.values(gamesList[req.session.user._id]));
    } else {
        res.send([]);
    }
});

router.post("/", function (req, res, next) {
    res.status(200).send(
        createGame(
            req.query.color,
            req.body.playerToken,
            req.body.computerToken,
            req.session.user._id
        )
    );
});

router.get("/gids/:gid", function (req, res, next) {
    const { gid } = req.params;
    res.status(200).send(getGameFromID(gid, req.session.user._id));
});

router.post("/gids/:gid", function (req, res, next) {
    const { gid } = req.params;
    res.status(200).send(updateGameBoard(gid, req.query.move, true, req.session.user._id));
});

router.get("/who", (req, res, next) => {
    let result = req.session && req.session.user;
    res.json(result);
});

router.put("/defaults", (req, res, next) => {
    res.json(updateDefault(req.user.defaults));
});

module.exports = router;
