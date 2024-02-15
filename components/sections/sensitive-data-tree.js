import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import StepContent from "@mui/material/StepContent"
import Button from "@mui/material/Button"
// import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { makeStyles } from "@mui/material"
import clsx from "clsx"
import Image from "next/image"
import Markdown from "../elements/markdown"

export default function SensitiveDataTree({ data }) {
  const [activeStep, setActiveStep] = React.useState(0)
  const [value, setValue] = React.useState(0)
  const [yes, setYes] = React.useState(false)
  const [yesValue, setYesValue] = React.useState()

  const handleNext = () => {
    setYes(false)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setValue((prevActiveStep) => prevActiveStep + 1)
  }

  const handleShowYes = (props) => {
    setYesValue(data.datasteps[props.target.id])
    setActiveStep(data.datasteps.length)
    setYes(true)
  }

  const handleReset = () => {
    setActiveStep(value)
    setYes(false)
  }

  const handleSelect = (i) => {
    // if (i + 1 !== data.datasteps.length) {
    setYes(false)
    setValue(i)
    setActiveStep(i)
    // }
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
    return (
      <Image
        src={`/${img}.png`}
        alt="image for current step"
        width="84"
        height="84"
      />
    )
  }

  const CustomStepIcon = (props) => {
    const classes = useStyles()

    const stepIcons = {
      1: <Icon img="20" />,
    }

    return (
      <button
        onClick={() => handleSelect(props.icon - 1)}
        className="cursor-pointer"
      >
        <div className={clsx(classes.root)}>{stepIcons[1]}</div>
      </button>
    )
  }

  const YesStepIcon = (props) => {
    const classes = useStyles()

    const stepIcons = {
      1: <Icon img="1" />,
    }

    return (
      <button
        onClick={() => handleSelect(props.icon - 1)}
        className="cursor-pointer"
      >
        <div className={clsx(classes.root)}>
          {stepIcons[String(props.icon)]}
        </div>
      </button>
    )
  }

  return (
    <div className={"container mb-16 mt-16"}>
      <Box sx={{ maxWidth: 1200 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {data.datasteps.map((step, index) => {
            return (
              !yes && (
                <Step key={step.question + index}>
                  <StepLabel
                    style={{ padding: 0 }}
                    StepIconComponent={CustomStepIcon}
                  >
                    <button
                      onClick={() => handleSelect(index)}
                      className="cursor-pointer"
                    >
                      <span className={"text-2xl text-purple font-bold"}>
                        {step.question}
                      </span>
                    </button>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
                      <div className="event-html">
                        <Typography>
                          <Markdown linkTarget="_blank">
                            {step.additionalinfo}
                          </Markdown>
                        </Typography>
                      </div>
                      <div className="mt-6">
                        <Button
                          variant="contained"
                          onClick={handleShowYes}
                          sx={{ mt: 1, mr: 1 }}
                          id={index}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          No
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              )
            )
          })}
          {yes && (
            <Step key={"yes"}>
              <StepLabel style={{ padding: 0 }} StepIconComponent={YesStepIcon}>
                <div className={"text-purple"}>
                  <Markdown linkTarget="_blank">{yesValue.yes}</Markdown>
                  <br></br>
                </div>
                <Box sx={{ mb: 2 }}>
                  <div className="event-html">
                    <Typography>
                      <Markdown linkTarget="_blank">
                        {yesValue.yesadditional}
                      </Markdown>
                    </Typography>
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="contained"
                      onClick={handleReset}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back to decision tree
                    </Button>
                  </div>
                </Box>
              </StepLabel>
              {/* <StepContent>
                                <Box sx={{ mb: 2 }}>
                                    <div className="event-html">
                                        <Typography>
                                            <Markdown linkTarget="_blank">{yesValue.yesadditional}</Markdown>
                                        </Typography>
                                    </div>
                                    <div className="mt-6">
                                        <Button
                                            variant="contained"
                                            onClick={handleReset}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back to decision tree
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent> */}
            </Step>
          )}
        </Stepper>
      </Box>
    </div>
  )
}
