import NavBar from "@/components/navbar";
import Chat from "@/components/chat";
export default async function Page(params) {
  const { id } = await params.params;

  return (
    <div className="flex h-screen">
      <NavBar />
      <Chat sessionid={id} />
    </div>
  );
}
