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

const groupByTag = (array) =>
  array.reduce((buckets, question) => {
    if (question.tag in buckets) {
      buckets[question.tag].push(question)
      return buckets
    }
    buckets[question.tag] = [question]
    return buckets
  }, {})

export default function Faqs({ data }) {
  const faqs = groupByTag(data.question)

  const [expanded, setExpanded] = useState()
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(faqs)[0])

  const handleAccordionChange = (panel) => (_, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
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
          {Object.keys(faqs).map((faqCategory, i) => {
            return (
              <Block
                onClick={() => setSelectedCategory(faqCategory)}
                key={i + faqCategory}
                title={faqCategory}
                index={i}
                isSelected={faqCategory === selectedCategory}
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
            {selectedCategory}
          </Typography>
          <Divider sx={{ backgroundColor: "#982568", marginBottom: "1rem" }} />

          {Boolean(selectedCategory) &&
            faqs[selectedCategory].map((question, i) => {
              return (
                <Accordion
                  expanded={expanded === "panel" + i + question.question}
                  onChange={handleAccordionChange(
                    "panel" + i + question.question
                  )}
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
