import React from 'react';
import { observer } from 'mobx-react-lite';
import { Sentence } from '../models/Sentence';
import { App } from '../models/App';

interface SentenceDisplayProps {
  sentence: Sentence;
  app: App;
}

export const SentenceDisplay: React.FC<SentenceDisplayProps> = observer(({ sentence, app }) => {
  const renderWord = (originalWord: string, wordIndex: number, isDebug: boolean) => {
    const isRevealed = wordIndex < sentence.words.length ? sentence.words[wordIndex].revealed : true;
    
    // Extract the actual word part (letters only) and punctuation
    const wordMatch = originalWord.match(/^(\W*)(.*?)(\W*)$/);
    if (!wordMatch) return originalWord;
    
    const [, prefix, wordPart, suffix] = wordMatch;
    
    if (isDebug) {
      return (
        <span key={wordIndex}>
          {prefix}
          <span className={isRevealed ? 'word revealed' : 'word unrevealed'}>
            {wordPart}
          </span>
          {suffix}
        </span>
      );
    } else {
      const displayWord = isRevealed ? wordPart : wordPart.replace(/[a-zA-Z]/g, '●');
      return (
        <span key={wordIndex}>
          {prefix}{displayWord}{suffix}
        </span>
      );
    }
  };

  const originalWords = sentence.text.split(/\s+/);
  
  return (
    <div className={app.debugMode ? "sentence-display debug" : "sentence-display"}>
      {originalWords.map((word, index) => (
        <React.Fragment key={index}>
          {renderWord(word, index, app.debugMode)}
          {index < originalWords.length - 1 && ' '}
        </React.Fragment>
      ))}
    </div>
  );
});