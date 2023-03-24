const { v4: uuidv4 } = require("uuid");

class Game {
    constructor(theme, status, start, finish, grid) {
        this.theme = theme;
        this.id = uuidv4();
        this.status = status;
        this.start = start;
        this.finish = finish;
        this.grid = grid;
    }
}

module.exports = Game;
