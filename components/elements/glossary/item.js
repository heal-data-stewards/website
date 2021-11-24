import React from "react"
import Divider from "@mui/material/Divider"
import Markdown from "react-markdown"

export default function GlossaryItem({ classes, word }) {
  return (
    <div className={classes.root + " mt-10"} id={word.anchor}>
      <h2
        className="text-magenta capitalize pb-2"
        style={{ fontWeight: "600", fontSize: "1.2rem" }}
      >
        {word.term_name}
      </h2>
      <Divider />
      <h3 className="pt-4 faq-markdown" style={{ fontWeight: "100" }}>
        <Markdown>{word.term_body}</Markdown>
      </h3>
      {word.gtd_sources.length !== 0 &&
        (word.gtd_sources.length > 1 ? (
          <div>
            <br /> <b>Sources: </b>
            <span>
              {word.gtd_sources.map((source, i) => {
                return (
                  <div key={source.title + i}>
                    <a href={source.url} style={{ color: "#0044B3" }}>
                      {source.title}
                    </a>
                    {word.gtd_sources.length - 1 !== i ? " & " : ""}
                  </div>
                )
              })}
            </span>
          </div>
        ) : (
          <div>
            <br /> <b>Source: </b>
            <span>
              <a href={word.gtd_sources[0].url} style={{ color: "#0044B3" }}>
                {word.gtd_sources[0].title}
              </a>
            </span>
          </div>
        ))}
    </div>
  )
}
