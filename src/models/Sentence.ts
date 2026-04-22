import { makeAutoObservable, Store } from '../framework';
import { Word } from './Word';
import { Grid } from './Grid';

export class Sentence extends Store {
  text: string;
  words: Word[] = [];
  tokens: Array<{type: 'word' | 'non-word', text: string, wordIndex?: number}> = [];
  grid: Grid | null = null;
  parent: any;

  constructor(text: string, parent: any) {
    super();
    this.text = text;
    this.parent = parent;
    makeAutoObservable(this);
  }

  parseWords(wordTexts: string[]) {
    this.words = wordTexts.map(text => new Word(text));
  }

  parseTokens(tokens: Array<{type: 'word' | 'non-word', text: string, originalText?: string}>) {
    this.words = [];
    this.tokens = [];

    let wordIndex = 0;

    for (const token of tokens) {
      if (token.type === 'word') {
        // Create word and track its index
        this.words.push(new Word(token.originalText || token.text));
        this.tokens.push({
          type: 'word',
          text: token.text,
          wordIndex: wordIndex
        });
        wordIndex++;
      } else {
        // Non-word token (punctuation, whitespace)
        this.tokens.push({
          type: 'non-word',
          text: token.text
        });
      }
    }
  }

  get isComplete(): boolean {
    return this.words.every(word => word.revealed);
  }

  get isStarted(): boolean {
    return this.words.some(word => word.revealed);
  }

  revealWord(wordText: string): boolean {
    const upperWord = wordText.toUpperCase();
    const unrevealedWord = this.words.find(
      word => !word.revealed && word.text === upperWord
    );
    if (unrevealedWord) {
      unrevealedWord.revealByUser();
      return true;
    }
    return false;
  }

}
