import { Component } from '@geajs/core';
import { Grid } from '../models/Grid';
import { Selection, GridPosition } from '../models/Selection';

interface WordSearchGridProps {
  grid: Grid;
}

interface RenderedSelection {
  x1: number;
  y1: number;
  length: number;
  angle: number;
  height: number;
  offset: number;
  rx: number;
  className: string;
  key: string;
}

const CELL_SIZE = 40;
const FONT_SIZE = 28;
const PADDING = 8;

function buildRenderedSelection(selection: Selection, className: string, key: string): RenderedSelection | null {
  if (selection.positions.length < 2) return null;
  const start = selection.positions[0];
  const end = selection.positions[selection.positions.length - 1];

  const x1 = start.col * CELL_SIZE + CELL_SIZE / 2 + PADDING;
  const y1 = start.row * CELL_SIZE + CELL_SIZE / 2 + PADDING;
  const x2 = end.col * CELL_SIZE + CELL_SIZE / 2 + PADDING;
  const y2 = end.row * CELL_SIZE + CELL_SIZE / 2 + PADDING;

  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  const isDiagonal = start.row !== end.row && start.col !== end.col;
  const height = isDiagonal ? CELL_SIZE * 0.64 : CELL_SIZE * 0.8;
  const offset = isDiagonal ? CELL_SIZE * 0.32 : CELL_SIZE * 0.4;

  return {
    x1, y1, length, angle, height, offset,
    rx: CELL_SIZE * 0.3,
    className,
    key
  };
}

export class WordSearchGrid extends Component<WordSearchGridProps> {
  svgEl: SVGSVGElement | null = null;

  getPositionFromEvent(event: PointerEvent): GridPosition | null {
    if (!this.svgEl) return null;
    const rect = this.svgEl.getBoundingClientRect();
    const x = event.clientX - rect.left - PADDING;
    const y = event.clientY - rect.top - PADDING;
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    const size = this.props.grid.size;
    if (row >= 0 && row < size && col >= 0 && col < size) {
      return { row, col };
    }
    return null;
  }

  handlePointerDown = (e: PointerEvent) => {
    const pos = this.getPositionFromEvent(e);
    if (pos) {
      this.props.grid.startSelection(pos.row, pos.col);
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    }
  };

  handlePointerMove = (e: PointerEvent) => {
    if (this.props.grid.currentSelection.length === 0) return;
    const pos = this.getPositionFromEvent(e);
    if (pos) {
      this.props.grid.updateSelection(pos.row, pos.col);
    }
  };

  handlePointerUp = (_e: PointerEvent) => {
    if (this.props.grid.currentSelection.length === 0) return;
    this.props.grid.endSelection();
  };

  template({ grid } = this.props) {
    const gridSize = grid.size * CELL_SIZE;
    const svgSize = gridSize + PADDING * 2;

    const selections: RenderedSelection[] = [];
    grid.correctSelections.forEach((sel, index) => {
      const isLast = index === grid.correctSelections.length - 1 && grid.currentSelection.length === 0;
      const built = buildRenderedSelection(sel, isLast ? 'correct last' : 'correct', `correct-${index}`);
      if (built) selections.push(built);
    });
    if (grid.wrongSelection) {
      const built = buildRenderedSelection(grid.wrongSelection, 'wrong', 'wrong');
      if (built) selections.push(built);
    }
    if (grid.currentSelection.length >= 2) {
      const current = new Selection(grid.currentSelection, '');
      const built = buildRenderedSelection(current, 'current', 'current');
      if (built) selections.push(built);
    }

    const cellsFlat: Array<{ row: number; col: number; letter: string; key: string }> = [];
    grid.cells.forEach((rowArr, rowIndex) => {
      rowArr.forEach((letter, colIndex) => {
        cellsFlat.push({
          row: rowIndex,
          col: colIndex,
          letter,
          key: `${rowIndex}-${colIndex}`
        });
      });
    });

    return (
      <div class="word-search-grid">
        <svg
          ref={this.svgEl}
          width={svgSize}
          height={svgSize}
          style="touch-action: none"
          pointerdown={this.handlePointerDown}
          pointermove={this.handlePointerMove}
          pointerup={this.handlePointerUp}
        >
          {selections.map((s) => (
            <rect
              key={s.key}
              class={`selection ${s.className}`}
              x={s.x1 - s.offset}
              y={-s.offset}
              width={s.length + s.offset * 2}
              height={s.height}
              rx={s.rx}
              transform={`translate(0, ${s.y1}) rotate(${s.angle} ${s.x1} 0)`}
            />
          ))}
          {cellsFlat.map((c) => (
            <text
              key={c.key}
              x={c.col * CELL_SIZE + CELL_SIZE / 2 + PADDING}
              y={c.row * CELL_SIZE + CELL_SIZE / 2 + PADDING}
              fontSize={FONT_SIZE}
              textAnchor="middle"
              dominantBaseline="central"
              class="letter"
            >
              {c.letter}
            </text>
          ))}
        </svg>
      </div>
    );
  }
}
