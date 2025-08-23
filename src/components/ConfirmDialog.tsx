import React from 'react';
import {
  Root,
  Portal,
  Overlay,
  Content,
  Description
} from '@radix-ui/react-dialog';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, message, onConfirm, onCancel }) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }
  };

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <Portal>
        <Overlay className="modal-overlay" />
        <Content className="modal-content">
          <Description asChild>
            <p>{message}</p>
          </Description>
          <div className="modal-buttons">
            <button 
              className="modal-yes" 
              onClick={onConfirm}
              autoFocus
            >
              Yes
            </button>
            <button 
              className="modal-no" 
              onClick={onCancel}
            >
              No
            </button>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};