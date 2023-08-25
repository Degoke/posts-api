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
exports.createPostComment = exports.getPostById = void 0;
const database_1 = require("../database");
function getPostById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'SELECT * FROM "posts" WHERE id = $1';
            const values = [id];
            const result = yield pool.query(query, values);
            console.log(result);
            if (result.rows.length === 0) {
                return undefined;
            }
            return result.rows[0];
        }
        catch (error) {
            console.log(error);
            throw new Error(`Error fetching pst by id: ${error}`);
        }
    });
}
exports.getPostById = getPostById;
function createPostComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'INSERT INTO "comments" (id, post_id, user_id, content) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [
                comment.id,
                comment.post_id,
                comment.user_id,
                comment.content,
            ];
            const result = yield pool.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            console.error(error);
            throw new Error(`Error creating user: ${error}`);
        }
    });
}
exports.createPostComment = createPostComment;
//# sourceMappingURL=repo.js.map