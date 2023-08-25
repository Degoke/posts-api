export interface Comment {
    id: string
    post_id: string
    user_id: string
    content: string
    created_at?: Date
    last_updated?: Date
}
