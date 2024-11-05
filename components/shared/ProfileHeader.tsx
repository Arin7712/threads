import { fetchCurrentUser, fetchUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import FollowBtn from "./FollowBtn";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  followId2: string
  username: string;
  imgUrl: string;
  bio: string;
  curUserId: string;
  type?: "User" | "Community";
}

const ProfileHeader = async ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
  curUserId,
  followId2,
}: Props) => {
  const user = await fetchCurrentUser();
  const userInfo = await fetchUser(user.id);

  const followers = userInfo.followers.length;
  const following = userInfo.following.length;
  const threads = userInfo.threads.length;

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <div className="flex-1">
              <h2 className="text-left text-heading3-bold text-light-1">
                {name}
              </h2>
              <p className="text-base-medium text-gray-1">@{username}</p>
            </div>
          </div>
          <div>

          {accountId !== user.id && (

<FollowBtn
  id={userInfo.id}
  currentUserId={userInfo._id.toString()}
  followId={followId2}
/>
)}
            {authUserId === curUserId && (
              <div className="flex-shrink-0 justify-end">
                {" "}
                
                {/* Prevents the button from shrinking */}
                <a
                  className="text-light-2 bg-primary-500 text-small-regular p-2 rounded-md font-medium"
                  href="/updateUser"
                >
                  Update profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*TODO: Community */}
      <div className="flex w-full flex-row justify-between md:justify-between">
        <p className="mt-6  text-base-regular text-light-2">
          {followers} followers
        </p>
        <p className="mt-6  text-base-regular text-light-2">
          {following} following
        </p>
        <p className="mt-6 text-base-regular text-light-2">
          {threads} threads
        </p>
      </div>

      <p className="mt-6 md:mt-2 max-w-lg text-base-regular text-light-3">{bio}</p>

      <div className="mt-12 h-0.5 w-full bg-dark-3"></div>
    </div>
  );
};

export default ProfileHeader;
