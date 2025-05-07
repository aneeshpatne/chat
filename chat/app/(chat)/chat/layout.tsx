import ChatLayout from "./Clientlayout";
import { createClient } from "@/utlis/supabase/server";
import { redirect } from "next/navigation";
export default async function ChatLayoutWrapper({ children }: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth");
  }
  return <ChatLayout>{children}</ChatLayout>;
}
