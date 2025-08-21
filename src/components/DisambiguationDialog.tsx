import React, { useEffect, useRef } from 'react';

interface DisambiguationDialogProps {
  topic: string;
  options: string[];
  onSelect: (selectedTopic: string) => void;
  onCancel: () => void;
}

export const DisambiguationDialog: React.FC<DisambiguationDialogProps> = ({ 
  topic, 
  options, 
  onSelect, 
  onCancel 
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  useEffect(() => {
    // Focus the dialog when it opens
    dialogRef.current?.focus();
  }, []);

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content disambiguation-modal" 
        ref={dialogRef}
        tabIndex={-1}
      >
        <h3>Choose a topic for "{topic}"</h3>
        <p>This topic has multiple meanings. Please select one:</p>
        
        <div className="disambiguation-options">
          {options.map((option, index) => (
            <button
              key={index}
              className="disambiguation-option"
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div className="modal-buttons">
          <button 
            className="modal-cancel" 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};