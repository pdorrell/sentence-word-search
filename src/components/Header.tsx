import { Component } from '@geajs/core';
import { App } from '../models/App';
import { ConfirmDialog } from './ConfirmDialog';
import { AboutDialog } from './AboutDialog';

interface HeaderProps {
  app: App;
}

export class Header extends Component<HeaderProps> {
  version: string = '';
  showConfirm: boolean = false;
  showAbout: boolean = false;

  created() {
    fetch('/version.txt')
      .then((response) => response.text())
      .then((text) => { this.version = text.trim(); })
      .catch(() => { this.version = ''; });
  }

  handleDebugToggle = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked && !this.props.app.debugMode) {
      this.showConfirm = true;
    } else if (!checked) {
      this.props.app.debugMode = false;
    }
  };

  handleConfirmDebug = () => {
    this.props.app.debugMode = true;
    this.showConfirm = false;
  };

  handleCancelDebug = () => {
    this.showConfirm = false;
  };

  handleCompactToggle = (e: Event) => {
    this.props.app.compactMode = (e.target as HTMLInputElement).checked;
  };

  showAboutDialog = () => { this.showAbout = true; };
  setShowAbout = (open: boolean) => { this.showAbout = open; };

  template({ app } = this.props) {
    return (
      <header class="header">
        <h1>Sentence Word Search</h1>
        <div class="header-controls">
          <span class="version">{this.version}</span>
          <label class="checkbox-label" title="Debug mode">
            <span class="emoji-label">🔍</span>
            <input
              type="checkbox"
              class="debug-toggle"
              checked={app.debugMode}
              change={this.handleDebugToggle}
            />
          </label>
          <label class="checkbox-label" title="Compact mode">
            <span class="emoji-label">📱</span>
            <input
              type="checkbox"
              class="compact-toggle"
              checked={app.compactMode}
              change={this.handleCompactToggle}
            />
          </label>
          <button class="info-button" click={this.showAboutDialog} title="About">ℹ️</button>
        </div>
        <ConfirmDialog
          open={this.showConfirm}
          message="Do you want to cheat by seeing the letters of unsolved words?"
          onConfirm={this.handleConfirmDebug}
          onCancel={this.handleCancelDebug}
        />
        <AboutDialog open={this.showAbout} onOpenChange={this.setShowAbout} />
      </header>
    );
  }
}
