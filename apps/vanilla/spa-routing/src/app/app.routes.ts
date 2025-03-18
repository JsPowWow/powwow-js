/* eslint-disable */
import { RouteHandler, Router } from '@powwow-js/fun-dom';
import { RoutesConfig } from '@powwow-js/routing-utils';

// export const AppRoutes: RoutesConfig<() => Element | DocumentFragment> = {
//   '/main': {
//     handler: () => {
//       return document.createElement('div');
//     },
//   },
// };

const learnJsRoute: RoutesConfig<RouteHandler> = [
  {
    pathname: '/library-creation',
    handler: () => {
      const ele = document.createElement('h4');
      ele.innerText = 'Learning JS library creation';
      return ele;
    },
  },
  {
    pathname: '/library-publishing',
    handler: () => {
      const ele = document.createElement('h4');
      ele.innerText = 'Learning JS library publishing';
      const button = document.createElement('button');
      button.innerText = 'Refresh';
      button.addEventListener('click', () => {
        Router.refresh();
      });
      ele.append(button);
      return ele;
    },
  },
];

const learnRoutes: RoutesConfig<RouteHandler> = [
  {
    pathname: '/js',
    handler: () => {
      const fragment = document.createDocumentFragment();
      const ele = document.createElement('h3');
      ele.innerText = 'Learning JS';
      fragment.append(ele);
      const section = document.createElement('section');
      section.dataset.vanillaRouteEle = 'router-wrap';
      fragment.append(section);
      return fragment;
    },
    children: learnJsRoute,
  },
  {
    pathname: '/css',
    handler: ({ dispose }) => {
      const ele = document.createElement('h3');
      dispose(() => {
        console.log('Dispose: Bye Bye from CSS Page');
      });
      ele.innerText = 'Learning CSS';
      return ele;
    },
  },
];

export const routeConfig: RoutesConfig<RouteHandler> = [
  {
    pathname: '*',
    handler: () => {
      const ele = document.createElement('h3');
      ele.textContent = '>> 404 Page not found <<';
      return ele;
    },
  },
  {
    pathname: '/',
    handler: () => {
      const ele = document.createElement('h2');
      ele.textContent = 'HOME PAGE';
      return ele;
    },
  },
  {
    pathname: '/about',
    handler: ({ dispose }) => {
      const ele = document.createElement('h2');
      ele.textContent = 'ABOUT PAGE';
      const button = document.createElement('button');
      button.textContent = 'Take me to the About page with details';
      button.addEventListener('click', () => {
        Router.go('/about/frontend-dev');
      });
      ele.append(button);
      dispose(() => {
        console.log('Dispose: Bye Bye from About Page');
      });
      return ele;
    },
  },
  {
    pathname: '/about/:id',
    handler: () => {
      const ele = document.createElement('h2');
      ele.textContent = `ABOUT PAGE with details about ${Router.getLocation().params.id}`;

      const buttonBack = document.createElement('button');
      buttonBack.textContent = 'Go back';
      buttonBack.addEventListener('click', () => {
        console.log('Bye Bye from About page');
        Router.back();
      });
      const buttonForward = document.createElement('button');
      buttonForward.innerText = 'Go Forward';
      buttonForward.addEventListener('click', () => {
        Router.forward();
      });

      ele.append(buttonBack);
      ele.append(buttonForward);
      return ele;
    },
  },
  {
    pathname: '/learn',
    handler: () => {
      const fragment = document.createDocumentFragment();
      const ele = document.createElement('h2');
      ele.innerText = 'LEARN PAGE';
      fragment.append(ele);
      const button = document.createElement('button');
      button.innerText = 'Replace with css page';
      button.addEventListener('click', () => {
        Router.replace('/learn/css');
      });
      fragment.append(button);
      const section = document.createElement('section');
      section.dataset.vanillaRouteEle = 'router-wrap';
      fragment.append(section);
      return fragment;
    },
    children: learnRoutes,
  },
];
