import { type RouteDefinition } from '@powwow-js/routing-utils';

export type RouteHandler = (options: {
  dispose: <T extends () => void>(callback: T) => void;
}) => Element | DocumentFragment;

export type RouteLocation = {
  pathname: string;
  params: Record<string, string>;
  search: Record<string, string>;
  hash: string;
};

export type RouteWithLocation<Handler extends RouteHandler> = RouteDefinition<Handler> & RouteLocation;
