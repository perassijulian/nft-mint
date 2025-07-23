import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { safeTransferFrom } from "thirdweb/extensions/erc1155";
import { sepolia } from "thirdweb/chains";

const { PRIVATE_KEY, THIRDWEB_API_KEY, NFT_CONTRACT_ADDRESS } = process.env;
const CHAIN = sepolia;

if (!PRIVATE_KEY || !THIRDWEB_API_KEY || !NFT_CONTRACT_ADDRESS) {
  throw new Error("Missing Thirdweb config in .env.local");
}

export async function createWalletAndSendNFT(email: string) {
  const walletRes = await fetch("https://api.thirdweb.com/v1/wallet", {
    method: "POST",
    headers: {
      "x-secret-key": THIRDWEB_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ strategy: "email", email }),
  });

  if (!walletRes.ok) {
    throw new Error(
      `Thirdweb wallet creation failed: ${await walletRes.text()}`
    );
  }

  const { address } = await walletRes.json();

  const client = createThirdwebClient({
    secretKey: PRIVATE_KEY!,
  });
  const account = privateKeyToAccount({
    client,
    privateKey: PRIVATE_KEY!,
  });

  const contract = getContract({
    address: NFT_CONTRACT_ADDRESS!,
    client,
    chain: CHAIN,
  });

  const transaction = safeTransferFrom({
    contract,
    from: account.address,
    to: address,
    tokenId: BigInt(0),
    value: BigInt(1),
    data: "0x",
  });

  const receipt = await sendTransaction({ account, transaction });
  return { address, txHash: receipt.transactionHash };
}
