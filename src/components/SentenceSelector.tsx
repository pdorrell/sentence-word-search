import { FC, observer } from '../framework';
import { Topic } from '../models/Topic';

interface SentenceSelectorProps {
  topic: Topic;
}

export const SentenceSelector: FC<SentenceSelectorProps> = observer(({ topic }) => {
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
    <div className="sentence-selector">
      <div className="sentence-selector-inner">
        {topic.sentences.map((_, index) => (
          <div
            key={index}
            className={getSquareClass(index)}
            onClick={() => topic.setCurrentSentenceIndex(index)}
          />
        ))}
      </div>
    </div>
  );
});