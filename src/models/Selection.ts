import { makeAutoObservable } from 'mobx';

export interface GridPosition {
  row: number;
  col: number;
}

export class Selection {
  positions: GridPosition[];
  word: string;
  timestamp: number;

  constructor(positions: GridPosition[], word: string) {
    this.positions = positions;
    this.word = word;
    this.timestamp = Date.now();
    makeAutoObservable(this);
  }

  get startPos(): GridPosition {
    return this.positions[0];
  }

  get endPos(): GridPosition {
    return this.positions[this.positions.length - 1];
  }
}