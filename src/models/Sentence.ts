import { makeAutoObservable } from 'mobx';
import { Word } from './Word';

export class Sentence {
  text: string;
  words: Word[] = [];
  parent: any;

  constructor(text: string, parent: any) {
    this.text = text;
    this.parent = parent;
    makeAutoObservable(this);
  }

  parseWords(wordTexts: string[]) {
    this.words = wordTexts.map(text => new Word(text));
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

  getDisplayText(): string {
    const originalWords = this.text.split(/\s+/);
    return originalWords.map((origWord, index) => {
      if (index < this.words.length && !this.words[index].revealed) {
        const wordMatch = origWord.match(/^(\W*)(.*?)(\W*)$/);
        if (wordMatch) {
          const [, prefix, wordPart, suffix] = wordMatch;
          return prefix + '●'.repeat(wordPart.length) + suffix;
        }
        return '●'.repeat(origWord.length);
      }
      return origWord;
    }).join(' ');
  }

  getDebugDisplayText(): Array<{ text: string; revealed: boolean }> {
    const originalWords = this.text.split(/\s+/);
    return originalWords.map((origWord, index) => {
      if (index < this.words.length) {
        return {
          text: origWord,
          revealed: this.words[index].revealed
        };
      }
      return {
        text: origWord,
        revealed: true
      };
    });
  }
}