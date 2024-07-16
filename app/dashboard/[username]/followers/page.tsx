import FollowersModal from "@/components/FollowersModal";
import { fetchProfile } from "@/lib/data";
import React from "react";

const FollowersPage = async ({
    params: { username },
}: {
    params: {
        username: string;
    };
}) => {
    const profile = await fetchProfile(username);
    const followers = profile?.followedBy;

    return <FollowersModal followers={followers} username={username} />;
};

export default FollowersPage;
