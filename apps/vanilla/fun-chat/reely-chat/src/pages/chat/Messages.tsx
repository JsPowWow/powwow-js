import styles from './chat.module.css';
import { GroupBox } from '../../shared/components/GroupBox';
import { cn } from '@powwow-js/fun-dom';

export const Messages = () => {
  return (
    <GroupBox className={styles.messagesContainer} styles={{ margin: '0', padding: '4px 6px' }} caption='Messages'>
      <article role='tabpanel' class={cn(styles.messagesList, 'has-scrollbar')}>
        <div role='tooltip'>A balloon is better known as tooltip in web development.</div>
        <div role='tooltip'>This balloon is positioned bottom right of the source control (default behavior).</div>
        <div role='tooltip' class='is-bottom is-left'>
          This balloon is positioned bottom left of the source control.
        </div>
        <div role='tooltip' class='is-top is-left'>
          This balloon is positioned top left of the source control.
        </div>
        <div role='tooltip' class='is-top is-right'>
          This balloon is positioned top right of the source control.
        </div>
        <div role='tooltip'>A balloon is better known as tooltip in web development.</div>
        <div role='tooltip'>This balloon is positioned bottom right of the source control (default behavior).</div>
        <div role='tooltip' class='is-bottom is-left'>
          This balloon is positioned bottom left of the source control.
        </div>
        <div role='tooltip' class='is-top is-left'>
          This balloon is positioned top left of the source control.
        </div>
        <div role='tooltip' class='is-top is-right'>
          This balloon is positioned top right of the source control.
        </div>
        <div role='tooltip'>A balloon is better known as tooltip in web development.</div>
        <div role='tooltip'>This balloon is positioned bottom right of the source control (default behavior).</div>
        <div role='tooltip' class='is-bottom is-left'>
          This balloon is positioned bottom left of the source control.
        </div>
        <div role='tooltip' class='is-top is-left'>
          This balloon is positioned top left of the source control.
        </div>
        <div role='tooltip' class='is-top is-right'>
          This balloon is positioned top right of the source control.
        </div>
        <div role='tooltip'>A balloon is better known as tooltip in web development.</div>
        <div role='tooltip'>This balloon is positioned bottom right of the source control (default behavior).</div>
        <div role='tooltip' class='is-bottom is-left'>
          This balloon is positioned bottom left of the source control.
        </div>
        <div role='tooltip' class='is-top is-left'>
          This balloon is positioned top left of the source control.
        </div>
        <div role='tooltip' class='is-top is-right'>
          This balloon is positioned top right of the source control.
        </div>
        <div role='tooltip'>A balloon is better known as tooltip in web development.</div>
        <div role='tooltip'>This balloon is positioned bottom right of the source control (default behavior).</div>
        <div role='tooltip' class='is-bottom is-left'>
          This balloon is positioned bottom left of the source control.
        </div>
        <div role='tooltip' class='is-top is-left'>
          This balloon is positioned top left of the source control.
        </div>
        <div role='tooltip' class='is-top is-right'>
          This balloon is positioned top right of the source control.
        </div>
        <div role='tooltip'>A balloon is better known as tooltip in web development.</div>
        <div role='tooltip'>This balloon is positioned bottom right of the source control (default behavior).</div>
        <div role='tooltip' class='is-bottom is-left'>
          This balloon is positioned bottom left of the source control.
        </div>
        <div role='tooltip' class='is-top is-left'>
          This balloon is positioned top left of the source control.
        </div>
        <div role='tooltip' class='is-top is-right'>
          This balloon is positioned top right of the source control.
        </div>
        <div role='tooltip'>A balloon is better known as tooltip in web development.</div>
        <div role='tooltip'>This balloon is positioned bottom right of the source control (default behavior).</div>
        <div role='tooltip' class='is-bottom is-left'>
          This balloon is positioned bottom left of the source control.
        </div>
        <div role='tooltip' class='is-top is-left'>
          This balloon is positioned top left of the source control.
        </div>
        <div role='tooltip' class='is-top is-right'>
          This balloon is positioned top right of the source control.
        </div>
      </article>
    </GroupBox>
  );
};
