import * as React from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { MaterialReactTable } from "material-react-table"
import Markdown from "../elements/markdown"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import HelpIcon from "@mui/icons-material/Help"
import CancelIcon from "@mui/icons-material/Cancel"
import axios from "axios"
import { useRouter } from "next/router"

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
  const [payload, setPayload] = React.useState(false)
  const [tableData, setData] = React.useState(false)
  const [sentParam, setStoreSentParam] = React.useState()
  const [showSupport, setShowSupport] = React.useState(false)

  const router = useRouter()
  const params = router.query

  React.useEffect(() => {
    let regExp = /[a-zA-Z]/g
    let param

    if (regExp.test(value)) {
      param = "proj_num="
    } else {
      param = "appl_id="
    }

    axios
      .get(
        `https://9trlpa4nv4.execute-api.us-east-1.amazonaws.com/dev/checklistv3?${param}${params.data}`
      )
      .then((response) => {
        if (response.data.length > 0) {
          setPayload(response.data)
          createData(response.data)
          setShowSupport(false)
        } else {
          if (params.data.length > 0) {
            setStoreSentParam(params.data)
            setShowSupport(true)
          }
        }
      })
      .catch((err) => console.error(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function createData(res) {
    let bucket = []

    for (const [key, keyValue] of Object.entries(res[0])) {
      switch (key) {
        case "appl_id":
          let status4 = keyValue ? "green" : "yellow"
          let notes4 =
            status4 == "green"
              ? "Congratulations! Thanks for being a HEAL-affiliated researcher!"
              : " "
          let step4 = "Award Received"
          bucket.push({ status: status4, step: step4, notes: notes4 })
          break
        // case "dmp_plan":
        //   let status3 = keyValue ? "green" : "yellow"
        //   let notes3 =
        //     status3 == "green"
        //       ? "Thank you for registering your study on the HEAL Platform!"
        //       : "Please register your study on the HEAL Platform as soon as possible. For registration instructions, click here. If you cannot find your study on the platform, please reach out to heat-support@datacommons.io"
        //   let step3 = "Provide Your Data Management and Sharing Plan to the HEAL Stewards (optional but encouraged)"
        //   bucket.push({ status: status2, step: step2, notes: notes2 })
        //   break
        case "clinical_trials_study_link":
          let status = keyValue ? "green" : "yellow"
          let notes =
            status == "green"
              ? "Thank you for registering your study on ClinicalTrials.gov!"
              : "We do not have a record of an NCT ID for your study. If your study is not a clinical trial, please skip this step!  If your study IS a clinical trial, please register your study on ClinicalTrials.gov as soon as possible, and send the NCT ID to heal-support@datacommons.io so we can update your study on the platform."
          let step =
            "Register Your Study on ClinicalTrials.gov (if appropriate)"
          bucket.push({ status, step, notes })
          break
        case "time_of_registration":
          let status2 = keyValue ? "green" : "yellow"
          let notes2 =
            status2 == "green"
              ? "Thank you for registering your study on the HEAL Platform!"
              : "Please register your study on the HEAL Platform as soon as possible. For registration instructions, click here. If you cannot find your study on the platform, please reach out to heat-support@datacommons.io"
          let step2 = "Register Your Study With the HEAL Data Platform"
          bucket.push({ status: status2, step: step2, notes: notes2 })
          break
        case "overall_percent_complete":
          let status5 = keyValue ? "green" : "red"
          let notes5 =
            status5 == "green"
              ? "Thank you for submitting your study-level metadata! You are another step closer to making your data more FAIR (findable, accessible, interoperable, reusable). "
              : "Please complete your study-level metadata form as soon as possible. For information and instructions on how to complete the form, click here."
          let step5 = "Complete Your Study-Level Metadata Form"
          bucket.push({ status: status5, step: step5, notes: notes5 })
          break
        case "data_repositories":
          let status6 = keyValue ? "green" : "yellow"
          let notes6 =
            status6 == "green"
              ? "Thank you for selecting a repository and reporting your selection to the HEAL Platform!"
              : "Have you selected a HEAL-compliant repostiory for sharing your data yet? If not, please review the HEAL data repository selection guide for guidance in selecting an appropriate repository, and reach out to us for additional assistance at any time. If you have already selected a repository, please report your selection to the Platform team at heal-support@datacommons.io."
          let step6 = "Select a Repository"
          bucket.push({ status: status6, step: step6, notes: notes6 })
          break
        case "vlmd_metadata":
          let status7 = keyValue ? "green" : "red"
          let notes7 =
            status7 == "green"
              ? "Thank you for submitting your variable-level metadata (VLMD)! VLMD enriches the HEAL Platform and powers HEAL Semantic Search."
              : "Please submit your variable-level metadata (VLMD) or, data dictionary, to the HEAL Stewards via email at HEALStewards@renci.org. Note that we can accept data dictionaries at any point in your study, even if incomplete! Data dictionaries inherently should not contain sensitive information such as personal health information (PHI) or personally identifiable information (PII). Data dictionaries will be shared publicly via the HEAL Data Platform and HEAL Semantic Search tool."
          let step7 = "Submit Variable-Level Metadata"
          bucket.push({ status: status7, step: step7, notes: notes7 })
          break
        case "vlmd_metadata":
          let status8 = keyValue ? "green" : "red"
          let notes8 =
            status8 == "green"
              ? "Congratulations on submitting your data and metadata to a HEAL-compliant repository!"
              : "If you are not ready to submit your data and metadata to a repository, that's okay! Revisit this when you're ready, and feel free to reach out to us with any questions or if you need assistance."
          let step8 = "Submit Data and Metadata to a Repository"
          bucket.push({ status: status8, step: step8, notes: notes8 })
          break
        // case "":
        //   let status9 = keyValue ? "green" : "red"
        //   let notes9 =
        //     status9 == "green"
        //       ? ""
        //       : ""
        //   let step9 = "Ensure Public Access to HEAL-funded publications"
        //   bucket.push({ status: status9, step: step9, notes: notes9 })
        //   break
        // case "":
        //   let status10 = keyValue ? "green" : "red"
        //   let notes10 =
        //     status10 == "green"
        //       ? ""
        //       : ""
        //   let step10 = "Report Your Research Publication"
        //   bucket.push({ status: status10, step: step10, notes: notes10 })
        //   break
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
        if (response.data.length > 0) {
          setShowSupport(false)
          setPayload(response.data)
          createData(response.data)
        } else {
          setShowSupport(true)
          setStoreSentParam(value)
          setPayload()
        }
      })
      .catch((err) => console.error(err))
  }

  let handleTextFieldChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className={"container mb-16"}>
      <div className="text-xl pb-6">
        <button type="button" onClick={() => router.back()}>
          {"< - Back to Checklist Requirements"}
        </button>
      </div>
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
      {showSupport && (
        <div>
          <span className="text-xl">{`We could not locate a study with an application ID or project number of ${sentParam}.`}</span>
          <span className="text-xl">
            {
              " Please verify that you input the correct information, or contact "
            }
          </span>
          <span className="text-xl" style={{ color: "blue" }}>
            <a href="#test">support</a>{" "}
          </span>{" "}
          <span className="text-xl">{" for assistance."}</span>
        </div>
      )}
      {payload && (
        <>
          <div
            className="p-[20px] flex overflow-auto"
            style={{ background: "#e6e6e6" }}
          >
            <div className="w-96 pr-[20px]">
              <h2 className="font-bold text-xl">Study title</h2>
              <p className="text-l">{payload[0].study_name}</p>
            </div>
            <div className="w-96 pr-[20px]">
              <h2 className="font-bold text-xl">PI</h2>
              <p className="text-l">
                {payload[0].investigators_name
                  ? payload[0].investigators_name
                      .replace(/\[|\]/g, "")
                      .split(",")
                      .map((name, i) => {
                        return <div key={i + name}>{name}</div>
                      })
                  : ""}
              </p>
            </div>
            <div className="w-96 pr-[20px]">
              <h2 className="font-bold text-xl">Research Area</h2>
              <p className="text-l">{payload[0].project_title}</p>
            </div>
            <div className="w-96">
              <h2 className="font-bold text-xl">Award Year</h2>
              <p className="text-l"> {payload[0].year_awarded} </p>
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
