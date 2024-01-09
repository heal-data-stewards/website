import * as React from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { MaterialReactTable } from "material-react-table"
import Markdown from "../elements/markdown"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HelpIcon from "@mui/icons-material/Help"
import CancelIcon from "@mui/icons-material/Cancel"

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

function createData(id, data) {
  let row = { ...data }

  for (const property in row) {
    let newKey = columns[Number(property)].header
    row[newKey] = row[property]
    delete row[property]
  }
  row["id"] = id

  return row
}

// let test = [{ status: "test", step: "test", notes: "test" }, { status: "test2", step: "test2", notes: "test2" }, { status: "test3", step: "test3", notes: "test3" }].map((row, i) => {

//     return createData(i, row)
// })

export default function AppSearch({ data }) {
  const [idNumber, setIdNumber] = React.useState(0)

  return (
    <div className={"container mb-16"}>
      {/* <p style={{marginBottom: "20px", fontSize: "16px"}}>Wondering where your study is on the HEAL Compliance Journey? Try our new checklist companion tool. Just type in your study's unique application id or project number and see results.</p> */}
      <div style={{ marginBottom: "10px" }}>
        <TextField
          id="outlined-basic"
          label="App / Proj Number"
          variant="outlined"
        />
        <Button
          style={{
            height: "43px",
            "margin-top": "7.5px",
            marginLeft: "20px",
          }}
          variant="contained"
        >
          Check Status
        </Button>
      </div>

      <div
        className="p-[20px] flex overflow-auto"
        style={{ background: "#e6e6e6" }}
      >
        <div className="w-96 pr-[20px]">
          <h2 className="font-bold text-xl">Study title</h2>
          <p className="text-xl">Lorem Ipsum suhfjgbewugbkd wukdyjhsgv</p>
        </div>
        <div className="w-96 pr-[20px]">
          <h2 className="font-bold text-xl">PI</h2>
          <p className="text-xl">Lorem Ipsum suhfjgbewugbkd</p>
        </div>
        <div className="w-96 pr-[20px]">
          <h2 className="font-bold text-xl">Research Area</h2>
          <p className="text-xl"> orem Ipsum suhfjgbewugbkd wukdyjhsgv wa</p>
        </div>
        <div className="w-96">
          <h2 className="font-bold text-xl">Award Year</h2>
          <p className="text-xl"> 2004 </p>
        </div>
      </div>
      <MaterialReactTable
        data={[
          { status: "green", step: "test", notes: "test" },
          { status: "yellow", step: "test2", notes: "test2" },
          { status: "red", step: "test3", notes: "test3" },
        ]}
        columns={columns}
        //   enableRowSelection //enable some features
        enableColumnOrdering
        enableGlobalFilter={false} //turn off a feature
      />
    </div>
  )
}
