export interface Comment extends BaseModel {
    post_id: number;
    content: string;
}