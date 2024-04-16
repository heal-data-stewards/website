import React, { useState, useEffect } from "react"
import Typography from "@mui/material/Typography"
import Markdown from "../elements/markdown"
import Divider from "@mui/material/Divider"
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../elements/accordion"
import {
  Block,
  ButtonBlockContainer,
  PanelContainer,
} from "../elements/side-tab-buttons"

export default function Faqs({ data }) {
  const [faqs, setFaqs] = useState([])
  const [expanded, setExpanded] = useState()
  const [open, setOpen] = useState(true)
  const [shownContent, setShownContent] = useState([])

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    // Split the array into separate objects by the tag property
    function groupByTag(arr, property) {
      return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) {
          memo[x[property]] = []
        }
        memo[x[property]].push(x)
        return memo
      }, {})
    }

    const separateObject = (obj) => {
      const res = []
      const keys = Object.keys(obj)
      keys.forEach((key) => {
        res.push({
          key: key,
          data: obj[key],
        })
      })
      return res
    }

    const group = groupByTag(data.question, "tag")
    const newState = separateObject(group)
    setFaqs(newState)
    setShownContent(newState[0])
  }, [data.question])

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  function onHover(item) {
    setShownContent(item)
  }

  return (
    <div className="container pb-4">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ButtonBlockContainer>
          {faqs.map((item, i) => {
            return (
              <Block
                onMouseEnter={(e) => onHover(item)}
                key={i + item.key}
                title={item.key}
              />
            )
          })}
        </ButtonBlockContainer>

        <PanelContainer>
          <Typography
            variant="h2"
            color="primary"
            sx={{ fontWeight: "600", paddingTop: 0 }}
          >
            {shownContent.key}
          </Typography>
          <Divider sx={{ backgroundColor: "#982568", marginBottom: "1rem" }} />

          {shownContent.data &&
            shownContent.data.map((question, i) => {
              return (
                <Accordion
                  expanded={expanded === "panel" + i + question.question}
                  onChange={handleChange("panel" + i + question.question)}
                  key={question.question + i}
                >
                  <AccordionSummary
                    aria-controls={"panel" + i + question.question}
                    id={"panel" + i + question.question}
                  >
                    <Typography
                      variant="h3"
                      sx={{ fontSize: "1.2rem", fontWeight: "500" }}
                    >
                      {question.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Markdown>{question.answerFAQ}</Markdown>
                  </AccordionDetails>
                </Accordion>
              )
            }
          )}
        </PanelContainer>
      </div>
    </div>
  )
}
