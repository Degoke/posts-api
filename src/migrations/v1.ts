import { PoolClient } from 'pg'

export async function run(client: PoolClient): Promise<void> {
    await client.query(`CREATE TABLE IF NOT EXISTS "users" (
        "id" UUID NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "last_updated" TIMESTAMPTZ DEFAULT NOW(),
        "created_at" TIMESTAMPTZ DEFAULT NOW()
    )`)

    await client.query('CREATE INDEX ON "users" ("email");')

    await client.query(`CREATE TABLE IF NOT EXISTS "posts" (
        "id" UUID NOT NULL PRIMARY KEY,
        "user_id" UUID NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "last_updated" TIMESTAMPTZ DEFAULT NOW(),
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`)

    await client.query('CREATE UNIQUE INDEX ON "posts" ("user_id", "title");')

    await client.query(`CREATE TABLE IF NOT EXISTS "comments" (
        "id" UUID NOT NULL PRIMARY KEY,
        "post_id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "content" TEXT NOT NULL,
        "last_updated" TIMESTAMPTZ DEFAULT NOW(),
        "created_at" TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`)

    await client.query('CREATE INDEX idx_posts_user_id ON posts(user_id);')
    await client.query(
        'CREATE INDEX idx_comments_post_id ON comments(post_id);'
    )
    await client.query(
        'CREATE INDEX idx_comments_created_at ON comments(created_at)'
    )
    await client.query(
        'CREATE INDEX idx_comments_user_id ON comments(user_id);'
    )
}
