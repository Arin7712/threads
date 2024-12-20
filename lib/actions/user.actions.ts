"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import mongoose from "mongoose";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    },);
  } catch (error: any) {
    console.log(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

export async function getLikeActivity(userId: string){
  
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (likes) from the 'children' field of each user thread
    const likesUsersIds = userThreads.reduce((acc: any[], thread) => {
      return acc.concat(thread.likes);
    }, []);

    if (likesUsersIds.length === 0) {
      return []; // Return empty array if no likes found
    }


    // Find and return the child threads (replies) excluding the ones created by the same user
    const likedByUsers = await User.find({
      _id: { $in: likesUsersIds, $ne : userId },
    }).select("name image id");

    return likedByUsers.map((user) => ({
      id: user.id, // Use the custom 'id' field
      name: user.name,
      image: user.image,
    }));

  } catch (error : any) {
    console.log(`Error while fetching the threads activity`, error.message);
    return [];
  }
}


export async function fetchFollowActivity(userId: string) {
  try {
    await connectToDB();

    // Find the user document by ID and populate followers' details
    const user = await User.findById(userId)
      .populate("followers", "username image id")
      .exec();

    if (!user) {
      console.log("User not found");
      return [];
    }

    // Extract followers' details
    const followers = user.followers.map((follower: any) => ({
      followerObjectId: follower._id,
      followerUsername: follower.username,
      followerImage: follower.image,
      followerId: follower.id,
    }));

    return followers;
  } catch (error) {
    console.log("Error fetching follow activity:", error);
    return [];
  }
}


export async function fetchCurrentUser() {
  try {
    const clerkUser = await currentUser(); // Fetch the logged-in user from Clerk

    if (!clerkUser) {
      throw new Error("User is not authenticated.");
    }

    await connectToDB();  // Ensure MongoDB connection

    // Fetch the user from MongoDB using the Clerk user id
    const dbUser = await User.findOne({ id: clerkUser.id }).populate({
      path: "communities",
      model: Community,
    });

    if (!dbUser) {
      throw new Error("User is not authenticated")
    }

    return dbUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function followUser(userId: string, targetUserId: string){
  try {

    await connectToDB();

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const targetUserObjectId = new mongoose.Types.ObjectId(targetUserId);

    const user = await User.findById(userObjectId);
    const targetUser = await User.findById(targetUserObjectId);

    if(!user || !targetUser)
      throw new Error('Cannot find user')


    // check if the user is already following the target user
    if(!user.following.includes(targetUserObjectId)){
      user.following.push(targetUserObjectId)
      targetUser.followers.push(userObjectId)

      await user.save();
      await targetUser.save();

      return {success: true, message: "User followed successfully"}
    }else{
      return {success: false, message: "try unfollow"}
          
        }}

      // unfollow the user if already following
catch (error: any) {
    console.log(`Error while following/unfollowing user`, error)
  }

}

export async function unfollowUser(userId: string, targetUserId: string){
try {
  await connectToDB();

  const userObjectId = new mongoose.Types.ObjectId(userId);
    const targetUserObjectId = new mongoose.Types.ObjectId(targetUserId);

    const user = await User.findById(userObjectId);
    const targetUser = await User.findById(targetUserObjectId);

  user.following = user.following.filter((id: string) => id.toString() !== targetUserId)
            targetUser.followers = targetUser.followers.filter((id: string) => id.toString() !== userId)
      
            await user.save();
            await targetUser.save();
      
            return { success: false, message: 'User unfollowed successfully!' };}

 catch (error) {
    return {success: false, error}
}}

export async function fetchFollowing(userId: string){
  try {
    await connectToDB();
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(userId);

    if(!user){
      console.log("Error fetching user")
    }

    return user?.following;

  } catch (error) {
    console.log(error)
  }
}

export async function fetchFollowerDetails(userId: string){
  try {
    await connectToDB();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(userObjectId).populate("followers")

    const followerDetails = user.followers.map((follower: any) => ({
      id: follower._id,
      ...follower.toObject(),
    }));

    if(!user){
      console.log("Error with user")
    }

    return followerDetails;

  } catch (error) {
    console.log("error fetching follower details")
  }
}

export async function fetchFollowingDetails(userId: string){
  try {
    await connectToDB();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(userObjectId).populate("following")

    const followingDetails = user.following.map((follower: any) => ({
      id: follower._id,
      ...follower.toObject(),
    }));

    if(!user){
      console.log("Error with user")
    }

    return followingDetails;

  } catch (error) {
    console.log("error fetching following details")
  }
}