import React from "react";

export default function EmailLoginForm({
  email,
  setEmail,
  sendVerification,
  loading,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  sendVerification: (email: string) => Promise<void>;
  loading: boolean;
}) {
  return (
    <>
      <input
        type="text"
        placeholder="Email"
        className="bg-zinc-800 text-white-400 px-4 py-2 rounded-md mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white-400 px-4 py-2 rounded-md"
        onClick={() => sendVerification(email)}
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </>
  );
}
