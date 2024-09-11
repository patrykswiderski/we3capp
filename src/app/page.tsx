"use client";
import thirdwebIcon from "@public/thirdweb.svg";
import Image from "next/image";
import { AALogin, AAEmailOnly } from "./components/AALogin";
import { EmailOnly, SocialOnly } from "./components/InAppLogin";
import { useActiveAccount } from "thirdweb/react";
import CustomLogin from "./components/CustomLogin";
// import EmailLogin from "./components/EmailLogin";

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container w-screen-lg mx-auto">
      <div className="py-20">
        <Header />
        <WalletOptions />
      </div>
    </main>
  );
}
function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />
    </header>
  );
}

function WalletOptions() {
  const account = useActiveAccount();

  return (
    <div className="flex justify-center flex-col border border-neutral-400 rounded-xl w-[500px]">
      <p className="text-neutral-200 text-center text-4xl font-bold my-8">
        {account ? "Your Account" : "Sign In"}
      </p>
      <SocialOnly />
      {!account && (
        <>
          <EmailOnly />
          <AALogin />
          <AAEmailOnly />
        </>
      )}
      <CustomLogin />
      {/* <EmailLogin /> */}
    </div>
  );
}
