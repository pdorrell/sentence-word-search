import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../models/App';
import { WikipediaServiceDouble } from '../testDoubles/WikipediaServiceDouble';
import { TextParserDouble } from '../testDoubles/TextParserDouble';

describe('App Model', () => {
  let app: App;
  let wikipediaService: WikipediaServiceDouble;
  let textParser: TextParserDouble;

  beforeEach(() => {
    wikipediaService = new WikipediaServiceDouble();
    textParser = new TextParserDouble();
    app = new App(wikipediaService, textParser);
  });

  it('should initialize with no current topic', () => {
    expect(app.currentTopic).toBeNull();
    expect(app.grid).toBeNull();
  });

  it('should load a topic successfully', async () => {
    wikipediaService.setResponse('elephant', 'Elephants are large mammals. They have trunks.');
    textParser.setSentences(['Elephants are large mammals', 'They have trunks']);
    
    await app.loadTopic('elephant');
    
    expect(app.currentTopic).not.toBeNull();
    expect(app.currentTopic?.word).toBe('elephant');
    expect(app.currentTopic?.sentences).toHaveLength(2);
    expect(app.grid).not.toBeNull();
  });

  it('should handle topic load failure', async () => {
    wikipediaService.setShouldFail(true);
    
    await app.loadTopic('nonexistent');
    
    expect(app.currentTopic).toBeNull();
    expect(app.grid).toBeNull();
  });

  it('should limit sentences to 10', async () => {
    const manySentences = Array(15).fill('Test sentence').map((s, i) => `${s} ${i}`);
    textParser.setSentences(manySentences);
    
    await app.loadTopic('test');
    
    expect(app.currentTopic?.sentences).toHaveLength(10);
  });

  it('should calculate appropriate grid size', () => {
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 900, writable: true });
    
    const size = app.calculateGridSize();
    
    expect(size).toBeGreaterThanOrEqual(8);
    expect(size).toBeLessThanOrEqual(12);
  });

  it('should reset topic correctly', async () => {
    await app.loadTopic('test');
    expect(app.currentTopic).not.toBeNull();
    
    app.resetTopic();
    
    expect(app.currentTopic).toBeNull();
    expect(app.grid).toBeNull();
  });
});