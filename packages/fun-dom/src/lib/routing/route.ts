import { RouteHandler, RouteLocation, RouteWithLocation } from './types';
import { getMatchingRoutes, parseConfig, RouteDefinition, RoutesConfig } from '@powwow-js/routing-utils';
import { getHash, getQueryString, PushHistory, removeQueryParamsAndHash, updateHistory } from './url-utils';

const BrowserRouteType = 'BrowserRoute';
const HashRouteType = 'HashRoute';

export type RouteType = typeof BrowserRouteType | typeof HashRouteType;

class RouterManagement<Handler extends RouteHandler> {
  #routes: Record<string, RouteDefinition<Handler>> = {};
  #disposeCb: Record<string, () => void> = {};
  routeType: RouteType = BrowserRouteType;
  #location: RouteLocation = {
    pathname: '/',
    params: {},
    search: {},
    hash: '',
  };

  constructor() {
    this.dispose = this.dispose.bind(this);
  }

  #getRoute(searchedPathname: string): RouteWithLocation<Handler> {
    console.log(`getRoute for ${searchedPathname}`, this.#routes);
    const matchingRoutes = getMatchingRoutes(Object.keys(this.#routes), removeQueryParamsAndHash(searchedPathname));
    console.log('', matchingRoutes);

    const matchingRoute = matchingRoutes.find(({ pathname }) => pathname !== '*') ?? matchingRoutes[0];
    const route = this.#routes[matchingRoute.pathname];
    console.log('~~found one', matchingRoute);
    return {
      ...route,
      pathname: matchingRoute.searchedTerm,
      search: getQueryString(searchedPathname),
      hash: getHash(searchedPathname),
    };
  }

  #directRoute(routeRenderEle: Element[], routeData: RouteWithLocation<Handler>) {
    const { nestedLevel, handler } = routeData;
    const routeEle = routeRenderEle[nestedLevel];
    if (routeEle) {
      routeEle.innerHTML = '';
      routeEle.appendChild(handler({ dispose: this.dispose }));
    }
  }

  #directNestedRoute(searchPathname: string, routeData: RouteWithLocation<Handler>) {
    const { nestedLevel, pathname } = routeData;

    const renderRouteEle = Array.from(document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]'));

    // number of the sub-route element which have the content
    const routeElementsLen = renderRouteEle.length - 1;

    const cleanPath = removeQueryParamsAndHash(searchPathname).split('/');

    // with/without existing route path
    const pathArr = pathname === '*' ? cleanPath.slice(1) : cleanPath.slice(1, nestedLevel + 2);

    // search for the path whose router element doesn't exist in the DOM
    const searchPathArr = pathArr.splice(routeElementsLen);

    // route for which we have to render its route element
    let nextPath = routeElementsLen > 0 ? `/${pathArr.splice(0, routeElementsLen).join('/')}` : '';
    const fragment = document.createDocumentFragment();

    for (const [index, path] of searchPathArr.entries()) {
      const renderEleFragment = Array.from(fragment.querySelectorAll('[data-vanilla-route-ele="router-wrap"]'));
      const routeFragmentEle = index === 0 ? fragment : renderEleFragment[index - 1];

      const routeInfo = this.#getRoute(`${nextPath}/${path}`);
      nextPath += `/${path}`;
      if (routeInfo.pathname === '*') {
        routeFragmentEle.appendChild(this.#routes['*'].handler({ dispose: this.dispose }));
        break;
      } else {
        routeFragmentEle.appendChild(routeInfo.handler({ dispose: this.dispose }));
      }
    }

    const routeEle = renderRouteEle[routeElementsLen]; //  route element in which subRoute element will be rendered
    if (routeEle) {
      routeEle.innerHTML = '';
      routeEle.appendChild(fragment);
    }
  }

  #unMount() {
    const { pathname } = this.getLocation();
    this.#disposeCb[pathname]?.();
    delete this.#disposeCb[pathname];
  }

  #isNotSameRoute(searchPathname: string) {
    const { pathname } = this.getLocation();
    console.log('isNotSameRoute', pathname === '/' || pathname !== searchPathname, {
      pathname,
      searchPathname,
    });
    return pathname === '/' || pathname !== searchPathname;
  }

  #routePath(pathname: string) {
    if (this.routeType === HashRouteType) {
      return pathname.slice(2);
    }
    return pathname;
  }

  #setLocation(obj: RouteLocation) {
    this.#location = obj;
  }
  getLocation(): RouteLocation {
    return this.#location;
  }

  #push(searchPathname: string, options?: PushHistory, replaceState = false) {
    const routePath = this.#routePath(searchPathname);
    if (this.#isNotSameRoute(routePath)) {
      const { state = {}, addToHistory = true } = options ?? {};
      const routeData = this.#getRoute(routePath);
      const { params, search, hash, pathname, nestedLevel } = routeData;

      this.#unMount();

      this.#setLocation({ pathname: routePath, params, search, hash });

      updateHistory({
        addToHistory,
        replaceState,
        state,
        pathname: searchPathname,
      });

      const routeRenderEle = Array.from(document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]'));

      // direct accessing the route
      if (routeRenderEle.length - 1 >= nestedLevel && pathname !== '*') {
        this.#directRoute(routeRenderEle, routeData);
      }
      // route by route access to the nested route
      else {
        this.#directNestedRoute(routePath, routeData);
      }

      // on route change, page should start from the top
      window.scrollTo(0, 0);
    }
  }

  // route change
  go(searchPathname: string, options?: PushHistory) {
    console.log('~~go', searchPathname);
    if (this.routeType === HashRouteType && !searchPathname.startsWith('/#')) {
      searchPathname = `/#` + searchPathname;
    }

    this.#push(searchPathname, options);
  }

  dispose<T extends () => void>(cb: T) {
    if (cb) {
      const { pathname } = this.getLocation();
      this.#disposeCb[pathname] = cb;
    }
  }

  replace(searchPathname: string, state?: PushHistory['state']) {
    let pathname = searchPathname;
    if (this.routeType === HashRouteType) {
      pathname = `/#${searchPathname}`;
    }
    this.#push(pathname, { state, addToHistory: false }, true);
  }

  // route config
  config(routeData: RoutesConfig<Handler>, basePath = '') {
    this.#routes = parseConfig(routeData, basePath);
  }
}

