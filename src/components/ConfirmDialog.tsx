import { FC, Dialog } from '../framework';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, message, onConfirm, onCancel }) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <Dialog.Description asChild>
            <p>{message}</p>
          </Dialog.Description>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};