import { fetchCurrentUser, fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props{
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async({currentUserId, accountId, accountType}: Props) => {
    const curUser = await fetchCurrentUser();
    let result: any;
    if(accountType === 'Community'){

         result = await fetchCommunityPosts(accountId);
    }else{
        result = await fetchUserPosts(accountId);
    }

    if(!result) redirect('/')
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any) => (
                <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                content={thread.text}
                author={
                    accountType === 'User'? {
                        name: result.name, image: result.image, id: result.id
                    }:{
                        name: thread.author.name, image: thread.author.image, id: thread.author.id
                    }
                } //todo
                community={thread.community} //todo
                createdAt={thread.createdAt}
                comments={thread.children}
                curUserId={curUser._id.toString()}
                curThreadId={thread.author._id.toString()}
                image={thread.image.toString()}
                />
            ))}
        </section>
    )
}

export default ThreadsTab;