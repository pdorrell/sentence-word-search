import { Store } from '@geajs/core';

export class Word extends Store {
  text: string;
  originalText: string;
  revealed: boolean = false;
  revealedByUser: boolean = false;
  gridPositions: Array<{ row: number; col: number; direction: string }> = [];

  constructor(originalText: string) {
    super();
    this.originalText = originalText;
    this.text = originalText.toUpperCase();
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