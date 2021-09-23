import React from "react"
import { Block } from "../elements/resources"

export default function ResourceBlocks(data ) {
    const { resourceblocks } = data.data

    return (
        <div className="container flex flex-wrap justify-between">
            {resourceblocks.map((block,i)=>{
                return <Block data={block} key={block + i}/>
            })}
        </div>
    )
}
