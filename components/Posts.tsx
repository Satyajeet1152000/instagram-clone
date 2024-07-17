'use client'
import { fetchPosts } from "@/lib/data";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import { PostWithExtras } from "@/lib/definations";

const Posts = () => {
    const [posts, setPosts] = useState<PostWithExtras[]>([]);
    const [loading, setLoading] = useState(true);

    // const posts = await fetchPosts();

    useEffect(() => {
        const getPosts = async () => {
            try {
                const postData = await fetch('/api/posts');
                const data: PostWithExtras[] = await postData.json();
                setPosts(data);
            } catch (error) {
                console.log("Posts.tsx Errors--------- ", error);
            } finally {
                setLoading(false);
            }
        };

        getPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {posts.map((post: any) => {
                return <Post key={post.id} post={post} />;
            })}
        </>
    );
};

export default Posts;
