import type { NextPage } from "next";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { signTypedData } from "@wagmi/core";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  let nameRef = useRef<HTMLInputElement>(null);
  let imageUrlRef = useRef<HTMLInputElement>(null);
  let descRef = useRef<HTMLInputElement>(null);

  if (connected) {
    return (
      <>
        <div className="card text-center">
          <span className=" font-medium">{address}</span>
        </div>

        <div className="card flex flex-col p-2 items-center">
          <input
            ref={nameRef}
            type="text"
            placeholder="Name"
            className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
          ></input>

          <input
            ref={descRef}
            type="text"
            placeholder="Description"
            className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
          ></input>

          <input
            ref={imageUrlRef}
            type="text"
            placeholder="Image Url"
            className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
          ></input>

          <div className="flex justify-center">
            <button
              className="button font-medium"
              onClick={async () => {
                await lazyMint(
                  nameRef.current?.value as string,
                  descRef.current?.value as string,
                  imageUrlRef.current?.value as string
                );
              }}
            >
              <a> Lazy Mint </a>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-center card">
        <span>Not connected</span>
      </div>
    </>
  );

  async function lazyMint(name: string, desc: string, image: string) {
    console.log({
      name,
      desc,
      image,
    });
    const domain = {
      name: "Lazy Mint Signature",
      version: "1",
      chainId: chain?.id,
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    } as const;

    // The named list of all type definitions
    const types = {
      LazyMint: [
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "image", type: "string" },
      ],
    } as const;

    const value = {
      name,
      description: desc,
      image,
    } as const;

    console.log(domain, types, value);
    const signature = await signTypedData({ domain, types, value });
    alert(`Lazy minted signature: ${signature}`);
  }
};

export default Home;
