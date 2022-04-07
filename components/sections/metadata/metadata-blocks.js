import React, { useState } from "react"
import Image from "next/image"
import Divider from "@mui/material/Divider"

export default function MetaDataBlocks({ data }) {
  const [shownFairContent, setShownFairContent] = useState(data.content[0])
  const animate = "scale-100 "
  const DEFAULT_SIZE = "scale-90 "
  const [animate1, setAnimate1] = useState(animate)
  const [animate2, setAnimate2] = useState(" ")
  const [animate3, setAnimate3] = useState(" ")
  const [color, setColor] = useState("text-purple")

  function onHover(e) {
    switch (e.target.id) {
      case "item-0":
        setColor("text-purple")
        setAnimate1(animate)
        setAnimate2(DEFAULT_SIZE)
        setAnimate3(DEFAULT_SIZE)
        setShownFairContent(data.content[0])
        break
      case "item-1":
        setColor("text-magenta-new")
        setAnimate2(animate)
        setAnimate1(DEFAULT_SIZE)
        setAnimate3(DEFAULT_SIZE)
        setShownFairContent(data.content[1])
        break
      case "item-2":
        setColor("text-magenta")
        setAnimate3(animate)
        setAnimate2(DEFAULT_SIZE)
        setAnimate1(DEFAULT_SIZE)
        setShownFairContent(data.content[2])
        break
      default:
        break
    }
  }
  return (
    <div className="container mb-12 mt-12">
      <div className="flex flex-nowrap flex-row justify-evenly">
        <Image
          onMouseEnter={(e) => onHover(e)}
          height="300px"
          width="300px"
          id="item-0"
          src={"/HEAL_WebsiteDesign_Spectrum_Study_V1.svg"}
          className={"cursor-pointer duration-700 " + animate1}
          alt="study image"
        />
        <Image
          onMouseEnter={(e) => onHover(e)}
          height="300px"
          width="300px"
          id="item-1"
          src={"/HEAL_WebsiteDesign_Spectrum_Variable_V1.svg"}
          className={"cursor-pointer duration-700 " + animate2}
          alt="variable image"
        />
        <Image
          onMouseEnter={(e) => onHover(e)}
          height="300px"
          width="300px"
          id="item-2"
          src={"/HEAL_WebsiteDesign_Spectrum_CommunityStandards_V1.svg"}
          className={"cursor-pointer duration-700 " + animate3}
          alt="community standards image"
        />
      </div>
      <Divider />
      <div className="mt-2">
        <h1 className={"font-bold mb-6 text-5xl " + color}>
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
