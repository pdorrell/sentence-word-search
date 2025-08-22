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
        // Use Unicode property escapes to match letters in any language
        return word.replace(/^[^\p{L}\p{N}'-]+|[^\p{L}\p{N}'-]+$/gu, '');
      })
      .filter((word: string) => word.length > 0);
  }

  extractSentenceTokens(sentence: string): Array<{type: 'word' | 'non-word', text: string, originalText?: string}> {
    const tokens: Array<{type: 'word' | 'non-word', text: string, originalText?: string}> = [];
    
    // Use regex to split into word and non-word tokens
    // Use Unicode property escapes to match letters in any language (including accented characters)
    const regex = /([\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*)|([^\p{L}\p{N}\s]+)|(\s+)/gu;
    let match;
    
    while ((match = regex.exec(sentence)) !== null) {
      if (match[1]) {
        // Word token (including apostrophes and hyphens)
        tokens.push({
          type: 'word',
          text: match[1].toUpperCase(), // For grid placement
          originalText: match[1] // Original case for display
        });
      } else if (match[2]) {
        // Punctuation/symbol token
        tokens.push({
          type: 'non-word',
          text: match[2]
        });
      } else if (match[3]) {
        // Whitespace token
        tokens.push({
          type: 'non-word',
          text: match[3]
        });
      }
    }
    
    return tokens;
  }
}