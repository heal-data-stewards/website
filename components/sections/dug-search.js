import React, { Fragment, useEffect, useRef } from "react"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import ButtonBase from "@mui/material/ButtonBase"

const DugSearch = ({ data }) => {
  const inputField = useRef()

  const doSearch = (event) => {
    event.preventDefault()
    if (!inputField.current) {
      return
    }
    window.location = `https://heal.renci.org/?q=${inputField.current.value}`
  }

  return (
    <div className="prose-lg container pb-12 event-html text-gray-dark text-xl">
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
            transition: 'background-color 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            transition: 'color 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            '&:hover, &.Mui-focusVisible': {
              backgroundColor: "#98256830",
              color: "#532565",
            }
          }}
        >
          Search
        </ButtonBase>
      </Paper>
    </div>
  )
}

export default DugSearch
