import { TextParser } from '../../services/TextParser';

export class TextParserDouble extends TextParser {
  private sentenceOverride: string[] | null = null;
  private wordsOverride: string[] | null = null;

  setSentences(sentences: string[]) {
    this.sentenceOverride = sentences;
  }

  setWords(words: string[]) {
    this.wordsOverride = words;
  }

  extractSentences(text: string): string[] {
    if (this.sentenceOverride !== null) {
      return this.sentenceOverride;
    }
    return text.split('. ').map(s => s.trim()).filter(s => s.length > 0);
  }

  extractWords(sentence: string): string[] {
    if (this.wordsOverride !== null) {
      return this.wordsOverride;
    }
    return sentence.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length > 0);
  }
}