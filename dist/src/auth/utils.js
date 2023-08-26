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
exports.generateToken = exports.comparePasswords = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
/**
 * Hashes a given password using the bcrypt library.
 *
 * @param password - The password to be hashed.
 * @returns A Promise that resolves to a string representing the hashed password.
 */
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return bcrypt_1.default.hash(password, saltRounds);
});
exports.hashPassword = hashPassword;
/**
 * Compares a plain text password with its hashed version.
 *
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed version of the password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean value indicating whether the passwords match.
 */
const comparePasswords = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hashedPassword);
});
exports.comparePasswords = comparePasswords;
/**
 * Generates a JSON Web Token (JWT) for a given user.
 *
 * @param user - The user object for which the token needs to be generated.
 * @returns The generated JSON Web Token for the given user.
 */
const generateToken = (user) => {
    const secret = (0, config_1.getConfig)().serverSecret;
    return jsonwebtoken_1.default.sign({ user }, secret, { expiresIn: '1h' }); // Token expires in 1 hour
};
exports.generateToken = generateToken;
//# sourceMappingURL=utils.js.map