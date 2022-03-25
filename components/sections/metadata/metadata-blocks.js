import React, { useState } from "react"
import Image from "next/image"

export default function MetaDataBlocks({ data }) {
  const [fairContent, setFairContent] = useState(data.content)
  const [shownFairContent, setShownFairContent] = useState(data.content[0])

  function onHover(e) {
    switch (e.target.id) {
      case "item-0":
        setShownFairContent(fairContent[0])
        break
      case "item-1":
        setShownFairContent(fairContent[1])
        break
      case "item-2":
        setShownFairContent(fairContent[2])
        break
      default:
        break
    }
  }
  return (
    <div className="container mb-12">
      <Image
        width={"350px"}
        height={"100px"}
        src={"/fairspectrumlogo.svg"}
        alt="FAIR Spectrum Logo"
      />
      <div
        style={{ backgroundImage: `url(/ARROW.svg)` }}
        className="bg-no-repeat bg-center"
      >
        <div className="grid">
          <div
            onMouseEnter={(e) => onHover(e)}
            className="row-start-1 row-end-3 col-start-1 col-end-2 w-3/4"
          >
            <Image
              width={"300px"}
              height={"300px"}
              id="item-0"
              src={"/fair1.svg"}
              className="cursor-pointer"
              alt="study image"
            />
          </div>
          <div
            onMouseEnter={(e) => onHover(e)}
            className="row-start-1 row-end-3 col-start-2 col-end-3 w-3/4"
          >
            <Image
              width={"300px"}
              height={"300px"}
              id="item-1"
              src={"/fair2.svg"}
              className="cursor-pointer"
              alt="variable image"
            />
          </div>
          <div
            onMouseEnter={(e) => onHover(e)}
            className="row-start-1 row-end-3 col-start-3 col-end-4 w-3/4"
          >
            <Image
              width={"300px"}
              height={"300px"}
              id="item-2"
              src={"/fair3.svg"}
              className="cursor-pointer"
              alt="discoverable image"
            />
          </div>
        </div>
      </div>
      <hr className="mt-12 bg-purple" style={{ height: "5px" }} />
      <div className="mt-12">
        <h1 className="font-bold mb-6 text-magenta text-5xl">
          {shownFairContent.title}
        </h1>
        <p className="mb-6 text-2xl text-gray-dark">
          {shownFairContent.descriptiveText}
        </p>
        <h4 className="font-bold mb-2 text-3xl">Products:</h4>
        <ul>
          {shownFairContent.products.map((product, i) => {
            return (
              <li
                key={product.item + i}
                className="text-2xl list-inside list-disc"
              >
                {product.item}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
