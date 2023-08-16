"use client";
import IRoom from "_services/interfaces/IRoom";
import IRoomContext from "_services/interfaces/IRoomContext";
import { createContext, useContext, useEffect, useState } from "react";

const intialData: IRoomContext = {
  rooms: [],
  myRooms: [],
  setMyRooms: () => {},
};

const RoomContext = createContext<IRoomContext>(intialData);

export function useRoom() {
  return useContext(RoomContext);
}

export default function RoomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [myRooms, setMyRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    fetchRoomsfromServer();
    fetchMyRooms();
  }, []);

  useEffect(() => {
    updateMyRooms();
  }, [myRooms]);

  async function fetchRoomsfromServer(): Promise<void> {
    const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/";
    // const response = await fetch(url + "rooms");
    const response = await fetch(url + "/rooms");
    const rooms = await response.json();
    setRooms(rooms);
  }

  function fetchMyRooms() {
    const myRooms = localStorage.getItem("myRooms");
    if (myRooms) setMyRooms(JSON.parse(myRooms));
    else setMyRooms([]);
  }

  function updateMyRooms() {
    localStorage.setItem("myRooms", JSON.stringify(myRooms));
  }

  return (
    <RoomContext.Provider value={{ rooms, myRooms, setMyRooms }}>
      {children}
    </RoomContext.Provider>
  );
}
