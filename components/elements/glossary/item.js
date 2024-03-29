import React from "react"
import Divider from "@mui/material/Divider"
import Markdown from "../../elements/markdown"

export default function GlossaryItem({ classes, word }) {
  return (
    <>
      <div className={"anchor"} id={word.anchor} />
      <div className={classes.root + " mt-10"}>
        <h2
          className="text-magenta pb-2"
          style={{ fontWeight: "600", fontSize: "1.3rem" }}
        >
          {word.term_name}
        </h2>
        <Divider />
        <div className="pt-4 glossary-markdown">
          <Markdown>{word.term_body}</Markdown>
        </div>
        {word.gtd_sources.length !== 0 &&
          (word.gtd_sources.length > 1 ? (
            <div>
              <br /> <b>Sources: </b>
              <span>
                {word.gtd_sources.map((source, i) => {
                  return (
                    <div key={source.title + i}>
                      <a
                        target="_blank"
                        href={source.url}
                        style={{ color: "#0044B3" }}
                        rel="noreferrer"
                      >
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
                <a
                  target="_blank"
                  href={word.gtd_sources[0].url}
                  style={{ color: "#0044B3" }}
                  rel="noreferrer"
                >
                  {word.gtd_sources[0].title}
                </a>
              </span>
            </div>
          ))}
      </div>
    </>
  )
}
