'use client'

import { cn } from "@/lib/utils";
import LikeButton from "./LikeButton";
import Link from "next/link";
import { PostWithExtras } from "@/lib/definations";
import ActionIcon from "./ActionIcon";
import { MessageCircle } from "lucide-react";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";

type Props = {
    post: PostWithExtras;
    userId?: string;
    className?: string;
};

const PostActions = ({ post, userId, className }: Props) => {
    return (
        <div
            className={cn(
                "relative flex items-start w-full gap-x-2",
                className
            )}
        >
            <LikeButton post={post} userId={userId} />
            <Link href={`/dashboard/p/${post.id}`}>
                <ActionIcon>
                    <MessageCircle className={"h-6 w-6"} />
                </ActionIcon>
            </Link>
            <ShareButton postId={post.id} />
            <BookmarkButton post={post} userId={userId} />
        </div>
    );
};

export default PostActions;
