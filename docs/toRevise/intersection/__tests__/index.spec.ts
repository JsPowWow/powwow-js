import { observeItemsIntersection } from '../index';

class IntersectionObserverMock {
  private readonly options: object;
  private readonly callback: () => void;

  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe(target) {
    this.callback([{ target, intersectionRatio: 0.5 }]);
  }

  disconnect() {
    // do nothing
  }
}

class ElementMock {}

describe('observeItemsIntersection', () => {
  let originalIntersectionObserver;

  beforeAll(() => {
    originalIntersectionObserver = window.IntersectionObserver;
    window.IntersectionObserver = IntersectionObserverMock;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIntersectionObserver;
  });

  test('should call onChange with the correct percentage', () => {
    const items = [new ElementMock(), new ElementMock(), new ElementMock()];
    const onChangeMock = jest.fn();

    const cleanup = observeItemsIntersection({
      items,
      onChange: onChangeMock,
    });

    expect(onChangeMock).toHaveBeenCalledWith(50);

    cleanup();
  });
});
