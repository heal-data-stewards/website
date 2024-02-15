import React, { useState, useEffect } from "react"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import CircleIcon from "@mui/icons-material/Circle"
import WarningIcon from "@mui/icons-material/Warning"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import Checkbox from "@mui/material/Checkbox"
import TripOriginIcon from "@mui/icons-material/TripOrigin"
import { fetchAPI } from "utils/api"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
}

const Block = ({
  title,
  onMouseEnter,
  choice,
  setCompareList,
  compareList,
}) => {
  const [checked, setChecked] = React.useState(false)

  const handleChange = (event) => {
    if (checked == false) {
      setCompareList([...compareList, choice])
    } else {
      let filteredList = compareList.filter((item) => {
        return item != choice
      })
      setCompareList([...filteredList])
    }
    setChecked(event.target.checked)
  }
  return (
    <div
      style={{
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "start",
        marginBottom: "15px",
        padding: "15px",
        minHeight: "75px",
        background:
          "linear-gradient(315deg, transparent 17px, rgb(229, 224, 231) 0)",
        color: "rgba(83, 37, 101, 1)",
        maxWidth: "300px",
        display: "block",
        width: "-webkit-fill-available",
      }}
      // className={"sensitive-data-blocks"}
      onClick={onMouseEnter}
    >
      <div style={{ display: "flex" }}>
        <Checkbox
          disableRipple
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          icon={<TripOriginIcon />}
          checkedIcon={<CircleIcon />}
        />
        <div>
          <div>{title}</div>
          <div style={{ fontWeight: "500", fontSize: "9px" }}>
            {choice.subtext}
          </div>
        </div>
      </div>
    </div>
  )
}

const VariableStandards = ({ data }) => {
  const [compareList, setCompareList] = useState([])
  const [cardList, setCardList] = useState([])
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    fetchAPI("/vlmds").then((res) => {
      setCardList(res)
    })
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // console.log(data)
  return (
    <div className="container pb-4 mt-20">
      <div style={{ display: "flex" }}>
        <div style={{ width: "30%", borderRight: "2px solid #532665" }}>
          <div style={{ fontWeight: "bold", marginBottom: "7px" }}>
            Question goes here
          </div>
          <div style={{ fontWeight: "400", marginBottom: "10px" }}>
            additional information for questions goes here
          </div>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Yes"
              />
              <FormControlLabel value="male" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </div>
        <div style={{ width: "70%" }}>
          <div
            style={{
              display: "inline-flex",
              width: "100%",
              fontWeight: "bold",
              top: "-50px",
              position: "relative",
              textAlign: "center",
            }}
          >
            <div style={{ width: "50%" }}>
              {" "}
              <CircleIcon style={{ fill: "#992569" }} />{" "}
              <span>Recommended Resources</span>
            </div>
            <div style={{ width: "50%" }}>
              {" "}
              <WarningIcon style={{ fill: "rgb(83 38 101)" }} />{" "}
              <span>Required Resources</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
            }}
          >
            {cardList.map((choice, i) => {
              return (
                <Block
                  // onMouseEnter={(e) => onHover(choice)}
                  key={i}
                  title={choice.title}
                  setCompareList={setCompareList}
                  compareList={compareList}
                  choice={choice}
                />
              )
            })}
          </div>
        </div>
      </div>
      {compareList.length > 0 && (
        <div
          style={{
            background: "rgb(229, 224, 231)",
            height: "50px",
            bottom: "0",
            position: "fixed",
            width: "100%",
            zIndex: "2",
            left: "0",
            display: "flex",
            justifyContent: "space-around",
            padding: "8px",
          }}
        >
          <span>Selected {compareList.length}</span>{" "}
          <Button variant="contained" onClick={handleOpen}>
            Compare Results
          </Button>
        </div>
      )}
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Comparison results
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              I need an example of a table comparing two or more options. (How
              will it look, what will the headers be, what data to show etc)
              Current chosen options to compare{" "}
              {compareList.map((item, i) => {
                return (
                  <p key={item.title + i} style={{ color: "blue" }}>
                    {item.title}
                  </p>
                )
              })}
            </Typography>
          </Box>
        </Modal>
      )}
    </div>
  )
}

// RichText.propTypes = {
//   data: PropTypes.shape({
//     content: PropTypes.string,
//   }),
// }

export default VariableStandards
