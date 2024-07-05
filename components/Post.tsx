import { auth } from "@/auth";
import { PostWithExtras } from "@/lib/definations";
import React from "react";
import UserAvatar from "./UserAvatar";

const Post = async ({ post }: { post: PostWithExtras }) => {
    const session = await auth();
    const userId = session?.user?.id
    const username = post.user.username

    if(!session?.user) return null;

    return <div className=" flex flex-col space-y-2.5">
        <div className=" flex items-center justify-between px-3 sm:px-0">
            <div className=" flex space-x-3 items-center ">
                <UserAvatar user={post.user}/>
            </div>
            <div className="text-sm"></div>
        </div>

    </div>;
};

export default Post;
