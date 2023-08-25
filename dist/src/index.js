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
exports.main = void 0;
const express_1 = __importDefault(require("express"));
const app_1 = require("./app");
const config_1 = require("./config");
const logger_1 = require("./logger");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        process.on('unhandledRejection', (err) => {
            logger_1.logger.error('Unhandled promise rejection', err);
        });
        process.on('uncaughtException', (err) => {
            logger_1.logger.error('Uncaught exception thrown', err);
            process.exit(1);
        });
        logger_1.logger.info('Starting Server...');
        const config = yield (0, config_1.loadConfig)();
        const app = yield (0, app_1.initApp)((0, express_1.default)(), config);
        const server = app.listen(config.port);
        server.keepAliveTimeout = 90000;
        logger_1.logger.info('Server started', { port: config.port });
    });
}
exports.main = main;
if (require.main === module) {
    main();
}
//# sourceMappingURL=index.js.map