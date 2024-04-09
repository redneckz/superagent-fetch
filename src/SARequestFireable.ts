import type { Response as SAResponse } from 'superagent';

export type EventHandler<E = any> = (ev: E) => void;

export class SARequestFireable {
  private handlers: Record<string, Set<EventHandler>> = {};

  on(type: string, handler: EventHandler) {
    this.handlers[type] ||= new Set();
    this.handlers[type].add(handler);
    return this;
  }

  handle(resp: Promise<SAResponse>): Promise<SAResponse> {
    return resp.then(
      resp => {
        this.fire('response', resp);
        return resp;
      },
      err => {
        this.fire('error', err);
        return Promise.reject(err);
      },
    );
  }

  fire(type: string, event: any) {
    if (this.handlers[type]) {
      for (const handler of this.handlers[type]) {
        handler(event);
      }
    }
  }
}
