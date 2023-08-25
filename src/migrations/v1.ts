import { PoolClient } from 'pg';

export async function run(client: PoolClient): Promise<void> {
    await client.query(`CREATE TABLE IF NOT EXISTS "users" (
        "id" UUID NOT NULL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "lastUpdated" TIMESTAMPZ NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS "posts" (
        "id" UUID NOT NULL PRIMARY KEY,
        "userId" UUID NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "lastUpdated" TIMESTAMPZ NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    await client.query('CREATE UNIQUE INDEX ON "posts" ("userId", "title");');

    await client.query(`CREATE TABLE IF NOT EXISTS "comments" (
        "id" UUID NOT NULL PRIMARY KEY,
        "postId" UUID NOT NULL,
        "content" TEXT NOT NULL,
        "lastUpdated" TIMESTAMPZ NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (postId) REFERENCES posts(id)
    )`);

    await client.query('CREATE INDEX idx_posts_userId ON posts(userId);');
    await client.query('CREATE INDEX idx_comments_postId ON comments(postId);');
    await client.query('CREATE INDEX idx_comments_createdAt ON comments(createdAt)');
}