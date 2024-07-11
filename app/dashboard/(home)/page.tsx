import Posts from "@/components/Posts";
import { PostSkeleton } from "@/components/Skeletons";
import React, { Suspense } from "react";

const Dashboard = () => {
    return <main className=" flex w-full flex-grow">
        <div className=" flex flex-col flex-1 gap-y-8 max-w-lg mx-auto pb-20">
            <Suspense fallback={<PostSkeleton/>} >
                <Posts/>
            </Suspense>
        </div>
    </main>;
};

export default Dashboard;
