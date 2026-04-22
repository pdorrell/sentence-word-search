import { makeObservable, observable, computed, Store } from '../framework';

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
    makeObservable(this, {
      positions: observable,
      word: observable,
      timestamp: observable,
      startPos: computed,
      endPos: computed,
    });
  }

  get startPos(): GridPosition {
    return this.positions[0];
  }

  get endPos(): GridPosition {
    return this.positions[this.positions.length - 1];
  }
}