import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Link from "next/link"

export default function DataSharingStatus({ data }) {
  const [value, setValue] = React.useState("")

  let handleTextFieldChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className={"container mb-16"}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          id="outlined-basic"
          label={data.inputBoxLabel}
          variant="outlined"
          onChange={handleTextFieldChange}
          value={value}
          sx={{ minWidth: "300px", marginTop: "0.5rem" }}
        />
        <Button
          style={{
            marginLeft: "2rem",
            height: "3.5rem",
            fontSize: "1rem",
            padding: "1rem 2rem",
          }}
          variant="contained"
          id="checklist-tracker-tool"
        >
          <Link
            href={{
              pathname: "/app-search",
              query: { data: value }, // the data
            }}
          >
            <a>{data.buttonText}</a>
          </Link>
        </Button>
      </Box>
    </div>
  )
}
