"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="text-sm underline"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("github")} className="text-sm underline">
      Login with GitHub
    </button>
  );
}
