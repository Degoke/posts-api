"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTestConfig = exports.loadConfig = exports.isProduction = exports.getConfig = void 0;
require("dotenv/config");
let cachedConfig = undefined;
/**
 * Returns the server configuration settings
 * @returns The server configuration settings
 */
function getConfig() {
    if (!cachedConfig) {
        throw new Error('config not loaded');
    }
    return cachedConfig;
}
exports.getConfig = getConfig;
function isProduction() {
    return getConfig().environment === 'production';
}
exports.isProduction = isProduction;
function loadConfig() {
    var _a, _b;
    const config = {};
    for (const [name, value] of Object.entries(process.env)) {
        if (!name.startsWith('APP_')) {
            continue;
        }
        let key = name.substring('APP_'.length);
        let currConfig = config;
        if (key.startsWith('DATABASE_')) {
            key = key.substring('DATABASE_'.length);
            currConfig = config.database = (_a = config.database) !== null && _a !== void 0 ? _a : {};
        }
        else if (key.startsWith('REDIS_')) {
            key = key.substring('REDIS_'.length);
            currConfig = config.redis = (_b = config.redis) !== null && _b !== void 0 ? _b : {};
        }
        //covert key from CAPITAL_CASE to camelCase
        key = key.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        if (isIntegerConfig(key)) {
            currConfig[key] = parseInt(value !== null && value !== void 0 ? value : '', 10);
        }
        else {
            currConfig[key] = value;
        }
    }
    cachedConfig = config;
    return cachedConfig;
}
exports.loadConfig = loadConfig;
/**
 * Loads the configuration setting for unit and integration tests.
 * @returns The configuration for tests.
 */
function loadTestConfig() {
    const config = loadConfig();
    config.database.dbname = 'test_db';
    return config;
}
exports.loadTestConfig = loadTestConfig;
function isIntegerConfig(key) {
    return key === 'port';
}
//# sourceMappingURL=config.js.map