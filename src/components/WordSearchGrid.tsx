import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useDrag } from '@use-gesture/react';
import { Grid } from '../models/Grid';
import { Selection } from '../models/Selection';

interface WordSearchGridProps {
  grid: Grid;
}

export const WordSearchGrid: React.FC<WordSearchGridProps> = observer(({ grid }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const cellSize = 40;
  const fontSize = 20;
  const svgSize = grid.size * cellSize;

  const getPositionFromEvent = (event: any) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < grid.size && col >= 0 && col < grid.size) {
      return { row, col };
    }
    return null;
  };

  const bind = useDrag(({
    first,
    last,
    event
  }) => {
    if (first) {
      const pos = getPositionFromEvent(event);
      if (pos) {
        grid.startSelection(pos.row, pos.col);
      }
    } else if (last) {
      grid.endSelection();
    } else {
      const pos = getPositionFromEvent(event);
      if (pos) {
        grid.updateSelection(pos.row, pos.col);
      }
    }
  });

  const renderSelection = (selection: Selection, className: string, key: string) => {
    if (selection.positions.length < 2) return null;
    
    const start = selection.positions[0];
    const end = selection.positions[selection.positions.length - 1];
    
    const x1 = start.col * cellSize + cellSize / 2;
    const y1 = start.row * cellSize + cellSize / 2;
    const x2 = end.col * cellSize + cellSize / 2;
    const y2 = end.row * cellSize + cellSize / 2;
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    return (
      <rect
        key={key}
        className={`selection ${className}`}
        x={x1 - cellSize * 0.4}
        y={-cellSize * 0.4}
        width={length + cellSize * 0.8}
        height={cellSize * 0.8}
        rx={cellSize * 0.3}
        transform={`translate(0, ${y1}) rotate(${angle} ${x1} 0)`}
      />
    );
  };

  const renderCurrentSelection = () => {
    if (grid.currentSelection.length < 2) return null;
    
    const selection = new Selection(grid.currentSelection, '');
    return renderSelection(selection, 'current', 'current');
  };

  return (
    <div className="word-search-grid">
      <svg
        ref={svgRef}
        width={svgSize}
        height={svgSize}
        {...bind()}
        style={{ touchAction: 'none' }}
      >
        {/* Grid lines */}
        {Array.from({ length: grid.size + 1 }).map((_, i) => (
          <g key={`lines-${i}`}>
            <line
              x1={0}
              y1={i * cellSize}
              x2={svgSize}
              y2={i * cellSize}
              stroke="#ddd"
              strokeWidth="1"
            />
            <line
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={svgSize}
              stroke="#ddd"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Letters */}
        {grid.cells.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <text
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * cellSize + cellSize / 2}
              y={rowIndex * cellSize + cellSize / 2 + fontSize / 3}
              fontSize={fontSize}
              textAnchor="middle"
              className="letter"
            >
              {letter}
            </text>
          ))
        )}

        {/* Correct selections */}
        {grid.correctSelections.map((selection, index) => {
          const isLast = index === grid.correctSelections.length - 1 && 
                         grid.currentSelection.length === 0;
          return renderSelection(
            selection,
            isLast ? 'correct last' : 'correct',
            `correct-${index}`
          );
        })}

        {/* Wrong selection */}
        {grid.wrongSelection && renderSelection(
          grid.wrongSelection,
          'wrong',
          'wrong'
        )}

        {/* Current selection */}
        {renderCurrentSelection()}
      </svg>
    </div>
  );
});