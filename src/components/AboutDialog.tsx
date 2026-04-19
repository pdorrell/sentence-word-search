import { Component } from '@geajs/core';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export class AboutDialog extends Component<AboutDialogProps> {
  template({ open, onOpenChange } = this.props) {
    const close = () => onOpenChange(false);
    return (
      <div>
        {open && <div class="modal-overlay" click={close} />}
        {open && (
          <div class="modal-content about-modal">
            <h2>Sentence Word Search</h2>
            <ul>
              <li>
                Choose a language and enter a Wikipedia topic word to generate
                word searches from sentences in the first paragraph of the
                Wikipedia page.
              </li>
              <li>
                Note: the topic word is passed directly to the Wikipedia API,
                so it has to be spelled exactly the same as how Wikipedia
                spells the word in the title of the page. (For example,
                with language "FR", "café" will work, but "cafe" won't.)
              </li>
            </ul>
            <p class="copyright">
              <span>© Philip Dorrell 2025</span>
              <a href="https://github.com/pdorrell/sentence-word-search" target="_blank" rel="noopener noreferrer">Source</a>
            </p>
            <div class="modal-buttons">
              <button class="modal-ok" click={close}>OK</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
