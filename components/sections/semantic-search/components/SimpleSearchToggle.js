import { FormControlLabel, Switch, Tooltip } from "@mui/material"

export function SimpleSearchToggle({ checked, size = "small", onChange }) {
  return (
    <Tooltip
      title="Match search terms exactly instead of semantically"
      placement="bottom"
    >
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            size={size}
            sx={{
              "& .Mui-checked": { color: "#4d2862" },
              "& .Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#4d2862",
              },
            }}
          />
        }
        label="Exact match"
        labelPlacement="start"
        sx={{
          ml: 0,
          mr: 0,
          "& .MuiFormControlLabel-label": {
            fontSize: size === "medium" ? "1.1rem" : "1rem" + " !important",
            color: "#4d2862",
            marginBottom: 0,
            marginRight: "4px",
          },
        }}
      />
    </Tooltip>
  )
}
