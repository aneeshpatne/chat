import ChatLayout from "./Clientlayout";
export default async function ChatLayoutWrapper({ children }) {
  return <ChatLayout>{children}</ChatLayout>;
}
