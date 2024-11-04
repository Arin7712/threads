"use client"

const ThreadShare = (threadId: any) => {
    const threadUrl = `localhost:3000/threads/${threadId}`;
    const title = "Check out this thread!";
    const text = "Take a look at this interesting thread:";
  
    const shareContent = async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: text,
            url: threadUrl,
          });
        } else {
          alert("Web Share API not supported in this browser.");
        }
      } catch (error) {
        console.error("Error sharing:", error);
      }
    };
  
    return (
      <div className="share-buttons">
        <button onClick={shareContent} className="share-button">
          Share this thread
        </button>
      </div>
    );
  };
  
  export default ThreadShare;
  