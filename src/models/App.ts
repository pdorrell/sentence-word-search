import { makeAutoObservable } from 'mobx';
import { Topic } from './Topic';
import { Grid } from './Grid';
import { Sentence } from './Sentence';
import { WikipediaService } from '../services/WikipediaService';
import { TextParser } from '../services/TextParser';

export class App {
  currentTopic: Topic | null = null;
  wikipediaService: WikipediaService;
  textParser: TextParser;
  debugMode: boolean = false;
  compactMode: boolean = false;
  currentLanguage: string = 'en';
  errorMessage: string | null = null;
  showDisambiguationDialog: boolean = false;
  disambiguationOptions: string[] = [];
  disambiguationTopic: string = '';
  topicInput: string = '';
  inputLanguage: string = 'EN';

  constructor(
    wikipediaService: WikipediaService = new WikipediaService(),
    textParser: TextParser = new TextParser()
  ) {
    this.wikipediaService = wikipediaService;
    this.textParser = textParser;
    // Auto-detect mobile and set compact mode default
    this.compactMode = this.isMobileDevice();
    makeAutoObservable(this);
  }

  isMobileDevice(): boolean {
    return window.innerWidth <= 480;
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
    this.currentLanguage = language;
    this.errorMessage = null;
    
    try {
      const text = await this.wikipediaService.fetchFirstParagraph(word, language);
      const sentences = this.textParser.extractSentences(text);
      
      // Check for disambiguation page (single sentence ending with colon, like "may refer to:" or other patterns)
      if (sentences.length === 1 && sentences[0].trim().endsWith(':')) {
        await this.handleDisambiguation(word, language);
        return;
      }
      
      const limitedSentences = sentences.slice(0, 7);
      
      for (const sentenceText of limitedSentences) {
        topic.addSentence(sentenceText);
        const tokens = this.textParser.extractSentenceTokens(sentenceText);
        topic.sentences[topic.sentences.length - 1].parseTokens(tokens);
      }
      
      topic.loading = false;
      
      if (topic.sentences.length > 0) {
        // Initialize grid for the first sentence
        this.initializeSentenceGrid(topic.sentences[0]);
        // Update input to show the actual loaded topic
        this.topicInput = word;
      }
    } catch (error) {
      topic.loading = false;
      const translations: Record<string, string> = {
        'en': 'Word not found',
        'es': 'Palabra no encontrada',
        'mi': 'Kaore i kitea te kupu',
        'qu': 'Mana tarisqachu'
      };
      
      // Check if this is a "not found" error or another error
      if (error instanceof Error && (error.message === 'Topic not found' || error.message.toLowerCase().includes('not found'))) {
        this.setErrorMessage(translations[language] || translations['en']);
        topic.error = null; // Don't show in the topic input error
      } else {
        // For other errors, show them without translation
        const errorMsg = error instanceof Error ? error.message : 'An error occurred';
        this.setErrorMessage(errorMsg);
        topic.error = null;
      }
      this.currentTopic = null;
    }
  }

  async handleDisambiguation(word: string, language: string) {
    try {
      const options = await this.wikipediaService.fetchDisambiguationLinks(word, language);
      if (options.length > 0) {
        this.disambiguationTopic = word;
        this.disambiguationOptions = options;
        this.showDisambiguationDialog = true;
        this.currentTopic = null; // Clear loading state
      } else {
        // Fallback to original error message if no links found
        const ambiguousTranslations: Record<string, string> = {
          'en': 'Ambiguous topic word',
          'es': 'Palabra temática ambigua',
          'mi': 'Kupu kaupapa rangirua',
          'qu': 'Mana chuyanchasqa tema simi'
        };
        this.setErrorMessage(ambiguousTranslations[language] || ambiguousTranslations['en']);
        this.currentTopic = null;
      }
    } catch (error) {
      // If fetching links fails, show the original disambiguation error
      const ambiguousTranslations: Record<string, string> = {
        'en': 'Ambiguous topic word',
        'es': 'Palabra temática ambigua',
        'mi': 'Kupu kaupapa rangirua',
        'qu': 'Mana chuyanchasqa tema simi'
      };
      this.setErrorMessage(ambiguousTranslations[language] || ambiguousTranslations['en']);
      this.currentTopic = null;
    }
  }

