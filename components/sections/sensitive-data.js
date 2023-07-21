import React from "react"

const Block = ({ title }) => {
  return (
    <div
      style={{
        clipPath: "polygon(0% 0%, 100% 0px, 100% 82%, 93% 100%, 0% 100%)",
        marginBottom: "15px",
        padding: "15px",
        height: "75px",
        background: "#e5e0e7",
      }}
    >
      {title}
    </div>
  )
}

const SensitiveData = ({ data }) => {
  console.log(data)
  return (
    <div className="prose-lg container pb-12 event-html text-gray-dark text-xl">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "40%" }}>
          {data.sensitiveDataItem.map((item, i) => {
            return <Block key={i + item.title} title={item.title} />
          })}
        </div>
        <div style={{ width: "55%" }}>body goes here</div>
      </div>
    </div>
  )
}

export default SensitiveData
