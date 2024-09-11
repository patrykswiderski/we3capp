import { inAppWallet } from "thirdweb/wallets";
import { ConnectButton, ConnectEmbed, useActiveAccount } from "thirdweb/react";
import { client } from "@/app/utils/client";
import { CHAIN } from "@/app/utils/chain";
import { ACCOUNT_FACTORY_ADDRESS } from "@/app/constants/constants";

const wallets = [inAppWallet()];

const accountAbstraction = {
  chain: CHAIN,
  facttoryAddress: ACCOUNT_FACTORY_ADDRESS,
  gasless: true,
};

export const AALogin = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <ConnectButton
        client={client}
        chain={CHAIN}
        wallets={wallets}
        accountAbstraction={accountAbstraction}
        connectButton={{ label: "Login AA" }}
      />
    </div>
  );
};

export const AAEmailOnly = () => {
  const account = useActiveAccount();

  return (
    <div className="flex flex-col items-center p-8">
      <ConnectEmbed
        client={client}
        chain={CHAIN}
        wallets={wallets}
        accountAbstraction={accountAbstraction}
        header={{ title: "Login AA with email" }}
      />
      {account && <ConnectButton client={client} />}
    </div>
  );
};
