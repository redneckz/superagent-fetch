import { composeURL } from './composeURL';

describe('composeURL', () => {
  it('should return URL without params as is', () => {
    expect(composeURL('http://foo')).toBe('http://foo');
  });

  it('should append query params to URL', () => {
    expect(composeURL('http://foo', { bar: '123', baz: '456' })).toBe('http://foo?bar=123&baz=456');
  });

  it('should merge URL params and provided query params', () => {
    expect(composeURL('http://foo?bar=777', { baz: '888' })).toBe('http://foo?bar=777&baz=888');
  });
});
