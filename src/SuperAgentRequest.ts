import type { Plugin, SuperAgentRequest as SARequest, Response as SAResponse } from 'superagent';
import { SARequestFireable } from './SARequestFireable';
import { SuperAgentResponse, type ResponseType } from './SuperAgentResponse';
import { composeURL } from './composeURL';
import { contentType } from './contentType';
import { isXMLHttpRequestBody } from './isXMLHttpRequestBody';

export type CallbackHandler = (err: any, res: SAResponse) => void;

// Partial implementation
export const SuperAgentRequest = (method: string, url: string, callback?: CallbackHandler): SARequest => {
  let abortController = new AbortController();
  let fireable = new SARequestFireable();

  let plugins: Plugin[] = [];

  let params = {};
  let body: XMLHttpRequestBodyInit | object | null = null;
  let headers = new Headers();
  let withCreds = false;

  let respType: ResponseType = '';
  let superAgentResponse: Promise<SAResponse> | undefined;

  return {
    cookies: '', // TODO
    method,
    url,

    use(_: Plugin) {
      plugins.push(_);
      return this;
    },

    abort() {
      abortController.abort();
    },

    type(val: string) {
      this.set('Content-Type', contentType(val));
      return this;
    },
    auth(user: string, pass: string | { type: 'bearer' }) {
      const creds = (): string => btoa(`${user}:${pass}`);
      this.set('Authorization', typeof pass === 'string' ? `Basic ${creds()}` : `Bearer ${user}`);
      return this;
    },

    send(data: any) {
      if (!data || isXMLHttpRequestBody(data)) {
        body = data || null;
      } else {
        this.type('json');
        body = { ...(typeof body === 'object' ? body : {}), ...data };
      }
      return this;
    },
    query(q: object | string) {
      params = {
        ...params,
        ...(typeof q === 'string' ? Object.fromEntries(new URLSearchParams(q).entries()) : q),
      };

      return this;
    },

    get(key: string): string {
      return headers.get(key) || '';
    },
    set(key: object | string, value?: string | string[]) {
      if (typeof key === 'object' && !value) {
        Object.entries(key).forEach(([k, v]) => headers.set(k, v as string));
      } else if (typeof key === 'string' && Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else if (typeof key === 'string' && typeof value === 'string') {
        headers.set(key, value);
      }
      return this;
    },

    http2(_enable: boolean) {
      // TODO
      return this;
    },
    withCredentials() {
      withCreds = true;
      return this;
    },

    responseType(_: string) {
      respType = _ as ResponseType;
      return this;
    },

    end(cb: CallbackHandler): void {
      const handler = cb || callback;
      this.doRequest().then(resp => {
        handler && handler(resp.ok ? undefined : resp.error, resp);
        return resp;
      });
    },
    then(onFulfilled?: ((value: any) => any) | null, onRejected?: ((reason: any) => any) | null) {
      return this.doRequest().then(onFulfilled, onRejected);
    },
    catch(onRejected?: ((reason: any) => any) | null) {
      return this.doRequest().catch(onRejected);
    },
    finally(onFinally?: (() => any) | null) {
      return this.doRequest().finally(onFinally);
    },

    on(type, handler) {
      fireable.on(type, handler);
      return this;
    },

    // private
    doRequest(): Promise<SAResponse> {
      if (superAgentResponse) {
        return superAgentResponse;
      }

      plugins.forEach(plugin => plugin(this as any));

      superAgentResponse = fireable.handle(
        fetch(composeURL(url, params), {
          method: method,
          headers: headers,
          body: (!body || isXMLHttpRequestBody(body) ? body : JSON.stringify(body)) as any,
          credentials: withCreds ? 'include' : 'same-origin',
          signal: abortController.signal,
        }).then(SuperAgentResponse(respType)),
      );
      return superAgentResponse;
    },
  } as SARequest & { doRequest(): Promise<SAResponse> };
};
