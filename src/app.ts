import compression from 'compression';
import cors from 'cors';
import { Express, json, NextFunction, Request, Response, Router, urlencoded } from 'express';
import http from 'http';
import { ServerConfig } from './config';
import { closeDatabase, initDatabase } from './database';
import { healthcheckHandler } from './healthcheck';
import { closeRedis, initRedis } from './redis';
import { asyncWrap } from './async';
import { authRouter } from './auth';
import { usersRouter } from './user';
import { postsRouter } from './post';
import { errorHandler, notFoundHandler } from './errors/middleware';

let server: http.Server | undefined = undefined;

/**
 * Sets standard headers for all requests.
 * @param _req The request.
 * @param res The response.
 * @param next The next handler.
 */
function standardHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Set Content Security Policy
  // As an API server, block everything
  // See: https://stackoverflow.com/a/45631261/2051724
  res.set(
    'Content-Security-Policy',
    "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';"
  );

  // Never send the Referer header
  res.set('Referrer-Policy', 'no-referrer');

  // Prevent browsers from incorrectly detecting non-scripts as scripts
  res.set('X-Content-Type-Options', 'nosniff');

  // Disallow attempts to iframe site
  res.set('X-Frame-Options', 'DENY');

  // Block pages from loading when they detect reflected XSS attacks
  res.set('X-XSS-Protection', '1; mode=block');
  next();
}

export async function initApp(app: Express, config: ServerConfig): Promise<http.Server> {
  await initAppServices(config);
  server = http.createServer(app);

  app.set('etag', false);
  app.set('trust proxy', true);
  app.set('x-powered-by', false);
  app.use(standardHeaders);
  app.use(cors());
  app.use(compression());
  app.use(
    urlencoded({
      extended: false,
    })
  );
  app.use(
    json({
      type: ['application/json'],
      limit: '1mb',
    })
  );

  const apiRouter = Router();
  apiRouter.get('/', (_req, res) => res.sendStatus(200));
  apiRouter.get('/healthcheck', asyncWrap(healthcheckHandler));
  apiRouter.use('/auth', authRouter)
  apiRouter.use('/users', usersRouter)
  apiRouter.use('/posts', postsRouter)

  app.use('/api/', apiRouter);
  app.use(notFoundHandler);
app.use(errorHandler);
  return server;
}

export async function initAppServices(config: ServerConfig): Promise<void> {
  initRedis(config.redis);
  await initDatabase(config.database);
}

export async function shutdownApp(): Promise<void> {
  await closeDatabase();
  closeRedis();

  if (server) {
    server.close();
    server = undefined;
  }
}