export class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/w/api.php';
  
  async fetchFirstParagraph(topic: string): Promise<string> {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: topic,
      prop: 'extracts',
      exintro: '1',
      explaintext: '1',
      origin: '*'
    });

    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: {
        'User-Agent': 'Sentence Word Search/1.0 (https://sentence-word-search.thinkinghard.com/about; web@thinkinghard.com)',
        'Api-User-Agent': 'Sentence Word Search/1.0 (https://sentence-word-search.thinkinghard.com/about; web@thinkinghard.com)'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Wikipedia');
    }

    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId === '-1' || !pages[pageId].extract) {
      throw new Error('Topic not found');
    }

    const extract = pages[pageId].extract;
    const paragraphs = extract.split('\n').filter((p: string) => p.trim().length > 0);
    
    if (paragraphs.length === 0) {
      throw new Error('No content found');
    }

    return paragraphs[0];
  }
}