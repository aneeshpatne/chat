import NavBar from "@/components/navbar";
import Chat from "@/components/initalChat";
export default function Home() {
  return (
    <div className="flex h-screen">
      <NavBar />
      <Chat />
    </div>
  );
}
