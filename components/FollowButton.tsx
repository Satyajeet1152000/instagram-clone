import React from "react";
import SubmitButton from "./SubmitButton";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { followUser } from "@/lib/actions";

const FollowButton = ({
    profileId,
    isFollowing,
    className,
    buttonClassName,
  }: {
    profileId: string;
    isFollowing?: boolean;
    className?: string;
    buttonClassName?: string;
  }) => {
    return (
        <form action={followUser} className={className}>
            <input type="hidden" value={profileId} name="id" />
            <SubmitButton
                className={buttonVariants({
                    variant: isFollowing ? "secondary" : "default",
                    className: cn("!font-bold w-full", buttonClassName),
                    size: "sm",
                })}
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </SubmitButton>
        </form>
    );
};

export default FollowButton;