class RouterSetup<Handler extends RouteHandler> extends RouterManagement<Handler> {
  #routeSetup = false;

  #init(routeType: RouteType, routes: RoutesConfig<Handler>) {
    this.routeType = routeType;
    this.#checkRouteSetup();
    this.config(routes);
    this.#backListener();
    this.#addListener();
  }

  #backListener() {
    window.addEventListener('popstate', (event: PopStateEvent) => {
      const { pathname = '' } = event.state || {};
      if (pathname) {
        this.go(pathname as string, { state: {}, addToHistory: false });
      }
    });
  }

  #addListener() {
    const links = document.querySelectorAll('a[data-vanilla-route-link="spa"]');
    if (links) {
      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const href = (event.target as Element).getAttribute('href') ?? '';
          this.go(href);
        });
      });
    }
  }

  #checkRouteSetup() {
    if (this.#routeSetup) {
      this.go('/404');
      throw new Error('In the application you can only have 1 Route setup using either browserRoute() or hashRoute().');
    }
    this.#routeSetup = true;
  }

  #appendHash() {
    const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[data-vanilla-route-link="spa"]');
    if (links) {
      links.forEach((link) => {
        const pathname = link.href.slice(link.origin.length);
        link.href = `/#${pathname}`;
      });
    }
  }

  // initial browser route
  createBrowserRoute(routeData: RoutesConfig<Handler>) {
    const { origin, href } = new URL(window.location.href);
    this.#init(BrowserRouteType, routeData);
    const pathname = href.slice(origin.length);
    this.go(pathname);
  }

  // initial hash route
  createHashRoute(routeData: RoutesConfig<Handler>) {
    const { origin, href } = new URL(window.location.href);
    this.#init(HashRouteType, routeData);
    let pathname = href.slice(origin.length);
    this.#appendHash();
    if (!pathname.startsWith('/#')) {
      pathname = `/#${pathname}`;
      window.location.href = `${origin}${pathname}`;
    }
    this.go(pathname);
  }
}

const router = new RouterSetup();

const setupBrowserRouter = <Handler extends RouteHandler>(routes: RoutesConfig<Handler>) =>
  router.createBrowserRoute(routes);

const setupHashRouter = <Handler extends RouteHandler>(routes: RoutesConfig<Handler>) => router.createHashRoute(routes);

const Router = {
  refresh() {
    window.location.reload();
  },
  back() {
    window.history.back();
  },
  forward() {
    window.history.forward();
  },
  go(searchPathname: string, options?: PushHistory) {
    return router.go(searchPathname, options);
  },
  replace(searchPathname: string, state?: PushHistory['state']) {
    router.replace(searchPathname, state);
  },
  getLocation() {
    return router.getLocation();
  },
};

export { setupBrowserRouter, setupHashRouter, Router };
