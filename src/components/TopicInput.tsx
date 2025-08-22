import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { App } from '../models/App';

interface TopicInputProps {
  app: App;
}

export const TopicInput: React.FC<TopicInputProps> = observer(({ app }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (app.topicInput.trim() && !app.currentTopic) {
      await app.loadTopic(app.topicInput.trim(), app.inputLanguage.toLowerCase());
    }
  };

  const handleBlur = () => {
    // Only submit on blur if there's input and no topic loaded yet
    if (app.topicInput.trim() && !app.currentTopic) {
      handleSubmit();
    }
  };

  return (
    <div className="topic-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic" title="Enter Wikipedia topic to generate word searches">Topic</label>
        <select
          value={app.inputLanguage}
          onChange={(e) => app.setInputLanguage(e.target.value)}
          disabled={!!app.currentTopic && !app.currentTopic.error}
          className="language-selector"
        >
          <option value="EN">EN</option>
          <option value="ES">ES</option>
          <option value="QU">QU</option>
        </select>
        <input
          ref={inputRef}
          id="topic"
          type="text"
          value={app.topicInput}
          onChange={(e) => app.setTopicInput(e.target.value)}
          onBlur={handleBlur}
          disabled={!!app.currentTopic && !app.currentTopic.error}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="eg tiger"
          title="Enter Wikipedia topic to generate word searches"
        />
      </form>
      {app.currentTopic?.error && (
        <div className="error">{app.currentTopic.error}</div>
      )}
    </div>
  );
});
