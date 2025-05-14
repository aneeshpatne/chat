import ChatLayout from "./clientlayout";
import { createClient } from "@/utlis/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/(auth)/auth/actions";
export default async function ChatLayoutWrapper({ children }: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth");
  }
  return (
    <ChatLayout signOutAction={signOutAction} user={user}>
      {children}
    </ChatLayout>
  );
}
