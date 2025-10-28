import * as tf from "@tensorflow/tfjs-node";

export class FederatedLearningService {
  private model: tf.Sequential;

  constructor() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 10, inputShape: [784], activation: "relu" }));
    this.model.add(tf.layers.dense({ units: 10, activation: "softmax" }));
    this.model.compile({ optimizer: "sgd", loss: "categoricalCrossentropy", metrics: ["accuracy"] });
  }

  async getModel() {
    return this.model.toJSON();
  }

  async updateModel(weights: any) {
    const newWeights = weights.map((w: any) => tf.tensor(w.data, w.shape, w.dtype));
    this.model.setWeights(newWeights);
  }
}

