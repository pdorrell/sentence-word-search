import { makeAutoObservable } from 'mobx';

export class Word {
  text: string;  // Clean text for grid placement (uppercase, no punctuation)
  originalText: string;  // Original text with punctuation
  revealed: boolean = false;
  revealedByUser: boolean = false;
  gridPositions: Array<{ row: number; col: number; direction: string }> = [];

  constructor(originalText: string) {
    this.originalText = originalText;
    // Remove all punctuation for grid placement
    this.text = originalText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    makeAutoObservable(this);
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