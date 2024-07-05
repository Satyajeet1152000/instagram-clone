import { unstable_noStore as noStore} from "next/cache"
import prisma from "./prisma"

export const fetchPosts = async () => {
    noStore()

    try {
        const data = await prisma.post.findMany({
            include: {
                comments: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                likes: {
                    include: {
                        user: true
                    },
                },
                savedBy: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return data;
    } catch (error) {
        console.log("Database Error: ", error);
        throw new Error("Faild to fetch posts.");
    }
}