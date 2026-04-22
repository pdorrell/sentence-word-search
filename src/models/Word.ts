import { makeObservable, observable, action, Store } from '../framework';

export class Word extends Store {
  text: string;  // Clean text for grid placement (uppercase, no punctuation)
  originalText: string;  // Original text with punctuation
  revealed: boolean = false;
  revealedByUser: boolean = false;
  gridPositions: Array<{ row: number; col: number; direction: string }> = [];

  constructor(originalText: string) {
    super();
    this.originalText = originalText;
    // Keep all characters but convert to uppercase for grid placement
    this.text = originalText.toUpperCase();
    makeObservable(this, {
      text: observable,
      originalText: observable,
      revealed: observable,
      revealedByUser: observable,
      gridPositions: observable,
      reveal: action,
      revealByUser: action,
      addGridPosition: action,
    });
  }

  reveal() {
    this.revealed = true;
  }

  revealByUser() {
    this.revealed = true;
    this.revealedByUser = true;
  }

  addGridPosition(row: number, col: number, direction: string) {
    this.gridPositions.push({ row, col, direction });
  }
}