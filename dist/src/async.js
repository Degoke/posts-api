"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrap = void 0;
/**
 * Wraps an express handler with an async handler.
 * See: https://zellwk.com/blog/async-await-express/
 * This is almost the exact same as express-async-handler,
 * except that package is out of date and lacks TypeScript bindings.
 * https://www.npmjs.com/package/express-async-handler/v/1.1.4
 * @param callback The handler.
 * @returns Async wrapped handler.
 */
function asyncWrap(callback) {
    return function (req, res, next) {
        callback(req, res, next).catch(next);
    };
}
exports.asyncWrap = asyncWrap;
//# sourceMappingURL=async.js.map