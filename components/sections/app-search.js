import * as React from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { MaterialReactTable } from "material-react-table"
import Markdown from "../elements/markdown"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HelpIcon from "@mui/icons-material/Help"
import CancelIcon from "@mui/icons-material/Cancel"
import axios from "axios"

const columns = [
  {
    accessorKey: "status",
    header: "Status",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      let icon = (expr) => {
        switch (expr) {
          case "red":
            return (
              <CancelIcon
                style={{ color: "#cf0000", width: "50px", height: "50px" }}
              />
            )
          case "green":
            return (
              <CheckCircleIcon
                style={{ color: "green", width: "50px", height: "50px" }}
              />
            )
          case "yellow":
            return (
              <HelpIcon
                style={{ color: "#f9bc00", width: "50px", height: "50px" }}
              />
            )
          default:
            console.log(`Sorry, we are out of ${expr}.`)
        }
      }
      return <div>{icon(cell.getValue())}</div>
    },
  },
  {
    accessorKey: "step",
    header: "Checklist Step",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
]

export default function AppSearch({ data }) {
  const [idNumber, setIdNumber] = React.useState(0)
  const [value, setValue] = React.useState("")
  const [tableData, setData] = React.useState(false)

  function createData(res) {
    let bucket = []

    for (const [key, keyValue] of Object.entries(res[0])) {
      switch (key) {
        case "clinical_trials_study_ID":
          let status = keyValue ? "green" : "yellow"
          let notes =
            status == "green"
              ? "Thank you for registering your study on ClinicalTrials.gov!"
              : "We do not have a record of an NCT ID for your study. If your study is not a clinical trial, please skip this step!  If your study IS a clinical trial, please register your study on ClinicalTrials.gov as soon as possible, and send the NCT ID to heal-support@datacommons.io so we can update your study on the platform."
          let step =
            "Register Your Study on ClinicalTrials.gov (if appropriate)"
          bucket.push({ status, step, notes })
          break
        case "hdp_id":
          let status2 = keyValue ? "green" : "yellow"
          let notes2 =
            status == "green"
              ? "Thank you for registering your study on the HEAL Platform!"
              : "Please register your study on the HEAL Platform as soon as possible. For registration instructions, click here. If you cannot find your study on the platform, please reach out to heat-support@datacommons.io"
          let step2 = "Register Your Study With the HEAL Data Platform"
          bucket.push({ status: status2, step: step2, notes: notes2 })
          break
        default:
          break
      }
    }
    setData(bucket)
  }

  const getAppId = (e) => {
    e.preventDefault()

    let regExp = /[a-zA-Z]/g
    let param

    if (regExp.test(value)) {
      param = "proj_num="
    } else {
      param = "appl_id="
    }

    axios
      .get(
        `https://9trlpa4nv4.execute-api.us-east-1.amazonaws.com/dev/checklistv3?${param}${value}`
      )
      .then((response) => {
        setValue(response.data)
        createData(response.data)
      })
      .catch((err) => console.error(err))
  }

  let handleTextFieldChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className={"container mb-16"}>
      {/* <p style={{marginBottom: "20px", fontSize: "16px"}}>Wondering where your study is on the HEAL Compliance Journey? Try our new checklist companion tool. Just type in your study's unique application id or project number and see results.</p> */}
      <form
        noValidate
        autoComplete="off"
        onSubmit={getAppId}
        style={{ marginBottom: "10px" }}
      >
        <TextField
          id="outlined-basic"
          label="App / Proj Number"
          variant="outlined"
          onChange={handleTextFieldChange}
          value={value}
        />
        <Button
          style={{
            height: "43px",
            "margin-top": "7.5px",
            marginLeft: "20px",
          }}
          variant="contained"
          type="submit"
        >
          Check Status
        </Button>
      </form>
      {value && (
        <>
          <div
            className="p-[20px] flex overflow-auto"
            style={{ background: "#e6e6e6" }}
          >
            <div className="w-96 pr-[20px]">
              <h2 className="font-bold text-xl">Study title</h2>
              <p className="text-l">{value[0].study_name}</p>
            </div>
            <div className="w-96 pr-[20px]">
              <h2 className="font-bold text-xl">PI</h2>
              {/* <p className="text-xl">{value.investigators_name.map((pi) => {
              return <div>{pi}</div>
            })}</p> */}
              {value.investigators_name}
            </div>
            <div className="w-96 pr-[20px]">
              <h2 className="font-bold text-xl">Research Area</h2>
              <p className="text-l">{value[0].project_title}</p>
            </div>
            <div className="w-96">
              <h2 className="font-bold text-xl">Award Year</h2>
              <p className="text-l"> {value[0].year_awarded} </p>
            </div>
          </div>
          <MaterialReactTable
            data={tableData}
            columns={columns}
            //   enableRowSelection //enable some features
            enableColumnOrdering
            enableGlobalFilter={false} //turn off a feature
          />
        </>
      )}
    </div>
  )
}
