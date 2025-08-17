import { makeAutoObservable } from 'mobx';

export class Word {
  text: string;
  revealed: boolean = false;
  revealedByUser: boolean = false;
  gridPositions: Array<{ row: number; col: number; direction: string }> = [];

  constructor(text: string) {
    this.text = text.toUpperCase();
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