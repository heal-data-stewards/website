import React, { useState, useEffect, useMemo } from "react"
import Markdown from "../elements/markdown"
import { Typography, Divider, Box, Button } from "@mui/material"
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

const VerticalTabsWithAccordion = ({ data }) => {
  const [shownContent, setShownContent] = useState(
    () => data.TabItemWithAccordion[0]
  )

  const sections = useMemo(
    () => parseMarkdownToSections(shownContent.TabContent),
    [shownContent.TabContent]
  )

  const [expandedStates, setExpandedStates] = useState([])

  useEffect(() => {
    setExpandedStates(
      sections[0]?.type === "accordion"
        ? Array(sections.length).fill(false)
        : []
    )
  }, [shownContent, sections])

  const handleExpandAll = () => {
    setExpandedStates(Array(sections.length).fill(true))
  }

  const handleCollapseAll = () => {
    setExpandedStates(Array(sections.length).fill(false))
  }

  const handleToggle = (index, isExpanded) => {
    setExpandedStates((prev) => {
      const next = [...prev]
      next[index] = typeof isExpanded === "boolean" ? isExpanded : !prev[index]
      return next
    })
  }

  return (
    <div className="container pb-12">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ButtonBlockContainer
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flex: { md: "0 0 300px", sm: "0 0 200px" },
          }}
        >
          {data.TabItemWithAccordion.map((item, i) => (
            <Block
              onClick={() => setShownContent(item)}
              key={i + item.TabTitle}
              title={item.TabTitle}
              index={i}
              isSelected={item.TabTitle === shownContent.TabTitle}
            />
          ))}
        </ButtonBlockContainer>

        <PanelContainer>
          <Typography
            variant="h2"
            color="primary"
            sx={{ fontWeight: "600", paddingTop: 0 }}
          >
            {shownContent.TabTitle}
          </Typography>
          <Divider sx={{ backgroundColor: "#982568", marginBottom: "1rem" }} />

          {sections[0]?.type === "accordion" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  marginBottom: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleExpandAll}
                  disabled={expandedStates.every(Boolean)}
                >
                  Expand All
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCollapseAll}
                  disabled={expandedStates.every((state) => !state)}
                >
                  Collapse All
                </Button>
              </Box>

              <div>
                {sections.map((section, index) => (
                  <Accordion
                    key={index}
                    expanded={!!expandedStates[index]}
                    onChange={(e, isExpanded) =>
                      handleToggle(index, isExpanded)
                    }
                  >
                    <AccordionSummary>
                      <Typography variant="h3">{section.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Markdown>{section.content}</Markdown>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: "#532565" }}>
              <Markdown>{sections[0]?.content}</Markdown>
            </div>
          )}
        </PanelContainer>
      </div>
    </div>
  )
}

export default VerticalTabsWithAccordion

function parseMarkdownToSections(markdown) {
  const lines = markdown.split("\n")
  const sections = []

  let currentTitle = ""
  let currentContent = []
  let foundFirstHeading = false

  for (const line of lines) {
    const h1Match = line.match(/^# (.*)/)
    if (h1Match) {
      foundFirstHeading = true
      if (currentTitle) {
        sections.push({
          type: "accordion",
          title: currentTitle,
          content: currentContent.join("\n").trim(),
        })
        currentContent = []
      }
      currentTitle = h1Match[1].trim()
    } else {
      currentContent.push(line)
    }
  }

  if (currentTitle) {
    sections.push({
      type: "accordion",
      title: currentTitle,
      content: currentContent.join("\n").trim(),
    })
  } else if (currentContent.length && !foundFirstHeading) {
    sections.push({
      type: "text",
      content: currentContent.join("\n").trim(),
    })
  }

  return sections
}
