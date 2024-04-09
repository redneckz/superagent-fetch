import type { Response as SAResponse } from 'superagent';

// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
const bodyHandlers = {
  '': (_: Response) => _.text(),
  text: (_: Response) => _.text(),
  json: (_: Response) => _.json() as Promise<object>,
  arraybuffer: (_: Response) => _.arrayBuffer(),
  blob: (_: Response) => _.blob(),
};

// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
export type ResponseType = keyof typeof bodyHandlers;

// Partial implementation
export const SuperAgentResponse = (responseType: ResponseType) => async (resp: Response) => {
  const body = await bodyHandlers[responseType](resp);

  return {
    ok: resp.ok,
    accepted: resp.status === 202,
    info: resp.status === 203,
    noContent: resp.status === 204,
    redirect: resp.status >= 300 && resp.status <= 308,
    badRequest: resp.status === 400,
    unauthorized: resp.status === 401,
    forbidden: resp.status === 403,
    notFound: resp.status === 404,
    notAcceptable: resp.status === 406,
    clientError: resp.status >= 400 && resp.status < 500,
    error: resp.status >= 400,
    serverError: resp.status >= 500,
    status: resp.status,
    statusType: resp.status,
    get(key) {
      return resp.headers.get(key);
    },
    get headers() {
      return Object.fromEntries(resp.headers);
    },
    redirects: resp.headers.has('Location') ? [resp.headers.get('Location')] : [],
    get text() {
      return typeof body === 'string' ? body : '';
    },
    get body() {
      return body && typeof body === 'string' ? JSON.parse(body) : body;
    },
  } as SAResponse;
};
