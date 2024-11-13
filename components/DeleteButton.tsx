'use client'
import { deleteThread } from "@/lib/actions/thread.actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast"


interface DeleteButtonProps {
  threadId: string;
  onAction: () => void
}

const DeleteButton = ({ threadId, onAction}: DeleteButtonProps) => {

  const router = useRouter();
  const {toast} = useToast();
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this thread?")) {
      try {
        await deleteThread(threadId, '/thread');
      } catch (error) {
        console.error("Failed to delete thread:", error);
      }
    }
    onAction();
    toast({
      description: "Thread Successfully deleted.",
    })
  };

  return (
    <button onClick={handleDelete} className="text-light-3">
      Delete
    </button>
  );
};

export default DeleteButton;
