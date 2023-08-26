"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdownApp = exports.initAppServices = exports.initApp = void 0;
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = require("express");
const http_1 = __importDefault(require("http"));
const database_1 = require("./database");
const healthcheck_1 = require("./healthcheck");
const redis_1 = require("./redis");
const async_1 = require("./async");
const auth_1 = require("./auth");
const user_1 = require("./user");
const post_1 = require("./post");
const middleware_1 = require("./errors/middleware");
let server = undefined;
/**
 * Sets standard headers for all requests.
 * @param _req The request.
 * @param res The response.
 * @param next The next handler.
 */
function standardHeaders(_req, res, next) {
    // Set Content Security Policy
    // As an API server, block everything
    // See: https://stackoverflow.com/a/45631261/2051724
    res.set('Content-Security-Policy', "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';");
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
/**
 * Initializes the application by setting up the necessary services, creating an HTTP server,
 * configuring middleware, and defining the API routes.
 *
 * @param app - An instance of the Express application.
 * @param config - The server configuration object containing the port number, environment,
 *                 server secret, database configuration, and Redis configuration.
 * @returns The created HTTP server.
 */
function initApp(app, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield initAppServices(config);
        server = http_1.default.createServer(app);
        app.set('etag', false);
        app.set('trust proxy', true);
        app.set('x-powered-by', false);
        app.use(standardHeaders);
        app.use((0, cors_1.default)());
        app.use((0, compression_1.default)());
        app.use((0, express_1.urlencoded)({
            extended: false,
        }));
        app.use((0, express_1.json)({
            type: ['application/json'],
            limit: '1mb',
        }));
        const apiRouter = (0, express_1.Router)();
        apiRouter.get('/', (_req, res) => res.sendStatus(200));
        apiRouter.get('/healthcheck', (0, async_1.asyncWrap)(healthcheck_1.healthcheckHandler));
        apiRouter.use('/auth', auth_1.authRouter);
        apiRouter.use('/users', user_1.usersRouter);
        apiRouter.use('/posts', post_1.postsRouter);
        app.use('/api/', apiRouter);
        app.use(middleware_1.notFoundHandler);
        app.use(middleware_1.errorHandler);
        return server;
    });
}
exports.initApp = initApp;
/**
 * Initializes the necessary services for the application.
 *
 * @param config - The server configuration object containing the necessary information for initializing the services.
 * @returns A Promise that resolves to void.
 */
function initAppServices(config) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, redis_1.initRedis)(config.redis);
        yield (0, database_1.initDatabase)(config.database);
    });
}
exports.initAppServices = initAppServices;
/**
 * Shuts down the application gracefully by closing the database connection, disconnecting from Redis, and closing the server if it is running.
 */
function shutdownApp() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, database_1.closeDatabase)();
        (0, redis_1.closeRedis)();
        if (server) {
            server.close();
            server = undefined;
        }
    });
}
exports.shutdownApp = shutdownApp;
//# sourceMappingURL=app.js.map