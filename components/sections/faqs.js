import React, { useState, useEffect } from "react"
import { Divider, Stack, Typography } from "@mui/material"
import Markdown from "../elements/markdown"
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../elements/accordion"
import {
  Block,
  ButtonBlockContainer,
  PanelContainer,
} from "../elements/side-tab-menu"

// Split the array into separate objects by the tag property
const groupByTag = (arr, property) =>
  arr.reduce(function (memo, x) {
    // Check if the memo object already has a key for the current property's value.
    // If not, initialize an empty array for that key.
    if (!memo[x[property]]) {
      memo[x[property]] = []
    }
    // Push the current object into the array for that key.
    memo[x[property]].push(x)
    return memo
  }, {}) // Start with an empty object as the initial value of the accumulator.

// takes the object into an array of objects with key as a property instead of outside of the object
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

export default function Faqs({ data }) {
  const [expanded, setExpanded] = useState()
  const [shownContent, setShownContent] = useState([])

  const faqs = separateObject(groupByTag(data.question, "tag"))

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  function onHover(item) {
    setShownContent(item)
  }

  return (
    <div className="container pb-4">
      <Stack
        direction={{ sm: "column", md: "row" }}
        justifyContent="flex-start"
      >
        <ButtonBlockContainer
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flex: {
              md: "0 0 300px",
              sm: "0 0 200px",
              xs: "0 0 150px",
            },
          }}
          role="tablist"
        >
          {faqs.map((item, i) => {
            return (
              <Block
                onMouseEnter={(e) => onHover(item)}
                key={i + item.key}
                title={item.key}
                index={i}
                isSelected={item.key === shownContent.key}
              />
            )
          })}
        </ButtonBlockContainer>

        <PanelContainer role="tabpanel">
          <Typography
            variant="h2"
            color="primary"
            sx={{
              fontWeight: "600",
              paddingTop: 0,
              fontSize: "1.4rem",
            }}
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
                      sx={{
                        fontSize: "1.1rem",
                        paddingBottom: 0,
                      }}
                    >
                      {question.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Markdown accordionText>{question.answerFAQ}</Markdown>
                  </AccordionDetails>
                </Accordion>
              )
            })}
        </PanelContainer>
      </Stack>
    </div>
  )
}
