import { sendCustomEvent } from "utils/analytics"
import { Close, Help } from "@mui/icons-material"
import {
  Box,
  Button,
  IconButton,
  Modal,
  styled,
  Tab,
  Tabs,
} from "@mui/material"
import { forwardRef, useState } from "react"
import Markdown from "../../../elements/markdown"

const HELP_CONTENT = `
**Studies Tab**  
This tab allows users to find HEAL studies and study-specific variables and CDEs associated with the related concepts. 


**CDEs (Common Data Elements) Tab**  
A CDE is a standardized question with a specific set of allowable responses used across different studies or clinical trials to ensure consistent data collection. The [HEAL CDE program](https://heal.nih.gov/data/common-data-elements) provides further information.


**Related Concepts Tab**  
This tab allows users to explore concepts related to their search, then find HEAL studies and CDEs connected to the related concepts. [Click here](https://docs.google.com/document/d/1FUlknVECgQwzPzyFVSQKfu2VOtNX7bC98p9SsZ1J_7c/edit?tab=t.0#bookmark=id.vpbv0x57cxgs) to learn more about how HSS makes connections between concepts.


**Variables Tab**  
This tab allows users to explore HEAL variables and measures (individual items from a CDE) associated with the search term.


**Need More Help?**  
Read the [User Guide](https://docs.google.com/document/d/1FUlknVECgQwzPzyFVSQKfu2VOtNX7bC98p9SsZ1J_7c/edit?usp=sharing), access the [Help Desk](https://renci.atlassian.net/servicedesk/customer/portal/3), or view other useful information on the [HSS Resources page](/resources/semantic-search/help).
`

export function SemanticSearchTabs({ currentTabIndex, setCurrentTabIndex }) {
  const [helpModalOpen, setHelpModalOpen] = useState(false)

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
      <Button
        variant="text"
        startIcon={<Help />}
        style={{ textTransform: "none", marginLeft: "auto", color: "#4d2862" }}
        onClick={() => setHelpModalOpen(true)}
      >
        Need help?
      </Button>
      <Modal
        open={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        aria-labelledby="help-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 700,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          <IconButton
            onClick={() => setHelpModalOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#4d2862",
            }}
          >
            <Close />
          </IconButton>
          <Markdown>{HELP_CONTENT}</Markdown>
        </Box>
      </Modal>
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
