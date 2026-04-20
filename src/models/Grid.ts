import { makeAutoObservable } from '../framework';
import { Selection, GridPosition } from './Selection';
import { Word } from './Word';

export class Grid {
  size: number;
  cells: string[][] = [];
  correctSelections: Selection[] = [];
  currentSelection: GridPosition[] = [];
  wrongSelection: Selection | null = null;
  parent: any;
  placedWords: Map<string, Word> = new Map();
  languageAlphabet: string = '';

  constructor(size: number, parent: any) {
    this.size = Math.max(8, Math.min(12, size));
    this.parent = parent;
    this.initializeGrid();
    makeAutoObservable(this);
  }

  initializeGrid() {
    this.cells = Array(this.size).fill(null).map(() => 
      Array(this.size).fill('')
    );
    this.placedWords.clear();
  }

  fillWithRandomLetters() {
    // Use language-specific alphabet if set, otherwise default to English
    const letters = this.languageAlphabet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    if (letters.length === 0) {
      // If no alphabet is available, use default English
      const defaultLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (this.cells[row][col] === '') {
            this.cells[row][col] = defaultLetters[Math.floor(Math.random() * defaultLetters.length)];
          }
        }
      }
      return;
    }
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.cells[row][col] === '') {
          this.cells[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  setLanguageAlphabet(alphabet: string) {
    this.languageAlphabet = alphabet;
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
        if (this.doPlaceWord(word, row, col, dir.dr, dir.dc)) {
          return true;
        }
        // If doPlaceWord returned false, continue trying other positions
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

  doPlaceWord(word: Word, row: number, col: number, dr: number, dc: number): boolean {
    // Create a unique key for this word placement
    const positions: GridPosition[] = [];
    for (let i = 0; i < word.text.length; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      positions.push({ row: r, col: c });
    }
    
    // Check if this placement key is already occupied
    const placementKey = this.getSelectionKey(positions);
    if (this.placedWords.has(placementKey)) {
      // This exact position and direction is already occupied by another word
      return false;
    }
    
    const directionName = this.getDirectionName(dr, dc);
    word.addGridPosition(row, col, directionName);
    
    // Place the word on the grid
    for (let i = 0; i < word.text.length; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      this.cells[r][c] = word.text[i];
    }
    
    // Store the Word instance with its placement key
    this.placedWords.set(placementKey, word);
    return true;
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
    
    // Check if this selection matches any placed word in the correct direction
    const matchedWord = this.findMatchingWord(this.currentSelection, word);
    
    const isAlreadySelected = this.correctSelections.some(
      sel => this.getSelectionKey(sel.positions) === this.getSelectionKey(this.currentSelection)
    );

    if (!isAlreadySelected && matchedWord && !matchedWord.revealed) {
      // Directly reveal the specific Word instance
      matchedWord.revealByUser();
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

  findMatchingWord(positions: GridPosition[], selectedWord: string): Word | null {
    // For each placed word, check if the selection matches it exactly
    for (const [, word] of this.placedWords) {
      if (word.text !== selectedWord) continue;
      
      // Get the positions for this placed word
      for (const placement of word.gridPositions) {
        const wordPositions = this.getWordPositions(
          placement.row, 
          placement.col, 
          placement.direction, 
          word.text.length
        );
        
        // Check if positions match exactly (in order)
        if (this.positionsMatch(positions, wordPositions)) {
          return word;
        }
        
        // For palindromes, also check reverse direction
        if (this.isPalindrome(word.text) && 
            this.positionsMatch(positions, [...wordPositions].reverse())) {
          return word;
        }
      }
    }
    return null;
  }

  getWordPositions(row: number, col: number, direction: string, length: number): GridPosition[] {
    const positions: GridPosition[] = [];
    let dr = 0, dc = 0;
    
    switch(direction) {
      case 'horizontal': dr = 0; dc = 1; break;
      case 'vertical': dr = 1; dc = 0; break;
      case 'diagonal-down-right': dr = 1; dc = 1; break;
      case 'diagonal-down-left': dr = 1; dc = -1; break;
      case 'diagonal-up-right': dr = -1; dc = 1; break;
      case 'diagonal-up-left': dr = -1; dc = -1; break;
      case 'horizontal-back': dr = 0; dc = -1; break;
      case 'vertical-up': dr = -1; dc = 0; break;
    }
    
    for (let i = 0; i < length; i++) {
      positions.push({ row: row + i * dr, col: col + i * dc });
    }
    
    return positions;
  }

  positionsMatch(pos1: GridPosition[], pos2: GridPosition[]): boolean {
    if (pos1.length !== pos2.length) return false;
    
    for (let i = 0; i < pos1.length; i++) {
      if (pos1[i].row !== pos2[i].row || pos1[i].col !== pos2[i].col) {
        return false;
      }
    }
    return true;
  }

  isPalindrome(text: string): boolean {
    const reversed = text.split('').reverse().join('');
    return text === reversed;
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