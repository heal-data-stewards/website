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
import { ProjectSearchForm } from "./app-search-form"

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
  const [query, setQuery] = React.useState("")
  const [activeStep, setActiveStep] = React.useState(-1)

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

  const StepIcon = (props) => {
    return (
      <button onClick={handleClickStep} className="cursor-pointer">
        <Icon src={`/${props.icon}.png`} />
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

      <ProjectSearchForm />

      <Box
        sx={{
          maxWidth: 1200,
          ".MuiStepper-root .MuiStep-root": {
            transition: "filter 250ms",
            filter: activeStep > -1 ? "opacity(0.66)" : "opacity(1.0)",
          },
          ".MuiStepper-root .MuiStep-root.active": {
            filter: "opacity(1.0)",
          },
          ".MuiStepper-root .MuiStep-root:not(.active):hover": {
            filter: "opacity(1.0)",
          },
        }}
      >
        <Stepper orientation="vertical">
          {data.steps.map((step, index) => (
            <Step
              key={step.title}
              active={activeStep === index}
              className={activeStep === index ? "active" : ""}
            >
              <StepLabel sx={{ p: 0 }} StepIconComponent={StepIcon}>
                <button
                  onClick={() => handleClickStep(index)}
                  className="cursor-pointer text-xl text-purple font-bold step-title"
                  style={{ marginLeft: "0.5rem" }}
                >
                  {step.title}
                </button>
              </StepLabel>

              <StepContent sx={{ pl: 7 }}>
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
