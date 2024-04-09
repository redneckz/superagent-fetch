type FileExt = string;

// Most popular are listed here. Others are treated as application/{ext}
const MIME_TYPES: Record<FileExt, string> = {
  js: 'application/javascript',
  text: 'text/plain',
  csv: 'text/csv',
  css: 'text/css',
  html: 'text/html',
};

export const contentType = (_: string): string => (isMimeType(_) ? _ : mimeType(_));

const isMimeType = (_: string): boolean => _.indexOf('/') !== -1;
const mimeType = (ext: string): string => MIME_TYPES[ext] || `application/${ext}`;
