import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../../../../components/ui/tabs'
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import RepliesCard from "@/components/cards/RepliesCard";

async function Page({params} : {params: {id: string}}){
    const user = await currentUser();

    if(!user)return null;

    const userInfo = await fetchUser(params.id);

    if(!userInfo?.onboarded) redirect('/onboarding');
    
    return (
        <section>
            <ProfileHeader
            accountId={userInfo.id}
            authUserId={user.id}
            name={userInfo.name}
            username={userInfo.username}
            imgUrl={userInfo.image}
            bio={userInfo.bio}
            curUserId={userInfo.id}
            />
            
            <div className="mt-9">
                <Tabs defaultValue='threads' className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain"/>
                                <p className="max-sm:hidden">{tab.label}</p>

                                {tab.label === 'Threads' && (
                                    <p className="ml-1 rounded-sm bg-primary-500 px-2 py-1 !text-tiny-medium text-light-2">
                                        {userInfo?.threads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent key={`content-Replies`} value="replies" className="w-full text-light-1">
                        <RepliesCard/>
                    </TabsContent>

                    <TabsContent key={`content-Threads`} value="threads" className="w-full text-light-1">
                        <ThreadsTab currentUserId={user.id} accountId={userInfo.id} accountType="User"/>
                    </TabsContent>

                    <TabsContent key={`content-Tagged`} value="tagged" className="w-full text-light-1">
                        tagged
                    </TabsContent>

                </Tabs>
            </div>
        </section>
    )
}

export default Page;