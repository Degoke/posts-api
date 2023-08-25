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
exports.authenticateTokenImpl = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const errors_1 = require("../errors/errors");
function authenticateToken(req, res, next) {
    return authenticateTokenImpl(req, res).then(next).catch(next);
}
exports.authenticateToken = authenticateToken;
function authenticateTokenImpl(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const secret = (0, config_1.getConfig)().serverSecret;
            const [tokenType, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
            if (!tokenType || !token) {
                throw new errors_1.AuthenticationError('Unauthorized');
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            res.locals.user = decoded.user;
        }
        catch (error) {
            throw new errors_1.AuthenticationError(error);
        }
    });
}
exports.authenticateTokenImpl = authenticateTokenImpl;
//# sourceMappingURL=middleware.js.map