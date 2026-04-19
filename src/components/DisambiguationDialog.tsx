import { Component } from '@geajs/core';

interface DisambiguationDialogProps {
  open: boolean;
  topic: string;
  options: string[];
  onSelect: (selectedTopic: string) => void;
  onCancel: () => void;
}

export class DisambiguationDialog extends Component<DisambiguationDialogProps> {
  template({ open, topic, options, onSelect, onCancel } = this.props) {
    return (
      <div>
        {open && <div class="modal-overlay" click={onCancel} />}
        {open && (
          <div class="modal-content disambiguation-modal">
            <h3>Choose a topic for "{topic}"</h3>
            <p>This topic has multiple meanings. Please select one:</p>
            <div class="disambiguation-options">
              {options.map((option) => (
                <button
                  key={option}
                  class="disambiguation-option"
                  click={() => onSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div class="modal-buttons">
              <button class="modal-cancel" click={onCancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
