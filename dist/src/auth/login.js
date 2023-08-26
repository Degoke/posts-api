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
exports.tryLogin = exports.loginHandler = exports.loginValidators = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("./utils");
const repo_1 = require("../user/repo");
const errors_1 = require("../errors/errors");
exports.loginValidators = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email address is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 5 })
        .withMessage('Invalid password, must be at least 5 characters'),
];
/**
 * Handles the login request.
 *
 * @param req - The request object containing the login details in the request body.
 * @param res - The response object used to send the login response.
 * @throws {ValidationError} - If there are validation errors in the request body.
 * @throws {Error} - If there is an error during the login process.
 */
function loginHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errors_1.ValidationError(errors);
        }
        const { email, password } = req.body;
        try {
            const { token, user } = yield tryLogin(email, password, res);
            res.status(200).json({ token, user });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.loginHandler = loginHandler;
/**
 * Handles the login process.
 *
 * @param email - The email of the user trying to log in.
 * @param password - The password of the user trying to log in.
 * @param res - The Express response object.
 * @returns An object containing the generated token and the user object without the password field.
 * @throws {AuthenticationError} If the email or password is invalid.
 */
function tryLogin(email, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        try {
            user = yield (0, repo_1.getUserByEmail)(email);
        }
        catch (error) {
            throw error;
        }
        if (!user) {
            throw new errors_1.AuthenticationError('Email or password is invalid');
        }
        const passwordMatches = yield (0, utils_1.comparePasswords)(password, user.password);
        if (!passwordMatches) {
            throw new errors_1.AuthenticationError('Email or password is invalid');
        }
        const token = (0, utils_1.generateToken)(user);
        delete user.password;
        return { token, user };
    });
}
exports.tryLogin = tryLogin;
//# sourceMappingURL=login.js.map