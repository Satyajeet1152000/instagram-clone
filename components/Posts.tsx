import { fetchPosts } from "@/lib/data";
import React from "react";
import Post from "./Post";

const Posts = async () => {
    const posts = await fetchPosts();

    return <>
        {posts.map((post) => {
            console.log("posts mapping.")
            return <Post key={post.id} post = {post} />
        })}
    </>;
};

export default Posts;
