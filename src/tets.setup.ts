import { randomUUID } from "crypto";
import { createUser, createUserPost } from "./user/repo";
import { hashPassword } from "./auth/utils";
import { createPostComment } from "./post/repo";

export async function createTestUser(email: string, password: string) {
    return await createUser({
        id: randomUUID(),
        name: "John Doe",
        email: email,
        password: await hashPassword(password)
    })
}

export async function createTestPost(userId: string, title?: string) {
    return await createUserPost({
        id: randomUUID(),
        title: title || "Test Post",
        content: randomUUID(),
        user_id: userId
    })
}

export async function createTestComment(postId: string, userId: string) {
    return await createPostComment({
        id: randomUUID(),
        content: randomUUID(),
        user_id: userId,
        post_id: postId
    })
}
