import React from "react"
import { FeaturedResourceBlock } from "../elements/resources"

export default function FeaturedResourceBlocks(data) {
  const { resource_card } = data.data
  return (
    <div className="container">
      <div style={{ gap: "25px" }} className="flex flex-wrap justify-left">
        {resource_card.map((block, i) => {
          return <FeaturedResourceBlock data={block} key={block + i} />
        })}
      </div>
    </div>
  )
}
