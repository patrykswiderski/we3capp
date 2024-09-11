"use client";

import {
  useActiveAccount,
  useActiveWallet,
  useAutoConnect,
  useConnect,
  useConnectModal,
  useDisconnect,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { preAuthenticate } from "thirdweb/wallets/in-app";
import { useState } from "react";
import { client } from "../utils/client";
import { InAppWallet } from "@thirdweb-dev/wallets";

export default function CustomLogin() {
  const account = useActiveAccount();
  const connectedWallet = useActiveWallet();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isVerification, setIsVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const sendVerification = async (email: string) => {
    await preAuthenticate({
      client: client,
      strategy: "email",
      email: email,
    });
    setIsVerification(true);
  };

  const handleLogin = async (email: string, verificationCode: string) => {
    await connect(async () => {
      const wallet = inAppWallet();
      await wallet.connect({
        client: client,
        strategy: "email",
        email: email,
        verificationCode: verificationCode,
      });
      return wallet;
    });
  };

  const { data: autoConnected } = useAutoConnect({
    client: client,
    wallets: [createWallet("io.metamask"), inAppWallet()],
    onConnect(wallet) {
      console.log("Auto connected wallet:", wallet);
    },
  });

  return (
    <div className="flex flex-col justify-center items-center border border-neutral-800 bg-[hsl(230,11.63%,8.43%)] mx-auto mb-8 p-10 rounded-xl max-w-max ">
      <p className="text-zinc-300 text-base mb-4">
        {account ? "Custom Email Login" : "Logged in"}
      </p>
      {account && connectedWallet ? (
        <button
          className="bg-red-500 text-white-400 px-4 py-2 rounded-md"
          onClick={() => disconnect(connectedWallet)}
        >
          Disconnect
        </button>
      ) : !isVerification ? (
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
          >
            Login
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Verification Code"
            className="bg-zinc-800 text-white-400 px-4 py-2 rounded-md mb-4"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white-400 px-4 py-2 rounded-md"
            onClick={() => {
              handleLogin(email, verificationCode);
              setEmail("");
              setVerificationCode("");
            }}
          >
            Verify
          </button>
        </>
      )}
    </div>
  );
}
