import React, { useRef, useState } from "react"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

const FeedbackLine = ({ message }) => {
  return (
    <Typography variant="caption" sx={{ color: "#982568" }}>
      {message}
    </Typography>
  )
}

const DugSearch = ({ data }) => {
  const inputField = useRef()
  const [errorMessage, setErrorMessage] = useState("")

  const doSearch = (event) => {
    event.preventDefault()
    //checks if the inputField has rendered
    if (!inputField.current) {
      return
    }

    //checks if the user has entered any value here (it can be a bunch of spaces and  still be considered a value)
    //this only returns if the user hasnt entered any characters at all
    if (!inputField.current.value) {
      setErrorMessage("No value indicated. Please enter search term.")
      return
    }

    //this trims any spaces off the front or back of the words
    //if you enter a bunch of spaces, you wont get sent to the heal dug page
    const trimmedString = inputField.current.value.trim()
    if (!trimmedString) {
      setErrorMessage("No value indicated. Please enter search term.")
      return
    }

    //this only sends you to the heal-dug page with your trimmed version of the search term
    window.location = `https://heal.renci.org/?q=${trimmedString}`
  }

  return (
    <Box
      sx={{
        margin: "1rem 0 3rem",
        padding: "3rem 0 3.5rem",
        backgroundColor: "#53256510",
      }}
    >
      <div className="prose-lg container event-html text-gray-dark text-xl">
        <Paper
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
          onSubmit={doSearch}
        >
          <InputBase
            sx={{ p: "0.5rem 1rem", ml: 1, flex: 1, fontFamily: "Montserrat" }}
            placeholder={data.placeholder}
            inputProps={{ "aria-label": `${data.placeholder}` }}
            inputRef={inputField}
            autoFocus
          />
          <ButtonBase
            type="submit"
            onSubmit={() => {
              doSearch
            }}
            sx={{
              backgroundColor: "#982568",
              height: "100%",
              padding: "1rem 1rem",
              color: "#FFF",
              borderRadius: "0 4px 4px 0",
              transition:
                "background-color 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              transition: "color 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              "&:hover, &.Mui-focusVisible": {
                backgroundColor: "#98256830",
                color: "#532565",
              },
            }}
          >
            Search
          </ButtonBase>
        </Paper>
        <FeedbackLine message={errorMessage} />
      </div>
    </Box>
  )
}

export default DugSearch
