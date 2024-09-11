import { useReadContract } from "thirdweb/react";

export default function ConnectedAA({
  contract,
  _adminSigner,
  _data,
}: {
  contract: any;
  _adminSigner: string;
  _data: `0x${string}`;
}): JSX.Element {
  const { data, isLoading } = useReadContract({
    contract,
    method:
      "function getAddress(address _adminSigner, bytes _data) view returns (address)",
    params: [_adminSigner, _data],
  });

  if (isLoading) return <p>Loading address...</p>;

  return <div>{data}</div>;
}
