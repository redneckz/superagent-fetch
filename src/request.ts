import type { Response, SuperAgentRequest } from 'superagent';
import { response } from './response';

export type CallbackHandler = (err: any, res: Response) => void;

export const request = (method: string, url: string, cb?: CallbackHandler): SuperAgentRequest => {
  const abortController = new AbortController();

  let params = new URLSearchParams();
  let headers = new Headers();
  let options: RequestInit = { method, headers, signal: abortController.signal };
  let superAgentResponse = Promise.reject<Response>(new Error('Use end() to send actual request'));

  const doRequest = () => {
    const queryStr = params.size ? `?${params.toString()}` : '';
    superAgentResponse ||= fetch(`${url}${queryStr}`, options).then(response);
    return superAgentResponse;
  };

  return {
    cookies: '',
    method,
    url,
    abort() {
      abortController.abort();
    },
    accept(type) {
      headers.set('Accept', type);
      return this;
    },
    auth(user, pass: string | { type: 'bearer' }) {
      const creds = () => btoa(`${user}:${pass}`);
      headers.set('Authorization', typeof pass === 'string' ? `Basic ${creds()}` : `Bearer ${user}`);
      return this;
    },
    send(data) {
      options.body = typeof data === 'object' ? JSON.stringify(data) : data;
      return this;
    },
    query(q) {
      params = new URLSearchParams(typeof q === 'string' ? q : { ...q });
      return this;
    },
    set(key, value) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
      return this;
    },
    // ...
    end(callback) {
      const handler = callback || cb;
      doRequest().then(resp => {
        handler && handler(resp.ok ? undefined : resp.error, resp);
        return resp;
      });
    },
    then(onFulfilled, onRejected) {
      return doRequest().then(onFulfilled, onRejected);
    },
    catch(onRejected) {
      return doRequest().catch(onRejected);
    },
    finally(onFinally) {
      return doRequest().finally(onFinally);
    }
  } as SuperAgentRequest;
};
