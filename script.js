// import * as tf from '@tensorlowjs/tfjs';

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
    this.$game = document.getElementById('game');

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
    this.startGame();
  }
  startGame() {
    for (let i = 0; i < 3; i++) {
      this.addOneCell();
    }
    this.printHtml();
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('keydown', function(e) {
      e.preventDefault();
      if (e.keyCode === 37) {
        this.takeTurn("left");
      } else if (e.keyCode === 38) {
        this.takeTurn("top");
      } else if (e.keyCode === 39) {
        this.takeTurn("right");
      } else if (e.keyCode === 40) {
        this.takeTurn("bottom");
      }
    }.bind(this));

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
    let didSomething = false
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
          didSomething = true;
          continue
        }

        if (previousMaxSpot.value === undefined) {
          this.board[i][previousMaxSpot.j].value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          didSomething = true;
          continue
        }

        if (j !== previousMaxSpot.j + 1) {
          previousMaxSpot = this.board[i][previousMaxSpot.j + 1];
          previousMaxSpot.value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          didSomething = true;
          continue
        }

        previousMaxSpot = this.board[i][j];
      }
    }

    return didSomething;
  }

  bottom() {
    let didSomething = false;

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
          didSomething = true;
          continue
        }

        if (previousMaxSpot.value === undefined) {
          this.board[i][previousMaxSpot.j].value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          didSomething = true;
          continue
        }

        if (j !== previousMaxSpot.j - 1) {
          previousMaxSpot = this.board[i][previousMaxSpot.j - 1];
          previousMaxSpot.value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          didSomething = true;
          continue
        }

        previousMaxSpot = this.board[i][j];
      }
    }
    return didSomething;
  }

  left() {
    let didSomething = false;

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
          didSomething = true;
          continue
        }

        if (previousMaxSpot.value === undefined) {
          this.board[previousMaxSpot.i][j].value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          didSomething = true;
          continue
        }

        if (i !== previousMaxSpot.i + 1) {
          previousMaxSpot = this.board[previousMaxSpot.i + 1][j];
          previousMaxSpot.value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          didSomething = true;
          continue
        }

        previousMaxSpot = this.board[i][j];
      }
    }
    return didSomething;
  }

  right() {
    let didSomething = false;

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
          didSomething = true;
          continue
        }

        if (previousMaxSpot.value === undefined) {
          this.board[previousMaxSpot.i][j].value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          didSomething = true;
          continue
        }

        if (i !== previousMaxSpot.i - 1) {
          previousMaxSpot = this.board[previousMaxSpot.i - 1][j];
          previousMaxSpot.value = this.board[i][j].value;
          this.board[i][j].value = undefined;
          didSomething = true;
          continue
        }

        previousMaxSpot = this.board[i][j];
      }
    }
    return didSomething;
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

  printHtml() {
    while (this.$game.firstChild) {
      this.$game.removeChild(this.$game.firstChild)
    }
    let div = document.createElement('div');
    div.classList.add("row")
    let row = this.$game.appendChild(div);
    this.iterateOnBoard((i, j) => {
      div = document.createElement('div');
      div.classList.add("cell")
      div.style.background = this.getBackground(this.board[i][j]);
      this.board[i][j].$cell = row.appendChild(div);
      this.board[i][j].$cell.innerHTML = `<span>${this.board[i][j].value ? this.board[i][j].value : 0}</span>`;
    }, () => {
      div = document.createElement('div');
      div.classList.add("row")
      row = this.$game.appendChild(div)
    }, true)
    row.innerHTML = this.score;

  }

  getBackground(cell) {
    return {
      2: "#eee4da",
      4: "#ede0c8",
      8: "#f2b179",
      16: "#f59563",
      32: "#f67c5f",
      64: "#f65e3b",
      128: "#edcf72",
    }[cell.value]
  }

  getBoard() {
    let board = []
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.width; j++) {
        board.push(this.board[i][j].value || 0)
      }
    }
    return board;
  }

  startTurn() {

  }

  endTurn() {
    this.addOneCell();
  }

  takeTurn(direction) {
    this.startTurn();
    let didSomething;
    if (direction == "top")
      didSomething = this.top();
    else if (direction == "bottom")
      didSomething = this.bottom();
    else if (direction == "right")
      didSomething = this.right();
    else if (direction == "left")
      didSomething = this.left();
    if (didSomething) {
      this.endTurn();
      this.getScore();
      this.printHtml();
    }
    let emptyCells = this.getEmptyCells();
    if (emptyCells.length == 0){
      return "lost"
    }
    return this.score;
  }

}
g=new Game({width: 4});

const model = tf.sequential();
model.add(tf.layers.dense({units: 10, inputShape: [16]}));

model.add(tf.layers.dense({
  units: 4,
  kernelInitializer: 'VarianceScaling',
  activation: 'softmax'
}));

const LEARNING_RATE = 0.15;
const optimizer = tf.train.sgd(LEARNING_RATE);

model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});


let directions = ["left", "right", "top", "bottom"]
let turn = ""

function train() {
  do {
    let board = tf.tensor2d([g.getBoard()])
    let pred = tf.tidy(() => {
      return model.predict(board)
    });
    console.log(Array.from(pred.argMax(1).dataSync())[0])
    turn = g.takeTurn(directions[Array.from(pred.argMax(1).dataSync())[0]])
  } while (turn !== "lost") {
    board = tf.tensor2d([g.getBoard()])
    pred = tf.tidy(() => {
      return model.predict(board)
    });
    console.log(Array.from(pred.argMax(1).dataSync())[0])
    turn = g.takeTurn(directions[Array.from(pred.argMax(1).dataSync())[0]])
  }
}
// prediction = model.predict(board)
// while (g.takeTurn() !== "lost") {

// }
