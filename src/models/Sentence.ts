import { makeAutoObservable } from 'mobx';
import { Word } from './Word';
import { Grid } from './Grid';

export class Sentence {
  text: string;
  words: Word[] = [];
  grid: Grid | null = null;
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

}