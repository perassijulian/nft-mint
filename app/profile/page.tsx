"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useActiveWallet } from "thirdweb/react";
import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import type { NFT } from "thirdweb";

const { NEXT_PUBLIC_THIRDWEB_CLIENT_ID } = process.env;

export default function Profile() {
  const [nfts, setNfts] = useState<(NFT & { quantityOwned: bigint })[]>([]);
  const [loading, setLoading] = useState(true);
  const wallet = useActiveWallet();

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!wallet) {
        setLoading(false);
        return;
      }

      try {
        const NFT_CONTRACT_ADDRESS =
          "0x50A4e8137566d62c343A232F6A152eB7065c7F11";

        const client = createThirdwebClient({
          clientId: NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
        });

        const contract = getContract({
          client,
          chain: sepolia,
          address: NFT_CONTRACT_ADDRESS,
        });

        const address = wallet.getAccount()?.address;
        if (!address) throw new Error("Wallet address not found");

        // Get NFTs for the wallet
        const owned = await getOwnedNFTs({
          contract,
          address,
          start: 0,
          count: 50,
        });

        setNfts(owned);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [wallet]);

  if (!wallet) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Please connect your wallet
        </h1>
        <p className="mt-2 text-gray-600">
          Sign in with your email to view your NFTs
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <p>Loading your NFTs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your NFTs</h1>

      {nfts.length === 0 ? (
        <p>You don't have any NFTs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              {nft.metadata.image && (
                <div className="relative h-60 w-full">
                  <Image
                    src={nft.metadata.image}
                    alt={nft.metadata.name || "NFT"}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{nft.metadata.name}</h2>
                <p className="text-gray-600 mt-2">{nft.metadata.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Quantity: {nft.quantityOwned}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
