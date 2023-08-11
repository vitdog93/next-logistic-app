"use client";
import ChatBody from "_components/Chat/ChatBody";
import ChatFooter from "_components/Chat/ChatFooter";
import ChatHeader from "_components/Chat/ChatHeader";
import { useSocket } from "_services/contexts/SocketContext";
// import { useUser } from "_services/contexts/UserContext";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useUserService } from "_services";
function Page() {
  const { roomId } = useParams() as { 
    roomId: string;
  };
  const { socket, roomUsers } = useSocket();
  const userService = useUserService();
  const username = userService.currentUser?.username

  useEffect(() => {
    if ( typeof roomId === "string" && roomUsers[roomId]?.includes(socket?.id)) return;
    socket?.emit("send_message", {
      text: username + " joined the room.",
      socketId: "kurakani",
      roomId: roomId,
    });
    socket?.emit("join_room", roomId);
  }, []);

  return (
    <div className="flex relative flex-col w-full h-screen">
      <ChatHeader roomId={roomId} />
      <ChatBody roomId={roomId} />
      <ChatFooter roomId={roomId} />
    </div>
  );
}

export default Page;
