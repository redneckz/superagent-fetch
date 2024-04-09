import { contentType } from './contentType';

describe('contentType', () => {
  it('should return full mime type as is', () => {
    expect(contentType('text/foo')).toBe('text/foo');
  });

  it('should return unknown extension as application/ext mime type', () => {
    expect(contentType('unknown')).toBe('application/unknown');
  });

  it('should return application/json on json extension', () => {
    expect(contentType('js')).toBe('application/javascript');
  });

  it('should return application/javascript on js extension', () => {
    expect(contentType('js')).toBe('application/javascript');
  });
});
