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
  });
});