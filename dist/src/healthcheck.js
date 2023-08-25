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
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthcheckHandler = void 0;
const database_1 = require("./database");
const redis_1 = require("./redis");
function healthcheckHandler(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json({
            ok: true,
            version: "v1",
            postgres: yield testPostgres(),
            redis: yield testRedis(),
        });
    });
}
exports.healthcheckHandler = healthcheckHandler;
function testPostgres() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield (0, database_1.getClient)().query(`SELECT 1 AS "status"`)).rows[0].status === 1;
    });
}
function testRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield (0, redis_1.getRedis)().ping()) === 'PONG';
    });
}
//# sourceMappingURL=healthcheck.js.map