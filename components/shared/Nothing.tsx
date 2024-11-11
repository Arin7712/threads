"use client";

import { likeThread, fetchThreadById } from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";
import FontAwesome, { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart as likeHeart} from '@fortawesome/free-solid-svg-icons'
import {faHeart} from '@fortawesome/free-regular-svg-icons'
import Image from "next/image";

interface Props {
  threadId: string;
  userId: string;
  likeState: Boolean;
  likesCount: string
}

const Nothing = ({ threadId, userId, likeState , likesCount}: Props) => {
  const [isLiked, setIsLiked] = useState(false);
  const[isLoading, setIsLoading] = useState(false);
  const[likes, setLikes] = useState(likesCount);

  useEffect(() => {
    if (likeState) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [likeState]); // This effect runs only when likeState changes
  
  {/*useEffect(() => {
    const fetchThread = async () => {
      const thread = await fetchThreadById(threadId);
      if (thread.likes.includes(userId)) {
        setIsLiked(true);
      }
    };
    fetchThread();
  }, [threadId, userId]);*/}

  const toggleLike = async () => {
    setIsLoading(true);
    // const likesCount = await fetchThreadById(threadId);
    // setLikes(likesCount.likes.length)
    const response = await likeThread(threadId, userId, "/");
    if (response.success) {
      setIsLiked(true);
      setIsLoading(false);
    }
     else {
      setIsLiked(false);
      setIsLoading(false);
    }

    
  };

  return (
    <div>
    <button className="flex" onClick={toggleLike}>{isLiked? 
    <FontAwesomeIcon icon={likeHeart} color="red" width={24} height={24}/> : <FontAwesomeIcon icon={faHeart} color="red" width={24} height={24}/>}

{isLoading && (
            <Image src="/assets/loader.svg" alt="loader" width={20} height={20} className="ml-2 animate-spin"/>
          )}
    </button>
    </div>
  );
};

export default Nothing;
