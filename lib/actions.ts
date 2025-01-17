"use server";

import prisma from "@/lib/prisma";
import {
    BookmarkSchema,
    CreateComment,
    CreatePost,
    DeleteComment,
    DeletePost,
    FollowUser,
    LikeSchema,
    UpdatePost,
    UpdateUser,
} from "./schemas";
import { z } from "zod";
import { getUserId } from "./utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getUserLocation from "./getUserLocation";

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
    let {location } = validateFields.data;
    // console.log(location)
    location = location ? await getUserLocation(location) : "";

    try {
        await prisma.post.create({
            data: {
                caption,
                fileUrl,
                location,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Post.",
        };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
};

export const deletePost = async (formData: FormData) => {
    const userId = await getUserId();

    const { id } = DeletePost.parse({
        id: formData.get("id"),
    });

    const post = await prisma.post.findUnique({
        where: {
            id,
            userId,
        },
    });

    if (!post) {
        throw new Error("Post not found");
    }

    try {
        await prisma.post.delete({ where: { id } });
        revalidatePath("/dashboard");
        return { message: "Deleted Post." };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Post." };
    }
};

export const likePost = async (value: FormDataEntryValue | null) => {
    const userId = await getUserId();
    const validateFields = LikeSchema.safeParse({ postId: value });

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Missing Field. Failed to Like Post.",
        };
    }

    const { postId } = validateFields.data;

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new Error("Post not found.");
    }

    const like = await prisma.like.findUnique({
        where: {
            postId_userId: {
                postId,
                userId,
            },
        },
    });

    if (like) {
        try {
            await prisma.like.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId,
                    },
                },
            });
            revalidatePath("/dashboard");
            return { message: "Unliked Post." };
        } catch (error) {
            return { message: "Database Error: Failed to Unlike Post." };
        }
    }

    try {
        await prisma.like.create({
            data: {
                postId,
                userId,
            },
        });
        revalidatePath("/dashboard");
        return { message: "Liked Post" };
    } catch (error) {
        return { message: "Database Error: Failed to Like Post." };
    }
};

export const bookmarkPost = async (value: FormDataEntryValue | null) => {
    const userId = await getUserId();

    const validatedFields = BookmarkSchema.safeParse({ postId: value });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Bookmark Post.",
        };
    }

    const { postId } = validatedFields.data;

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new Error("Post not found.");
    }

    const bookmark = await prisma.savedPost.findUnique({
        where: {
            postId_userId: {
                postId,
                userId,
            },
        },
    });

    if (bookmark) {
        try {
            await prisma.savedPost.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId,
                    },
                },
            });
            revalidatePath("/dashboard");
            return { message: "Unbookmarked Post." };
        } catch (error) {
            return {
                message: "Database Error: Failed to Unbookmark Post.",
            };
        }
    }

    try {
        await prisma.savedPost.create({
            data: {
                postId,
                userId,
            },
        });
        revalidatePath("/dashboard");
        return { message: "Bookmarked Post." };
    } catch (error) {
        return {
            message: "Database Error: Failed to Bookmark Post.",
        };
    }
};

export const createComment = async (values: z.infer<typeof CreateComment>) => {
    const userId = await getUserId();

    const validatedFields = CreateComment.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Comment.",
        };
    }

    const { postId, body } = validatedFields.data;

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new Error("Post not found");
    }

    try {
        await prisma.comment.create({
            data: {
                body,
                postId,
                userId,
            },
        });
        revalidatePath("/dashboard");
        return { message: "Created Comment." };
    } catch (error) {
        return { message: "Database Error: Failed to Create Comment." };
    }
};

export const deleteComment = async (formData: FormData) => {
    const userId = await getUserId();

    const { id } = DeleteComment.parse({
        id: formData.get("id"),
    });

    const comment = await prisma.comment.findUnique({
        where: {
            id,
            userId,
        },
    });

    if (!comment) {
        throw new Error("Comment not found");
    }

    try {
        await prisma.comment.delete({
            where: {
                id,
            },
        });
        revalidatePath("/dashboard");
        return { message: "Deleted Comment." };
    } catch (error) {
        return { message: "Database Error: Failed to Delete Comment." };
    }
};

export const followUser = async (formData: FormData) => {
    const userId = await getUserId();

    const { id } = FollowUser.parse({
        id: formData.get("id"),
    });

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const follows = await prisma.follows.findUnique({
        where: {
            followerId_followingId: {
                // followerId is of the person who wants to follow
                followerId: userId,
                // followingId is of the person who is being followed
                followingId: id,
            },
        },
    });

    if (follows) {
        try {
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: id,
                    },
                },
            });
            revalidatePath("/dashboard");
            return { message: "Unfollowed User." };
        } catch (error) {
            return {
                message: "Database Error: Failed to Unfollow User.",
            };
        }
    }

    try {
        await prisma.follows.create({
            data: {
                followerId: userId,
                followingId: id,
            },
        });
        revalidatePath("/dashboard");
        return { message: "Followed User." };
    } catch (error) {
        return {
            message: "Database Error: Failed to Follow User.",
        };
    }
};

export const updateProfile = async (values: z.infer<typeof UpdateUser>) => {
    const userId = await getUserId();

    const validatedFields = UpdateUser.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Profile.",
        };
    }

    const { bio, gender, image, name, username, website } =
        validatedFields.data;

    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                username,
                name,
                image,
                bio,
                gender,
                website,
            },
        });
        revalidatePath("/dashboard");
        return { message: "Updated Profile." };
    } catch (error) {
        return { message: "Database Error: Failed to Update Profile." };
    }
};

export const updatePost = async (values: z.infer<typeof UpdatePost>) => {
    const userId = await getUserId();

    const validatedFields = UpdatePost.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Post.",
        };
    }

    const { id, fileUrl, caption } = validatedFields.data;

    const post = await prisma.post.findUnique({
        where: {
            id,
            userId,
        },
    });

    if (!post) {
        throw new Error("Post not found");
    }

    try {
        await prisma.post.update({
            where: {
                id,
            },
            data: {
                fileUrl,
                caption,
            },
        });
    } catch (error) {
        return { message: "Database Error: Failed to Update Post." };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
};
