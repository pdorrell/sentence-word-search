import React from 'react';
import { observer } from 'mobx-react-lite';
import { Sentence } from '../models/Sentence';
import { App } from '../models/App';

interface SentenceDisplayProps {
  sentence: Sentence;
  app: App;
}

export const SentenceDisplay: React.FC<SentenceDisplayProps> = observer(({ sentence, app }) => {
  if (app.debugMode) {
    const debugWords = sentence.getDebugDisplayText();
    return (
      <div className="sentence-display debug">
        {debugWords.map((word, index) => (
          <span 
            key={index}
            className={word.revealed ? 'word revealed' : 'word unrevealed'}
          >
            {word.text}
            {index < debugWords.length - 1 && ' '}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="sentence-display">
      {sentence.getDisplayText()}
    </div>
  );
});