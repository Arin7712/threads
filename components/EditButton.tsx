'use client'
import { deleteThread } from "@/lib/actions/thread.actions";
import { redirect, useRouter } from "next/navigation";

interface DeleteButtonProps {
  threadId: string;
  onAction: () => void
}

const EditButton = ({ threadId, onAction}: DeleteButtonProps) => {
  const router = useRouter();

  const navigateToEdit = async () => {
    onAction();
    router.push(`/update-thread/${threadId}`);
  };

  return (
    <button onClick={navigateToEdit} className="text-light-3">
      Edit
    </button>
  );
};

export default EditButton;
