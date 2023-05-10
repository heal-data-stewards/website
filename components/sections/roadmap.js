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
import clsx from "clsx"
import Image from "next/image"
import Markdown from "react-markdown"

export default function RoadMap({ data }) {
  const [activeStep, setActiveStep] = React.useState(0)

  // React.useEffect(() => {

  // }, [])

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
      1: <Icon img="1" />,
      2: <Icon img="2" />,
      3: <Icon img="3" />,
      4: <Icon img="4" />,
      5: <Icon img="5" />,
      6: <Icon img="6" />,
      7: <Icon img="7" />,
      8: <Icon img="8" />,
      9: <Icon img="9" />,
      10: <Icon img="10" />
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
                // optional={
                //   index === data.steps.length - 1 ? (
                //     <Typography variant="caption">Last step</Typography>
                //   ) : null
                // }
              >
                {" "}
                <button
                  onClick={() => handleSelect(index)}
                  className="cursor-pointer"
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
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === data.steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    {index === 0 ? (
                      ""
                    ) : (
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
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
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    </div>
  )
}
