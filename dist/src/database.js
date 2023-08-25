"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initDatabase = exports.getClient = void 0;
const pg_1 = require("pg");
const logger_1 = require("./logger");
const migrations = __importStar(require("./migrations"));
let pool;
function getClient() {
    if (!pool) {
        throw new Error('Database not setup');
    }
    return pool;
}
exports.getClient = getClient;
function initDatabase(config) {
    return __awaiter(this, void 0, void 0, function* () {
        pool = new pg_1.Pool({
            host: config.host,
            port: config.port,
            database: config.dbname,
            user: config.username,
            password: config.password
        });
        pool.on('error', (err) => {
            logger_1.logger.error('Database conection error', err);
        });
        let client;
        try {
            client = yield pool.connect();
            yield client.query('SELECT pg_advisory_lock(1)');
            yield migrate(client);
        }
        finally {
            if (client) {
                yield client.query('SELECT pg_advisory_unlock_all()');
                client.release();
            }
        }
    });
}
exports.initDatabase = initDatabase;
function closeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (pool) {
            yield pool.end();
            pool = undefined;
        }
    });
}
exports.closeDatabase = closeDatabase;
function migrate(client) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        yield client.query(`CREATE TABLE IF NOT EXISTS "DatabaseMigration" (
        "id" INTEGER NOT NULL PRIMARY KEY,
        "version" INTEGER NOT NULL
    )`);
        const result = yield client.query(`SELECT "version" FROM "DatabaseMigration"`);
        const version = (_b = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : -1;
        if (version < 0) {
            yield client.query(`INSERT INTO "DatabaseMigration" ("id", "version") VALUES (1, 0)`);
        }
        const migrationKeys = Object.keys(migrations);
        for (let i = version + 1; i <= migrationKeys.length; i++) {
            const migration = migrations['v' + i];
            if (migration) {
                logger_1.logger.info('Running database migration', { version: `v${i}` });
                yield migration.run(client);
                yield client.query('UPDATE "DatabaseMigration" SET "version"=$1', [i]);
            }
        }
    });
}
//# sourceMappingURL=database.js.map