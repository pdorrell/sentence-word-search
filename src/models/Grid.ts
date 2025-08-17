import { makeAutoObservable } from 'mobx';
import { Selection, GridPosition } from './Selection';
import { Word } from './Word';

export class Grid {
  size: number;
  cells: string[][] = [];
  correctSelections: Selection[] = [];
  currentSelection: GridPosition[] = [];
  wrongSelection: Selection | null = null;
  parent: any;

  constructor(size: number, parent: any) {
    this.size = Math.max(8, Math.min(20, size));
    this.parent = parent;
    this.initializeGrid();
    makeAutoObservable(this);
  }

  initializeGrid() {
    this.cells = Array(this.size).fill(null).map(() => 
      Array(this.size).fill('')
    );
  }

  fillWithRandomLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.cells[row][col] === '') {
          this.cells[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  placeWord(word: Word): boolean {
    const directions = [
      { dr: 0, dc: 1 },   // horizontal
      { dr: 1, dc: 0 },   // vertical
      { dr: 1, dc: 1 },   // diagonal down-right
      { dr: 1, dc: -1 },  // diagonal down-left
      { dr: -1, dc: 1 },  // diagonal up-right
      { dr: -1, dc: -1 }, // diagonal up-left
      { dr: 0, dc: -1 },  // horizontal backwards
      { dr: -1, dc: 0 }   // vertical upwards
    ];

    const attempts = 100;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const maxRow = dir.dr === 0 ? this.size : 
                     dir.dr > 0 ? this.size - word.text.length : word.text.length - 1;
      const maxCol = dir.dc === 0 ? this.size :
                     dir.dc > 0 ? this.size - word.text.length : word.text.length - 1;
      
      if (maxRow <= (dir.dr === 0 ? this.size - 1 : 0) || 
          maxCol <= (dir.dc === 0 ? this.size - 1 : 0)) continue;

      const row = Math.floor(Math.random() * (maxRow + 1));
      const col = Math.floor(Math.random() * (maxCol + 1));

      if (this.canPlaceWord(word.text, row, col, dir.dr, dir.dc)) {
        this.doPlaceWord(word, row, col, dir.dr, dir.dc);
        return true;
      }
    }
    return false;
  }

  canPlaceWord(text: string, row: number, col: number, dr: number, dc: number): boolean {
    for (let i = 0; i < text.length; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      if (r < 0 || r >= this.size || c < 0 || c >= this.size) {
        return false;
      }
      if (this.cells[r][c] !== '' && this.cells[r][c] !== text[i]) {
        return false;
      }
    }
    return true;
  }

  doPlaceWord(word: Word, row: number, col: number, dr: number, dc: number) {
    const directionName = this.getDirectionName(dr, dc);
    word.addGridPosition(row, col, directionName);
    
    for (let i = 0; i < word.text.length; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      this.cells[r][c] = word.text[i];
    }
  }

  getDirectionName(dr: number, dc: number): string {
    if (dr === 0 && dc === 1) return 'horizontal';
    if (dr === 1 && dc === 0) return 'vertical';
    if (dr === 1 && dc === 1) return 'diagonal-down-right';
    if (dr === 1 && dc === -1) return 'diagonal-down-left';
    if (dr === -1 && dc === 1) return 'diagonal-up-right';
    if (dr === -1 && dc === -1) return 'diagonal-up-left';
    if (dr === 0 && dc === -1) return 'horizontal-back';
    if (dr === -1 && dc === 0) return 'vertical-up';
    return 'unknown';
  }

  startSelection(row: number, col: number) {
    this.currentSelection = [{ row, col }];
    this.wrongSelection = null;
  }

  updateSelection(row: number, col: number) {
    if (this.currentSelection.length === 0) return;
    
    const start = this.currentSelection[0];
    const positions = this.getLinePositions(start.row, start.col, row, col);
    if (positions.length > 1) {
      this.currentSelection = positions;
    }
  }

  endSelection(): boolean {
    if (this.currentSelection.length < 2) {
      this.currentSelection = [];
      return false;
    }

    const word = this.getWordFromSelection(this.currentSelection);
    const selectionKey = this.getSelectionKey(this.currentSelection);
    
    const isAlreadySelected = this.correctSelections.some(
      sel => this.getSelectionKey(sel.positions) === selectionKey
    );

    if (!isAlreadySelected && this.parent.currentSentence?.revealWord(word)) {
      this.correctSelections.push(new Selection(this.currentSelection, word));
      this.currentSelection = [];
      return true;
    } else {
      this.wrongSelection = new Selection(this.currentSelection, word);
      this.currentSelection = [];
      setTimeout(() => {
        this.wrongSelection = null;
      }, 1000);
      return false;
    }
  }

  getLinePositions(r1: number, c1: number, r2: number, c2: number): GridPosition[] {
    const positions: GridPosition[] = [];
    const dr = r2 - r1;
    const dc = c2 - c1;
    
    if (dr === 0 && dc === 0) {
      return [{ row: r1, col: c1 }];
    }
    
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
    
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
      return [{ row: r1, col: c1 }];
    }
    
    for (let i = 0; i <= steps; i++) {
      positions.push({
        row: r1 + i * stepR,
        col: c1 + i * stepC
      });
    }
    
    return positions;
  }

  getWordFromSelection(positions: GridPosition[]): string {
    return positions.map(pos => this.cells[pos.row][pos.col]).join('');
  }

  getSelectionKey(positions: GridPosition[]): string {
    const sorted = [...positions].sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });
    return sorted.map(p => `${p.row},${p.col}`).join('|');
  }

  cancelSelection() {
    this.currentSelection = [];
  }

  get lastCorrectSelection(): Selection | null {
    if (this.correctSelections.length === 0) return null;
    return this.correctSelections[this.correctSelections.length - 1];
  }
}