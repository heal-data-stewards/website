import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import ButtonBase from "@mui/material/ButtonBase"

const DugSearch = ({ data }) => {
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
      >
        <InputBase
          sx={{ p: "0.5rem 1rem", ml: 1, flex: 1, fontFamily: "Montserrat" }}
          placeholder={data.placeholder}
          inputProps={{ "aria-label": `${data.placeholder}` }}
        />
        <ButtonBase
          sx={{
            backgroundColor: "#982568",
            height: "100%",
            padding: "1rem 1rem",
            color: "white",
            borderRadius: "0 4px 4px 0",
          }}
        >
          Search
        </ButtonBase>
      </Paper>
    </div>
  )
}

export default DugSearch
