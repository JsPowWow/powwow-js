export type MatchingRoute = {
  searchedTerm: string;
  pathname: string;
  params: Record<string, string>;
};

export type RouteMatchingResult = { success: true; route: MatchingRoute } | { success: false; error: Error };

export type RoutePath = RegExp | string;

export type RouteDefinition<Handler extends CallableFunction> = {
  handler: Handler;
  params: Record<string, string>;
};

export type RouteConfig<Handler extends CallableFunction, P extends string = string> = {
  pathname: P;
  handler: Handler;
  children?: RoutesConfig<Handler>;
};

// TODO AR del this
export type RoutesConfig<Handler extends CallableFunction, P extends string = string> = RouteConfig<Handler, P>[];
