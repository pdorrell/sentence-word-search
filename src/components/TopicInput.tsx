import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { App } from '../models/App';

interface TopicInputProps {
  app: App;
}

export const TopicInput: React.FC<TopicInputProps> = observer(({ app }) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await app.loadTopic(input.trim());
      if (!app.currentTopic?.error) {
        setInput(input.trim());
      }
    }
  };

  const handleNewTopic = () => {
    const shouldReset = !app.currentTopic?.allComplete || 
      window.confirm('Do you want to start with a new topic word?');
    
    if (shouldReset) {
      app.resetTopic();
      setInput('');
    }
  };

  return (
    <div className="topic-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">Wikipedia topic</label>
        <input
          id="topic"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!!app.currentTopic && !app.currentTopic.error}
          maxLength={20}
          size={20}
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