import Markdown from "../elements/markdown"
import * as React from "react"
import { Box } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormGroup from "@mui/material/FormGroup"
import { Button } from "@mui/material"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import { CSVLink } from "react-csv"
import {
  KeyboardArrowLeft as BackIcon,
  RestartAlt as StartOverIcon,
} from "@mui/icons-material"
import Checkbox from "@mui/material/Checkbox"
import Typography from "@mui/material/Typography"

const RepoQuestions = ({ data }) => {
  const [value, setValue] = React.useState("")
  const [showOptions, setShowOptions] = React.useState(true)
  const [optionalInformation, setOptionalInformation] = React.useState(false)
  const [questionToShow, setQuestionToShow] = React.useState(1)
  const [selectedCheckboxes, setSelectedCheckboxes] = React.useState({})
  const [showRepositories, setShowRepositories] = React.useState(false)

  const handleClickStartOver = React.useCallback(() => {
    setQuestionToShow(1)
    setOptionalInformation(false)
    setShowOptions(true)
    setValue("")
    setSelectedCheckboxes({})
    setShowRepositories(false)
  }, [])

  const handleClickBack = React.useCallback(() => {
    setQuestionToShow(Math.max(questionToShow - 1, 1))
    setOptionalInformation(false)
    setShowOptions(true)
    setValue("")
    setSelectedCheckboxes({})
    setShowRepositories(false)
  }, [questionToShow])

  const handleChange = (event) => {
    const selectedValue = event.target.value

    if (selectedValue === "next") {
      setOptionalInformation(false)
      setSelectedCheckboxes({})
      setShowRepositories(false)

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

  const handleSeeRepositories = () => {
    setShowRepositories(true)
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
              <Typography>
                {questionToShow}. <Markdown inline>{q.question}</Markdown>
              </Typography>
              <br />

              {q.options.length > 2 && (
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
                      />
                    ))}
                  </FormGroup>

                  <Button
                    variant="contained"
                    onClick={handleSeeRepositories}
                    disabled={Object.keys(selectedCheckboxes).length === 0}
                    style={{ marginTop: "10px", color: "white" }}
                  >
                    See Repositories
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleChange({ target: { value: "next" } })} // Simulate selecting "next"
                    disabled={Object.keys(selectedCheckboxes).length > 0} // Disable if any checkboxes are selected
                    style={{ marginTop: "10px", marginLeft: "10px" }}
                  >
                    None of the Above
                  </Button>
                </div>
              )}

              {showOptions && q.options.length <= 2 && (
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
                          />
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                </div>
              )}

              {showRepositories &&
                Object.keys(selectedCheckboxes).length > 0 && (
                  <div>
                    <br />
                    {Object.values(selectedCheckboxes).map((info, idx) => (
                      <div key={`info-${idx}`}>
                        <Markdown>{info}</Markdown>
                        <br />
                      </div>
                    ))}
                    <br />
                    <Button
                      variant="contained"
                      startIcon={<FileDownloadIcon />}
                    >
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
