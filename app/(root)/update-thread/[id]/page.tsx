import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts, fetchThreadById } from "@/lib/actions/thread.actions";
import { currentUser, User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { deleteThread } from "@/lib/actions/thread.actions";
import { fetchCurrentUser, fetchUser } from "@/lib/actions/user.actions";
import UpdateThreadForm from "@/components/forms/UpdateThreadForm";

export default async function Home({params}: {params: {id:string}}){
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  if(!user)redirect('/sign-in')
    const userInfo = await fetchUser(user.id);

  // If the user has not completed onboarding, redirect to the onboarding page
  if (!userInfo?.onboarded) {
    redirect('/onboarding');
  }

  const thread = await fetchThreadById(params.id);
  const {text, image, _id} = thread;

// Convert to buffer
  const curUser = await fetchCurrentUser();
  const textBuffer = Buffer.from(text);
  const imageBuffer = Buffer.from(image);
  const idBuffer = Buffer.from(_id);

  const userIdBuffer = Buffer.from(userInfo._id);
  const userIdBase64 = userIdBuffer.toString("base64");
  const textBufferBase64 = textBuffer.toString("base64");
  const imageBufferBase64 = imageBuffer.toString("base64");
  const idBufferBase64 = idBuffer.toString("base64");
  
  return(
<>
            <h1 className="head-text">Update Thread</h1>
            <UpdateThreadForm userId={userInfo._id} threadId={params.id} threadText={text} threadImage={image}/>
            {/* <PostThread userId={userInfo._id}></PostThread> */}
        </>
  )
}