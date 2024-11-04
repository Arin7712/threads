import { fetchUser, getActivity, getLikeActivity } from "@/lib/actions/user.actions";
import { formatDateString } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();

  if (!user) redirect("/onboarding");

  const userInfo = await fetchUser(user.id);


  // getActivity
  const activity = await getActivity(userInfo._id);
  const likesActivity = await getLikeActivity(userInfo._id);
  console.log(`LIKES:`, likesActivity)

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src={activity.author.image}
                      alt="Profile Picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />

                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.name}
                      </span>{" "}
                      replied to your thread
                    </p>
                  </div>
                  <p className="text-light-3 text-small-regular">
                    {formatDateString(activity.createdAt)}
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3"></p>
        )}

        {likesActivity.length > 0 ? (
          <>
            {likesActivity.map((like) => (
              <Link key={like.id} href={`/profile/${like.id}`}>
                <article className="activity-card">
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src={like.image}
                      alt="Profile Picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />

                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {like.name}
                      </span>{" "}
                      liked your thread
                    </p>
                  </div>
                  {/*<p className="text-light-3 text-small-regular">
                    {formatDateString(like.createdAt)}
                  </p>*/}
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3"></p>
        )}
      </section>
      {activity.length < 1 && likesActivity.length < 1 && (<p className="!text-base-regular text-light-3">No activity yet</p>)}
    </section>
  );
}

export default Page;
