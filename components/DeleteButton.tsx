'use client'
import { deleteThread } from "@/lib/actions/thread.actions";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  threadId: string;
}

const DeleteButton = ({ threadId}: DeleteButtonProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this thread?")) {
      try {
        await deleteThread(threadId, '/thread');
      } catch (error) {
        console.error("Failed to delete thread:", error);
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500">
      Delete
    </button>
  );
};

export default DeleteButton;
