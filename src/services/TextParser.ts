import nlp from 'compromise';

export class TextParser {
  extractSentences(text: string): string[] {
    const doc = nlp(text);
    const sentences = doc.sentences().out('array') as string[];
    return sentences.filter((s: string) => s.trim().length > 0);
  }

  extractWords(sentence: string): string[] {
    const doc = nlp(sentence);
    const terms = doc.terms().out('array') as string[];
    
    return terms
      .map((term: string) => term.replace(/[^a-zA-Z]/g, ''))
      .filter((word: string) => word.length > 0);
  }
}