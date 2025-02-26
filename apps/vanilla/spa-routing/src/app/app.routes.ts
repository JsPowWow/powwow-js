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
      const btn = document.createElement('button');
      btn.innerText = 'Refresh';
      btn.onclick = () => {
        Router.refresh();
      };
      ele.appendChild(btn);
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
      fragment.appendChild(ele);
      const section = document.createElement('section');
      section.setAttribute('data-vanilla-route-ele', 'router-wrap');
      fragment.appendChild(section);
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
      ele.innerText = '>> 404 Page not found <<';
      return ele;
    },
  },
  {
    pathname: '/',
    handler: () => {
      const ele = document.createElement('h2');
      ele.innerText = 'HOME PAGE';
      return ele;
    },
  },
  {
    pathname: '/about',
    handler: ({ dispose }) => {
      const ele = document.createElement('h2');
      ele.innerText = 'ABOUT PAGE';
      const btn = document.createElement('button');
      btn.innerText = 'Take me to the About page with details';
      btn.onclick = () => {
        Router.go('/about/frontend-dev');
      };
      ele.appendChild(btn);
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
      ele.innerText = `ABOUT PAGE with details about ${Router.getLocation().params.id}`;

      const btnBack = document.createElement('button');
      btnBack.innerText = 'Go back';
      btnBack.onclick = () => {
        console.log('Bye Bye from About page');
        Router.back();
      };
      const btnForward = document.createElement('button');
      btnForward.innerText = 'Go Forward';
      btnForward.onclick = () => {
        Router.forward();
      };

      ele.appendChild(btnBack);
      ele.appendChild(btnForward);
      return ele;
    },
  },
  {
    pathname: '/learn',
    handler: () => {
      const fragment = document.createDocumentFragment();
      const ele = document.createElement('h2');
      ele.innerText = 'LEARN PAGE';
      fragment.appendChild(ele);
      const btn = document.createElement('button');
      btn.innerText = 'Replace with css page';
      btn.onclick = () => {
        Router.replace('/learn/css');
      };
      fragment.appendChild(btn);
      const section = document.createElement('section');
      section.setAttribute('data-vanilla-route-ele', 'router-wrap');
      fragment.appendChild(section);
      return fragment;
    },
    children: learnRoutes,
  },
];
