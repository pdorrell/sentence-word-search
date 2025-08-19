export class WikipediaService {
  async fetchFirstParagraph(topic: string, language: string = 'en'): Promise<string> {
    // QU is Quechua language code
    const baseUrl = `https://${language}.wikipedia.org/w/api.php`;
    
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: topic,
      prop: 'extracts',
      exintro: '1',
      explaintext: '1',
      origin: '*'
    });

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: {
        'User-Agent': 'Sentence Word Search/1.0 (https://word-search.thinkinghard.com/; web@thinkinghard.com)',
        'Api-User-Agent': 'Sentence Word Search/1.0 (https://word-search.thinkinghard.com/; web@thinkinghard.com)'
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
