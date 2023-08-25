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
exports.createTestComment = exports.createTestPost = exports.createTestUser = void 0;
const crypto_1 = require("crypto");
const repo_1 = require("./user/repo");
const utils_1 = require("./auth/utils");
const repo_2 = require("./post/repo");
function createTestUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, repo_1.createUser)({
            id: (0, crypto_1.randomUUID)(),
            name: "John Doe",
            email: email,
            password: yield (0, utils_1.hashPassword)(password)
        });
    });
}
exports.createTestUser = createTestUser;
function createTestPost(userId, title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, repo_1.createUserPost)({
            id: (0, crypto_1.randomUUID)(),
            title: title || "Test Post",
            content: (0, crypto_1.randomUUID)(),
            user_id: userId
        });
    });
}
exports.createTestPost = createTestPost;
function createTestComment(postId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, repo_2.createPostComment)({
            id: (0, crypto_1.randomUUID)(),
            content: (0, crypto_1.randomUUID)(),
            user_id: userId,
            post_id: postId
        });
    });
}
exports.createTestComment = createTestComment;
//# sourceMappingURL=tets.setup.js.map