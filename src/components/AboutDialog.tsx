import React, { useEffect } from 'react';

interface AboutDialogProps {
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content about-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Sentence Word Search</h2>
        <ul>
          <li>
            Choose a language and enter a Wikipedia topic word to generate
            word searches from sentences in the first paragraph of the
            Wikipedia page.
          </li>
        </ul>
        <p className="copyright">© Philip Dorrell 2025</p>
        <div className="modal-buttons">
          <button className="modal-ok" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};