  onDisambiguationSelect(selectedTopic: string) {
    this.showDisambiguationDialog = false;
    this.disambiguationOptions = [];
    this.disambiguationTopic = '';
    // Remove " (disambiguation)" suffix if present for API request
    const topicForApi = selectedTopic.endsWith(' (disambiguation)') 
      ? selectedTopic.slice(0, -' (disambiguation)'.length)
      : selectedTopic;
    // Clean the topic (trim and lowercase) before loading
    const cleanedTopic = topicForApi.trim().toLowerCase();
    this.topicInput = cleanedTopic;
    this.loadTopic(cleanedTopic, this.currentLanguage);
  }

  onDisambiguationCancel() {
    this.showDisambiguationDialog = false;
    this.disambiguationOptions = [];
    this.disambiguationTopic = '';
    this.currentTopic = null;
  }

  initializeSentenceGrid(sentence: Sentence) {
    // Only generate grid if it doesn't exist yet
    if (sentence.grid) return;
    
    const gridSize = this.calculateGridSize();
    sentence.grid = new Grid(gridSize, this);
    
    sentence.grid.initializeGrid();
    sentence.grid.correctSelections = [];
    
    // Set the appropriate alphabet for the grid based on language
    const alphabet = this.getLanguageAlphabet(sentence);
    sentence.grid.setLanguageAlphabet(alphabet);
    
    const minWordLength = this.getMinWordLength(sentence);
    
    const wordsToPlace = sentence.words.filter(word => 
      word.text.length >= minWordLength
    );
    
    const wordsNotPlaced: typeof wordsToPlace = [];
    
    for (const word of wordsToPlace) {
      if (!sentence.grid.placeWord(word)) {
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
    
    sentence.grid.fillWithRandomLetters();
  }

  getMinWordLength(sentence: Sentence): number {
    const maxLength = Math.max(...sentence.words.map((w) => w.text.length));
    if (maxLength < 4) return maxLength;
    return 4;
  }

  getLanguageAlphabet(_sentence: Sentence): string {
    const lang = this.currentLanguage.toUpperCase();
    
    // Define alphabets for fixed languages
    const fixedAlphabets: Record<string, string> = {
      'EN': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'ES': 'AÁEÉIÍOÓUÚBCDFGHJKLMNÑPQRSTVWXYZ', // Spanish with accented vowels and Ñ
      'MI': 'AĀEĒHIĪKMNGOŌPRTUWH', // Māori uses macrons for long vowels
      'QU': 'ACHIJKLMNÑPQRSTUWXY' // Quechua
    };
    
    // If it's a fixed language, use its known alphabet
    if (fixedAlphabets[lang]) {
      return fixedAlphabets[lang];
    }
    
    // For other languages, extract unique letters from all sentences
    const lettersSet = new Set<string>();
    
    // Get all sentences from the current topic
    if (this.currentTopic) {
      for (const sent of this.currentTopic.sentences) {
        // Extract all alphabetic characters from the sentence text
        const text = sent.text;
        for (const char of text) {
          // Check if it's a letter using Unicode properties
          if (/\p{L}/u.test(char)) {
            // Convert to uppercase if possible
            const upperChar = char.toUpperCase();
            // Only add if it's truly uppercase (some scripts don't have case)
            if (upperChar === upperChar.toUpperCase()) {
              lettersSet.add(upperChar);
            }
          }
        }
      }
    }
    
    // Convert set to string and sort for consistency
    const uniqueLetters = Array.from(lettersSet).sort().join('');
    
    // If we didn't find enough letters, fall back to English alphabet
    if (uniqueLetters.length < 10) {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    return uniqueLetters;
  }

  resetTopic() {
    this.currentTopic = null;
    this.errorMessage = null;
    this.topicInput = '';
  }

  setTopicInput(value: string) {
    this.topicInput = value;
  }

  setInputLanguage(language: string) {
    this.inputLanguage = language;
  }
  
  setErrorMessage(message: string) {
    this.errorMessage = message;
    // Clear error after 3 seconds
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
  
  clearErrorMessage() {
    this.errorMessage = null;
  }

  get currentSentence(): Sentence | null {
    return this.currentTopic?.currentSentence || null;
  }
}