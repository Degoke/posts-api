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
exports.getPostsHandler = exports.createPostHandler = exports.newPostValidators = void 0;
const repo_1 = require("./repo");
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const crypto_1 = require("crypto");
const errors_1 = require("../errors/errors");
exports.newPostValidators = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Valid Title is required'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Valid Content is required'),
];
/**
 * Handles the creation of a new post by a user.
 *
 * @param req - The request object containing the user ID, post title, and content.
 * @param res - The response object used to send the response back to the client.
 * @throws {ValidationError} - If there are validation errors in the request data.
 * @throws {ServiceError} - If the user ID is not a valid UUID or if the user with the given ID does not exist.
 * @throws {AuthorizationError} - If the user ID does not match the authorized user ID.
 * @throws {ServiceError} - If a post with the same title already exists for the user.
 */
function createPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errors_1.ValidationError(errors);
        }
        const userId = req.params.id;
        if (!(0, utils_1.isUUID)(userId)) {
            throw new errors_1.ServiceError('Invalid User Id');
        }
        if (userId !== res.locals.user.id) {
            throw new errors_1.AuthorizationError('Forbidden');
        }
        const { title, content } = req.body;
        let userExists;
        let existingTitle = undefined;
        try {
            userExists = yield (0, repo_1.getUserById)(userId);
            if (!userExists) {
                throw new errors_1.ServiceError('Invalid User Id');
            }
            existingTitle = yield (0, repo_1.getPostByTitle)(userId, title);
            if (existingTitle) {
                throw new errors_1.ServiceError('Title already Exists');
            }
            const post = yield (0, repo_1.createUserPost)({
                id: (0, crypto_1.randomUUID)(),
                user_id: userId,
                title,
                content,
            });
            res.status(201).json({ post });
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createPostHandler = createPostHandler;
/**
 * Handles the request to get posts for a specific user.
 *
 * @param req - The request object containing information about the HTTP request.
 * @param res - The response object used to send the HTTP response.
 * @throws {ServiceError} - If the provided user ID is not a valid UUID.
 * @throws {AuthorizationError} - If the provided user ID does not match the ID of the authenticated user.
 */
function getPostsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        if (!(0, utils_1.isUUID)(userId)) {
            throw new errors_1.ServiceError('Invalid User Id');
        }
        if (userId !== res.locals.user.id) {
            throw new errors_1.AuthorizationError('Forbidden');
        }
        try {
            const posts = yield (0, repo_1.getUserPosts)(userId);
            res.status(200).json({ posts });
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getPostsHandler = getPostsHandler;
//# sourceMappingURL=post.js.map