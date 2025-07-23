import { getContract, sendTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { inAppWallet } from "thirdweb/wallets";
import { safeTransferFrom } from "thirdweb/extensions/erc1155";
import { sepolia } from "thirdweb/chains";
import { client } from "./thirdwebClient";

const { PRIVATE_KEY, NFT_CONTRACT_ADDRESS } = process.env;
const CHAIN = sepolia;

if (!PRIVATE_KEY || !NFT_CONTRACT_ADDRESS) {
  throw new Error("Missing config in .env.local");
}

export async function createWalletAndSendNFT(email: string) {
  // 1. Create the recipient wallet via email
  const wallet = inAppWallet();

  const account = await wallet.connect({
    client,
    strategy: "email",
    email,
    verificationCode,
  });

  const recipientAddress = account.address;

  // 2. Get the admin sender wallet
  const adminAccount = privateKeyToAccount({
    client,
    privateKey: PRIVATE_KEY!,
  });

  // 3. Load the ERC-1155 contract
  const contract = getContract({
    address: NFT_CONTRACT_ADDRESS!,
    client,
    chain: CHAIN,
  });

  // 4. Prepare the transfer
  const transaction = safeTransferFrom({
    contract,
    from: adminAccount.address,
    to: recipientAddress,
    tokenId: BigInt(0),
    value: BigInt(1),
    data: "0x",
  });

  // 5. Send the transfer
  const receipt = await sendTransaction({ account: adminAccount, transaction });

  return { address: recipientAddress, txHash: receipt.transactionHash };
}
