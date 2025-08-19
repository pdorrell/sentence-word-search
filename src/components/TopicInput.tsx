import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { App } from '../models/App';

interface TopicInputProps {
  app: App;
}

export const TopicInput: React.FC<TopicInputProps> = observer(({ app }) => {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('EN');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await app.loadTopic(input.trim(), language.toLowerCase());
      if (!app.currentTopic?.error) {
        setInput(input.trim());
      }
    }
  };

  const handleNewTopic = () => {
    const currentSentence = app.currentTopic?.currentSentence;
    const needsConfirmation = currentSentence?.isStarted && !currentSentence?.isComplete;
    
    const shouldReset = !needsConfirmation || 
      window.confirm('The current sentence is not complete. Do you want to start with a new topic?');
    
    if (shouldReset) {
      app.resetTopic();
      setInput('');
    }
  };

  return (
    <div className="topic-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">Wikipedia topic</label>
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
          disabled={!!app.currentTopic && !app.currentTopic.error}
          maxLength={20}
          size={20}
          autoFocus
        />
        {app.currentTopic && !app.currentTopic.error && (
          <button type="button" onClick={handleNewTopic}>
            New Topic ...
          </button>
        )}
      </form>
      {app.currentTopic?.error && (
        <div className="error">{app.currentTopic.error}</div>
      )}
    </div>
  );
});