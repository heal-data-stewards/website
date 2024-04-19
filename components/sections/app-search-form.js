import * as React from "react"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import StepContent from "@mui/material/StepContent"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"
import Image from "next/image"
import Markdown from "../elements/markdown"
import TextField from "@mui/material/TextField"
import Link from "next/link"

export const ProjectSearchForm = ({ defaultValue = "" }) => {
  const [value, setValue] = React.useState(defaultValue)

  let handleTextFieldChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        pt: 4,
        pb: 6,
        ".MuiInputBase-root": { m: 0, width: "500px", border: 0 },
        ".MuiInputBase-input": { boxShadow: 0 },
      }}
    >
      <Stack direction="row" gap={2}>
        <FormControl>
          <TextField
            id="textfield"
            label="App / Proj Number"
            variant="outlined"
            onChange={handleTextFieldChange}
            value={value}
          />
        </FormControl>
        <Button variant="contained">
          <Link
            href={{
              pathname: "/app-search",
              // pass the input text as query param
              query: { data: value },
            }}
          >
            <a>Check Status</a>
          </Link>
        </Button>
      </Stack>
    </Stack>
  )
}
