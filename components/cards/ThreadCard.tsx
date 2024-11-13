
import {
  deleteThread,
  fetchAllChildThreads,
  fetchThreadById,
  likeThread,
} from "@/lib/actions/thread.actions";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteButton from "../DeleteButton";
import Nothing from "../shared/Nothing"
import EditButton from "../EditButton";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchCurrentUser, fetchUser } from "@/lib/actions/user.actions";
import { revalidatePath } from "next/cache";
import ThreadShare from "../shared/ShareThread";
import ThreadActionDialog from "../shared/ThreadActionDialog";
import { format, parseISO } from 'date-fns';
import { create } from "domain";
import ThreadTime from "../shared/ThreadTime";


interface Props {
  id: string;
  curUserId: string;
  curThreadId: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: Date;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  image: string;
}

const ThreadCard =  async({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  curUserId,
  curThreadId,
  image,
}: Props) => {

  const countComments = await fetchAllChildThreads(id);
  const fetchThread = await fetchThreadById(id);
  const userLikes = fetchThread.likes.length;
  const user = await currentUser();
  const checkLike = fetchThread.likes.includes(curUserId);
  console.log('CHECKLIKE', checkLike)
  if(!user)redirect('/sign-in')
    const userInfo = await fetchUser(user.id);
    console.log('CURRENTUSER:', curUserId.toString());


  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile Photo"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar"></div>
          </div>

          <div className="flex w-full flex-col">
            <div className="flex flex-row justify-between">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            {curUserId === curThreadId && parentId == null && (
                  <ThreadActionDialog threadId={id}/> // contains the edit and delete buttons
            )}
            </div>
            {image.length > 0 && (
              <div className="mt-4">
                <Image
                  src={image}
                  alt="Thread Image"
                  width={200} // Adjust this based on your design
                  height={400} // Adjust height to maintain aspect ratio
                  className="rounded-lg object-contain" // Ensures it fits in the container
                />
              </div>
            )}
            

            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className={`mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5 items-center">
                {/*<Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />*/}
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                
                  {fetchThread.parentId? <></> : <>
                  
                    <Nothing threadId={id} userId={curUserId} likeState={checkLike} likesCount={userLikes}/>
                    <div className="text-white">{userLikes}</div>      
                  </>
                  }
                
              </div>

              {countComments.length > 0 && (
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {comments.slice(0, 3).map((comment, index) => (
                      <Image
                        key={index}
                        src={comment.author.image}
                        alt={`commenter-${index}`}
                        width={24}
                        height={24}
                        className="rounded-full border-2 border-light-3"
                      />
                    ))}
                  </div>
                  <Link href={`/thread/${id}`} className="ml-3">
                    <p className="mt-1 text-subtle-medium text-gray-1">
                      {countComments.length} repl
                      {countComments.length > 1 ? "ies" : "y"}
                    </p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*TODO: Delete a thread */}
        {/*TODO: Show comment logos */}
      </div>
      {!community ? (
        <div className="mt-5 flex items-center mb-10 flex-row justify-between">
          <p>
            <ThreadTime createdAt={createdAt}/>
          </p>
          <div className="flex flex-row gap-2 items-center">
          {curUserId === curThreadId && parentId == null && (
                  // <DeleteButton threadId={id} />
                  <></>
                )}
                {curUserId === curThreadId && parentId == null && (
                  // <EditButton threadId={id} />
                  <></>
                )}
          </div>
        </div>
      ) : (
        <></>
      )}
      {!isComment && community && (
        <div className="mt-5 flex items-center mb-10 flex-row justify-between">
        <Link
          href={`/communities/${community.id}`}
          className="flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {/*{formatDateString(createdAt)} -{" "}*/}
            <span className="text-primary-500">{community.name} Community</span>
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
        </div>
      )}
    </article>
  );
};

export default ThreadCard;
