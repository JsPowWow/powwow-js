import { findMatchingRoute } from './match-path';
import { expect } from 'vitest';
import { noop } from '@powwow-js/nullable';

describe('findMatchingRoute', () => {
  const routes = Object.keys({
    '/': noop,
    '/main': noop,
    '/main#index': noop,
    '/details/:id': noop,
    '/about': noop,
    '/details/:detailsId/entity/:entityId': noop,
    '/lang/*': noop,
  });
  it('should find and create matching route per provided url', () => {
    expect(findMatchingRoute(routes, '/lang/en')).toMatchObject({ success: true });
    expect(findMatchingRoute(routes, '/lang/ru')).toMatchObject({ success: true });
    expect(findMatchingRoute(routes, '/main')).toMatchObject({ success: true });
    expect(findMatchingRoute(routes, '/main#index')).toMatchObject({ success: true });
    expect(findMatchingRoute(routes, '/')).toMatchObject({ success: true });
    expect(findMatchingRoute(routes, '/about')).toMatchObject({ success: true });
    expect(findMatchingRoute(routes, '/details/20/entity/15')).toMatchSnapshot();

    expect(findMatchingRoute(routes, '/ma')).toMatchObject({ success: false });
  });
});
