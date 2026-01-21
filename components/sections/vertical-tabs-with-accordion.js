import React, { useState, useEffect, useMemo, Fragment } from "react"
import Markdown from "../elements/markdown"
import {
  Typography,
  Divider,
  Box,
  useMediaQuery,
  MenuItem,
  Select,
  Fab,
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"
import { AccordionControls, AccordionList } from "../elements/accordion"
import {
  Block,
  ButtonBlockContainer,
  PanelContainer,
} from "../elements/side-tab-menu"
import { useTheme } from "@mui/material/styles"
import parseMarkdownToSections from "../../utils/parse-markdown-to-sections"
import { OpenInNew } from "@mui/icons-material"
import trackTabClick from "../elements/side-tab-menu/analytics/track-tab-click"

const VerticalTabsWithAccordion = ({ data }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [shownContent, setShownContent] = useState(
    () => data.TabItemWithAccordion[0]
  )
  const [expandedStates, setExpandedStates] = useState([])
  const [showBackToTop, setShowBackToTop] = useState(false)

  const sections = useMemo(() => {
    if (!shownContent?.TabContent) return []
    return parseMarkdownToSections(shownContent.TabContent)
  }, [shownContent?.TabContent])

  useEffect(() => {
    setExpandedStates(
      sections[0]?.type === "accordion"
        ? Array(sections.length).fill(false)
        : []
    )
  }, [shownContent, sections])

  // Scroll listener for Back to Top button
  // To Do: add this to page layout component to implement site-wide
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

                if (selected.TabURL) {
                  trackTabClick({
                    title: selected.TabTitle,
                    url: selected.TabURL,
                    isMobile: true,
                    isExternal: true,
                  })

                  window.open(selected.TabURL, "_blank", "noopener,noreferrer")
                  return
                }

                trackTabClick({
                  title: selected.TabTitle,
                  url: selected.TabURL,
                  isMobile: true,
                })

                setShownContent(selected)
              }}
              IconComponent={KeyboardArrowDown}
              renderValue={(selected) => (
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    lineHeight: 1.4,
                    flex: 1,
                    paddingBottom: "0 !important",
                    paddingRight: "2rem !important",
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
                <MenuItem
                  key={item.TabTitle}
                  value={item.TabTitle}
                  sx={{
                    alignItems: "flex-start",
                    whiteSpace: "normal",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      lineHeight: 1.4,
                      flex: 1,
                    }}
                  >
                    {item.TabTitle}
                  </Typography>

                  {item.TabURL && (
                    <OpenInNew
                      fontSize="small"
                      sx={{ ml: 1, mt: "2px", flexShrink: 0 }}
                    />
                  )}
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
                url={item.TabURL}
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
              <AccordionControls
                expandedStates={expandedStates}
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
              />
              <AccordionList
                sections={sections}
                expandedStates={expandedStates}
                handleToggle={handleToggle}
              />
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
