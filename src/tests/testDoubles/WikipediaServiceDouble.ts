import { WikipediaService } from '../../services/WikipediaService';

export class WikipediaServiceDouble extends WikipediaService {
  private responses: Map<string, string> = new Map();
  private shouldFail: boolean = false;

  setResponse(topic: string, response: string) {
    this.responses.set(topic.toLowerCase(), response);
  }

  setShouldFail(fail: boolean) {
    this.shouldFail = fail;
  }

  async fetchFirstParagraph(topic: string): Promise<string> {
    if (this.shouldFail) {
      throw new Error('Topic not found');
    }

    const response = this.responses.get(topic.toLowerCase());
    if (response) {
      return response;
    }

    return 'Default test paragraph. This is a test sentence. Here is another one.';
  }
}