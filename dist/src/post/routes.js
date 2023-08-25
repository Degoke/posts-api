"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../auth/middleware");
const async_1 = require("../async");
const comment_1 = require("./comment");
const seed_1 = require("./seed");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.use('/seed', seed_1.seedPostsHandler);
exports.postsRouter.use(middleware_1.authenticateToken);
exports.postsRouter.post('/:postId/comments', comment_1.newCommentValidator, (0, async_1.asyncWrap)(comment_1.addCommentToPostHandler));
//# sourceMappingURL=routes.js.map