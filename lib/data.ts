'use server'
import { unstable_noStore as noStore } from "next/cache";
import prisma from "./prisma";

export const fetchPosts = async () => {
    noStore();

    try {
        const data = await prisma.post.findMany({
            include: {
                comments: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                likes: {
                    include: {
                        user: true,
                    },
                },
                savedBy: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return data;
    } catch (error) {
        console.log("Database Error: ", error);
        throw new Error("Faild to fetch posts.");
    }
};

export const fetchPostById = async (id: string) => {
    noStore();

    try {
        const data = await prisma.post.findUnique({
            where: {
                id,
            },
            include: {
                comments: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                likes: {
                    include: {
                        user: true,
                    },
                },
                savedBy: true,
                user: true,
            },
        });
        return data;
    } catch (error) {
        console.error("Database Error: ", error);
        throw new Error("Failed to fetch Post.");
    }
};

export const fetchPostsByUsername = async (
    username: string,
    postId?: string
) => {
    noStore();

    try {
        const data = await prisma.post.findMany({
            where: {
                user: {
                    username,
                },
                NOT: {
                    id: postId,
                },
            },
            include: {
                comments: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                likes: {
                    include: {
                        user: true,
                    },
                },
                savedBy: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch posts");
    }
};

export const fetchProfile = async (username: string) => {
    noStore();

    try {
        const data = await prisma.user.findUnique({
            where: {
                username,
            },
            include: {
                posts: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                saved: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                followedBy: {
                    include: {
                        follower: {
                            include: {
                                following: true,
                                followedBy: true,
                            },
                        },
                    },
                },
                following: {
                    include: {
                        following: {
                            include: {
                                following: true,
                                followedBy: true,
                            },
                        },
                    },
                },
            },
        });

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch profile");
    }
};

export const fetchSavedPostsByUsername  = async (username: string) => {
    noStore();

    try {
        const data = await prisma.savedPost.findMany({
            where: {
                user: {
                    username,
                },
            },
            include: {
                post: {
                    include: {
                        comments: {
                            include: {
                                user: true,
                            },
                            orderBy: {
                                createdAt: "desc",
                            },
                        },
                        likes: {
                            include: {
                                user: true,
                            },
                        },
                        savedBy: true,
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch saved posts");
    }
};
