"use server";

import prisma from "@/lib/prisma";
import { CreatePost, DeletePost, LikeSchema } from "./schemas";
import { z } from "zod";
import { getUserId } from "./utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createPost = async (values: z.infer<typeof CreatePost>) => {
    const userId = await getUserId();

    const validateFields = CreatePost.safeParse(values);

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create post.",
        };
    }

    const { fileUrl, caption } = validateFields.data;

    try {
        await prisma.post.create({
            data: {
                caption,
                fileUrl,
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
        });
    } catch(error) {
        return {
            message: "Database Error: Failed to Create Post."
        }
    }

    revalidatePath("/dashboard")
    redirect('/dashboard')
};


export const deletePost = async (formData: FormData) => {
    const userId = await getUserId();

    const { id } = DeletePost.parse({
        id: formData.get("id")
    })

    const post = await prisma.post.findUnique({
        where: {
            id,
            userId 
        }
    })

    if(!post) { throw new Error("Post not found"); }

    try {
        await prisma.post.delete({ where: { id } })
        revalidatePath("/dashboard");
        return {message: "Deleted Post."}
    } catch (error) {
        return { message: "Database Error: Failed to Delete Post."};
    }
}

export const likePost = async (value: FormDataEntryValue | null) => {
    const userId = await getUserId()
    const validateFields = LikeSchema.safeParse({postId: value})

    if(!validateFields.success){ 
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Missing Field. Failed to Like Post."
        }
    }

    const { postId } = validateFields.data

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    if(!post){
        throw new Error("Post not found.")
    }

    const like = await prisma.like.findUnique({
        where: {
            postId_userId: {
                postId, 
                userId
            }
        }
    })

    if(like){
        try {
            await prisma.like.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId
                    }
                }
            })
            revalidatePath("/dashboard")
            return { message: "Unliked Post." }
        } catch (error) {
            return { message: "Database Error: Failed to Unlike Post." }
        }
    }

    try {
        await prisma.like.create({
            data: {
                postId,
                userId
            }
        })
        revalidatePath("/dashboard")
        return {message: "Liked Post"}
    } catch (error) {
        return { message: "Database Error: Failed to Like Post." }
    }
}