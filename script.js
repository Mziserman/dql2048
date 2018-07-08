
class Cell {
  constructor(config) {
    this.init(config);
  }

  init(config) {
    this.i = config.i;
    this.j = config.j;
    this.value = config.value;
  }
}
class Game {
  constructor(config) {
    this.init(config);
  }

  init(config) {
    this.width = config.width;
    let board = [];

    this.score = 0;

    for (let i = 0; i < this.width; i++) {
      board[i] = [];
      for (let j = 0; j < this.width; j++) {
        board[i].push(new Cell({
          i: i,
          j: j
        }))
      }
    }

    this.board = board;
    this.startGame()
  }
  startGame() {
    for (let i = 0; i < 3; i++) {
      this.addOneCell();
    }
  }

  addOneCell() {
    let emptyCells = this.getEmptyCells();
    let cell = emptyCells[Math.floor(Math.random() * emptyCells.length)]

    cell.value = Math.ceil(Math.random() * 2) * 2
  }

  getEmptyCells() {
    let emptyCells = [];
    this.iterateOnBoard((i, j) => {
      if (this.board[i][j].value === undefined) {
        emptyCells.push(this.board[i][j]);
      }
    });
    return emptyCells;
  }

  top() {
    for (let i = 0; i < this.width; i++) {
      let previousMaxSpot = this.board[i][0];

      for (let j = 1; j < this.width; j++) {
        if (this.board[i][j].value === undefined) {
          continue
        }

        if (this.board[i][j].value == previousMaxSpot.value) {
          previousMaxSpot.value = this.board[i][j].value * 2;
          this.board[i][j].value = undefined;
          previousMaxSpot = this.board[previousMaxSpot.i][previousMaxSpot.j + 1];
          continue
        }

        if (previousMaxSpot.value === undefined) {
          this.board[i][previousMaxSpot.j].value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          continue
        }

        if (j !== previousMaxSpot.j + 1) {
          previousMaxSpot = this.board[i][previousMaxSpot.j + 1];
          previousMaxSpot.value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          continue
        }

        previousMaxSpot = this.board[i][j];
      }
    }
  }

  bottom() {
    for (let i = 0; i < this.width; i++) {
      let previousMaxSpot = this.board[i][this.width - 1];

      for (let j = this.width - 2; j >= 0; j--) {
        if (this.board[i][j].value === undefined) {
          continue
        }

        if (this.board[i][j].value == previousMaxSpot.value) {
          previousMaxSpot.value = this.board[i][j].value * 2;
          this.board[i][j].value = undefined;
          previousMaxSpot = this.board[previousMaxSpot.i][previousMaxSpot.j - 1];
          continue
        }

        if (previousMaxSpot.value === undefined) {
          this.board[i][previousMaxSpot.j].value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          continue
        }

        if (j !== previousMaxSpot.j - 1) {
          previousMaxSpot = this.board[i][previousMaxSpot.j - 1];
          previousMaxSpot.value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          continue
        }

        previousMaxSpot = this.board[i][j];
      }
    }
  }

  left() {
    for (let j = 0; j < this.width; j++) {
      let previousMaxSpot = this.board[0][j];

      for (let i = 1; i < this.width; i++) {
        if (this.board[i][j].value === undefined) {
          continue
        }

        if (this.board[i][j].value == previousMaxSpot.value) {
          previousMaxSpot.value = this.board[i][j].value * 2;
          this.board[i][j].value = undefined;
          previousMaxSpot = this.board[previousMaxSpot.i + 1][j];
          continue
        }

        if (previousMaxSpot.value === undefined) {
          this.board[previousMaxSpot.i][j].value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          continue
        }

        if (i !== previousMaxSpot.i + 1) {
          previousMaxSpot = this.board[previousMaxSpot.i + 1][j];
          previousMaxSpot.value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          continue
        }

        previousMaxSpot = this.board[i][j];
      }
    }
  }

  right() {
    for (let j = 0; j < this.width; j++) {
      let previousMaxSpot = this.board[this.width - 1][j];

      for (let i = this.width - 2; i >= 0; i--) {
        if (this.board[i][j].value === undefined) {
          continue
        }

        if (this.board[i][j].value == previousMaxSpot.value) {
          previousMaxSpot.value = this.board[i][j].value * 2;
          this.board[i][j].value = undefined;
          previousMaxSpot = this.board[previousMaxSpot.i - 1][j];
          continue
        }

        if (previousMaxSpot.value === undefined) {
          this.board[previousMaxSpot.i][j].value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          continue
        }

        if (i !== previousMaxSpot.i - 1) {
          previousMaxSpot = this.board[previousMaxSpot.i - 1][j];
          previousMaxSpot.value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          continue
        }

        previousMaxSpot = this.board[i][j];
      }
    }

  }

  getScore() {
    let score = 0;
    this.iterateOnBoard((i, j) => {
      if (this.board[i][j].value !== undefined) {
        score += this.board[i][j].value**2
      }
    })
    this.score = score;
  }

  iterateOnBoard(callback, endCallback=() => {}, iterateHorizontaly=false) {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.width; j++) {
        if (iterateHorizontaly) {
          callback(j, i);
          if (j == this.width - 1) {
            endCallback()
          }
        } else {
          callback(i, j);
          if (i == this.width - 1) {
            endCallback()
          }
        }
      }
    }
  }

  print() {
    let string = `${"__".repeat(this.width * 2.4 - 1)} \n`;
    this.iterateOnBoard((i, j) => {
      string +=  `| ${this.board[i][j].value === undefined ? " " : this.board[i][j].value} `
    }, () => {
      string += `| \n`
    }, true)
    string += `${"__".repeat(this.width * 2.4 - 1)}`;
    return string;
  }

  startTurn() {

  }

  endTurn() {
    this.addOneCell();
  }

  takeTurn(direction) {
    this.startTurn();
    if (direction == "top")
      this.top();
    else if (direction == "bottom")
      this.bottom();
    else if (direction == "right")
      this.right();
    else if (direction == "left")
      this.left()
    this.endTurn()
    console.log(this.print())
  }



}
g=new Game({width: 4});
