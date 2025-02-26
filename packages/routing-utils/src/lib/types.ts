export type MatchingRoute = {
  url: string;
  pathname: string;
  params: Record<string, string>;
};

export type RouteMatchingResult = { success: true; route: MatchingRoute } | { success: false; error: Error };

export type RoutePath = RegExp | string;
