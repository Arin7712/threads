'use client'

import React, { useEffect, useState } from 'react'

const ThreadTime = ({createdAt}: {createdAt: Date}) => {

    const [localTime, setLocalTime] = useState<string>("");
    console.log("CREATED AT:", createdAt)

    useEffect(() => {
        // Client-side conversion to local time after the component mounts
        const localTimeString = new Date(createdAt).toLocaleString(); // Adjusts to user's local time zone
        setLocalTime(localTimeString);
      }, [createdAt]);
  return (
    <div className="text-subtle-medium text-gray-1">
      {localTime}
    </div>
  )
}

export default ThreadTime
