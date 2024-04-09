export const isXMLHttpRequestBody = (_: unknown): _ is XMLHttpRequestBodyInit =>
  _ instanceof Blob || _ instanceof FormData || _ instanceof URLSearchParams || typeof _ === 'string';
