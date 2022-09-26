import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import StepContent from "@mui/material/StepContent"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { makeStyles } from "@material-ui/core"
import NoteAddIcon from "@material-ui/icons/NoteAdd"
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto"
import AddAlertIcon from "@material-ui/icons/AddAlert"
import clsx from "clsx"
import Image from "next/image"

const steps = [
  {
    label: "Award Won!",
    description: `NIH HEAL Initiative applicants must submit a data management and sharing plan (DMP) as part of their resource sharing plan that outlines management and sharing of scientific data, accompanying metadata, other relevant data, and associated documentation. If you haven’t submitted your DMP yet, please refer to the links below for guidance. Beginning in January 2023, a DMP will be a required part of any NIH proposal per the new NIH Policy for Data Management and Sharing.`,
  },
  {
    label: "Submit your Data Management and Sharing Plan",
    description: "Optional description",
  },
  {
    label: "Register your Study on ClinicalTrials.gov",
    description: `Optional description`,
  },
  {
    label:
      "Nostrud ad laboris irure aliquip culpa in labore magna laboris qui ut.",
    description: "Optional description",
  },
  {
    label: "Nisi mollit in labore amet tempor ullamco in commodo.",
    description: `Optional description`,
  },
]

export default function RoadMap() {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
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

  function Icon({ img }) {
    return <Image src={`/${img}.png`} alt="me" width="84" height="84" />
  }

  const CustomStepIcon = (props) => {
    const classes = useStyles()

    const stepIcons = {
      1: <Icon img="1" />,
      2: <Icon img="2" />,
      3: <Icon img="3" />,
      4: <Icon img="4" />,
      5: <Icon img="5" />,
      6: <Icon img="6" />,
    }

    return (
      <div className={clsx(classes.root)}>{stepIcons[String(props.icon)]}</div>
    )
  }

  return (
    <Box
      sx={{ maxWidth: 1200 }}
      className={"prose-lg container mt-16 mb-16 pl-20"}
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              style={{ padding: 0 }}
              StepIconComponent={CustomStepIcon}
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              <span className={"text-xl text-purple font-bold"}>
                {step.label}
              </span>
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  )
}
