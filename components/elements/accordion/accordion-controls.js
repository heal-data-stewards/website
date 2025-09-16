import { Box, Button } from "@mui/material"

export const AccordionControls = ({
  expandedStates,
  onExpandAll,
  onCollapseAll,
}) => (
  <Box
    sx={{
      display: "flex",
      gap: 1,
      mb: "1rem",
      justifyContent: "flex-end",
      flexWrap: "wrap",
    }}
  >
    <Button
      variant="outlined"
      size="medium"
      sx={{ minHeight: 40 }}
      onClick={onExpandAll}
      disabled={expandedStates.every(Boolean)}
    >
      Expand All
    </Button>
    <Button
      variant="outlined"
      size="medium"
      sx={{ minHeight: 40 }}
      onClick={onCollapseAll}
      disabled={expandedStates.every((state) => !state)}
    >
      Collapse All
    </Button>
  </Box>
)

export default AccordionControls
