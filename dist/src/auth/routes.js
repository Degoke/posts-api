"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const login_1 = require("./login");
const newuser_1 = require("./newuser");
const async_1 = require("../async");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', login_1.loginValidators, (0, async_1.asyncWrap)(login_1.loginHandler));
exports.authRouter.post('/newUser', newuser_1.newUserValidators, (0, async_1.asyncWrap)(newuser_1.newUserHandler));
//# sourceMappingURL=routes.js.map