import * as React from "react"
import Markdown from "../elements/markdown"
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormGroup,
  Button,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material"
import { CSVLink } from "react-csv"
import {
  KeyboardArrowLeft as BackIcon,
  RestartAlt as StartOverIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material"

const RepoQuestions = ({ data }) => {
  const [value, setValue] = React.useState("")
  const [showOptions, setShowOptions] = React.useState(true)
  const [optionalInformation, setOptionalInformation] = React.useState(false)
  const [questionToShow, setQuestionToShow] = React.useState(1)
  const [selectedCheckboxes, setSelectedCheckboxes] = React.useState({})

  const handleClickStartOver = React.useCallback(() => {
    setQuestionToShow(1)
    setOptionalInformation(false)
    setShowOptions(true)
    setValue("")
    setSelectedCheckboxes({})
  }, [])

  const handleClickBack = React.useCallback(() => {
    if (optionalInformation || Object.keys(selectedCheckboxes).length > 0) {
      // if optionalInformation is displayed or checkboxes are selected, clear them but stay on the same question
      setOptionalInformation(false)
      setShowOptions(true)
      setValue("")
      setSelectedCheckboxes({})
    } else {
      // otherwise, go back one question
      setQuestionToShow(Math.max(questionToShow - 1, 1))
      setOptionalInformation(false)
      setShowOptions(true)
      setValue("")
      setSelectedCheckboxes({})
    }
  }, [questionToShow, optionalInformation, selectedCheckboxes])

  const handleChange = (event) => {
    const selectedValue = event.target.value

    if (selectedValue === "next") {
      setOptionalInformation(false)
      setSelectedCheckboxes({})

      if (data.repo_question.length > questionToShow) {
        setQuestionToShow(questionToShow + 1)
        setValue("")
      }
    } else {
      setValue(selectedValue)
      setShowOptions(false)
      setOptionalInformation(selectedValue)
    }
  }

  const handleCheckboxChange = (option, checked) => {
    setSelectedCheckboxes((prev) => {
      const updated = { ...prev }
      if (checked) {
        updated[option.yes_no] = option.optional_information
      } else {
        delete updated[option.yes_no]
      }
      return updated
    })
  }

  const BackButton = React.useCallback(
    () => (
      <Button
        onClick={handleClickBack}
        disabled={questionToShow === 1}
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
    [handleClickStartOver, questionToShow, showOptions]
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
            <div key={q.question}>
              <Markdown>{q.question}</Markdown>
              <br />

              {q.checkbox_type === true && (
                <div>
                  <FormGroup>
                    {q.options.map((o, index) => (
                      <FormControlLabel
                        key={`checkbox-${index}`}
                        control={
                          <Checkbox
                            onChange={(e) =>
                              handleCheckboxChange(o, e.target.checked)
                            }
                            checked={!!selectedCheckboxes[o.yes_no]}
                          />
                        }
                        label={o.yes_no}
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            marginBottom: 0,
                          },
                        }}
                      />
                    ))}
                  </FormGroup>
                  <Button
                    variant="outlined"
                    onClick={() => handleChange({ target: { value: "next" } })}
                    sx={{ marginTop: "10px", marginLeft: "10px" }}
                  >
                    None of the Above
                  </Button>
                </div>
              )}

              {showOptions && q.checkbox_type === false && (
                <div>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                    >
                      {q.options.map((o) => {
                        let v = o.optional_information || "next"
                        return (
                          <FormControlLabel
                            key={o.yes_no}
                            value={v}
                            control={<Radio />}
                            label={o.yes_no}
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                marginBottom: 0,
                              },
                            }}
                          />
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                </div>
              )}

              {Object.keys(selectedCheckboxes).length > 0 && (
                <div>
                  <Divider sx={{ marginTop: "2rem" }} />
                  <Typography variant="h3" sx={{ marginBottom: "1rem" }}>
                    Repository List
                  </Typography>
                  {Object.values(selectedCheckboxes).map((info, idx) => (
                    <div key={`info-${idx}`}>
                      <Markdown>{info}</Markdown>
                      <br />
                    </div>
                  ))}
                  <br />
                  <Button variant="contained" startIcon={<FileDownloadIcon />}>
                    <CSVLink
                      data={Object.entries(selectedCheckboxes).map(
                        ([key, value]) => ({
                          Repository: key,
                          Information: value,
                        })
                      )}
                      filename="selected_repositories.csv"
                    >
                      Download Results
                    </CSVLink>
                  </Button>
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
