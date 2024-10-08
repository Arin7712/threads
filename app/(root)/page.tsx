import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser, User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { deleteThread } from "@/lib/actions/thread.actions";
import { fetchCurrentUser, fetchUser } from "@/lib/actions/user.actions";

export default async function Home(){
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  if(!user)redirect('/sign-in')
    const userInfo = await fetchUser(user.id);

  // If the user has not completed onboarding, redirect to the onboarding page
  if (!userInfo?.onboarded) {
    redirect('/onboarding');
  }

    const curUser = await fetchCurrentUser();
  
    const threadsWithAuthorCheck = result.posts.map((post) => {  
      // Check if the current user's ID matches the author of the thread
      const isAuthor = curUser._id.toString() === post.author._id.toString();
  
      // Log a message if the current user is the author of the thread
      if (isAuthor) {
        console.log(`Current user is the author of thread: ${post._id}`);
      }else{
        console.log('not')
      }
  
      return {
        ...post, // Spread the existing post properties
        isAuthor, // Add the isAuthor flag to the post
      };
    });

  return(
    <>
      <h1 className="head-text text-left ">Threads</h1>
      {/*<div className="w-full h-full min-h-[700px]">
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/Ss0S_4ShD_JbnP6RMew2B"
        className="w-full h-full"
        frameBorder="0"
        title="Chatbot"
      ></iframe>
    </div>*/}
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0? (
          <p className="no-result">No threads found</p>
        ):(
          <>
          {result.posts.map((post) => (
            <ThreadCard
            key={post._id}
            id={post._id.toString()}
            currentUserId={user.id.toString()}
            parentId={post.parentId}
            content={post.text}
            author={post.author}
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}
            curUserId={curUser._id.toString()}
            curThreadId={post.author._id.toString()}
            image={post.image.toString()}
            />
          ))}
          </>
        )}
      </section>
    </>
  )
}