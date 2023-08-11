import RoomSideBar from "_components/Room/RoomSideBar";
import RoomProvider from "_services/contexts/RoomContext";
import SocketProvider from "_services/contexts/SocketContext";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoomProvider>
      <SocketProvider>
        <div className="flex h-screen">
          <RoomSideBar />
          {children}
        </div>
      </SocketProvider>
    </RoomProvider>
  );
}
