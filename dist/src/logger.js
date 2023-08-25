"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["NONE"] = 0] = "NONE";
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
exports.logger = {
    level: process.env.NODE_ENV === 'test' ? LogLevel.ERROR : LogLevel.INFO,
    error(msg, data) {
        if (exports.logger.level >= LogLevel.ERROR) {
            exports.logger.log('ERROR', msg, data);
        }
    },
    warn(msg, data) {
        if (exports.logger.level >= LogLevel.WARN) {
            exports.logger.log('WARN', msg, data);
        }
    },
    info(msg, data) {
        if (exports.logger.level >= LogLevel.INFO) {
            exports.logger.log('INFO', msg, data);
        }
    },
    debug(msg, data) {
        if (exports.logger.level >= LogLevel.DEBUG) {
            exports.logger.log('DEBUG', msg, data);
        }
    },
    log(level, msg, data) {
        if (data instanceof Error) {
            data = { error: data.toString() };
        }
        console.log(JSON.stringify(Object.assign({ level, timestamp: new Date().toISOString(), msg }, data)));
    },
};
//# sourceMappingURL=logger.js.map