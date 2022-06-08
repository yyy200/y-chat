import Head from "next/head";
import React from "react";

interface Props {}

export const HeadComponent: React.FC<Props> = () => {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content="#000000" />

      <title>Y-Chat</title>
      <meta name="title" content="y-Chat" />
      <meta
        name="description"
        content="Buy items on my store using Solana Pay!"
      />

      <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
    </Head>
  );
};
