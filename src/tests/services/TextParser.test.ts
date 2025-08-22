import { describe, it, expect, beforeEach } from 'vitest';
import { TextParser } from '../../services/TextParser';

describe('TextParser', () => {
  let parser: TextParser;

  beforeEach(() => {
    parser = new TextParser();
  });

  describe('extractSentenceTokens', () => {
    it('should preserve original sentence when tokens are concatenated', () => {
      const testCases = [
        "The quick brown fox jumps over the lazy dog.",
        "Hello, world! How are you?",
        "It's a beautiful day (isn't it?)",
        "The user's data is stored in /home/user/.",
        "Price: $25.99 - what a deal!",
        " Leading space and trailing space ",
        "Multiple   spaces   between   words.",
      ];

      testCases.forEach(originalSentence => {
        const tokens = parser.extractSentenceTokens(originalSentence);
        const reconstructed = tokens.map(token => 
          token.type === 'word' ? token.originalText || token.text : token.text
        ).join('');
        
        expect(reconstructed).toBe(originalSentence);
      });
    });

    it('should correctly identify word and non-word tokens', () => {
      const sentence = "Hello, world! It's nice.";
      const tokens = parser.extractSentenceTokens(sentence);
      
      const expectedTokens = [
        { type: 'word', text: 'HELLO' },
        { type: 'non-word', text: ',' },
        { type: 'non-word', text: ' ' },
        { type: 'word', text: 'WORLD' },
        { type: 'non-word', text: '!' },
        { type: 'non-word', text: ' ' },
        { type: 'word', text: "IT'S" },
        { type: 'non-word', text: ' ' },
        { type: 'word', text: 'NICE' },
        { type: 'non-word', text: '.' },
      ];

      expect(tokens).toHaveLength(expectedTokens.length);
      
      tokens.forEach((token, index) => {
        expect(token.type).toBe(expectedTokens[index].type);
        expect(token.text).toBe(expectedTokens[index].text);
        if (token.type === 'word') {
          expect(token.originalText).toBeDefined();
        }
      });
    });

    it('should handle edge cases', () => {
      const edgeCases = [
        "",
        "   ",
        "word",
        "123",
        "!@#$%",
        "word1 word2",
        "  leading",
        "trailing  ",
      ];

      edgeCases.forEach(sentence => {
        const tokens = parser.extractSentenceTokens(sentence);
        const reconstructed = tokens.map(token => 
          token.type === 'word' ? token.originalText || token.text : token.text
        ).join('');
        expect(reconstructed).toBe(sentence);
      });
    });

    it('should handle Spanish text with accented characters', () => {
      const spanishSentences = [
        "El niño comió una manzana.",
        "¿Cómo estás hoy?",
        "¡Qué día más hermoso!",
        "La señora María José vive en São Paulo.",
        "El café está caliente.",
        "Él habló con ánimo.",
        "La canción número veintitrés.",
      ];

      spanishSentences.forEach(sentence => {
        const tokens = parser.extractSentenceTokens(sentence);
        
        // Verify all accented characters are properly recognized as parts of words
        const reconstructed = tokens.map(token => 
          token.type === 'word' ? token.originalText || token.text : token.text
        ).join('');
        expect(reconstructed).toBe(sentence);
        
        // Check specific words with accents are recognized as single word tokens
        if (sentence.includes('niño')) {
          const ninoToken = tokens.find(t => t.text === 'NIÑO');
          expect(ninoToken).toBeDefined();
          expect(ninoToken?.type).toBe('word');
          expect(ninoToken?.originalText).toBe('niño');
        }
        
        if (sentence.includes('José')) {
          const joseToken = tokens.find(t => t.text === 'JOSÉ');
          expect(joseToken).toBeDefined();
          expect(joseToken?.type).toBe('word');
          expect(joseToken?.originalText).toBe('José');
        }
        
        if (sentence.includes('São')) {
          const saoToken = tokens.find(t => t.text === 'SÃO');
          expect(saoToken).toBeDefined();
          expect(saoToken?.type).toBe('word');
          expect(saoToken?.originalText).toBe('São');
        }
      });
    });

    it('should correctly extract words with accented characters', () => {
      const testCases = [
        { sentence: "El niño juega.", expected: ["El", "niño", "juega"] },
        { sentence: "María José está aquí.", expected: ["María", "José", "está", "aquí"] },
        { sentence: "¿Cómo estás?", expected: ["Cómo", "estás"] },
        { sentence: "café, té y água", expected: ["café", "té", "y", "água"] },
      ];

      testCases.forEach(({ sentence, expected }) => {
        const words = parser.extractWords(sentence);
        expect(words).toEqual(expected);
      });
    });

    it('should handle multiple languages and scripts in the same text', () => {
      const multilingualSentences = [
        // English with Spanish name
        "Maria José lives in New York.",
        // English with French name
        "François works at the café.",
        // Spanish with Arabic name
        "محمد vive en España.",
        // English with Chinese name
        "李明 is my friend.",
        // Russian text
        "Привет, как дела?",
        // Greek text
        "Καλημέρα κόσμε!",
        // Mixed scripts in one sentence
        "The student 李明 met María at the café.",
        // Japanese hiragana, katakana, and kanji
        "こんにちは、カフェで会いましょう。",
        // Korean
        "안녕하세요 세계!",
        // Hebrew
        "שלום עולם!",
      ];

      multilingualSentences.forEach(sentence => {
        const tokens = parser.extractSentenceTokens(sentence);
        
        // Verify reconstruction works correctly
        const reconstructed = tokens.map(token => 
          token.type === 'word' ? token.originalText || token.text : token.text
        ).join('');
        expect(reconstructed).toBe(sentence);
        
        // Verify specific multi-script words are recognized correctly
        if (sentence.includes('María')) {
          const token = tokens.find(t => t.text === 'MARÍA');
          expect(token).toBeDefined();
          expect(token?.type).toBe('word');
        }
        
        if (sentence.includes('محمد')) {
          const token = tokens.find(t => t.originalText === 'محمد');
          expect(token).toBeDefined();
          expect(token?.type).toBe('word');
        }
        
        if (sentence.includes('李明')) {
          const token = tokens.find(t => t.originalText === '李明');
          expect(token).toBeDefined();
          expect(token?.type).toBe('word');
        }
        
        if (sentence.includes('Привет')) {
          const token = tokens.find(t => t.text === 'ПРИВЕТ');
          expect(token).toBeDefined();
          expect(token?.type).toBe('word');
        }
        
        if (sentence.includes('안녕하세요')) {
          const token = tokens.find(t => t.originalText === '안녕하세요');
          expect(token).toBeDefined();
          expect(token?.type).toBe('word');
        }
      });
    });
  });
});