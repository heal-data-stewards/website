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

const statusIcons = {
  red: {
    icon: CancelIcon,
    color: "#cf0000",
  },
  green: {
    icon: CheckCircleIcon,
    color: "green",
  },
  yellow: {
    icon: HelpIcon,
    color: "#f9bc00",
  },
}

const columns = [
  {
    accessorKey: "status",
    header: "Status",
    size: 40,
    Cell: function Cell({ cell }) {
      const icon = (expr) => {
        return React.createElement(statusIcons[expr].icon, {
          style: {
            color: statusIcons[expr].color,
            width: "50px",
            height: "50px",
          },
        })
      }
      return <div>{icon(cell.getValue())}</div>
    },
  },
  {
    accessorKey: "step",
    header: "Checklist Step",
    size: 75,
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
    if (params.data) {
      let regExp = /[a-zA-Z]/g
      let param

      if (regExp.test(params.data)) {
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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function createData(res) {
    let bucket = {
      10: {
        status: "yellow",
        step: "Ensure Public Access to HEAL-funded publications",
        notes:
          "We cannot confirm whether or not your research publicatons are publicly accessible. NIH HEAL Initiative funded investigators are required to make any publications associated with their study publicly accessible immediately upon publication.",
      },
      11: {
        status: "yellow",
        step: "Report Your Research Publication",
        notes:
          "We cannot confirm whether or not you have reported your research publications. Remember to report your research publication to  HEALquestion@od.nih.gov upon publication in a journal! Award recipients and their collaborators are required to acknowledge NIH HEAL Initiative support by referencing in the acknowledgement sections of any relevant publication: This research was supported by the National Institutes of Health through the NIH HEAL Initiative (/) under award number [include specific grant/contract/award number; with NIH grant number(s) in this format: R01GM987654].",
      },
    }

    for (const [key, keyValue] of Object.entries(res[0])) {
      switch (key) {
        case "appl_id":
          let status4 = keyValue ? "green" : "red"
          let notes4 =
            status4 == "green"
              ? "Congratulations! Thanks for being a HEAL-affiliated researcher!"
              : ""
          let step4 = "Award Received"
          bucket[1] = { status: status4, step: step4, notes: notes4 }
          break
        case "dmp_plan":
          let status3 = keyValue.length != 2 ? "green" : "yellow"
          let notes3 =
            status3 == "green"
              ? ""
              : "We cannot currently confirm whether or not you have submitted a DMSP to the HEAL Stewards team. While this step is optional, sharing your DMSP provides us with insight into how we can best assist investigators with managing and sharing data."
          let step3 =
            "Provide Your Data Management and Sharing Plan to the HEAL Stewards (optional but encouraged)"
          bucket[2] = { status: status3, step: step3, notes: notes3 }
          break
        case "clinical_trials_study_ID":
          let status = keyValue ? "green" : "yellow"
          let notes =
            status == "green"
              ? "Thank you for registering your study on ClinicalTrials.gov!"
              : "We do not have a record of an NCT ID for your study. If your study is not a clinical trial, please skip this step!  If your study IS a clinical trial, please register your study on ClinicalTrials.gov as soon as possible, and send the NCT ID to heal-support@datacommons.io so we can update your study on the platform."
          let step =
            "Register Your Study on ClinicalTrials.gov (if appropriate)"
          bucket[3] = { status, step, notes }
          break
        case "time_of_registration":
          let status2 = keyValue ? "green" : "red"
          let notes2 =
            status2 == "green"
              ? "Thank you for registering your study on the HEAL Platform!"
              : "Please register your study on the HEAL Platform as soon as possible. For registration instructions, click here. If you cannot find your study on the platform, please reach out to heat-support@datacommons.io"
          let step2 = "Register Your Study With the HEAL Data Platform"
          bucket[4] = { status: status2, step: step2, notes: notes2 }
          break
        case "overall_percent_complete":
          let status5 = Number(keyValue) >= 50 ? "green" : "red"
          let notes5 =
            status5 == "green"
              ? `Thank you for submitting your study-level metadata currently at ${keyValue}% complete! You are another step closer to making your data more FAIR (findable, accessible, interoperable, reusable). `
              : `Please complete your study-level metadata form as soon as possible. For information and instructions on how to complete the form, click here.`
          let step5 = "Complete Your Study-Level Metadata Form"
          bucket[5] = { status: status5, step: step5, notes: notes5 }
          break
        case "repository_name":
          let status6 = keyValue ? "green" : "red"
          let notes6 =
            status6 == "green"
              ? `Thank you for selecting a repository and reporting your selection to the HEAL Platform! Repository: ${keyValue}`
              : "Have you selected a HEAL-compliant repostiory for sharing your data yet? If not, please review the HEAL data repository selection guide for guidance in selecting an appropriate repository, and reach out to us for additional assistance at any time. If you have already selected a repository, please report your selection to the Platform team at heal-support@datacommons.io."
          let step6 = "Select a Repository"
          bucket[6] = { status: status6, step: step6, notes: notes6 }
          break
        case "vlmd_metadata":
          let status7 = keyValue.length != 2 ? "green" : "red"
          let notes7 =
            status7 == "green"
              ? "Thank you for submitting your variable-level metadata (VLMD)! VLMD enriches the HEAL Platform and powers HEAL Semantic Search."
              : "Please submit your variable-level metadata (VLMD) or, data dictionary, to the HEAL Stewards via email at HEALStewards@renci.org. Note that we can accept data dictionaries at any point in your study, even if incomplete! Data dictionaries inherently should not contain sensitive information such as personal health information (PHI) or personally identifiable information (PII). Data dictionaries will be shared publicly via the HEAL Data Platform and HEAL Semantic Search tool."
          let step7 = "Submit Variable-Level Metadata"
          bucket[8] = { status: status7, step: step7, notes: notes7 }
          break
        case "heal_cde_used":
          let status9 = keyValue.length != 2 ? "green" : "yellow"
          let notes9 =
            status9 == "green"
              ? ""
              : "We cannot currently confirm whether or not you are using CDEs to collect your study data. All pain clinical studies are required to use these CDEs, and to use the variable names and the standardized codings provided by the HEAL CDE team. Additionally, all studies using CDEs will be required to report which questionnaires are being used to the HEAL CDE team at heal_cde@hsc.utah.edu. Please review the CDEs section of the Checklist for HEAL-Compliant Data for more information."
          let step9 = "Use HEAL Common Data Elements to Collect Your Data"
          bucket[7] = { status: status9, step: step9, notes: notes9 }
          break
        case "data_repositories_hdp":
          let status11 = keyValue ? "green" : "red"
          let notes11 =
            status11 == "green"
              ? "Congratulations on submitting your data and metadata to a HEAL-compliant repository!"
              : "If you are not ready to submit your data and metadata to a repository, that's okay! Revisit this when you're ready, and feel free to reach out to us with any questions or if you need assistance."
          let step11 = "Submit Data and Metadata to a Repository"
          bucket[9] = { status: status11, step: step11, notes: notes11 }
          break
        default:
          break
      }
    }

    let output = []

    for (const [key, keyValue] of Object.entries(bucket)) {
      output.push(keyValue)
    }

    setData(output)
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
          console.log(response.data)
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
            marginTop: "7.5px",
            marginLeft: "20px",
          }}
          variant="contained"
          type="submit"
        >
          Check Status
        </Button>
      </form>
      {/* For studies that have many projects to one number https://mui.com/material-ui/react-select/ */}
      {}
      {showSupport && (
        <div>
          <span className="text-xl">{`We could not locate a study with an application ID or project number of ${sentParam}.`}</span>
          <span className="text-xl">
            {
              " Please verify that you input the correct information, or contact "
            }
          </span>
          <span className="text-xl" style={{ color: "blue" }}>
            <a
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSc1gGjOQ7UsmBlMuqUzczPnbjKnbH2hjWgGLrY2xVsRH3n1vg/viewform "
              rel="noreferrer"
            >
              support
            </a>{" "}
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
              <div className="text-l">
                {payload[0].investigators_name
                  ? payload[0].investigators_name
                      .replace(/\[|\]/g, "")
                      .split(",")
                      .map((name, i) => {
                        return <div key={i + name}>{name}</div>
                      })
                  : ""}
              </div>
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
            enableColumnResizing
            enableGlobalFilter={false} //turn off a feature
          />
        </>
      )}
    </div>
  )
}
