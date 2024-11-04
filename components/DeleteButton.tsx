'use client'
import { deleteThread } from "@/lib/actions/thread.actions";

interface DeleteButtonProps {
  threadId: string;
  onAction: () => void
}

const DeleteButton = ({ threadId, onAction}: DeleteButtonProps) => {

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this thread?")) {
      try {
        await deleteThread(threadId, '/thread');
      } catch (error) {
        console.error("Failed to delete thread:", error);
      }
    }
    onAction();
  };

  return (
    <button onClick={handleDelete} className="text-light-3">
      Delete
    </button>
  );
};

export default DeleteButton;
