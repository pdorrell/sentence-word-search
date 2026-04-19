import { Component } from '@geajs/core';
import { App } from '../models/App';
import { Header } from './Header';
import { TopicInput } from './TopicInput';
import { SentenceSelector } from './SentenceSelector';
import { SentenceDisplay } from './SentenceDisplay';
import { WordSearchGrid } from './WordSearchGrid';
import { DisambiguationDialog } from './DisambiguationDialog';
import { ConfirmDialog } from './ConfirmDialog';

interface AppViewProps {
  app: App;
}

export class AppView extends Component<AppViewProps> {
  showConfirmReset: boolean = false;

  private beforeUnloadHandler = (e: BeforeUnloadEvent) => {
    const currentSentence = this.props.app.currentTopic?.currentSentence;
    if (currentSentence?.isStarted && !currentSentence?.isComplete) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  };

  onAfterRender() {
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  dispose() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    super.dispose();
  }

  handleNewTopic = () => {
    const { app } = this.props;
    const currentSentence = app.currentTopic?.currentSentence;
    const needsConfirmation = currentSentence?.isStarted && !currentSentence?.isComplete;
    if (needsConfirmation) {
      this.showConfirmReset = true;
    } else {
      app.resetTopic();
    }
  };

  handleConfirmReset = () => {
    this.props.app.resetTopic();
    this.showConfirmReset = false;
  };

  handleCancelReset = () => {
    this.showConfirmReset = false;
  };

  onDisambiguationSelect = (topic: string) => {
    this.props.app.onDisambiguationSelect(topic);
  };

  onDisambiguationCancel = () => {
    this.props.app.onDisambiguationCancel();
  };

  template({ app } = this.props) {
    const isAboutPage = window.location.pathname === '/about';

    return (
      <div class="outer-app-container">
        {isAboutPage ? (
          <div class="app about-page">
            <Header app={app} />
            <div class="about-content">
              <h2>About Sentence Word Search</h2>
              <p>
                Sentence Word Search is an educational word puzzle game that combines
                Wikipedia content with classic word search gameplay.
              </p>
              <h3>How to Play</h3>
              <ol>
                <li>Enter a Wikipedia topic (e.g., "Elephant", "Paris", "Computer")</li>
                <li>The app fetches the first paragraph from that Wikipedia article</li>
                <li>Each sentence becomes a word search puzzle</li>
                <li>Find and select words by dragging from the first to last letter</li>
                <li>Words can be horizontal, vertical, or diagonal in any direction</li>
                <li>Complete all sentences to finish the topic</li>
              </ol>
              <h3>Wikipedia API Usage</h3>
              <p>
                This application uses the Wikipedia API to fetch article content.
                We comply with Wikipedia's User-Agent policy and include proper
                attribution for all content.
              </p>
              <p><a href="/">Back to Game</a></p>
            </div>
          </div>
        ) : app.compactMode ? (
          (app.currentTopic && !app.currentTopic.error && app.currentTopic.sentences.length > 0) ? (
            <div class="app compact solving-mode">
              <div class="compact-sentence-row">
                <SentenceSelector topic={app.currentTopic!} />
                <button type="button" click={this.handleNewTopic} class="new-topic-button" title="Start new topic">🆕</button>
              </div>
              {app.currentTopic!.currentSentence && (
                <SentenceDisplay sentence={app.currentTopic!.currentSentence} app={app} />
              )}
              {app.currentTopic!.currentSentence?.grid && (
                <WordSearchGrid grid={app.currentTopic!.currentSentence.grid} />
              )}
              <DisambiguationDialog
                open={app.showDisambiguationDialog}
                topic={app.disambiguationTopic}
                options={app.disambiguationOptions}
                onSelect={this.onDisambiguationSelect}
                onCancel={this.onDisambiguationCancel}
              />
              <ConfirmDialog
                open={this.showConfirmReset}
                message="The current sentence is not complete. Do you want to start with a new topic?"
                onConfirm={this.handleConfirmReset}
                onCancel={this.handleCancelReset}
              />
            </div>
          ) : (
            <div class="app compact choose-word-mode">
              <Header app={app} />
              <TopicInput app={app} />
              {app.errorMessage && <div class="error-message">{app.errorMessage}</div>}
              {app.currentTopic?.loading && <div class="loading">Loading...</div>}
              <DisambiguationDialog
                open={app.showDisambiguationDialog}
                topic={app.disambiguationTopic}
                options={app.disambiguationOptions}
                onSelect={this.onDisambiguationSelect}
                onCancel={this.onDisambiguationCancel}
              />
            </div>
          )
        ) : (
          <div class="app">
            <Header app={app} />
            {(app.currentTopic && !app.currentTopic.error && app.currentTopic.sentences.length > 0) ? (
              <div class="topic-and-selectors">
                <TopicInput app={app} />
                <div class="sentence-selector-row">
                  <SentenceSelector topic={app.currentTopic!} />
                  <button type="button" click={this.handleNewTopic} class="new-topic-button" title="Start new topic">🆕</button>
                </div>
              </div>
            ) : (
              <TopicInput app={app} />
            )}
            {app.errorMessage && <div class="error-message">{app.errorMessage}</div>}
            {app.currentTopic && !app.currentTopic.error && app.currentTopic.sentences.length > 0 && (
              <div class="game-content">
                {app.currentTopic!.currentSentence && (
                  <SentenceDisplay sentence={app.currentTopic!.currentSentence} app={app} />
                )}
                {app.currentTopic!.currentSentence?.grid && (
                  <WordSearchGrid grid={app.currentTopic!.currentSentence.grid} />
                )}
              </div>
            )}
            {app.currentTopic?.loading && <div class="loading">Loading...</div>}
            <DisambiguationDialog
              open={app.showDisambiguationDialog}
              topic={app.disambiguationTopic}
              options={app.disambiguationOptions}
              onSelect={this.onDisambiguationSelect}
              onCancel={this.onDisambiguationCancel}
            />
            <ConfirmDialog
              open={this.showConfirmReset}
              message="The current sentence is not complete. Do you want to start with a new topic?"
              onConfirm={this.handleConfirmReset}
              onCancel={this.handleCancelReset}
            />
          </div>
        )}
      </div>
    );
  }
}
