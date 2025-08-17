import React from 'react';
import { observer } from 'mobx-react-lite';
import { Sentence } from '../models/Sentence';
import { App } from '../models/App';
import { Word } from '../models/Word';

interface SentenceDisplayProps {
  sentence: Sentence;
  app: App;
}

export const SentenceDisplay: React.FC<SentenceDisplayProps> = observer(({ sentence, app }) => {
  const renderWord = (word: Word, wordIndex: number, isDebug: boolean) => {
    const isRevealed = word.revealed;
    const revealedByUser = word.revealedByUser;
    
    const getWordClass = () => {
      if (!isRevealed) return 'word unrevealed';
      if (revealedByUser) return 'word revealed-by-user';
      return 'word pre-revealed';
    };

    if (isDebug) {
      return (
        <span key={wordIndex}>
          <span className={getWordClass()}>
            {word.originalText}
          </span>
        </span>
      );
    } else {
      const displayWord = isRevealed ? word.originalText : '●'.repeat(word.originalText.length);
      return (
        <span key={wordIndex}>
          <span className={getWordClass()}>
            {displayWord}
          </span>
        </span>
      );
    }
  };
  
  return (
    <div className={app.debugMode ? "sentence-display debug" : "sentence-display"}>
      {sentence.words.map((word, index) => (
        <React.Fragment key={index}>
          {renderWord(word, index, app.debugMode)}
          {index < sentence.words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </div>
  );
});