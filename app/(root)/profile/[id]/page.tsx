import ProfileHeader from "@/components/shared/ProfileHeader";
import {
  fetchFollowerDetails,
  fetchFollowingDetails,
  fetchUser,
} from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import RepliesCard from "@/components/cards/RepliesCard";
import UserCard from "@/components/cards/UserCard";
import FollowBtn from "@/components/shared/FollowBtn";
import { Suspense } from "react";
import Loading from "../../Loading";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const followers = await fetchFollowerDetails(userInfo._id);
  const following = await fetchFollowingDetails(userInfo._id);

  return (
    <section>
      <Suspense fallback={<Loading/>}>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        followId2={userInfo._id.toString()}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        curUserId={userInfo.id}
        paramsId={params.id}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-primary-500 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent
            key={`content-Replies`}
            value="replies"
            className="w-full text-light-1"
          >
            <RepliesCard />
          </TabsContent>

          <TabsContent
            key={`content-Threads`}
            value="threads"
            className="w-full text-light-1"
          >
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
            />
          </TabsContent>

          <TabsContent
            key={`content-Tagged`}
            value="tagged"
            className="w-full text-light-1"
          >
            tagged
          </TabsContent>

          <TabsContent
            key={`content-Tagged`}
            value="followers"
            className="w-full flex flex-col mt-9 gap-9 text-light-1"
          >
            {followers.map((person: any) => (
              <UserCard
                key={person.id}
                currentUserId={userInfo._id.toString()}
                followId={person._id.toString()}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </TabsContent>

          <TabsContent
            key={`content-Tagged`}
            value="following"
            className="w-full flex flex-col mt-9 gap-9 text-light-1"
          >
            {following.map((person: any) => (
              <UserCard
                key={person.id}
                currentUserId={userInfo._id.toString()}
                followId={person._id.toString()}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
      </Suspense>
    </section>
  );
}

export default Page;
