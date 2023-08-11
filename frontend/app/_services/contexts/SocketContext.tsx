"use client";
import IMessage from "_services/interfaces/IMessage";
import ISocketContext from "_services/interfaces/ISocketContext";
import { createContext, useContext, useEffect, useState } from "react";
import * as socketIO from "socket.io-client";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";
import { useUserService } from "_services/useUserService";

const intialData: ISocketContext = {
  socket: undefined,
  roomUsers: {},
  messages: {},
};

const SocketContext = createContext<ISocketContext>(intialData);

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [roomUsers, setRoomUsers] = useState({});
  const [socket, setSocket] = useState<socketIO.Socket>();
  const [messages, setMessages] = useState<{ [key: string]: IMessage[] }>({});
  const userService = useUserService();
  const user = userService.currentUser;
  const username = user?.username;

  // const { username } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.replace("/");
      return;
    }
    let socket = socketIO.connect(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000");
    socket.on("receive_message", (data: IMessage) => {
      setMessages((prev) => {
        const newMessages = { ...prev };
        newMessages[data.roomId] = [...(newMessages[data.roomId] ?? []), data];
        return newMessages;
      });
    });
    socket.on("users_response", (data) => setRoomUsers(data));
    setSocket(socket);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, roomUsers, messages }}>
      {children}
    </SocketContext.Provider>
  );
}
