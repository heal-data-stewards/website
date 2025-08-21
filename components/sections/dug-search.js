import React, { useRef, useState } from "react"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

const FeedbackLine = ({ message }) => {
  return (
    <Typography variant="caption" sx={{ color: "#982568" }}>
      {message}
    </Typography>
  )
}

const DugSearch = () => {
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

    window.open(`https://heal.renci.org/?q=${trimmedString}`, "_blank")
    setErrorMessage("")
  }

  return (
    <Box
      sx={{
        margin: "0 0 3rem",
        padding: "3rem 0 3.5rem",
        backgroundColor: "#53256510",
      }}
    >
      <div className="prose-lg container event-html text-gray-dark text-xl">
        <Typography
          variant="h3"
          gutterBottom
          sx={{ color: "#982568", fontSize: "1.5rem" }}
        >
          Enter a term to search for related concepts and studies
        </Typography>
        <Paper
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            alignItems: "stretch",
            width: "100%",
            overflow: "hidden",
          }}
          onSubmit={doSearch}
        >
          <InputBase
            sx={{ p: "0.5rem 1rem", ml: 1, flex: 1, fontFamily: "Montserrat" }}
            inputRef={inputField}
            autoFocus
          />
          <Button
            type="submit"
            onSubmit={() => {
              doSearch
            }}
            variant="contained"
          >
            Search
          </Button>
        </Paper>
        <FeedbackLine message={errorMessage} />
      </div>
    </Box>
  )
}

export default DugSearch
