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

const SearchForm = () => {
  const [value, setValue] = React.useState("")

  let handleTextFieldChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        pt: 4, pb: 6,
        '.MuiInputBase-root': { m: 0, width: '500px', border: 0 },
        '.MuiInputBase-input': { boxShadow: 0 },
      }}
    >
      <Stack direction="row" gap={ 2 }>
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

function Icon({ src }) {
  return (
    <Image
      src={src}
      alt="" // decorative image
      width="84"
      height="84"
    />
  )
}

export default function RoadMap({ data }) {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleClickNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleClickBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleClickReset = () => {
    setActiveStep(0)
  }

  const handleClickStep = (i) => {
    if (activeStep === i) {
      setActiveStep(-1)
      return
    }
    setActiveStep(i)
  }

  const useStyles = makeStyles(() => ({
    root: {
      padding: "0",
      marginBottom: "-14px",
      marginTop: "-4px",
    },
    active: {
      color: "red",
    },
    completed: {
      color: "green",
    },
  }))

  const StepIcon = (props) => {
    const classes = useStyles()

    return (
      <button
        onClick={handleClickStep}
        className="cursor-pointer"
      >
        <div className={clsx(classes.root)}>
          <Icon src={ `/${props.icon}.png` } />
        </div>
      </button>
    )
  }

  return (
    <div className={"container mb-16"}>
      <p style={{ marginBottom: "20px", fontSize: "16px" }}>
        {
          "Wondering where your study is on the HEAL compliance journey? Try our new HEAL Checklist Progress Tracker. Just type in your study's unique application ID or project number in the search bar below to see your study's status for steps we can track."
        }
      </p>
      
      <SearchForm />

      <Box sx={{ maxWidth: 1200 }}>
        <Stepper orientation="vertical">
          {data.steps.map((step, index) => (
            <Step active={ activeStep === index } key={step.title}>
              <StepLabel
                style={{ padding: 0 }}
                StepIconComponent={StepIcon}
              >
                {" "}
                <button
                  onClick={() => handleClickStep(index)}
                  className="cursor-pointer"
                >
                  <span className={"text-xl text-purple font-bold"}>
                    {step.title}
                  </span>
                </button>
              </StepLabel>

              <StepContent sx={{ pl: 6 }}>
                <div className="event-html">
                  <Markdown linkTarget="_blank">{step.description}</Markdown>
                </div>
                <Box sx={{ mb: 2 }}>
                  <div className="mt-6">
                    <Button
                      variant="contained"
                      onClick={handleClickNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === data.steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    {index !== 0 && (
                      <Button
                        disabled={index === 0}
                        onClick={handleClickBack}
                        sx={{ mt: 1, mr: 1 }}
                        variant="outlined"
                      >
                        Back
                      </Button>
                    )}
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === data.steps.length - 1 && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Button onClick={handleClickReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    </div>
  )
}
