const model = tf.sequential();

model.add(tf.layers.conv1d({
  activation: 'relu',
  kernelSize: 2,
  filters: 8,
  inputShape: [16, 18]
}));
model.add(tf.layers.flatten());
model.add(tf.layers.dense({units: 16, activation: 'sigmoid'}));

model.add(tf.layers.dense({
  units: 4,
  activation: 'linear'
}));

let actions = ["left", "right", "top", "bottom"];

// let crossEntropies = tf.losses.softmaxCrossEntropy({one_hot_label: tf.oneHot(actions, 4), logits: YLogits});
// let loss = tf.reduceSum(rewards * crossEntropies);

// let optimizer = tf.train.RMSPropOptimizer({learningRate: 0.001, decay: 0.99});
// let trainOp = optimizer.minimize(loss);

model.compile({optimizer: 'adam', loss: 'meanSquaredError'});

// model.fit(state, reward_value, epochs=1, verbose=0)



function trainModel(times) {
  for (let i = 0; i < times; i++) {
    var history = []
    var game = new Game({width: 4});
    lastScore = game.score;
    do {
      var board = game.getBoard();
      var direction;
      if (Math.random() > 0.2) {
        direction = model.predict(tf.tensor3d([board]));
        debugger
      } else {
        direction = Math.floor(Math.random() * 4);
      }
      var turn = game.takeTurn(directions[direction]);

      history.push([direction, turn.getBoard()]);
      var reward = turn.score - lastScore - baseLine;
      addReward(reward, history);
      lastScore = turn.score;
    } while (!turn.lost);
    addReward(-50, history);
    globalHistory.push(history)
  }
}


function addReward(reward, history) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i][2]) {
      history[i][2] += reward;
    } else {
      history[i][2] = reward;
    }
    reward = reward/2;
  }
}

function trainOn(history) {
  for (let i = 0; i < history.length; i++) {
    model.fit(tf.tensor2d(history[1]), history[2], epochs=1, verbose=0)
  }
}
