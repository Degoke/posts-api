import { getConfig, loadConfig } from './config';

describe('Config', () => {

  test('Load env config', async () => {
    process.env.APP_PORT = '3000';
    process.env.APP_DATABASE_PORT = '5432';
    const config = await loadConfig();
    expect(config).toBeDefined();
    expect(config.port).toEqual(3000);
    expect(config.database.port).toEqual(5432);
    expect(getConfig()).toBe(config);
  });
});