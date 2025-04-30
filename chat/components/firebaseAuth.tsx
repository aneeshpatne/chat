"use client";

import { useEffect } from "react";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { app } from "@/lib/firebaseConfig";

export default function FirebaseAuthUI() {
  useEffect(() => {
    const auth = getAuth(app);
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        //EmailAuthProvider.PROVIDER_ID,
        GoogleAuthProvider.PROVIDER_ID,
      ],
      signInSuccessUrl: "/chat",
      tosUrl: "/terms-of-service",
      privacyPolicyUrl: "/privacy-policy",
      callbacks: {
        uiShown: () => {
          const loader = document.getElementById("loader");
          if (loader) loader.style.display = "none";
        },
      },
    });
  }, []);

  return (
    <div>
      <div id="firebaseui-auth-container" />
      <div id="loader">Loading...</div>
    </div>
  );
}
