import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { App } from '../models/App';
import { Header } from './Header';
import { TopicInput } from './TopicInput';
import { SentenceSelector } from './SentenceSelector';
import { SentenceDisplay } from './SentenceDisplay';
import { WordSearchGrid } from './WordSearchGrid';

interface AppViewProps {
  app: App;
}

export const AppView: React.FC<AppViewProps> = observer(({ app }) => {
  const isAboutPage = window.location.pathname === '/about';

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if there's an unfinished puzzle
      const currentSentence = app.currentTopic?.currentSentence;
      if (currentSentence?.isStarted && !currentSentence?.isComplete) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [app.currentTopic]);

  if (isAboutPage) {
    return (
      <div className="app about-page">
        <Header app={app} />
        <div className="about-content">
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
          <p>
            <a href="/">Back to Game</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header app={app} />
      <TopicInput app={app} />
      
      {app.errorMessage && (
        <div className="error-message">
          {app.errorMessage}
        </div>
      )}
      
      {app.currentTopic && !app.currentTopic.error && app.currentTopic.sentences.length > 0 && (
        <div className="game-content">
          <SentenceSelector topic={app.currentTopic} />
          {app.currentTopic.currentSentence && (
            <>
              <SentenceDisplay sentence={app.currentTopic.currentSentence} app={app} />
              {app.grid && <WordSearchGrid grid={app.grid} />}
            </>
          )}
        </div>
      )}
      
      {app.currentTopic?.loading && (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
});