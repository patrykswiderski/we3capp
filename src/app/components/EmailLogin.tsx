import { useEffect, useState } from "react";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { ethers } from "ethers";
import { inAppWallet, preAuthenticate } from "thirdweb/wallets/in-app";
import { ACCOUNT_FACTORY_ADDRESS } from "@/app/constants/constants";
import { client } from "@/app/utils/client";
import { CHAIN } from "@/app/utils/chain";
import { useThirdwebAccount } from "@/app/utils/useThirdWebAccount";
import ConnectedAA from "./ConnectedAA";
import EmailLoginForm from "./EmailLoginForm";

export const contract = getContract({
  client,
  chain: CHAIN,
  address: ACCOUNT_FACTORY_ADDRESS,
});

export default function EmailLogin() {
  const { account, connectedWallet, connect, disconnect } =
    useThirdwebAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerification, setIsVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [username, setUsername] = useState("");
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [data, setData] = useState<`0x${string}` | null>(null);
  const [adminSigner, setAdminSigner] = useState<string | null>(null);
  const { mutate: sendTransaction } = useSendTransaction();

  const sendVerification = async (email: string) => {
    await preAuthenticate({
      client: client,
      strategy: "email",
      email: email,
    });
    setIsVerification(true);
  };

  const { data: allAccounts, isLoading } = useReadContract({
    contract,
    method: "function getAllAccounts() view returns (address[])",
    params: [],
  });

  if (!isLoading && allAccounts) {
    console.log("all addresses", allAccounts, "account", account?.address);
  }

  const handleLogin = async (email: string, verificationCode: string) => {
    await connect(async () => {
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
    });
  };

  const createAccount = async () => {
    if (!account || !connectedWallet) {
      setError("No active account or wallet");
      return;
    }
    console.log(account.address);

    if (!isLoading && allAccounts?.includes(account.address)) {
      setError("Account already exists for this user.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const usernameBytes = ethers.utils.toUtf8Bytes(username);
      const hexData = ethers.utils.hexlify(usernameBytes) as `0x${string}`;
      setData(hexData);
      const adminAddress = account.address;
      setAdminSigner(adminAddress);
      const transaction = prepareContractCall({
        contract,
        method:
          "function createAccount(address _admin, bytes _data) returns (address)",
        params: [adminAddress, hexData],
      });

      sendTransaction(transaction, {
        onSuccess: async (txResult) => {
          console.log("Transaction successful", txResult);
          setIsAccountCreated(true);
          setLoading(false);
        },
        onError: (error) => {
          console.error("Transaction failed", error);
          setError("Transaction failed");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error creating account", error);
      setError("Error creating account");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAccountCreated) {
      console.log("Account successfully created!");
    }
  }, [isAccountCreated]);

  return (
    <div className="flex flex-col items-center mb-20 md:mb-20">
      {isAccountCreated ? (
        <ConnectedAA
          contract={contract}
          _data={data || "0x"}
          _adminSigner={adminSigner || ""}
        />
      ) : (
        <>
          <p className="text-zinc-300 text-base mb-4 md:mb-4">Email Login</p>
          {account && connectedWallet ? (
            <>
              <input
                type="text"
                placeholder="Username"
                className="bg-zinc-800 text-white-400 px-4 py-2 rounded-md mb-4"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white-400 px-4 py-2 rounded-md"
                onClick={createAccount}
              >
                Create Account
              </button>
              <button
                className="bg-red-500 text-white-400 px-4 py-2 rounded-md mt-4"
                onClick={() => disconnect(connectedWallet)}
              >
                Disconnect
              </button>
            </>
          ) : !isVerification ? (
            <EmailLoginForm
              email={email}
              setEmail={setEmail}
              sendVerification={sendVerification}
              loading={loading}
            />
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
        </>
      )}
    </div>
  );
}
