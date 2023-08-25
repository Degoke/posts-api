"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedis = exports.closeRedis = exports.initRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
let redis = undefined;
function initRedis(config) {
    redis = new ioredis_1.default(config);
}
exports.initRedis = initRedis;
function closeRedis() {
    if (redis) {
        redis.disconnect();
        redis = undefined;
    }
}
exports.closeRedis = closeRedis;
function getRedis() {
    if (!redis) {
        throw new Error('Redis not initialized');
    }
    return redis;
}
exports.getRedis = getRedis;
//# sourceMappingURL=redis.js.map