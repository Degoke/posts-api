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
exports.topUsersHandler = exports.allUsersHandler = void 0;
const repo_1 = require("./repo");
/**
 * Handles the request to get all users.
 *
 * @param req - The request object containing information about the HTTP request.
 * @param res - The response object used to send the HTTP response.
 * @throws Throws an error if there is an error retrieving the users.
 */
function allUsersHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield (0, repo_1.getAllUsers)();
            res.status(200).json({ users });
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.allUsersHandler = allUsersHandler;
/**
 * Handles a request to get the top users with the most posts.
 * Calls the getTopUsersWithMostPosts function to retrieve the users and sends the response with the users in JSON format.
 *
 * @param req - The request object from the client.
 * @param res - The response object to send the response back to the client.
 */
function topUsersHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield (0, repo_1.getTopUsersWithMostPosts)(3);
            console.log(users);
            res.status(200).json({ users });
            return;
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: err });
            return;
        }
    });
}
exports.topUsersHandler = topUsersHandler;
//# sourceMappingURL=user.js.map