import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export const fetchPosts = async () => {
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
        throw new Error("Failed to fetch posts.");
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const posts = await fetchPosts();
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch posts" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
