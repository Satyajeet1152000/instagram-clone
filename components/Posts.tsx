import { fetchPosts } from "@/lib/data";
import React from "react";
import Post from "./Post";

const Posts = async () => {
    // Implement data fetching logic
    const posts = await fetchPosts();

    return <>
        {posts.map((post) => (
            <Post
                key={post.id}
                post = {post}
            />
        ))}
    </>;
};

export default Posts;
