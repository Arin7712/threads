import React from 'react'
import UserCard from '../cards/UserCard'
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { fetchCommunities } from '@/lib/actions/community.actions';

const SubTopbar = async() => {
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
    <div className='sub_topbar'>
      <div className="flex flex-1 flex-row justify-start h-auto">
        <section>
          {/*Search bar*/}

          <div className="mt-14 flex flex-row gap-9">
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
    </div>
  )
}

export default SubTopbar
