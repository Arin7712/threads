import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import CommunityCard from "../cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.actions";

async function RightSidebar() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch Users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageSize: 25,
    pageNumber: 1,
  });
  const comResult = await fetchCommunities({
    searchString: "",
    pageSize: 25,
    pageNumber: 1,
  });
  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start h-60">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>
        <div className="mt-14 flex flex-col gap-9 overflow-y-scroll">
          {comResult.communities.length === 0 ? (
            <p className="no-result">No users</p>
          ) : (
            <>
              {comResult.communities.map((community) => (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start h-60">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        <section>
          {/*Search bar*/}

          <div className="mt-14 flex flex-col gap-9">
            {result.users.length === 0 ? (
              <p className="no-result">No users</p>
            ) : (
              <>
                {result.users.map((person) => (
                  <UserCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    username={person.username}
                    imgUrl={person.image}
                    personType="User"
                  />
                ))}
              </>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default RightSidebar;
