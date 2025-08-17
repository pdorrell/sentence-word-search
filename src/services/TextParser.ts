import nlp from 'compromise';

export class TextParser {
  extractSentences(text: string): string[] {
    const doc = nlp(text);
    const sentences = doc.sentences().out('array') as string[];
    return sentences.filter((s: string) => s.trim().length > 0);
  }

  extractWords(sentence: string): string[] {
    // Split by whitespace to get the same word boundaries as the sentence display
    const words = sentence.split(/\s+/);
    
    return words
      .map((word: string) => {
        // Remove leading and trailing punctuation, but keep internal punctuation
        // This preserves apostrophes and hyphens within words
        return word.replace(/^[^\w'-]+|[^\w'-]+$/g, '');
      })
      .filter((word: string) => word.length > 0);
  }
}