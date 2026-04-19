import { Component } from '@geajs/core';
import { Topic } from '../models/Topic';

interface SentenceSelectorProps {
  topic: Topic;
}

export class SentenceSelector extends Component<SentenceSelectorProps> {
  template({ topic } = this.props) {
    const getSquareClass = (index: number) => {
      const sentence = topic.sentences[index];
      const isCurrent = index === topic.currentSentenceIndex;
      if (sentence.isComplete) {
        return isCurrent ? 'square current complete' : 'square complete';
      } else if (sentence.isStarted) {
        return isCurrent ? 'square current partial' : 'square partial';
      } else {
        return isCurrent ? 'square current' : 'square';
      }
    };

    return (
      <div class="sentence-selector">
        <div class="sentence-selector-inner">
          {topic.sentences.map((_, index) => (
            <div
              key={index}
              class={getSquareClass(index)}
              click={() => topic.setCurrentSentenceIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  }
}
