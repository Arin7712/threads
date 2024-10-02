'use client'
import { deleteThread } from "@/lib/actions/thread.actions";
import { redirect, useRouter } from "next/navigation";

interface DeleteButtonProps {
  threadId: string;
}

const EditButton = ({ threadId}: DeleteButtonProps) => {
  const router = useRouter();

  const navigateToEdit = async () => {
    router.push(`/update-thread/${threadId}`);
  };

  return (
    <button onClick={navigateToEdit} className="text-red-500">
      Edit
    </button>
  );
};

export default EditButton;
