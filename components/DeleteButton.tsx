'use client'
import { deleteThread } from "@/lib/actions/thread.actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DeleteButtonProps {
  threadId: string;
  createdAt: string
  onAction: () => void
}

const DeleteButton = ({ threadId, onAction, createdAt}: DeleteButtonProps) => {

  const [localTime, setLocalTime] = useState<string>("");


  useEffect(() => {
    // Client-side conversion to local time after the component mounts
    const localTimeString = new Date("2024-11-13T07:20:36.671+00:00").toLocaleString(); // Adjusts to user's local time zone
    setLocalTime(localTimeString);
  }, ["2024-11-13T07:20:36.671+00:00"]);

  const router = useRouter();
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
      {localTime}
    </button>
  );
};

export default DeleteButton;
