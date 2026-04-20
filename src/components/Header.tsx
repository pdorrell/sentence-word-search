import { useState, useEffect, FC, ChangeEvent, observer } from '../framework';
import { App } from '../models/App';
import { ConfirmDialog } from './ConfirmDialog';
import { AboutDialog } from './AboutDialog';

interface HeaderProps {
  app: App;
}

export const Header: FC<HeaderProps> = observer(({ app }) => {
  const [version, setVersion] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    fetch('/version.txt')
      .then(response => response.text())
      .then(text => setVersion(text.trim()))
      .catch(() => setVersion(''));
  }, []);

  const handleDebugToggle = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && !app.debugMode) {
      setShowConfirm(true);
    } else if (!e.target.checked) {
      app.debugMode = false;
    }
  };

  const handleConfirmDebug = () => {
    app.debugMode = true;
    setShowConfirm(false);
  };

  const handleCancelDebug = () => {
    setShowConfirm(false);
  };

  const handleCompactToggle = (e: ChangeEvent<HTMLInputElement>) => {
    app.compactMode = e.target.checked;
  };

  return (
    <header className="header">
      <h1>Sentence Word Search</h1>
      <div className="header-controls">
        <span className="version">{version}</span>
        <label className="checkbox-label" title="Debug mode">
          <span className="emoji-label">🔍</span>
          <input 
            type="checkbox" 
            className="debug-toggle"
            checked={app.debugMode}
            onChange={handleDebugToggle}
          />
        </label>
        <label className="checkbox-label" title="Compact mode">
          <span className="emoji-label">📱</span>
          <input 
            type="checkbox" 
            className="compact-toggle"
            checked={app.compactMode}
            onChange={handleCompactToggle}
          />
        </label>
        <button className="info-button" onClick={() => setShowAbout(true)} title="About">
          ℹ️
        </button>
      </div>
      <ConfirmDialog
        open={showConfirm}
        message="Do you want to cheat by seeing the letters of unsolved words?"
        onConfirm={handleConfirmDebug}
        onCancel={handleCancelDebug}
      />
      <AboutDialog open={showAbout} onOpenChange={setShowAbout} />
    </header>
  );
});