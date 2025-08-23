import React from 'react';
import {
  Root,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close
} from '@radix-ui/react-dialog';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Overlay className="modal-overlay" />
        <Content className="modal-content about-modal">
          <Title asChild>
            <h2>Sentence Word Search</h2>
          </Title>
          <Description asChild>
            <ul>
              <li>
                Choose a language and enter a Wikipedia topic word to generate
                word searches from sentences in the first paragraph of the
                Wikipedia page.
              </li>
            </ul>
          </Description>
          <p className="copyright">
            <span>© Philip Dorrell 2025</span>
            <a href="https://github.com/pdorrell/sentence-word-search" target="_blank" rel="noopener noreferrer">Source</a>
          </p>
          <div className="modal-buttons">
            <Close asChild>
              <button className="modal-ok">
                OK
              </button>
            </Close>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};