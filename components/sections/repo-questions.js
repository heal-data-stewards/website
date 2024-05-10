import Markdown from "../elements/markdown"
import * as React from "react"
import { Box } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import { Button } from "@mui/material"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import { CSVLink, CSVDownload } from "react-csv"
import {
  KeyboardArrowLeft as BackIcon,
  RestartAlt as StartOverIcon,
} from "@mui/icons-material"

const RepoQuestions = ({ data }) => {
  const [value, setValue] = React.useState("")
  const [showOptions, setShowOptions] = React.useState(true)
  const [optionalInformation, setOptionalInformation] = React.useState(false)
  const [questionToShow, setQuestionToShow] = React.useState(1)

  const handleClickStartOver = React.useCallback(() => {
    setQuestionToShow(1)
    setOptionalInformation(false)
    setShowOptions(true)
    setValue("")
  }, [])

  const handleClickBack = React.useCallback(() => {
    console.log({ questionToShow })
    setQuestionToShow(Math.max(questionToShow - 1, 1))
    setOptionalInformation(false)
    setShowOptions(true)
    setValue("")
  }, [questionToShow])

  const handleChange = (event) => {
    setValue(event.target.value)
    if (event.target.value != "next") {
      setShowOptions(false)
      setOptionalInformation(event.target.value)
    } else if (event.target.value == "next") {
      setOptionalInformation(false)
      if (data.repo_question.length > questionToShow) {
        setQuestionToShow(questionToShow + 1)
        setValue("")
      }
    }
  }

  const BackButton = React.useCallback(
    () => (
      <Button
        onClick={handleClickBack}
        disabled={questionToShow === 1 && !showOptions}
        variant="outlined"
        startIcon={<BackIcon />}
      >
        Back
      </Button>
    ),
    [handleClickBack, questionToShow]
  )

  const StartOverButton = React.useCallback(
    () => (
      <Button
        onClick={handleClickStartOver}
        disabled={questionToShow === 1 && showOptions}
        variant="outlined"
        startIcon={<StartOverIcon />}
      >
        Start Over
      </Button>
    ),
    [optionalInformation, questionToShow]
  )

  return (
    <div
      className="container pb-4 text-gray-dark"
      style={{
        padding: "25px 5px 25px 32px",
        marginBottom: "25px",
      }}
    >
      {data.repo_question.map((q, i) => {
        if (i + 1 === questionToShow) {
          return (
            <div className="repo-questions" key={q.question}>
              <Markdown className="repo-questions">{q.question}</Markdown>
              <br></br>
              {showOptions && (
                <div>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                    >
                      {q.options.map((o) => {
                        let v
                        if (o.optional_information) {
                          v = o.optional_information
                        } else {
                          v = "next"
                        }
                        return (
                          <FormControlLabel
                            key={o.yes_no}
                            value={v}
                            control={<Radio />}
                            label={o.yes_no}
                          />
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                </div>
              )}

              {optionalInformation && (
                <div>
                  <Markdown>{optionalInformation}</Markdown>
                  <br></br>
                  <Button variant="contained" startIcon={<FileDownloadIcon />}>
                    <CSVLink data={optionalInformation}>
                      Download Results
                    </CSVLink>
                  </Button>
                </div>
              )}

              {!showOptions && (
                <Box
                  sx={{
                    borderLeft: "6px solid",
                    borderLeftColor: "primary.light",
                    backgroundColor: "rgb(229, 224, 232)",
                    my: 6,
                    p: 2,
                  }}
                >
                  <Markdown>
                    Once you have selected a repository, please report your
                    selection to the HEAL Stewards by emailing
                    [HEALStewards@renci.org](mailto:HEALStewards@renci.org), or
                    the Platform Team via the [Platform Help
                    Desk](https://heal.github.io/platform-documentation/contact/).
                    For more information or repository selection assistance,
                    please [contact the HEAL
                    Stewards](https://forms.fillout.com/t/gcVveGMswBus).
                  </Markdown>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 1,
                  mt: 3,
                }}
              >
                <BackButton />
                <StartOverButton />
              </Box>
            </div>
          )
        }
      })}
    </div>
  )
}

export default RepoQuestions
