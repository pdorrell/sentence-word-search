import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface DisambiguationDialogProps {
  open: boolean;
  topic: string;
  options: string[];
  onSelect: (selectedTopic: string) => void;
  onCancel: () => void;
}

export const DisambiguationDialog: React.FC<DisambiguationDialogProps> = ({ 
  open,
  topic, 
  options, 
  onSelect, 
  onCancel 
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content disambiguation-modal">
          <Dialog.Title asChild>
            <h3>Choose a topic for "{topic}"</h3>
          </Dialog.Title>
          <Dialog.Description asChild>
            <p>This topic has multiple meanings. Please select one:</p>
          </Dialog.Description>
          
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
            <Dialog.Close asChild>
              <button className="modal-cancel">
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};