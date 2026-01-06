import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Link from "next/link"
import Markdown from "../elements/markdown"
import { styled, Tooltip, tooltipClasses } from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"

export default function DataSharingStatus({ data }) {
  const [value, setValue] = React.useState("")
  const [isInvalidInput, setIsInvalidInput] = React.useState(false)

  let handleTextFieldChange = (e) => {
    const v = e.target.value
    setValue(v)
    if (v.trim()) setIsInvalidInput(false)
  }

  const handleButtonClick = (e) => {
    if (!value.trim()) {
      // prevent action when empty and show error
      e.preventDefault()
      setIsInvalidInput(true)
    }
  }

  const hasValue = value.trim().length > 0

  return (
    <div className={"container mb-16"}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-basic"
          label={data.inputBoxLabel}
          variant="outlined"
          onChange={handleTextFieldChange}
          value={value}
          sx={{ width: "450px", marginTop: "0.5rem" }}
        />
        <Button
          style={{
            height: "3.5rem",
            fontSize: "1rem",
            padding: "1rem 2rem",
          }}
          variant="contained"
          id="checklist-tracker-tool"
          onClick={handleButtonClick}
        >
          {hasValue ? (
            <Link
              href={{
                pathname: "/app-search",
                query: { data: value }, // the data
              }}
            >
              <a style={{ color: "inherit", textDecoration: "none" }}>
                {data.buttonText}
              </a>
            </Link>
          ) : (
            <span style={{ color: "inherit" }}>{data.buttonText}</span>
          )}
        </Button>
        <LightTooltip title={<Markdown>{data.tooltip}</Markdown>}>
          <InfoIcon sx={{ color: "#cacaca" }} />
        </LightTooltip>
      </Box>

      {isInvalidInput && (
        <div
          style={{
            fontSize: "0.875rem",
            color: "#af0000",
          }}
        >
          Please enter a valid value to search.
        </div>
      )}
    </div>
  )
}

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.3)",
    fontSize: 8,
  },
}))
