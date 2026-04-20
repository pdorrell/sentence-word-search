import { useRef, FC, observer, useDrag } from '../framework';
import { Grid } from '../models/Grid';
import { Selection } from '../models/Selection';

interface WordSearchGridProps {
  grid: Grid;
}

export const WordSearchGrid: FC<WordSearchGridProps> = observer(({ grid }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const cellSize = 40;
  const fontSize = 28; // Changed from 20 to 28 (140% increase)
  const padding = 8; // Add padding around the grid
  const gridSize = grid.size * cellSize;
  const svgSize = gridSize + (padding * 2);

  const getPositionFromEvent = (event: any) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - padding; // Account for padding
    const y = event.clientY - rect.top - padding; // Account for padding
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
    
    const x1 = start.col * cellSize + cellSize / 2 + padding;
    const y1 = start.row * cellSize + cellSize / 2 + padding;
    const x2 = end.col * cellSize + cellSize / 2 + padding;
    const y2 = end.row * cellSize + cellSize / 2 + padding;
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    // Check if selection is diagonal (not horizontal or vertical)
    const isDiagonal = start.row !== end.row && start.col !== end.col;
    // Make diagonal selections 20% narrower (0.64 instead of 0.8)
    const selectionHeight = isDiagonal ? cellSize * 0.64 : cellSize * 0.8;
    const selectionOffset = isDiagonal ? cellSize * 0.32 : cellSize * 0.4;
    
    return (
      <rect
        key={key}
        className={`selection ${className}`}
        x={x1 - selectionOffset}
        y={-selectionOffset}
        width={length + selectionOffset * 2}
        height={selectionHeight}
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

        {/* Letters - rendered last so they appear on top */}
        {grid.cells.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <text
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * cellSize + cellSize / 2 + padding}
              y={rowIndex * cellSize + cellSize / 2 + padding}
              fontSize={fontSize}
              textAnchor="middle"
              dominantBaseline="central"
              className="letter"
            >
              {letter}
            </text>
          ))
        )}
      </svg>
    </div>
  );
});