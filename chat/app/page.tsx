import NavBar from "@/components/navbar";
import Chat from "@/components/chat";
export default function Home() {
  return (
    <div className="flex h-screen">
      <NavBar />
      <Chat />
    </div>
  );
}
