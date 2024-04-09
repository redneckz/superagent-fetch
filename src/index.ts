import type { SuperAgentStatic } from 'superagent';
import { SuperAgentRequest } from './SuperAgentRequest';

export const superagent = ((methodOrURL: string, url: string) =>
  url ? SuperAgentRequest(methodOrURL, url) : SuperAgentRequest('GET', methodOrURL)) as SuperAgentStatic;

Object.assign(superagent, {
  get: (url, cb) => SuperAgentRequest('GET', url, cb),
  post: (url, cb) => SuperAgentRequest('POST', url, cb),
  put: (url, cb) => SuperAgentRequest('PUT', url, cb),
  del: (url, cb) => SuperAgentRequest('DELETE', url, cb),
  delete: (url, cb) => SuperAgentRequest('DELETE', url, cb),
  head: (url, cb) => SuperAgentRequest('HEAD', url, cb),
  options: (url, cb) => SuperAgentRequest('OPTIONS', url, cb),
} as SuperAgentStatic);

export default superagent;
