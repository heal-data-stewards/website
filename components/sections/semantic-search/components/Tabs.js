import { styled, Tab, Tabs, Tooltip } from "@mui/material"
import { forwardRef } from "react"

export function SemanticSearchTabs({ currentTabIndex, setCurrentTabIndex }) {
  return (
    <StyledTabs
      value={currentTabIndex}
      onChange={(_, i) => setCurrentTabIndex(i)}
      aria-label="Results tabs"
    >
      <Tooltip
        title="The Studies tab displays HEAL studies related to your search term. By default, the Studies tab shows all studies associated with the search term. Users can filter studies by using the filters box."
        placement="top"
        arrow
      >
        <StyledTab label="Studies" {...a11yProps(0)} />
      </Tooltip>
      <Tooltip
        title="The CDEs tab displays HEAL-approved Common Data Elements (CDEs) associated with the search term. A CDE is a standardized question with a specific set of allowable responses used across different studies or clinical trials to ensure consistent data collection. The HEAL CDE program provides further information."
        placement="top"
        arrow
      >
        <StyledTab label="CDEs" {...a11yProps(1)} />
      </Tooltip>
      <Tooltip
        title="The Related Concepts tab displays biomedical concepts associated with the search term. This tab allows users to explore concepts related to their search, then find HEAL studies and CDEs connected to the related concepts."
        placement="top"
        arrow
      >
        <StyledTab label="Related Concepts" {...a11yProps(2)} />
      </Tooltip>
      <Tooltip
        title="The Variables tab displays variables and measures (individual items from a CDE) associated with the search term."
        placement="top"
        arrow
      >
        <StyledTab label="Variables" {...a11yProps(3)} />
      </Tooltip>
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

const StyledTab = styled(
  forwardRef(function StyledTab(props, ref) {
    return <Tab ref={ref} {...props} />
  })
)(({ theme }) => ({
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
