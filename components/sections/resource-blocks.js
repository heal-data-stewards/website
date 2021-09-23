import React from "react";
import { Block } from "../elements/resources";

import Divider from "@mui/material/Divider";

export default function ResourceBlocks(data) {
  const { resourceblocks } = data.data;
  return (
    <div className="container">
      <section className="pt-10 pb-10">
        <h1 className="text-5xl font-black pb-4 text-purple">Resources</h1>
        <Divider />
        <p className="text-xl text-gray pt-4">
          The HEAL Data Stewardship Group (HEAL Stewards) is committed to
          providing a variety of documents to assist HEAL Investigators in
          navigating and contributing to the HEAL data ecosystem.
        </p>
      </section>
      <div className="flex flex-wrap justify-between">
        {resourceblocks.map((block, i) => {
          return <Block data={block} key={block + i} />;
        })}
      </div>
    </div>
  );
}
