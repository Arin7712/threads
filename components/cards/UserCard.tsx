"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  fetchFollowing,
  followUser,
  unfollowUser,
} from "@/lib/actions/user.actions";
import { useToast } from "@/hooks/use-toast";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
  currentUserId: string;
  followId: string;
}

const UserCard = ({
  id,
  name,
  username,
  imgUrl,
  personType,
  currentUserId,
  followId,
}: Props) => {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false); // Initial follow state is set to false
  const {toast} = useToast();
  
  // Fetch the follow status when the component mounts
  
  useEffect(() => {
    console.log("FOLLOWID", followId); // This will log only when followId or currentUserId changes
    const checkFollowStatus = async () => {
      try {
        const response = await fetchFollowing(currentUserId); // Fetch the list of users the current user is following
        const isFollowingUser = response.includes(followId); // Check if the target user is in the following list
        setIsFollowing(isFollowingUser);
      } catch (error) {
        console.log(`Error fetching follow status: ${error}`);
      }
    };
  
    if (followId) {
      checkFollowStatus(); // Only check if followId is defined
    }
  }, [currentUserId, followId]); // // Dependency array ensures the effect runs when these props change

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow the user
        const response = await unfollowUser(currentUserId, followId);
        if (response?.success) {
          setIsFollowing(false); // Update the state to unfollowed
          toast({
            description: "Unfollowed successfully"
          })
        }
      } else {
        // Follow the user
        const response = await followUser(currentUserId, followId);
        if (response?.success) {
          setIsFollowing(true); // Update the state to followed
          toast({
            description: "Followed successfully"
          })
        }
      }
    } catch (error) {
      console.log(`Error following/unfollowing: ${error}`);
    }
  };

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button className="user-card_btn" onClick={handleFollow}>
        {isFollowing ? "unfollow" : "follow"}
      </Button>
      <Button
        className="user-card_btn"
        onClick={() => router.push(`/profile/${id}`)}
      >
        View
      </Button>
    </article>
  );
};

export default UserCard;
