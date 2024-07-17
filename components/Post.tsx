"use client";
import { auth } from "@/auth";
import { PostWithExtras } from "@/lib/definations";
import UserAvatar from "./UserAvatar";
import PostOptions from "./PostOptions";
import { Card } from "./ui/card";
import Image from "next/image";
import PostActions from "./PostActions";
import Link from "next/link";
import Comments from "./Comments";
import Timestamp from "./Timestamp";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";


const Post = ({ post }: { post: PostWithExtras }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await auth();
            setSession(session);
            setUserId(session?.user?.id);
        };

        fetchSession();
    }, []);

    if (!session?.user) return null;

    const username = post.user.username;
    // const session = await auth();
    // const userId = session?.user?.id;
    // const username = post.user.username;

    // if (!session?.user) return null;

    return (
        <div className=" flex flex-col space-y-2.5">
            <div className="flex items-center justify-between px-3 sm:px-0">
                <div className="flex space-x-3 items-center">
                    <UserAvatar user={post.user} />
                    <div className="text-sm">
                        <p className="space-x-1">
                            <span className="font-semibold">{username}</span>
                            <span
                                className="font-medium text-neutral-400 dark:text-white
                                text-xs
                                "
                            >
                                •
                            </span>
                            <Timestamp createdAt={post.createdAt} />
                        </p>
                        <p className="text-xs text-black dark:text-white font-medium">
                            {post.location}
                        </p>
                    </div>
                </div>
                <PostOptions post={post} userId={userId} />
            </div>
            <Card className="relative h-[450px] w-full overflow-hidden rounded-none sm:rounded-md">
                <Image
                    src={post.fileUrl}
                    alt="Post Image"
                    fill
                    className="sm:rounded-md object-cover"
                />
            </Card>

            <PostActions post={post} userId={userId} className="px-3 sm:px-0" />

            {post.caption && (
                <div className="text-sm leading-none flex items-center space-x-2 font-medium px-3 sm:px-0">
                    <Link href={`/dashboard/${username}`} className="font-bold">
                        {username}
                    </Link>
                    <p>{post.caption}</p>
                </div>
            )}

            <Comments
                postId={post.id}
                comments={post.comments}
                user={session.user}
            />
        </div>
    );
};

export default Post;
