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
exports.getUserPosts = exports.getPostByTitle = exports.createUserPost = exports.createUser = exports.getUserByEmail = exports.getUserById = exports.getTopUsersWithMostPosts = exports.getAllUsers = void 0;
const database_1 = require("../database");
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'SELECT id, name, email, last_updated, created_at FROM "users"';
            const result = yield pool.query(query);
            if (result.rows.length === 0) {
                return [];
            }
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error fetching users: ${error}`);
        }
    });
}
exports.getAllUsers = getAllUsers;
function getTopUsersWithMostPosts(count) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = `SELECT 
        users.id AS user_id,
        users.email AS user_email,
        top_users.post_count AS post_count,
        latest_post.title AS latest_post_title,
        latest_comment.content AS latest_comment_content
    FROM users
    JOIN (
        SELECT 
            user_id,
            COUNT(id) AS post_count
        FROM posts
        GROUP BY user_id
        ORDER BY post_count DESC
        LIMIT $1
    ) AS top_users ON users.id = top_users.user_id
    LEFT JOIN LATERAL (
        SELECT 
            id AS post_id,
            title
        FROM posts
        WHERE user_id = top_users.user_id
        ORDER BY created_at DESC
        LIMIT 1
    ) AS latest_post ON true
    LEFT JOIN LATERAL (
        SELECT 
            post_id,
            content
        FROM comments
        WHERE user_id = top_users.user_id
        ORDER BY created_at DESC
        LIMIT 1
    ) AS latest_comment ON true
    ORDER BY top_users.post_count DESC;
    ;
    
        
          `;
            const values = [count];
            const result = yield pool.query(query, values);
            if (result.rows.length === 0) {
                return [];
            }
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error fetching users: ${error}`);
        }
    });
}
exports.getTopUsersWithMostPosts = getTopUsersWithMostPosts;
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'SELECT * FROM "users" WHERE id = $1';
            const values = [id];
            const result = yield pool.query(query, values);
            if (result.rows.length === 0) {
                return undefined;
            }
            return result.rows[0];
        }
        catch (error) {
            console.log(error);
            throw new Error(`Error fetching user by id: ${error}`);
        }
    });
}
exports.getUserById = getUserById;
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'SELECT * FROM "users" WHERE email = $1';
            const values = [email];
            const result = yield pool.query(query, values);
            if (result.rows.length === 0) {
                return undefined;
            }
            return result.rows[0];
        }
        catch (error) {
            console.log(error);
            throw new Error(`Error fetching user by email: ${error}`);
        }
    });
}
exports.getUserByEmail = getUserByEmail;
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'INSERT INTO "users" (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [user.id, user.name, user.email, user.password];
            const result = yield pool.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            console.error(error);
            throw new Error(`Error creating user: ${error}`);
        }
    });
}
exports.createUser = createUser;
function createUserPost(post) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'INSERT INTO posts (id, user_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [post.id, post.user_id, post.title, post.content];
            const result = yield pool.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            console.error(error);
            throw new Error(`Error creating user: ${error}`);
        }
    });
}
exports.createUserPost = createUserPost;
function getPostByTitle(userId, title) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'SELECT * FROM "posts" WHERE user_id = $1 AND title = $2';
            const values = [userId, title];
            const result = yield pool.query(query, values);
            if (result.rows.length === 0) {
                return undefined;
            }
            return result.rows[0];
        }
        catch (error) {
            console.log(error);
            throw new Error(`Error fetching user posts by title: ${error}`);
        }
    });
}
exports.getPostByTitle = getPostByTitle;
function getUserPosts(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = (0, database_1.getClient)();
            const query = 'SELECT * FROM "posts" WHERE user_id = $1';
            const values = [userId];
            const result = yield pool.query(query, values);
            if (result.rows.length === 0) {
                return [];
            }
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error fetching users: ${error}`);
        }
    });
}
exports.getUserPosts = getUserPosts;
//# sourceMappingURL=repo.js.map