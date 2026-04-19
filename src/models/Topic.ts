import { Store } from '@geajs/core';
import { Sentence } from './Sentence';

export class Topic extends Store {
  word: string;
  sentences: Sentence[] = [];
  currentSentenceIndex: number = 0;
  loading: boolean = false;
  error: string | null = null;
  parent: any;

  constructor(word: string, parent: any) {
    super();
    this.word = word;
    this.parent = parent;
  }

  get currentSentence(): Sentence | null {
    if (this.sentences.length === 0) return null;
    return this.sentences[this.currentSentenceIndex];
  }

  setCurrentSentenceIndex(index: number) {
    if (index >= 0 && index < this.sentences.length) {
      this.currentSentenceIndex = index;
      const sentence = this.sentences[index];
      // Initialize grid for this sentence if it doesn't exist
      this.parent.initializeSentenceGrid(sentence);
    }
  }

  addSentence(text: string) {
    const sentence = new Sentence(text, this);
    this.sentences.push(sentence);
  }

  get allComplete(): boolean {
    return this.sentences.length > 0 && 
           this.sentences.every(s => s.isComplete);
  }
}