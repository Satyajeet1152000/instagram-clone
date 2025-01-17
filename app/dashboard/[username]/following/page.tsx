import FollowingModal from "@/components/FollowingModal";
import { fetchProfile } from "@/lib/data";

const FollowingPage = async ({
    params: { username },
}: {
    params: {
        username: string;
    };
}) => {
    const profile = await fetchProfile(username);
    const following = profile?.following;

    return <FollowingModal following={following} username={username} />;
};

export default FollowingPage;
