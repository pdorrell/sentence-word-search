import { FC, observer } from '../framework';
import { Sentence } from '../models/Sentence';
import { App } from '../models/App';
import { Word } from '../models/Word';

interface SentenceDisplayProps {
  sentence: Sentence;
  app: App;
}

export const SentenceDisplay: FC<SentenceDisplayProps> = observer(({ sentence, app }) => {
  const getWordClasses = (word: Word) => {
    const classes = ['word'];
    if (word.revealedByUser) {
      classes.push('revealed');
    } else if (!word.revealed) {
      classes.push('unrevealed');
    }
    // Words that are revealed but not by user (auto-revealed) get no extra class
    return classes.join(' ');
  };

  const getWordContent = (word: Word, isDebug: boolean) => {
    if (isDebug) {
      return word.originalText;
    } else {
      return word.revealed ? word.originalText : '●'.repeat(word.originalText.length);
    }
  };
  
  return (
    <div className="sentence-container">
      <div className={app.debugMode ? "sentence-display debug" : "sentence-display"}>
        {sentence.tokens.map((token, index) => (
          token.type === 'word' ? (
            <span key={index} className={getWordClasses(sentence.words[token.wordIndex!])}>
              {getWordContent(sentence.words[token.wordIndex!], app.debugMode)}
            </span>
          ) : (
            <span key={index} className="non-word">
              {token.text}
            </span>
          )
        ))}
      </div>
    </div>
  );
});