import React from "react"
import { ResourceBlock } from "../elements/resources"

export default function ResourceBlocks(data) {
  
  const { resourceblocks } = data.data
  return (
    <div className="container">
      <div style={{ gap: "25px" }} className="flex flex-wrap justify-left">
        {resourceblocks.map((block, i) => {
          return <ResourceBlock data={block} key={block + i} />
        })}
      </div>
    </div>
  )
}
