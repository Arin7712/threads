'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import DeleteButton from "../DeleteButton"
import EditButton from "../EditButton"
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";


const ThreadActionDialog = (data: {threadId: string}) => {
    const[isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false); // Close the dialog
      };

  return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
   <DialogTrigger asChild>
        <button onClick={() => setIsOpen(true)}><FontAwesomeIcon icon={faEllipsisVertical} color="white"/></button>
      </DialogTrigger>
  <DialogContent>
    <DeleteButton threadId={data.threadId} onAction={handleClose}/>
    <EditButton threadId={data.threadId} onAction={handleClose}/>
  </DialogContent>
</Dialog>
  )
}

export default ThreadActionDialog

