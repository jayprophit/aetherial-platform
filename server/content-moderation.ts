import Filter from "bad-words";
import * as toxicity from "@tensorflow-models/toxicity";

export class ContentModerationService {
  private filter: Filter;
  private model: toxicity.ToxicityClassifier | null = null;

  constructor() {
    this.filter = new Filter();
    this.loadModel();
  }

  private async loadModel() {
    this.model = await toxicity.load(0.9, []);
  }

  async moderate(text: string) {
    if (this.filter.isProfane(text)) {
      return { flagged: true, reason: "profanity" };
    }

    if (this.model) {
      const predictions = await this.model.classify(text);
      for (const prediction of predictions) {
        if (prediction.results[0].match) {
          return { flagged: true, reason: prediction.label };
        }
      }
    }

    return { flagged: false };
  }
}

