import { Component } from '@geajs/core';
import { App } from '../models/App';

interface TopicInputProps {
  app: App;
}

export class TopicInput extends Component<TopicInputProps> {
  tempOtherInput: string = '';

  handleSubmit = async (e?: Event) => {
    e?.preventDefault();
    const { app } = this.props;
    const cleanedTopic = app.topicInput.trim().toLowerCase();
    if (cleanedTopic && !app.currentTopic) {
      app.setTopicInput(cleanedTopic);
      await app.loadTopic(cleanedTopic, app.inputLanguage.toLowerCase());
    }
  };

  handleLanguageChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value;
    const { app } = this.props;
    if (value === 'OTHER') {
      app.setShowOtherLanguageInput(true);
      this.tempOtherInput = '';
    } else {
      app.setInputLanguage(value);
      app.setShowOtherLanguageInput(false);
    }
  };

  handleOtherLanguageSubmit = () => {
    const lang = this.tempOtherInput.trim().toUpperCase();
    if (lang && lang.length >= 2) {
      this.props.app.setOtherLanguageInput(lang);
      this.props.app.applyOtherLanguage();
      this.tempOtherInput = '';
    }
  };

  handleOtherInputKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleOtherLanguageSubmit();
    }
  };

  handleOtherInputChange = (e: Event) => {
    this.tempOtherInput = (e.target as HTMLInputElement).value.toUpperCase();
  };

  handleTopicChange = (e: Event) => {
    this.props.app.setTopicInput((e.target as HTMLInputElement).value);
  };

  handleBlur = () => {
    const { app } = this.props;
    const cleanedTopic = app.topicInput.trim().toLowerCase();
    if (cleanedTopic !== app.topicInput) {
      app.setTopicInput(cleanedTopic);
    }
    if (cleanedTopic && !app.currentTopic) {
      this.handleSubmit();
    }
  };

  cancelOther = () => {
    this.props.app.setShowOtherLanguageInput(false);
  };

  template({ app } = this.props) {
    const lang = app.inputLanguage.toUpperCase();
    const placeholders: Record<string, string> = {
      'EN': 'eg tiger',
      'ES': 'eg tigre',
      'MI': 'eg moa',
      'QU': 'eg puma'
    };
    const placeholder = placeholders[lang] || 'eg tiger';
    const topicDisabled = !!app.currentTopic && !app.currentTopic.error;

    return (
      <div class="topic-input">
        <form submit={this.handleSubmit}>
          <label htmlFor="topic" title="Enter Wikipedia topic to generate word searches">Topic</label>
          {app.showOtherLanguageInput ? (
            <div class="language-input-container">
              <input
                type="text"
                value={this.tempOtherInput}
                input={this.handleOtherInputChange}
                keydown={this.handleOtherInputKey}
                blur={this.handleOtherLanguageSubmit}
                placeholder="Enter language code"
                class="other-language-input"
                autoFocus
                maxLength={7}
              />
              <button type="button" click={this.cancelOther} class="cancel-other-btn">✕</button>
            </div>
          ) : (
            <select
              value={app.inputLanguage}
              change={this.handleLanguageChange}
              disabled={topicDisabled}
              class="language-selector"
            >
              {app.selectableLanguages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
              <option value="OTHER">Other...</option>
            </select>
          )}
          <input
            id="topic"
            type="text"
            value={app.topicInput}
            input={this.handleTopicChange}
            blur={this.handleBlur}
            disabled={topicDisabled}
            autoFocus={!app.showOtherLanguageInput}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={placeholder}
            title="Enter Wikipedia topic to generate word searches"
          />
        </form>
        {app.currentTopic?.error && (
          <div class="error">{app.currentTopic.error}</div>
        )}
      </div>
    );
  }
}
