"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../auth/middleware");
const user_1 = require("./user");
const async_1 = require("../async");
const post_1 = require("./post");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get('/topusers', (0, async_1.asyncWrap)(user_1.topUsersHandler));
exports.usersRouter.get('/', (0, async_1.asyncWrap)(user_1.allUsersHandler));
exports.usersRouter.use(middleware_1.authenticateToken);
exports.usersRouter.get('/:id/posts', (0, async_1.asyncWrap)(post_1.getPostsHandler));
exports.usersRouter.post('/:id/posts', post_1.newPostValidators, (0, async_1.asyncWrap)(post_1.createPostHandler));
//# sourceMappingURL=routes.js.map