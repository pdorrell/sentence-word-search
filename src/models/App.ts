import { makeAutoObservable } from 'mobx';
import { Topic } from './Topic';
import { Grid } from './Grid';
import { Sentence } from './Sentence';
import { WikipediaService } from '../services/WikipediaService';
import { TextParser } from '../services/TextParser';

export class App {
  currentTopic: Topic | null = null;
  grid: Grid | null = null;
  wikipediaService: WikipediaService;
  textParser: TextParser;
  debugMode: boolean = false;

  constructor(
    wikipediaService: WikipediaService = new WikipediaService(),
    textParser: TextParser = new TextParser()
  ) {
    this.wikipediaService = wikipediaService;
    this.textParser = textParser;
    makeAutoObservable(this);
  }

  calculateGridSize(): number {
    const width = window.innerWidth;
    const height = window.innerHeight - 300;
    const minDimension = Math.min(width, height);
    const cellSize = 40;
    const gridSize = Math.floor(minDimension / cellSize);
    return Math.max(8, Math.min(12, gridSize));
  }

  async loadTopic(word: string, language: string = 'en') {
    const topic = new Topic(word, this);
    topic.loading = true;
    this.currentTopic = topic;
    
    try {
      const text = await this.wikipediaService.fetchFirstParagraph(word, language);
      const sentences = this.textParser.extractSentences(text);
      const limitedSentences = sentences.slice(0, 10);
      
      for (const sentenceText of limitedSentences) {
        topic.addSentence(sentenceText);
        const words = this.textParser.extractWords(sentenceText);
        topic.sentences[topic.sentences.length - 1].parseWords(words);
      }
      
      topic.loading = false;
      
      if (topic.sentences.length > 0) {
        const gridSize = this.calculateGridSize();
        this.grid = new Grid(gridSize, this);
        this.populateGrid();
      }
    } catch (error) {
      topic.loading = false;
      topic.error = `No such topic: ${word}`;
      this.currentTopic = null;
    }
  }

  populateGrid() {
    if (!this.grid || !this.currentTopic?.currentSentence) return;
    
    this.grid.initializeGrid();
    this.grid.correctSelections = [];
    
    const sentence = this.currentTopic.currentSentence;
    const minWordLength = this.getMinWordLength(sentence);
    
    const wordsToPlace = sentence.words.filter(word => 
      word.text.length >= minWordLength
    );
    
    const wordsNotPlaced: typeof wordsToPlace = [];
    
    for (const word of wordsToPlace) {
      if (!this.grid.placeWord(word)) {
        wordsNotPlaced.push(word);
      }
    }
    
    for (const word of wordsNotPlaced) {
      word.reveal();
    }
    
    for (const word of sentence.words) {
      if (word.text.length < minWordLength) {
        word.reveal();
      }
    }
    
    this.grid.fillWithRandomLetters();
  }

  getMinWordLength(sentence: Sentence): number {
    const maxLength = Math.max(...sentence.words.map((w) => w.text.length));
    if (maxLength < 4) return maxLength;
    return 4;
  }

  regenerateGrid() {
    if (this.grid) {
      this.populateGrid();
    }
  }

  resetTopic() {
    this.currentTopic = null;
    this.grid = null;
  }

  get currentSentence(): Sentence | null {
    return this.currentTopic?.currentSentence || null;
  }
}