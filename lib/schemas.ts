import {z} from 'zod'

export const PostSchema = z.object({
    id: z.string(),
    fileUrl: z.string({
        required_error: "Please upload file."
    }).url(),
    caption: z.string().optional(),
    fileName: z.string(),
    fileType: z.string(),
    location: z.string(),
}) 

export const CreatePost = PostSchema.omit({ id: true });
export const UpdatePost = PostSchema;
export const DeletePost = PostSchema.pick({ id: true });

export const LikeSchema = z.object({
    postId: z.string(),
})

export const BookmarkSchema = z.object({
    postId: z.string(),
})

export const CommentSchema = z.object({
    id: z.string(),
    body: z.string(),
    postId: z.string(),
})

export const CreateComment = CommentSchema.omit({ id: true })
export const UpdateComment = CommentSchema;
export const DeleteComment = CommentSchema.pick({ id: true })