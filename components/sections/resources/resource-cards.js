import React, { useState } from "react"
import ResourceCard from "./resource-card"

export default function ResourceCards(data) {
  return (
    <div className="container">
      <section className="flex flex-wrap justify-between">
        {data.data.resource_card.map((card, i) => {
          return <ResourceCard key={i + "key"} data={card} />
        })}
      </section>
    </div>
  )
}
