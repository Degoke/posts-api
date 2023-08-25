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
exports.run = void 0;
function run(client) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.query(`CREATE TABLE IF NOT EXISTS "users" (
        "id" UUID NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "last_updated" TIMESTAMPTZ DEFAULT NOW(),
        "created_at" TIMESTAMPTZ DEFAULT NOW()
    )`);
        yield client.query('CREATE INDEX ON "users" ("email");');
        yield client.query(`CREATE TABLE IF NOT EXISTS "posts" (
        "id" UUID NOT NULL PRIMARY KEY,
        "user_id" UUID NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "last_updated" TIMESTAMPTZ DEFAULT NOW(),
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
        yield client.query('CREATE UNIQUE INDEX ON "posts" ("user_id", "title");');
        yield client.query(`CREATE TABLE IF NOT EXISTS "comments" (
        "id" UUID NOT NULL PRIMARY KEY,
        "post_id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "content" TEXT NOT NULL,
        "last_updated" TIMESTAMPTZ DEFAULT NOW(),
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
        yield client.query('CREATE INDEX idx_posts_user_id ON posts(user_id);');
        yield client.query('CREATE INDEX idx_comments_post_id ON comments(post_id);');
        yield client.query('CREATE INDEX idx_comments_created_at ON comments(created_at)');
        yield client.query('CREATE INDEX idx_comments_user_id ON comments(user_id);');
    });
}
exports.run = run;
//# sourceMappingURL=v1.js.map