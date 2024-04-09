export const composeURL = (url: string, params: Record<string, string> = {}): string => {
  const [baseURL, baseParams] = url.split('?');
  const queryStr = [new URLSearchParams(baseParams || {}), new URLSearchParams(params)]
    .map(String)
    .filter(Boolean)
    .join('&');

  return [baseURL, queryStr].filter(Boolean).join('?');
};
