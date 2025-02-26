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
  isSubRoute: boolean;
  nestedLevel: number;
};

export type RoutesConfig<Handler extends CallableFunction> = {
  pathname: string;
  handler: Handler;
  children?: RoutesConfig<Handler>;
}[];
