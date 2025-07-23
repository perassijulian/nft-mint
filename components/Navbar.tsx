"use client";

import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/thirdwebClient";

export default function Navbar() {
  const wallets = [
    inAppWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image
                src="/img/wordmark-dark.png"
                alt="Logo"
                width={180}
                height={50}
              />
            </Link>
          </div>

          <div className="flex items-center">
            <Link
              href="/profile"
              className="mr-4 text-gray-700 hover:text-gray-900"
            >
              Profile
            </Link>
            <ConnectButton client={client} wallets={wallets} />
          </div>
        </div>
      </div>
    </nav>
  );
}
