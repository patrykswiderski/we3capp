import { inAppWallet, preAuthenticate } from "thirdweb/wallets/in-app";
import { client } from "../utils/client";
import { CHAIN } from "../utils/chain";

export const sendVerification = async (email: string) => {
  await preAuthenticate({
    client: client,
    strategy: "email",
    email: email,
  });
};

export const loginUser = async (email: string, verificationCode: string) => {
  const wallet = inAppWallet({
    smartAccount: {
      chain: CHAIN,
      sponsorGas: true,
    },
  });
  await wallet.connect({
    client: client,
    strategy: "email",
    email: email,
    verificationCode: verificationCode,
  });
  return wallet;
};
