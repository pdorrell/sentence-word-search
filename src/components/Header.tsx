import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { App } from '../models/App';
import { ConfirmDialog } from './ConfirmDialog';

interface HeaderProps {
  app: App;
}

export const Header: React.FC<HeaderProps> = observer(({ app }) => {
  const [version, setVersion] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch('/version.txt')
      .then(response => response.text())
      .then(text => setVersion(text.trim()))
      .catch(() => setVersion(''));
  }, []);

  const handleDebugToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <header className="header">
      <h1>Sentence Word Search</h1>
      <div className="header-controls">
        <span className="version">{version}</span>
        <input 
          type="checkbox" 
          className="debug-toggle"
          checked={app.debugMode}
          onChange={handleDebugToggle}
        />
      </div>
      {showConfirm && (
        <ConfirmDialog
          message="Do you want to cheat by seeing the letters of unsolved words?"
          onConfirm={handleConfirmDebug}
          onCancel={handleCancelDebug}
        />
      )}
    </header>
  );
});