import { ConnectButton, ConnectEmbed, useActiveAccount } from "thirdweb/react";
import { client } from "@/app//utils/client";
import { CHAIN } from "@/app/utils/chain";
import { inAppWallet } from "thirdweb/wallets";

export function SocialOnly() {
  return (
    <div className="flex flex-col items-center p-8">
      <ConnectButton
        client={client}
        chain={CHAIN}
        wallets={[
          inAppWallet({
            auth: {
              options: ["email", "google", "phone", "facebook"],
            },
          }),
        ]}
        connectButton={{ label: "Login In-App Wallet" }}
      />
    </div>
  );
}

export function EmailOnly() {
  const account = useActiveAccount();

  return (
    <div className="flex flex-col items-center p-8">
      <ConnectEmbed
        client={client}
        chain={CHAIN}
        wallets={[
          inAppWallet({
            auth: {
              options: ["email"],
            },
          }),
        ]}
        header={{ title: "Login In-App Wallet with email" }}
      />
      {account && <ConnectButton client={client} />}
    </div>
  );
}
