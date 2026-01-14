import { alpha, styled, Tab, Tabs } from "@mui/material"

export function SemanticSearchTabs({ currentTabIndex, setCurrentTabIndex }) {
  return (
    <StyledTabs
      value={currentTabIndex}
      onChange={(_, i) => setCurrentTabIndex(i)}
      aria-label="Results tabs"
    >
      <StyledTab label="Studies" {...a11yProps(0)} />
      <StyledTab label="CDEs" {...a11yProps(1)} />
      <StyledTab label="Related Concepts" {...a11yProps(2)} />
      <StyledTab label="Variables" {...a11yProps(3)} />
    </StyledTabs>
  )
}

export function PillTabs({ children, ...props }) {
  return <StyledPillTabs {...props}>{children}</StyledPillTabs>
}

const StyledPillTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ theme, fullWidth = true }) => ({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTabs-flexContainer": {
    gap: theme.spacing(1),
  },
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.05)
      : theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(0.5),
  display: "inline-flex",
  width: fullWidth ? "100%" : "auto",
  minHeight: "auto",

  // Styled tab children
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(14),
    minHeight: "auto",
    minWidth: "auto",
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(["background-color", "color"], {
      duration: theme.transitions.duration.short,
    }),

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
    },

    "&.Mui-selected": {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[1],
    },

    "&.Mui-focusVisible": {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
  },
}))

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

export function TabPanel({ children, currentTabIndex, index }) {
  return (
    <div
      role="tabpanel"
      hidden={currentTabIndex !== index}
      id={`results-tabpanel-${index}`}
      aria-labelledby={`results-tab-${index}`}
    >
      {currentTabIndex === index && <div>{children}</div>}
    </div>
  )
}

export function a11yProps(index) {
  return {
    id: `results-tab-${index}`,
    "aria-controls": `results-tabpanel-${index}`,
  }
}
