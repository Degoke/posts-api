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
exports.addCommentToPostHandler = exports.newCommentValidator = void 0;
const repo_1 = require("./repo");
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const crypto_1 = require("crypto");
const errors_1 = require("../errors/errors");
exports.newCommentValidator = [
    (0, express_validator_1.body)('content').notEmpty().withMessage('Valid Content is required'),
];
/**
 * Handles a HTTP request to /auth/newuser.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
function addCommentToPostHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errors_1.ValidationError(errors);
        }
        const postId = req.params.postId;
        if (!(0, utils_1.isUUID)(postId)) {
            throw new errors_1.ServiceError('Invalid Post Id');
        }
        const userId = res.locals.user.id;
        if (!userId) {
            throw new errors_1.ServiceError('Forbidden');
        }
        const { content } = req.body;
        let postExists;
        try {
            postExists = yield (0, repo_1.getPostById)(postId);
            if (!postExists) {
                throw new errors_1.ServiceError('Invalid Post Id');
            }
            const comment = yield (0, repo_1.createPostComment)({
                id: (0, crypto_1.randomUUID)(),
                post_id: postId,
                user_id: userId,
                content,
            });
            res.status(201).json({ comment });
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addCommentToPostHandler = addCommentToPostHandler;
//# sourceMappingURL=comment.js.map