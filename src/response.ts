import type { Response as SuperAgentResponse } from "superagent";

export const response = (resp: Response) => ({
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
    text: '', // TODO
    body: '', // TODO
}) as SuperAgentResponse;
