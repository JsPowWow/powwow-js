import BaseComponent from '../components/baseComponent';

type Trigger = 'first' | 'last' | 'all' | 'noone';

export default class Pagination extends BaseComponent {
  private readonly prevPage: BaseComponent<'button'> = new BaseComponent({
    tag: 'button',
    content: 'Prev',
  });

  private readonly nextPage: BaseComponent<'button'> = new BaseComponent({
    tag: 'button',
    content: 'Next',
  });

  private readonly pagination: BaseComponent<'section'> = new BaseComponent({
    tag: 'section',
  });

  public getPagination() {
    return this.pagination;
  }

  public getPrevPage() {
    return this.prevPage;
  }

  public getNextPage() {
    return this.nextPage;
  }

  public toggleDisabled(trigger: Trigger) {
    if (trigger === 'first') {
      this.prevPage.setAttribute('disabled', 'true');
      this.nextPage.removeAttribute('disabled');
    }
    if (trigger === 'last') {
      this.nextPage.setAttribute('disabled', 'true');
      this.prevPage.removeAttribute('disabled');
    }
    if (trigger === 'noone') {
      this.prevPage.removeAttribute('disabled');
      this.nextPage.removeAttribute('disabled');
    }
    if (trigger === 'all') {
      this.prevPage.setAttribute('disabled', 'true');
      this.nextPage.setAttribute('disabled', 'true');
    }
  }
}
