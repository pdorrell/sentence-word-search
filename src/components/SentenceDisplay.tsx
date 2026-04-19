import { Component } from '@geajs/core';
import { Sentence } from '../models/Sentence';
import { App } from '../models/App';
import { Word } from '../models/Word';

interface SentenceDisplayProps {
  sentence: Sentence;
  app: App;
}

export class SentenceDisplay extends Component<SentenceDisplayProps> {
  template({ sentence, app } = this.props) {
    const getWordClasses = (word: Word) => {
      const classes = ['word'];
      if (word.revealedByUser) {
        classes.push('revealed');
      } else if (!word.revealed) {
        classes.push('unrevealed');
      }
      return classes.join(' ');
    };

    const getWordContent = (word: Word, isDebug: boolean) => {
      if (isDebug) return word.originalText;
      return word.revealed ? word.originalText : '●'.repeat(word.originalText.length);
    };

    return (
      <div class="sentence-container">
        <div class={app.debugMode ? 'sentence-display debug' : 'sentence-display'}>
          {sentence.tokens.map((token, index) => (
            token.type === 'word' ? (
              <span key={index} class={getWordClasses(sentence.words[token.wordIndex!])}>
                {getWordContent(sentence.words[token.wordIndex!], app.debugMode)}
              </span>
            ) : (
              <span key={index} class="non-word">{token.text}</span>
            )
          ))}
        </div>
      </div>
    );
  }
}
