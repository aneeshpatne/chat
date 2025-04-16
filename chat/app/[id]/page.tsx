import NavBar from "@/components/navbar";
import Chat from "@/components/chat";
export default async function Page(params: { params: { id: string } }) {
  const { id } = await params.params;

  return (
    <div className="flex h-full w-full">
      <NavBar />
      <Chat />
    </div>
  );
}
