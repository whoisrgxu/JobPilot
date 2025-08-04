// components/LoginButton.tsx

import { signIn } from "next-auth/react";

export default function GoogleLogin() {
  return (
    <button onClick={() => signIn("google")}>
      Sign in with Google
    </button>
  );
}
