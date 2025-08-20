import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { App } from '../models/App';
import { ConfirmDialog } from './ConfirmDialog';

interface TopicInputProps {
  app: App;
}

export const TopicInput: React.FC<TopicInputProps> = observer(({ app }) => {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('EN');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !app.currentTopic) {
      await app.loadTopic(input.trim(), language.toLowerCase());
      if (app.currentTopic && !app.currentTopic.error) {
        setInput(input.trim());
      }
    }
  };

  const handleBlur = () => {
    // Only submit on blur if there's input and no topic loaded yet
    if (input.trim() && !app.currentTopic) {
      handleSubmit();
    }
  };

  const handleNewTopic = () => {
    const currentSentence = app.currentTopic?.currentSentence;
    const needsConfirmation = currentSentence?.isStarted && !currentSentence?.isComplete;
    
    if (needsConfirmation) {
      setShowConfirm(true);
    } else {
      app.resetTopic();
      setInput('');
    }
  };

  const handleConfirmReset = () => {
    app.resetTopic();
    setInput('');
    setShowConfirm(false);
  };

  const handleCancelReset = () => {
    setShowConfirm(false);
  };

  return (
    <div className="topic-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic" title="Enter Wikipedia topic to generate word searches">Topic</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={!!app.currentTopic && !app.currentTopic.error}
          className="language-selector"
        >
          <option value="EN">EN</option>
          <option value="ES">ES</option>
          <option value="QU">QU</option>
        </select>
        <input
          id="topic"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={handleBlur}
          disabled={!!app.currentTopic && !app.currentTopic.error}
          maxLength={20}
          autoFocus
          placeholder="e.g., Elephant"
          title="Enter Wikipedia topic to generate word searches"
        />
        {app.currentTopic && !app.currentTopic.error && (
          <button type="button" onClick={handleNewTopic} className="new-topic-button" title="Start new topic">
            🆕
          </button>
        )}
      </form>
      {app.currentTopic?.error && (
        <div className="error">{app.currentTopic.error}</div>
      )}
      {showConfirm && (
        <ConfirmDialog
          message="The current sentence is not complete. Do you want to start with a new topic?"
          onConfirm={handleConfirmReset}
          onCancel={handleCancelReset}
        />
      )}
    </div>
  );
});