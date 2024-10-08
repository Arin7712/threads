import Image from "next/image";

interface Props{
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    curUserId: string;
    type?: 'User' | 'Community'
}

const ProfileHeader = ({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    type,
    curUserId
}: Props) => {
    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20 object-cover">
                        <Image src={imgUrl} alt='profile image' fill className="rounded-full object-cover shadow-2xl"/>
                    </div>

                    <div className="flex-1">
                        <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">
                            {name}
                        </h2>
                        <p className="text-base-medium text-gray-1">@{username}</p>
                        </div>
                    </div>
                    {authUserId === curUserId && (
                    <div className="flex-shrink-0"> {/* Prevents the button from shrinking */}
                        <a className="text-light-2 bg-primary-500 text-small-regular p-1 rounded-md font-medium" href='/updateUser'>
                            Update profile
                        </a>
                    </div>
                )}
                </div>
            </div>

                {/*TODO: Community */}
                <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
                
                <div className="mt-12 h-0.5 w-full bg-dark-3">
                </div>
        </div>
    )
}

export default ProfileHeader;