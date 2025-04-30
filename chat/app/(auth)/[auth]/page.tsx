"use client";
import dynamic from "next/dynamic";

const FirebaseAuthUI = dynamic(() => import("@/components/firebaseAuth"), {
  ssr: false,
});
export default function LoginPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <FirebaseAuthUI />
    </div>
  );
}
