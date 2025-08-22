import React, { useRef, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { App } from '../models/App';

interface TopicInputProps {
  app: App;
}

export const TopicInput: React.FC<TopicInputProps> = observer(({ app }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Debug: collect user preference language info
  const userLanguageInfo = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return { 
        full: [], 
        reduced: [],
        navigatorLanguage: 'navigator undefined',
        userAgent: 'navigator undefined',
        platform: 'navigator undefined'
      };
    }
    
    const full = navigator.languages ? [...navigator.languages] : [];
    const reduced = full.map(lang => {
      const mainLang = lang.split('-')[0].toUpperCase();
      return mainLang.length === 2 ? mainLang : `(skipped: ${lang})`;
    });
    
    // Additional debug info
    const navigatorLanguage = navigator.language || 'undefined';
    const userAgent = navigator.userAgent || 'undefined';
    const platform = navigator.platform || 'undefined';
    
    return { full, reduced, navigatorLanguage, userAgent, platform };
  }, []);

  // Get available languages, including user preferences from navigator.languages
  const availableLanguages = useMemo(() => {
    // Start with the default languages
    const languages = new Set(['EN', 'ES', 'QU']);
    
    // Add user preference languages from browser
    if (typeof navigator !== 'undefined') {
      // Try navigator.languages first (may have multiple languages)
      if (navigator.languages && navigator.languages.length > 0) {
        navigator.languages.forEach(lang => {
          // Extract the main 2-letter language code (e.g., 'en-US' -> 'EN')
          const mainLang = lang.split('-')[0].toUpperCase();
          // Only add 2-letter codes (skip regional variants like 'zh-Hant')
          if (mainLang.length === 2) {
            languages.add(mainLang);
          }
        });
      }
      // Also add navigator.language as fallback (single language)
      else if (navigator.language) {
        const mainLang = navigator.language.split('-')[0].toUpperCase();
        if (mainLang.length === 2) {
          languages.add(mainLang);
        }
      }
    }
    
    // Convert to sorted array for display
    return Array.from(languages).sort();
  }, []);

  // Ensure the current language is valid, or default to the first user preference or EN
  React.useEffect(() => {
    if (!availableLanguages.includes(app.inputLanguage)) {
      // Try to use the first browser language if available, otherwise use EN
      if (navigator.languages && navigator.languages.length > 0) {
        const firstLang = navigator.languages[0].split('-')[0].toUpperCase();
        if (firstLang.length === 2 && availableLanguages.includes(firstLang)) {
          app.setInputLanguage(firstLang);
        } else {
          app.setInputLanguage('EN');
        }
      } else {
        app.setInputLanguage('EN');
      }
    }
  }, [availableLanguages, app]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (app.topicInput.trim() && !app.currentTopic) {
      await app.loadTopic(app.topicInput.trim(), app.inputLanguage.toLowerCase());
    }
  };

  const handleBlur = () => {
    // Only submit on blur if there's input and no topic loaded yet
    if (app.topicInput.trim() && !app.currentTopic) {
      handleSubmit();
    }
  };

  return (
    <div className="topic-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic" title="Enter Wikipedia topic to generate word searches">Topic</label>
        <select
          value={app.inputLanguage}
          onChange={(e) => app.setInputLanguage(e.target.value)}
          disabled={!!app.currentTopic && !app.currentTopic.error}
          className="language-selector"
        >
          {availableLanguages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <input
          ref={inputRef}
          id="topic"
          type="text"
          value={app.topicInput}
          onChange={(e) => app.setTopicInput(e.target.value)}
          onBlur={handleBlur}
          disabled={!!app.currentTopic && !app.currentTopic.error}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="eg tiger"
          title="Enter Wikipedia topic to generate word searches"
        />
      </form>
      {app.currentTopic?.error && (
        <div className="error">{app.currentTopic.error}</div>
      )}
      {/* Debug: Show user preference languages */}
      <div style={{ 
        fontSize: '11px', 
        color: '#666', 
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontFamily: 'monospace',
        lineHeight: '1.4'
      }}>
        <div><strong>Debug - Language Detection:</strong></div>
        <div><strong>navigator.languages:</strong> {userLanguageInfo.full.join(', ') || '(empty array)'}</div>
        <div><strong>navigator.language:</strong> {userLanguageInfo.navigatorLanguage}</div>
        <div><strong>Reduced codes:</strong> {userLanguageInfo.reduced.join(', ') || '(none)'}</div>
        <div><strong>Available in dropdown:</strong> {availableLanguages.join(', ')}</div>
        <div style={{ marginTop: '5px', fontSize: '10px', opacity: 0.7 }}>
          <div><strong>Platform:</strong> {userLanguageInfo.platform}</div>
          <div><strong>User Agent:</strong> {userLanguageInfo.userAgent.substring(0, 100)}...</div>
        </div>
        <div style={{ marginTop: '5px', fontSize: '10px', color: '#999' }}>
          Note: iOS Safari often only exposes the primary language for privacy reasons.
        </div>
      </div>
    </div>
  );
});
