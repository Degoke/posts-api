import { randomUUID } from "crypto";
import { Post } from "./models/Post";
import { createTestUser, createTestPost, createTestComment } from "./tets.setup";
import { Comment } from "./models/Comment";

/**
 * Returns true if the input string is a UUID.
 * @param input The input string.
 * @returns True if the input string matches the UUID format.
 */
export function isUUID(input: string): boolean {
    return !!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/i.exec(input);
  }

/**
 * Generates random users, posts, and comments and returns them in the form of maps.
 * 
 * @returns A promise that resolves to an object containing maps of posts and comments.
 */
export async function seedUsersPostsAndComments(): Promise<{ posts: Map<string, Post[]>, comments: Map<string, Comment[]>  }> {
    const posts: Map<string, Post[]> = new Map()
    const comments: Map<string, Comment[]> = new Map()

    for (let i = 0; i <= 50; i++) {
        const user = await createTestUser(
            randomUUID() + '@example.com',
            randomUUID()
        )

        const numPosts = Math.floor(Math.random() * 100)
        for (let j = 0; j < numPosts; j++) {
            const post = await createTestPost(
                user.id,
                randomUUID() + 'title'
            )
            const previous = posts.get(user.id)
            if (!previous) {
                posts.set(user.id, [post])
            } else {
                posts.set(user.id, [...previous, post])
            }

            const numComments = Math.floor(Math.random() * 2)
            for (let k = 0; k < numComments; k++) {
                const comment = await createTestComment(post.id, user.id)
                const prevComment = comments.get(post.id)
                if (!prevComment) {
                    comments.set(post.id, [comment])
                } else {
                    comments.set(post.id, [...prevComment, comment])
                }
            }
        }
    }

    return {
        posts,
        comments
    }
}
