import React, { useState, useEffect, useMemo, useRef, Fragment } from "react"
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

// Helper function to create slug from tab title (fallback)
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// Helper to get the slug (custom or auto-generated)
const getSlug = (item) => {
  // Use custom TabLinkFragment if provided, otherwise auto-generate from title
  return item.TabLinkFragment || createSlug(item.TabTitle)
}

const VerticalTabsWithAccordion = ({ data }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Find tab by hash or default to first
  const getInitialTab = () => {
    if (typeof window === "undefined") return data.TabItemWithAccordion[0]

    const hash = window.location.hash.slice(1) // Remove #
    if (!hash) return data.TabItemWithAccordion[0]

    const matchedTab = data.TabItemWithAccordion.find(
      (item) => getSlug(item) === hash
    )
    return matchedTab || data.TabItemWithAccordion[0]
  }

  const [shownContent, setShownContent] = useState(getInitialTab)
  const [expandedStates, setExpandedStates] = useState([])
  const [showBackToTop, setShowBackToTop] = useState(false)
  const tabItemsRef = useRef(data.TabItemWithAccordion)

  const sections = useMemo(() => {
    if (!shownContent?.TabContent) return []
    return parseMarkdownToSections(shownContent.TabContent)
  }, [shownContent?.TabContent])

  // Handle hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (!hash) {
        setShownContent(data.TabItemWithAccordion[0])
        return
      }

      const matchedTab = data.TabItemWithAccordion.find(
        (item) => getSlug(item) === hash
      )
      if (matchedTab && matchedTab.TabTitle !== shownContent.TabTitle) {
        setShownContent(matchedTab)
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [data.TabItemWithAccordion, shownContent.TabTitle])

  // Set initial tab from hash on mount (corrects SSR default when a hash is present)
  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const matchedTab = tabItemsRef.current.find(
      (item) => getSlug(item) === hash
    )
    if (matchedTab) {
      setShownContent(matchedTab)
    }
  }, [])

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

  // Updated tab change handler
  const handleTabChange = (item) => {
    if (item.TabURL) {
      window.open(item.TabURL, "_blank", "noopener,noreferrer")
      return
    }

    setShownContent(item)
    // Update hash without triggering page scroll
    const slug = getSlug(item)
    window.history.pushState(null, "", `#${slug}`)
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
                handleTabChange(selected)
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
                  onMouseDown={() =>
                    trackTabClick({
                      title: item.TabTitle,
                      url: item.TabURL,
                      isMobile: true,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      trackTabClick({
                        title: item.TabTitle,
                        url: item.TabURL,
                        isMobile: true,
                      })
                    }
                  }}
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
                key={i + item.TabTitle}
                onClick={() => handleTabChange(item)}
                title={item.TabTitle}
                url={item.TabURL}
                index={i}
                isSelected={item.TabTitle === shownContent.TabTitle}
              />
            ))}
          </ButtonBlockContainer>
        )}

        {data.TabItemWithAccordion.map((item) => {
          const isActive = item.TabTitle === shownContent.TabTitle
          return (
            <PanelContainer
              key={item.TabTitle}
              sx={{
                width: "100%",
                paddingX: isMobile ? 2 : 0,
                marginTop: isMobile ? 2 : 0,
              }}
              style={{ display: isActive ? undefined : "none" }}
            >
              {isActive ? (
                <>
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
                        {item.TabTitle}
                      </Typography>
                      <Divider
                        sx={{
                          backgroundColor: "#982568",
                          marginBottom: "1rem",
                        }}
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
                </>
              ) : (
                <>
                  <h2>{item.TabTitle}</h2>
                  <Markdown>{item.TabContent}</Markdown>
                </>
              )}
            </PanelContainer>
          )
        })}
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
