import React, { useState, useEffect, useMemo, Fragment } from "react"
import Markdown from "../elements/markdown"
import {
  Typography,
  Divider,
  Box,
  Button,
  useMediaQuery,
  MenuItem,
  Select,
  Fab,
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"
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
import { useTheme } from "@mui/material/styles"

const VerticalTabsWithAccordion = ({ data }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [shownContent, setShownContent] = useState(
    () => data.TabItemWithAccordion[0]
  )
  const [expandedStates, setExpandedStates] = useState([])
  const [showBackToTop, setShowBackToTop] = useState(false)

  const sections = useMemo(
    () => parseMarkdownToSections(shownContent.TabContent),
    [shownContent.TabContent]
  )

  useEffect(() => {
    setExpandedStates(
      sections[0]?.type === "accordion"
        ? Array(sections.length).fill(false)
        : []
    )
  }, [shownContent, sections])

  // Scroll listener for Back to Top button
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 200)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleExpandAll = () =>
    setExpandedStates(Array(sections.length).fill(true))
  const handleCollapseAll = () =>
    setExpandedStates(Array(sections.length).fill(false))

  const handleToggle = (index, isExpanded) => {
    setExpandedStates((prev) => {
      const next = [...prev]
      next[index] = typeof isExpanded === "boolean" ? isExpanded : !prev[index]
      return next
    })

    if (!expandedStates[index]) {
      const el = document.getElementById(`accordion-${index}`)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="container pb-12">
      <div
        style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}
      >
        {isMobile ? (
          <Box mb={2}>
            <Select
              fullWidth
              value={shownContent.TabTitle}
              onChange={(e) => {
                const selected = data.TabItemWithAccordion.find(
                  (item) => item.TabTitle === e.target.value
                )
                setShownContent(selected)
              }}
              IconComponent={KeyboardArrowDown}
              renderValue={(selected) => (
                <Typography
                  variant="h2"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    paddingBottom: "0 !important",
                  }}
                >
                  {selected}
                </Typography>
              )}
              sx={{
                border: "1px solid #982568",
                "& .MuiSelect-icon": {
                  color: "#532565",
                  right: "1rem",
                  fontSize: "3rem",
                },
              }}
            >
              {data.TabItemWithAccordion.map((item) => (
                <MenuItem key={item.TabTitle} value={item.TabTitle}>
                  <Typography variant="body1">{item.TabTitle}</Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        ) : (
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
        )}

        <PanelContainer
          sx={{
            width: "100%",
            paddingX: isMobile ? 2 : 0,
            marginTop: isMobile ? 2 : 0,
          }}
        >
          {!isMobile && (
            <Fragment>
              <Typography
                variant="h2"
                color="primary"
                sx={{
                  fontWeight: 600,
                  paddingTop: 0,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                }}
              >
                {shownContent.TabTitle}
              </Typography>
              <Divider
                sx={{ backgroundColor: "#982568", marginBottom: "1rem" }}
              />
            </Fragment>
          )}

          {sections[0]?.type === "accordion" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  marginBottom: "1rem",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{ minHeight: 40 }}
                  onClick={handleExpandAll}
                  disabled={expandedStates.every(Boolean)}
                >
                  Expand All
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{ minHeight: 40 }}
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
                    id={`accordion-${index}`}
                    expanded={!!expandedStates[index]}
                    onChange={(e, isExpanded) =>
                      handleToggle(index, isExpanded)
                    }
                    sx={{ width: "100%", marginBottom: 1 }}
                  >
                    <AccordionSummary>
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        {section.title}
                      </Typography>
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

      {showBackToTop && (
        <Fab
          color="primary"
          size="medium"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
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
