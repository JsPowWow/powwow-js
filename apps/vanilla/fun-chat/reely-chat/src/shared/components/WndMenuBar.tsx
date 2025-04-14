import { hasProperty } from '@powwow-js/core';
import { cn } from '@powwow-js/fun-dom';

export interface WndMenuBarProps {
  items: {
    caption: string;
    menu: {
      divider?: boolean;
      content: unknown;
    }[];
  }[];
}

export const WndMenuBar = ({ items = [] }: WndMenuBarProps) => {
  return (
    <ul role='menubar'>
      {items.map((item) => {
        return (
          <li role='menuitem' tabindex='0' aria-haspopup='true'>
            {item.caption}
            <ul role='menu'>
              {item.menu.map((menuItem) => {
                if (hasProperty('content', menuItem)) {
                  return (
                    <li role='menuitem' class={cn({ 'has-divider': menuItem.divider })}>
                      {menuItem.content}
                    </li>
                  );
                }
                return <li role='menuitem'>{menuItem}</li>;
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};
