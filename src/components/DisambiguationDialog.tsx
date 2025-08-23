import React from 'react';
import {
  Root,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close
} from '@radix-ui/react-dialog';

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
    <Root open={open} onOpenChange={handleOpenChange}>
      <Portal>
        <Overlay className="modal-overlay" />
        <Content className="modal-content disambiguation-modal">
          <Title asChild>
            <h3>Choose a topic for "{topic}"</h3>
          </Title>
          <Description asChild>
            <p>This topic has multiple meanings. Please select one:</p>
          </Description>
          
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
            <Close asChild>
              <button className="modal-cancel">
                Cancel
              </button>
            </Close>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};