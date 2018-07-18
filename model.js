const model = tf.sequential();

model.add(tf.layers.conv1d({
  activation: 'relu',
  kernelSize: 2,
  filters: 8,
  inputShape: [16, 18]
}));
model.add(tf.layers.flatten());
model.add(tf.layers.dense({units: 100, activation: 'sigmoid'}));

model.add(tf.layers.dense({
  units: 4,
  activation: 'linear'
}));

model.compile({optimizer: tf.train.rmsprop(0.001, 0.99)});

let actions = ["left", "right", "top", "bottom"];
// let crossEntropies = tf.losses.softmaxCrossEntropy(actionTaken, prediction)
// let loss = tf.reduceSum(rewards * crossEntropies);
// let optimizer = tf.train.rmsprop(0.001, 0.99)
// let trainOp = optimizer.minimize(loss)

// let crossEntropies = tf.losses.softmaxCrossEntropy({one_hot_label: tf.oneHot(actions, 4), logits: YLogits});

// let optimizer = tf.train.RMSPropOptimizer({learningRate: 0.001, decay: 0.99});
// let trainOp = optimizer.minimize(loss);

// model.compile({optimizer: 'adam', loss: 'meanSquaredError'});

// model.fit(state, reward_value, epochs=1, verbose=0)

function train(times, discount=0.9) {
  let g;
  let lastScore;
  let observations;
  let actions;
  let rewards;
  let globalHistory = []
  for (let i = 0; i < times; i++) {
    g = new Game({width: 4});
    lastScore = g.score;
    observations = [];
    actions = []
    rewards = []
    do {
      board = tf.tensor3d([g.getBoard()]);
      observation = model.predict(board);
      action = tf.multinomial(observation, 1);
      direction = directions[action.asScalar().get()];
      turn = g.takeTurn(direction);
      observations.push(observation);
      actions.push(action);
      reward = (turn.score - lastScore - baseLine) / 4
      rewards = addReward(reward, rewards, discount);
      lastScore = turn.score;
    } while (!turn.lost);
    rewards = addReward(-5, rewards, discount);
    globalHistory.push({observations: observations, actions: actions, rewards: rewards});
  }
  return globalHistory;
}


// const f = x => a.mul(x.square()).add(b.mul(x)).add(c);
// const loss = (pred, label) => pred.sub(label).square().mean();

// const learningRate = 0.01;
// const optimizer = tf.train.sgd(learningRate);

// Train the model.
// for (let i = 0; i < 10; i++) {
//    optimizer.minimize(() => loss(f(xs), ys));
// }


function fit(model, history) {
  for (i = 0; i < history.observations.length; i++) {
    // debugger
    var loss = () => tf.mul(history.rewards[i], tf.losses.softmaxCrossEntropy(tf.oneHot(history.actions[i].dataSync(), 4).asType('float32'), history.observations[i]))
    // debugger
    // var loss = () => tf.sum(history.rewards[i] * crossEntropies);
    var trainOp = model.optimizer.minimize(loss)
  }
}

function trainModel(times, randomTreshold, discount) {
  for (let i = 0; i < times; i++) {
    var history = []
    var game = new Game({width: 4});
    lastScore = game.score;
    do {
      var board = game.getBoard();
      var direction;
      if (Math.random() > 0.2) {
        direction = model.predict(tf.tensor3d([board]));
        tf.multinomial(direction, 3).print();

        debugger
      } else {
        direction = Math.floor(Math.random() * 4);
      }
      var turn = game.takeTurn(directions[direction]);

      history.push([direction, turn.getBoard()]);
      var reward = turn.score - lastScore - baseLine;
      addReward(reward, history, discount);
      lastScore = turn.score;
    } while (!turn.lost);
    addReward(-50, history);
    globalHistory.push(history)
  }
}


function addReward(reward, rewards, discount) {
  let time = 0;
  for (let i = rewards.length; i >= 0; i--) {
    if (isNaN(reward)) debugger
    console.log(reward)
    if (rewards[i]) {
      rewards[i] += reward;
    } else {
      rewards[i] = reward;
    }
    reward = reward * discount**time;
    time++
  }
  return rewards;
}

function trainOn(history) {
  for (let i = 0; i < history.length; i++) {
    model.fit(tf.tensor2d(history[1]), history[2], epochs=1, verbose=0)
  }
}

// loss = -(predicted_up * log(correct_up) + down + left + right)
// sample from probabilities (si up as 75 et down 25 up sortira 3/4 du temps)

// for each move loss = -R(played_up ? 1 : 0 * log(predicted up) + played_down ? 1 : 0 * log(predicted down))
