export interface Post {
    id: string
    user_id: string
    title: string
    content: string
    created_at?: Date
    last_updated?: Date
}
