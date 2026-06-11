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
  Stack,
} from "@mui/material"
import { CSVLink } from "react-csv"
import {
  KeyboardArrowLeft as BackIcon,
  RestartAlt as StartOverIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material"
import { sendCustomEvent } from "utils/analytics"

const QUESTION_LABELS = {
  1: "1-ic-specific-repository",
  2: "2-generalist-or-data-type-specific",
  3: "3-human-data",
  13: "4-data-types-multi-select",
  8: "5-protocols-code-publications",
}

const RepoQuestions = ({ data }) => {
  const [value, setValue] = React.useState("")
  const [showOptions, setShowOptions] = React.useState(true)
  const [optionalInformation, setOptionalInformation] = React.useState(false)
  const [questionToShow, setQuestionToShow] = React.useState(1)
  const [selectedCheckboxes, setSelectedCheckboxes] = React.useState({})

  const handleClickStartOver = React.useCallback(() => {
    sendCustomEvent("repo_selection_tool_interaction", {
      interaction_type: "start_over",
      question_id:
        QUESTION_LABELS[data.repo_question[questionToShow - 1]?.id] ??
        data.repo_question[questionToShow - 1]?.id,
    })
    setQuestionToShow(1)
    setOptionalInformation(false)
    setShowOptions(true)
    setValue("")
    setSelectedCheckboxes({})
  }, [questionToShow, data.repo_question])

  const handleClickBack = React.useCallback(() => {
    sendCustomEvent("repo_selection_tool_interaction", {
      interaction_type: "back_click",
      question_id:
        QUESTION_LABELS[data.repo_question[questionToShow - 1]?.id] ??
        data.repo_question[questionToShow - 1]?.id,
    })
    if (optionalInformation || Object.keys(selectedCheckboxes).length > 0) {
      setOptionalInformation(false)
      setShowOptions(true)
      setValue("")
      setSelectedCheckboxes({})
    } else {
      setQuestionToShow(Math.max(questionToShow - 1, 1))
      setOptionalInformation(false)
      setShowOptions(true)
      setValue("")
      setSelectedCheckboxes({})
    }
  }, [
    questionToShow,
    optionalInformation,
    selectedCheckboxes,
    data.repo_question,
  ])

  const handleChange = (event, question, selectedOption) => {
    const isNoneOfTheAbove = !selectedOption

    sendCustomEvent("repo_selection_tool_interaction", {
      interaction_type: "question_answered",
      question_id: QUESTION_LABELS[question?.id] ?? question?.id,
      answer: isNoneOfTheAbove
        ? "none_of_the_above"
        : selectedOption.option_label,
    })

    if (!selectedOption?.optional_information) {
      setOptionalInformation(false)
      setSelectedCheckboxes({})
      if (data.repo_question.length > questionToShow) {
        setQuestionToShow(questionToShow + 1)
        setValue("")
      }
    } else {
      setValue(event.target.value)
      setShowOptions(false)
      setOptionalInformation(event.target.value)
    }
  }

  const handleCheckboxChange = (option, checked, question) => {
    if (checked) {
      sendCustomEvent("repo_selection_tool_interaction", {
        interaction_type: "question_answered",
        question_id: QUESTION_LABELS[question?.id] ?? question?.id,
        answer: option.option_label,
      })
    }
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
                <Stack
                  direction={{ sm: "column", md: "row" }}
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={{ sm: 2, md: 4 }}
                >
                  <Box sx={{ minWidth: "400px" }}>
                    <FormGroup>
                      {q.options.map((o, index) => (
                        <FormControlLabel
                          key={`checkbox-${index}`}
                          control={
                            <Checkbox
                              onChange={(e) =>
                                handleCheckboxChange(o, e.target.checked, q)
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
                      onClick={() =>
                        handleChange({ target: { value: "next" } }, q, null)
                      }
                      sx={{ margin: "1rem 1rem 1rem" }}
                    >
                      None of the Above
                    </Button>
                  </Box>
                  {Object.keys(selectedCheckboxes).length > 0 && (
                    <div
                      onClick={(e) => {
                        const anchor = e.target.closest("a")
                        if (!anchor) return
                        sendCustomEvent("repo_selection_tool_interaction", {
                          interaction_type: "result_link_click",
                          link_url: anchor.href,
                          link_text: anchor.innerText,
                          question_id: QUESTION_LABELS[q.id] ?? q.id,
                        })
                      }}
                    >
                      <Typography variant="h3">Repository List</Typography>
                      {Object.values(selectedCheckboxes).map((info, idx) => (
                        <Box
                          key={`info-${idx}`}
                          sx={{ marginBottom: "1rem", "& ul": { py: 0 } }}
                        >
                          <Markdown linkTarget="_blank">{info}</Markdown>
                        </Box>
                      ))}
                      <br />
                      <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={(e) => {
                          e.stopPropagation()
                          sendCustomEvent("repo_selection_tool_interaction", {
                            interaction_type: "download_results",
                            question_id: QUESTION_LABELS[q.id] ?? q.id,
                            answer: Object.keys(selectedCheckboxes).join(", "),
                          })
                        }}
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
                </Stack>
              )}

              {showOptions && q.checkbox_type === false && (
                <div>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={(e) => {
                        const selectedOption = q.options.find(
                          (o) =>
                            (o.optional_information || "next") ===
                            e.target.value
                        )
                        handleChange(e, q, selectedOption)
                      }}
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

              {optionalInformation && (
                <div
                  onClick={(e) => {
                    const anchor = e.target.closest("a")
                    if (!anchor) return
                    sendCustomEvent("repo_selection_tool_interaction", {
                      interaction_type: "result_link_click",
                      link_url: anchor.href,
                      link_text: anchor.innerText,
                      question_id: QUESTION_LABELS[q.id] ?? q.id,
                    })
                  }}
                >
                  <Markdown linkTarget="_blank">{optionalInformation}</Markdown>
                  <br />
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={(e) => {
                      e.stopPropagation()
                      sendCustomEvent("repo_selection_tool_interaction", {
                        interaction_type: "download_results",
                        question_id: QUESTION_LABELS[q.id] ?? q.id,
                      })
                    }}
                  >
                    <CSVLink data={optionalInformation}>
                      Download Results
                    </CSVLink>
                  </Button>
                </div>
              )}
              {!showOptions && (
                <Box
                  onClick={(e) => {
                    const anchor = e.target.closest("a")
                    if (!anchor) return
                    sendCustomEvent("repo_tool_next_steps_link_click", {
                      link_url: anchor.href,
                      link_text: anchor.innerText,
                      question_id: QUESTION_LABELS[q.id] ?? q.id,
                    })
                  }}
                  sx={{
                    borderLeft: "6px solid",
                    borderLeftColor: "primary.light",
                    backgroundColor: "rgb(229, 224, 232)",
                    my: 6,
                    p: 2,
                  }}
                >
                  <Markdown linkTarget="_blank">
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
