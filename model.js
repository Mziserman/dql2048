const modelFitConfig = {
    epochs: 1,
    stepsPerEpoch: 16
};

const numActions = 4;
const inputSize = 288;
const temporalWindow = 1;

const totalInputSize = inputSize * temporalWindow + numActions * temporalWindow + inputSize;

const network = new ReImprove.NeuralNetwork();
network.InputShape = [totalInputSize];
network.addNeuralNetworkLayers([
    {type: 'dense', units: 32, activation: 'relu'},
    {type: 'dense', units: numActions, activation: 'softmax'}
]);

const model = new ReImprove.Model.FromNetwork(network, modelFitConfig);
model.compile({loss: 'categoricalCrossentropy', optimizer: 'sgd'})

const academy = new ReImprove.Academy();
const teacher = academy.addTeacher({});
const agent = academy.addAgent({});

academy.assignTeacherToAgent(agent, teacher);

