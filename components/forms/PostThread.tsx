"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import { useUploadThing } from "@/lib/uploadthing";
import { ChangeEvent, useState } from "react";
import { isBase64Image } from "@/lib/utils";
import Image from "next/image";
import { Input } from "../ui/input";

interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('media')
  const router = useRouter();
  const pathname = usePathname();
  const {organization} = useOrganization();



  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
      image:''
    },
  });

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value:string) => void) => {
    e.preventDefault();

    const fileReader = new FileReader(); // initialize a file reader

    // checking if the image exists
    if(e.target.files && e.target.files.length > 0){
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      console.log('IMAGE URL:', file);

      if(!file.type.includes('image'))return;
      fileReader.onload = async(event) => {
        const imageDataUrl = event.target?.result?.toString() || '';

        fieldChange(imageDataUrl);
      }
      fileReader.readAsDataURL(file);
    }
  }

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    const blob = values.image;
    if(blob){
      const hasImageChanged = isBase64Image(blob);
      if(hasImageChanged){
        const imgRes = await startUpload(files);
        if(imgRes && imgRes[0].url){
          values.image = imgRes[0].url;
        }
      }
    }


    if (!organization) {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: null,
            path: '/',
            image: values.image || '', // Use the uploaded image URL
        });
    } else {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: organization.id,
            path: '/',
            image: values.image || '', // Use the uploaded image URL
        });
    }
    router.push('/')
};

  return (
    <>
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="thread-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="image"
                    width={96}
                    height={96}
                    priority
                    className="object-contain rounded"
                  />
                ) : (
                  <Image
                    src="/assets/upload-placeholder.svg"
                    alt="upload_image"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload an image"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} className="resize-none"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Post Thread
        </Button>
      </form>
    </Form>
    </>
  );
}

export default PostThread;