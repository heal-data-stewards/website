import { styled, Tab, Tabs } from "@mui/material"
import { sendCustomEvent } from "utils/analytics"

export function SemanticSearchTabs({ currentTabIndex, setCurrentTabIndex }) {
  return (
    <StyledTabs
      value={currentTabIndex}
      onChange={(_, i) => setCurrentTabIndex(i)}
      aria-label="Results tabs"
    >
      <StyledTab
        label="Studies"
        {...a11yProps(0)}
        onClick={() => {
          sendCustomEvent("hss_panel_selected", {
            panel_index: "Studies",
          })
        }}
      />
      <StyledTab
        label="CDEs"
        {...a11yProps(1)}
        onClick={() => {
          sendCustomEvent("hss_panel_selected", {
            panel_index: "CDEs",
          })
        }}
      />
      <StyledTab
        label="Related Concepts"
        {...a11yProps(2)}
        onClick={() => {
          sendCustomEvent("hss_panel_selected", {
            panel_index: "Related Concepts",
          })
        }}
      />
      <StyledTab
        label="Variables"
        {...a11yProps(3)}
        onClick={() => {
          sendCustomEvent("hss_panel_selected", {
            panel_index: "Variables",
          })
        }}
      />
    </StyledTabs>
  )
}

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    variant="scrollable"
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    backgroundColor: "#4d2862",
    height: "4px",
  },
  "& .MuiTabs-flexContainer": {
    gap: "0.5rem",
  },
})

const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  backgroundColor: "rgba(77, 40, 98, 0.1)",
  borderRadius: "8px 8px 0 0",
  "&:hover": {
    color: "rgba(77, 40, 98, 0.25)",
    color: "#764593",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#4d2862",
    backgroundColor: "rgba(77, 40, 98, 0.25)",
    fontWeight: theme.typography.fontWeightMedium,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(77, 40, 98, 0.25)",
  },
}))

function a11yProps(index) {
  return {
    id: `results-tab-${index}`,
    "aria-controls": `results-tabpanel-${index}`,
  }
}
