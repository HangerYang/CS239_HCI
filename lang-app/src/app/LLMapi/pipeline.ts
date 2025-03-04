import { pipeline } from '@huggingface/transformers';

const modelId = "amazon/MistralLite";

class PipelineSingleton {
  private static instance: any | null = null;

  static async getInstance() {
    if (!this.instance) {
      this.instance = await pipeline('text2text-generation', 'Xenova/t5-base');
    }
    return this.instance;
  }
}

export default PipelineSingleton;
