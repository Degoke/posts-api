import express from 'express';
import { initApp } from './app';
import { loadConfig } from './config';
import { logger } from './logger';

export async function main(): Promise<void> {
  process.on('unhandledRejection', (err: any) => {
    logger.error('Unhandled promise rejection', err);
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception thrown', err);
    process.exit(1);
  });

  logger.info('Starting Server...');
  const config = await loadConfig();

  const app = await initApp(express(), config);
  const server = app.listen(config.port);
  server.keepAliveTimeout = 90000;
  logger.info('Server started', { port: config.port });
}

if (require.main === module) {
  main();
}