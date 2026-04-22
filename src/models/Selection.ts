import { makeAutoObservable, Store } from '../framework';

export interface GridPosition {
  row: number;
  col: number;
}

export class Selection extends Store {
  positions: GridPosition[];
  word: string;
  timestamp: number;

  constructor(positions: GridPosition[], word: string) {
    super();
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