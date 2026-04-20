import { FC, Dialog } from '../framework';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog: FC<AboutDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content about-modal">
          <Dialog.Title asChild>
            <h2>Sentence Word Search</h2>
          </Dialog.Title>
          <Dialog.Description asChild>
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
          </Dialog.Description>
          <p className="copyright">
            <span>© Philip Dorrell 2025</span>
            <a href="https://github.com/pdorrell/sentence-word-search" target="_blank" rel="noopener noreferrer">Source</a>
          </p>
          <div className="modal-buttons">
            <Dialog.Close asChild>
              <button className="modal-ok">
                OK
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
