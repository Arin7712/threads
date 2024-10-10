"use client";

import { likeThread, fetchThreadById } from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";
import FontAwesome, { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart as likeHeart} from '@fortawesome/free-solid-svg-icons'
import {faHeart} from '@fortawesome/free-regular-svg-icons'
interface Props {
  threadId: string;
  userId: string;
  likeState: Boolean
}

const Nothing = ({ threadId, userId, likeState }: Props) => {
  const [isLiked, setIsLiked] = useState(false);

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
    const response = await likeThread(threadId, userId);
    if (response.success) {
      setIsLiked(true);
    } else {
      setIsLiked(false)
    }

    
  };

  return (
    <button onClick={toggleLike}>{isLiked? 
    <FontAwesomeIcon icon={likeHeart} color="red" width={24} height={24}/> : <FontAwesomeIcon icon={faHeart} color="red" width={24} height={24}/>}
    </button>
  );
};

export default Nothing;
