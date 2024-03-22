import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import StepContent from "@mui/material/StepContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"
import Image from "next/image"
import Markdown from "../elements/markdown"

export default function SensitiveDataTree({ data }) {
  const [activeStep, setActiveStep] = React.useState(0)
  const [value, setValue] = React.useState(0)
  const [yes, setYes] = React.useState(false)
  const [yesValue, setYesValue] = React.useState()
  const [chosen, setChose] = React.useState(1)

  const handleNext = () => {
    setYes(false)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setValue((prevActiveStep) => prevActiveStep + 1)
  }

  const handleShowYes = (props) => {
    setChose(props.target.id)
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
      1: <Icon img="step1" />,
      2: <Icon img="step2" />,
      3: <Icon img="step3" />,
      4: <Icon img="step4" />,
      5: <Icon img="step5" />,
      6: <Icon img="step6" />,
    }

    return (
      <button
        onClick={() => handleSelect(props - 1)}
        className="cursor-pointer"
      >
        <div className={clsx(classes.root)}>{stepIcons[props]}</div>
      </button>
    )
  }

  const YesStepIcon = (props) => {
    const classes = useStyles()

    const stepIcons = {
      0: <Icon img="step1" />,
      1: <Icon img="step2" />,
      2: <Icon img="step3" />,
      3: <Icon img="step4" />,
      4: <Icon img="step5" />,
      5: <Icon img="step6" />,
    }

    return (
      <button
        onClick={() => handleSelect(props - 1)}
        className="cursor-pointer"
      >
        <div className={clsx(classes.root)}>{stepIcons[chosen]}</div>
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
                    StepIconComponent={() => CustomStepIcon(index + 1)}
                  >
                    <button
                      onClick={() => handleSelect(index)}
                      className="cursor-pointer"
                    >
                      <Markdown
                        sensitiveTool={"sensitive-tool"}
                        linkTarget="_blank"
                      >
                        {step.question}
                      </Markdown>
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
                      {index + 1 < data.datasteps.length && (
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
                      )}
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
