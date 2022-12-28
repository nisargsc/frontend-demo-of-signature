import type { NextPage } from "next";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { signTypedData } from "@wagmi/core";
import { BigNumber } from "ethers";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  let startTimeRef = useRef<HTMLInputElement>(null);
  let endTimeRef = useRef<HTMLInputElement>(null);

  if (connected) {
    return (
      <>
        <div className="card text-center">
          <span className=" font-medium">{address}</span>
        </div>

        <div className="card flex flex-col p-2 items-center">
          <input
            ref={startTimeRef}
            type="text"
            placeholder="startTime"
            className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
          ></input>

          <input
            ref={endTimeRef}
            type="text"
            placeholder="endTime"
            className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
          ></input>

          <div className="flex justify-center">
            <button
              className="button font-medium"
              onClick={async () => {
                await sign(
                  startTimeRef?.current?.value as unknown as number,
                  endTimeRef?.current?.value as unknown as number
                );
              }}
            >
              <a> Create Signature!! </a>
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

  async function sign(startTime: number, endTime: number) {
    const domain = {
      name: "SignatureHandler",
      version: "1",
      chainId: chain?.id,
      verifyingContract: "0xd59d25a9cafF8649F837C03C4fa299f21fF38E3B",
    } as const;

    const types = {
      Request: [
        { name: "validityStartTimestamp", type: "uint256" },
        { name: "validityEndTimestamp", type: "uint256" },
      ],
    } as const;

    const value = {
      validityStartTimestamp: BigNumber.from(startTime),
      validityEndTimestamp: BigNumber.from(endTime),
    } as const;

    console.log(domain, types, value);
    const signature = await signTypedData({ domain, types, value });
    console.log({ signature });
    alert(`Created signature: ${signature}`);
  }
};

export default Home;
