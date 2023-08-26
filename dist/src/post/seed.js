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
exports.seedPostsHandler = void 0;
const utils_1 = require("../utils");
/**
 * Handles a request to seed users, posts, and comments.
 *
 * @param req - The request object containing information about the HTTP request.
 * @param res - The response object used to send the HTTP response to the client.
 * @throws Throws an error if an error occurs during the seeding operation.
 */
function seedPostsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, utils_1.seedUsersPostsAndComments)();
            res.status(201).json({ message: 'success' });
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.seedPostsHandler = seedPostsHandler;
//# sourceMappingURL=seed.js.map