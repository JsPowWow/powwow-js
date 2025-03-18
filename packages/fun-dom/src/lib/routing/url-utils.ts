/* eslint-disable */
export function removeQueryParams(path: string) {
  const paramsPos = path.indexOf('?');
  return paramsPos > -1 ? path.slice(0, paramsPos) : path;
}
export function removeHash(path: string) {
  const hashPosition = path.indexOf('#');
  return hashPosition > -1 ? path.slice(0, hashPosition) : path;
}

export function removeQueryParamsAndHash(path: string) {
  const pathWithoutHash = removeHash(path);
  return removeQueryParams(pathWithoutHash);
}

export function getHash(path: string) {
  const str = path.lastIndexOf('#');
  return str > -1 ? path.slice(str) : '';
}

export function getQueryString(path: string) {
  const pathWithoutHash = removeHash(path);
  const str = pathWithoutHash.indexOf('?');
  if (str > -1) {
    const queryString = pathWithoutHash.slice(str + 1);
    const queryStringArr = queryString.split('&');

    return queryStringArr.reduce((obj, queryParams) => {
      const [key, value] = queryParams.split('=');

      return { ...obj, [key as string]: value };
    }, {});
  }
  return {};
}

export type PushHistory = {
  addToHistory?: boolean;
  state?: Record<string, string>;
};

export function updateHistory({
  addToHistory,
  replaceState,
  state,
  pathname,
}: PushHistory & {
  pathname: string;
  replaceState?: boolean;
}) {
  if (replaceState) {
    history.replaceState(state, '', pathname);
  } else if (addToHistory) {
    history.pushState({ ...state, pathname }, '', pathname);
  }
}
