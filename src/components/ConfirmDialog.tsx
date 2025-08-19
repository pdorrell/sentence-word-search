import React, { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the Yes button by default
    yesButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="modal-buttons">
          <button ref={yesButtonRef} className="modal-yes" onClick={onConfirm}>
            Yes
          </button>
          <button className="modal-no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};