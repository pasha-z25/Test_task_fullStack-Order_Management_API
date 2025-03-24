import type { Request } from 'express';

export const getRequestInfo = (req: Request) => ({
  method: req.method,
  url: req.originalUrl || req.url,
  baseUrl: req.baseUrl,
  referer: req.get('Referer'),
  origin: req.get('Origin'),
  userAgent: req.get('User-Agent'),
  secure: req.secure,
  query: req.query,
  headers: req.headers,
  body: req.body,
});
