import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
} from "thirdweb/react";
import { CHAIN } from "./chain";
import { client } from "./client";

export const useThirdwebAccount = () => {
  const account = useActiveAccount();
  const connectedWallet = useActiveWallet();
  const { connect } = useConnect({
    client,
    accountAbstraction: {
      chain: CHAIN,
      sponsorGas: true,
    },
  });
  const { disconnect } = useDisconnect();

  return { account, connectedWallet, connect, disconnect };
};
