import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import StepContent from "@mui/material/StepContent"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { makeStyles } from "@mui/styles"
import clsx from "clsx"
import Image from "next/legacy/image"
import Markdown from "../elements/markdown"
import { sendCustomEvent } from "utils/analytics"

export default function RoadMap({ data }) {
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

  const handleSelect = (i) => {
    sendCustomEvent("checklist_interaction", {
      interaction_type: "step_select",
      step_title: data.steps[i].title,
      step_number: data.steps[i].stepID ?? i + 1,
    })
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
      1: <Icon img="ci-award" />,
      2: <Icon img="ci-clinical-trials" />,
      3: <Icon img="ci-register" />,
      4: <Icon img="ci-cedar" />,
      5: <Icon img="ci-db" />,
      6: <Icon img="ci-cdes" />,
      7: <Icon img="ci-vlmd" />,
      8: <Icon img="ci-submit" />,
      9: <Icon img="ci-report" />,
      10: <Icon img="ci-access" />,
      11: <Icon img="ci-publication" />,
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
    <div className={"container mb-16"}>
      <Box sx={{ maxWidth: 1200 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {data.steps.map((step, index) => (
            <Step key={step.title}>
              <StepLabel
                style={{ padding: 0 }}
                StepIconComponent={CustomStepIcon}
              >
                {" "}
                <button
                  onClick={() => handleSelect(index)}
                  className="cursor-pointer"
                  id={
                    step.stepID
                      ? `checklist-step-title-${step.stepID}`
                      : `checklist-step-title-${index + 1}`
                  }
                >
                  <span className={"text-xl text-purple font-bold"}>
                    {step.title}
                  </span>
                </button>
              </StepLabel>

              <StepContent>
                <div className="event-html">
                  <Typography>
                    <Markdown linkTarget="_blank">{step.description}</Markdown>
                  </Typography>
                </div>
                <Box sx={{ mb: 2 }}>
                  <div className="mt-6">
                    <Button
                      variant="contained"
                      onClick={() => {
                        sendCustomEvent("checklist_interaction", {
                          interaction_type: "step_continue",
                          step_title: step.title,
                          step_number: step.stepID ?? index + 1,
                        })
                        handleNext()
                      }}
                      sx={{ mt: 1, mr: 1 }}
                      id={
                        step.stepID
                          ? `checklist-step-button-${step.stepID}`
                          : `checklist-step-button-${index + 1}`
                      }
                    >
                      {index === data.steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    {index === 0 ? (
                      ""
                    ) : (
                      <Button
                        disabled={index === 0}
                        onClick={() => {
                          sendCustomEvent("checklist_interaction", {
                            interaction_type: "step_back",
                            step_title: step.title,
                            step_number: step.stepID ?? index + 1,
                          })
                          handleBack()
                        }}
                        sx={{ mt: 1, mr: 1 }}
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
        {activeStep === data.steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Button
              onClick={() => {
                sendCustomEvent("checklist_interaction", {
                  interaction_type: "step_reset",
                  step_number: activeStep + 1,
                })
                handleReset()
              }}
              sx={{ mt: 1, mr: 1 }}
            >
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    </div>
  )
}
