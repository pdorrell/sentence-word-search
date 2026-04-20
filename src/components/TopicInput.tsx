import { useRef, useState, FC, FormEvent, KeyboardEvent, observer } from '../framework';
import { App } from '../models/App';

interface TopicInputProps {
  app: App;
}

export const TopicInput: FC<TopicInputProps> = observer(({ app }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempOtherInput, setTempOtherInput] = useState('');

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const cleanedTopic = app.topicInput.trim().toLowerCase();
    if (cleanedTopic && !app.currentTopic) {
      // Update the input field to show the cleaned topic
      app.setTopicInput(cleanedTopic);
      await app.loadTopic(cleanedTopic, app.inputLanguage.toLowerCase());
    }
  };
  
  const handleLanguageChange = (value: string) => {
    if (value === 'OTHER') {
      app.setShowOtherLanguageInput(true);
      setTempOtherInput('');
    } else {
      app.setInputLanguage(value);
      app.setShowOtherLanguageInput(false);
    }
  };
  
  const handleOtherLanguageSubmit = () => {
    const lang = tempOtherInput.trim().toUpperCase();
    if (lang && lang.length >= 2) {
      app.setOtherLanguageInput(lang);
      app.applyOtherLanguage();
      setTempOtherInput('');
    }
  };
  
  const handleOtherInputKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOtherLanguageSubmit();
    }
  };

  const handleBlur = () => {
    // Clean the input even if not submitting
    const cleanedTopic = app.topicInput.trim().toLowerCase();
    if (cleanedTopic !== app.topicInput) {
      app.setTopicInput(cleanedTopic);
    }
    
    // Only submit on blur if there's input and no topic loaded yet
    if (cleanedTopic && !app.currentTopic) {
      handleSubmit();
    }
  };

  // Get language-specific placeholder text
  const getPlaceholder = () => {
    const lang = app.inputLanguage.toUpperCase();
    const placeholders: Record<string, string> = {
      'EN': 'eg tiger',
      'ES': 'eg tigre',
      'MI': 'eg moa',
      'QU': 'eg puma'
    };
    return placeholders[lang] || 'eg tiger';
  };

  return (
    <div className="topic-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic" title="Enter Wikipedia topic to generate word searches">Topic</label>
        {app.showOtherLanguageInput ? (
          <div className="language-input-container">
            <input
              type="text"
              value={tempOtherInput}
              onChange={(e) => setTempOtherInput(e.target.value.toUpperCase())}
              onKeyPress={handleOtherInputKeyPress}
              onBlur={handleOtherLanguageSubmit}
              placeholder="Enter language code"
              className="other-language-input"
              autoFocus
              maxLength={7}
            />
            <button
              type="button"
              onClick={() => app.setShowOtherLanguageInput(false)}
              className="cancel-other-btn"
            >
              ✕
            </button>
          </div>
        ) : (
          <select
            value={app.inputLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={!!app.currentTopic && !app.currentTopic.error}
            className="language-selector"
          >
            {app.selectableLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
            <option value="OTHER">Other...</option>
          </select>
        )}
        <input
          ref={inputRef}
          id="topic"
          type="text"
          value={app.topicInput}
          onChange={(e) => app.setTopicInput(e.target.value)}
          onBlur={handleBlur}
          disabled={!!app.currentTopic && !app.currentTopic.error}
          autoFocus={!app.showOtherLanguageInput}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={getPlaceholder()}
          title="Enter Wikipedia topic to generate word searches"
        />
      </form>
      {app.currentTopic?.error && (
        <div className="error">{app.currentTopic.error}</div>
      )}
    </div>
  );
});
