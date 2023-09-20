import React, { useState } from "react"
import { connectAutoComplete } from "react-instantsearch-dom"
import Markdown from "../elements/markdown"

const Block = ({ title, onMouseEnter }) => {
  return (
    <button
      style={{
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "start",
        marginBottom: "15px",
        padding: "15px",
        minHeight: "75px",
        background:
          "linear-gradient(315deg, transparent 17px, rgb(229, 224, 231) 0)",
        cursor: "pointer",
        color: "rgba(83, 37, 101, 1)",
        maxWidth: "300px",
        display: "block",
        width: "-webkit-fill-available",
      }}
      className={"sensitive-data-blocks"}
      onClick={onMouseEnter}
    >
      {title}
    </button>
  )
}

const SensitiveData = ({ data }) => {
  const [shownContent, setShownContent] = useState(data.sensitiveDataItem[0])

  function onHover(item) {
    setShownContent(item)
  }
  return (
    <div className="prose-lg container pb-12 event-html text-gray-dark text-xl">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "50%", maxWidth: "350px", marginRight: "20px" }}>
          {data.sensitiveDataItem.map((item, i) => {
            return (
              <Block
                onMouseEnter={(e) => onHover(item)}
                key={i + item.title}
                title={item.title}
              />
            )
          })}
        </div>
        <div style={{ width: "-webkit-fill-available" }}>
          <h1
            style={{
              marginBottom: "5px",
              fontSize: "21px",
              fontWeight: "bold",
            }}
          >
            {shownContent.title}
          </h1>
          <div style={{ marginBottom: "30px" }}>{shownContent.body}</div>
          <div>
            <h2
              style={{
                margin: "0 0 3px 0",
                fontSize: "19px",
                fontWeight: "bold",
              }}
            >
              Resources
            </h2>
            <hr style={{ marginBottom: 0 }} />
            {shownContent.sensitiveDataResources.length > 0 && (
              <ul>
                {shownContent.sensitiveDataResources.map((resource, i) => {
                  return (
                    <li
                      key={resource.link + i}
                      style={{
                        padding: 0,
                        color: "#9a256b",
                        margin: "0 0 0 16px",
                      }}
                    >
                      <Markdown>{resource.link}</Markdown>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div>
            <h2
              style={{
                margin: "0 0 3px 0",
                fontSize: "19px",
                fontWeight: "bold",
              }}
            >
              HEAL-specific Resources
            </h2>
            <hr style={{ marginBottom: 0 }} />

            {shownContent.healSpecificResourses.length > 0 && (
              <ul>
                {shownContent.healSpecificResourses.map((resource, i) => {
                  return (
                    <li
                      key={resource.link + i}
                      style={{
                        padding: 0,
                        color: "#9a256b",
                        margin: "0 0 0 16px",
                      }}
                    >
                      <Markdown>{resource.link}</Markdown>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SensitiveData
