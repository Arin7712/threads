'use client'

import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import { userValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from 'zod';
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import {usePathname, useRouter} from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface Props{
user:{
    id: string,
    objectId: string,
    username:string,
    name:string,
    bio:string,
    image:string,
};
btnTitle: string
}

const AccountProfile = ({user, btnTitle} : Props) => {

  const [files, setFiles] = useState<File[]>([]);
  const {startUpload} = useUploadThing('media');
  const router = useRouter();
  const pathname = usePathname();
  const[isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

    const form = useForm({
        resolver:zodResolver(userValidation),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user?.name || '',
            username: user?.username || '',
            bio:user?.bio || '',
        }
    });

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value:string) => void) => {
      e.preventDefault();

      const fileReader = new FileReader(); // initialize a file reader

      // checking if the image exists
      if(e.target.files && e.target.isDefaultNamespace.length > 0){
        const file = e.target.files[0];
        setFiles(Array.from(e.target.files));

        if(!file.type.includes('image'))return;
        fileReader.onload = async(event) => {
          const imageDataUrl = event.target?.result?.toString() || '';

          fieldChange(imageDataUrl);
        }
        fileReader.readAsDataURL(file);
      }
    }

      const onSubmit = async(values: z.infer<typeof userValidation>) => {
        setIsLoading(true);
        const blob = values.profile_photo;
        const hasImageChanged = isBase64Image(blob);

        if(hasImageChanged){
          const imgRes = await startUpload(files);
          if(imgRes && imgRes[0].url){
            values.profile_photo = imgRes[0].url;
          }
        }

        await updateUser({
          userId: user.id,
          username: values.username,
          name: values.name,
          bio: values.bio,
          image: values.profile_photo,
          path: pathname || ''

        });


        if(pathname === '/profile/edit'){
          setIsLoading(false);
          toast({
            description : "Profile updated successfully"
          })
          router.back();
        }else{
          setIsLoading(false);
          router.push('/');
        }
      }

    return(
        <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col justify-start gap-10">
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                  {field.value ? ( <Image 
                  src={field.value} 
                  alt='profile_photo'
                  width={96}
                  height={96}
                  priority
                  className="rounded-full object-contain"/>): (

                    <Image 
                  src='/assets/profile.svg' 
                  alt='profile_photo'
                  width={24}
                  height={24}
                  className="object-contain"/>
                  )}
               </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input 
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2 gap-3 w-full">
                  Name
               </FormLabel>
                <FormControl>
                  <Input 
                  type="text"
                  className="account-form_input no-focus"
                  {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2 gap-3 w-full">
                  Username
               </FormLabel>
                <FormControl>
                  <Input 
                  type="text"
                  className="account-form_input no-focus"
                  {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

<FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2 gap-3 w-full">
                  Bio
               </FormLabel>
                <FormControl>
                  <Textarea
                  rows={10}
                  className="account-form_input no-focus resize-none"
                  {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button className="bg-primary-500" type="submit">
            Submit
            {isLoading && (
            <Image src="/assets/loader.svg" alt="loader" width={20} height={20} className="ml-2 animate-spin"/>
          )}
            </Button>
        </form>
      </Form>
    )
}

export default AccountProfile