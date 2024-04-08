import type { SuperAgentStatic } from 'superagent';
import { request } from './request';

export const superagent = ((methodOrURL: string, url: string) =>
  url ? request(methodOrURL, url) : request('GET', url)) as SuperAgentStatic;

Object.assign(superagent, {
  get: (url, cb) => request('GET', url, cb),
  post: (url, cb) => request('POST', url, cb),
  put: (url, cb) => request('PUT', url, cb),
  del: (url, cb) => request('DELETE', url, cb),
  delete: (url, cb) => request('DELETE', url, cb),
  head: (url, cb) => request('HEAD', url, cb),
  options: (url, cb) => request('OPTIONS', url, cb)
} as SuperAgentStatic);

export default superagent;
