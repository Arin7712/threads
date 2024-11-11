import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Page(){
    const user = await currentUser();
    

    if(!user)return null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');

    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <Suspense fallback={<div>Loading...</div>}>
        <PostThread userId={userInfo._id} />
      </Suspense>
        </>

)
}

export default Page;