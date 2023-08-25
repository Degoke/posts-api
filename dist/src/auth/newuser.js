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
exports.newUserHandler = exports.newUserValidators = void 0;
const express_validator_1 = require("express-validator");
const hibp_1 = require("hibp");
const login_1 = require("./login");
const utils_1 = require("./utils");
const repo_1 = require("../user/repo");
const crypto_1 = require("crypto");
const errors_1 = require("../errors/errors");
exports.newUserValidators = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Valid Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email address is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
];
/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
function newUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errors_1.ValidationError(errors);
        }
        const email = req.body.email.toLowerCase();
        let existingUser = undefined;
        existingUser = yield (0, repo_1.getUserByEmail)(email);
        if (existingUser) {
            throw new errors_1.ServiceError('Email already registered');
        }
        try {
            const { email, password, name } = req.body;
            const numPwns = yield (0, hibp_1.pwnedPassword)(password);
            if (numPwns > 0) {
                throw new errors_1.ServiceError('Password found in breach database: use a stronger psssword');
            }
            const passwordHash = yield (0, utils_1.hashPassword)(password);
            const user = yield (0, repo_1.createUser)({
                name,
                email,
                password: passwordHash,
                id: (0, crypto_1.randomUUID)(),
            });
            const token = yield (0, login_1.tryLogin)(email, req.body.password, res);
            delete user.password;
            res.status(201).json({ user, token });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.newUserHandler = newUserHandler;
//# sourceMappingURL=newuser.js.map