import { Component } from '@geajs/core';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export class ConfirmDialog extends Component<ConfirmDialogProps> {
  template({ open, message, onConfirm, onCancel } = this.props) {
    return (
      <div>
        {open && <div class="modal-overlay" click={onCancel} />}
        {open && (
          <div class="modal-content">
            <p>{message}</p>
            <div class="modal-buttons">
              <button class="modal-yes" click={onConfirm} autoFocus>Yes</button>
              <button class="modal-no" click={onCancel}>No</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
