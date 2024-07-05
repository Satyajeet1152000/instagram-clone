"use server";

import prisma from "@/lib/prisma";
import { CreatePost } from "./schemas";
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
