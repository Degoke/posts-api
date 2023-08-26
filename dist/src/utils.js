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
exports.seedUsersPostsAndComments = exports.isUUID = void 0;
const crypto_1 = require("crypto");
const tets_setup_1 = require("./tets.setup");
/**
 * Returns true if the input string is a UUID.
 * @param input The input string.
 * @returns True if the input string matches the UUID format.
 */
function isUUID(input) {
    return !!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/i.exec(input);
}
exports.isUUID = isUUID;
/**
 * Generates random users, posts, and comments and returns them in the form of maps.
 *
 * @returns A promise that resolves to an object containing maps of posts and comments.
 */
function seedUsersPostsAndComments() {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = new Map();
        const comments = new Map();
        for (let i = 0; i <= 50; i++) {
            const user = yield (0, tets_setup_1.createTestUser)((0, crypto_1.randomUUID)() + '@example.com', (0, crypto_1.randomUUID)());
            const numPosts = Math.floor(Math.random() * 100);
            for (let j = 0; j < numPosts; j++) {
                const post = yield (0, tets_setup_1.createTestPost)(user.id, (0, crypto_1.randomUUID)() + 'title');
                const previous = posts.get(user.id);
                if (!previous) {
                    posts.set(user.id, [post]);
                }
                else {
                    posts.set(user.id, [...previous, post]);
                }
                const numComments = Math.floor(Math.random() * 2);
                for (let k = 0; k < numComments; k++) {
                    const comment = yield (0, tets_setup_1.createTestComment)(post.id, user.id);
                    const prevComment = comments.get(post.id);
                    if (!prevComment) {
                        comments.set(post.id, [comment]);
                    }
                    else {
                        comments.set(post.id, [...prevComment, comment]);
                    }
                }
            }
        }
        return {
            posts,
            comments
        };
    });
}
exports.seedUsersPostsAndComments = seedUsersPostsAndComments;
//# sourceMappingURL=utils.js.map