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
import { CircularProgress } from "@mui/material"
import { formatList } from "utils/format-list"

const columns = [
  {
    accessorKey: "status",
    header: "Status",
    size: 40,
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
          case "green-and-red":
            return (
              <div>
                <CheckCircleIcon
                  style={{ color: "green", width: "50px", height: "50px" }}
                />
                <CancelIcon
                  style={{ color: "#cf0000", width: "50px", height: "50px" }}
                />
              </div>
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
  const [tableData, setTableData] = React.useState(false)
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
          `https://k18san0v73.execute-api.us-east-1.amazonaws.com/prod/progresstracker?${param}${params.data}`
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
        case "clinical_trials_study_ID":
          let status = keyValue ? "green" : "yellow"
          let notes =
            status == "green"
              ? "Thank you for registering your study on ClinicalTrials.gov!"
              : "We do not have a record of an NCT ID for your study. If your study is not a clinical trial, please skip this step! If your study IS a clinical trial, please register your study on ClinicalTrials.gov as soon as possible. If you have not yet registered your study on the HEAL Data Platform, you can enter your NCT ID at registration. If you have already registered your study, please send the NCT ID to [heal-support@datacommons.io](mailto:heal-support@datacommons.io) so we can update your study record."
          let step =
            "Register Your Study on ClinicalTrials.gov (if appropriate)"
          bucket[3] = { status, step, notes }
          break
        case "time_of_registration":
          let status2 = keyValue ? "green" : "red"
          let notes2 =
            status2 == "green"
              ? "Thank you for registering your study on the HEAL Platform!"
              : "Please register your study on the HEAL Platform as soon as possible. There are 3 steps to registration: (1) request access to register the study; (2) create a CEDAR account; and (3) finish registering your study on the platform. For detailed registration instructions, [click here](https://heal.github.io/platform-documentation/study-registration/). If you cannot find your study on the platform, please reach out to [heal-support@datacommons.io](mailto:heal-support@datacommons.io)."
          let step2 = "Register Your Study With the HEAL Data Platform"
          bucket[4] = { status: status2, step: step2, notes: notes2 }
          break
        case "overall_percent_complete":
          let status5 = Number(keyValue) >= 50 ? "green" : "red"
          let notes5 =
            status5 == "green"
              ? `Thank you for submitting your study-level metadata currently at ${keyValue}% complete! You are another step closer to making your data more FAIR (findable, accessible, interoperable, reusable). `
              : "Please complete your study-level metadata form as soon as possible. For information and instructions on how to complete the form, [click here](https://heal.github.io/platform-documentation/slmd_submission/)."
          let step5 = "Complete Your Study-Level Metadata Form"
          bucket[5] = { status: status5, step: step5, notes: notes5 }
          break
        case "vlmd_metadata":
          let status7 = keyValue?.length > 0 ? "green" : "red"
          let notes7 =
            status7 == "green"
              ? "Thank you for submitting your variable-level metadata (VLMD)! VLMD enriches the HEAL Platform and powers HEAL Semantic Search."
              : "Please submit your variable-level metadata (VLMD) or, data dictionary, to the HEAL Stewards via email at HEALStewards@renci.org. Note that we can accept data dictionaries at any point in your study, even if incomplete! Data dictionaries inherently should not contain sensitive information such as personal health information (PHI) or personally identifiable information (PII). Data dictionaries will be shared publicly via the HEAL Data Platform and HEAL Semantic Search tool."
          let step7 = "Submit Variable-Level Metadata"
          bucket[8] = { status: status7, step: step7, notes: notes7 }
          break
        case "heal_cde_used":
          let status9 = keyValue?.length > 0 ? "green" : "yellow"
          let notes9 =
            status9 == "green"
              ? ""
              : "We cannot currently confirm whether or not you are using CDEs to collect your study data. All pain clinical studies are required to use these CDEs, and to use the variable names and the standardized codings provided by the HEAL CDE team. Additionally, all studies using CDEs will be required to report which questionnaires are being used to the HEAL CDE team at heal_cde@hsc.utah.edu. Please review the CDEs section of the Checklist for HEAL-Compliant Data for more information."
          let step9 = "Use HEAL Common Data Elements to Collect Your Data"
          bucket[7] = { status: status9, step: step9, notes: notes9 }
          break
        case "repository_metadata":
          const repos = keyValue
          const reposWithData = repos.filter(
            ({ repository_study_link }) =>
              typeof repository_study_link === "string" &&
              repository_study_link.length > 0
          )
          const reposWithoutData = repos.filter(
            (r) => !reposWithData.includes(r)
          )

          // "Select a Repository" step
          const repoNames = repos
            .filter((r) => typeof r.repository_name === "string")
            .map((r) => r.repository_name)
          const status6 = repoNames.length > 0 ? "green" : "red"
          const notes6 =
            status6 == "green"
              ? `Thank you for reporting your selection${
                  repoNames.length > 1 ? "s" : ""
                } to the HEAL Platform! Your repositor${
                  repoNames.length > 1 ? "ies" : "y"
                }: ${formatList(repoNames)}`
              : "Have you selected a HEAL-compliant repostiory for sharing your data yet? If not, please review the HEAL data repository selection guide for guidance in selecting an appropriate repository, and reach out to us for additional assistance at any time. If you have already selected a repository, please report your selection to the Platform team at [heal-support@datacommons.io](mailto:heal-support@datacommons.io)."
          const step6 = "Select a Repository"
          bucket[6] = { status: status6, step: step6, notes: notes6 }

          // "Submit Data and Metadata to a Repository" step
          let status11, notes11
          if (repos.length === 0) {
            status11 = "red"
            notes11 =
              "If you are not ready to submit your data and metadata to a repository, that's okay! Revisit this when you're ready, and feel free to reach out to us with any questions or if you need assistance."
          } else if (reposWithData.length === repos.length) {
            status11 = "green"
            notes11 =
              "Congratulations on submitting your data and metadata to a HEAL-compliant repository!"
          } else {
            status11 = "green-and-red"
            notes11 = ""

            if (reposWithData.length > 0) {
              const repoDataNames = reposWithData
                .filter((r) => typeof r.repository_name === "string")
                .map((r) => r.repository_name)

              if (repoDataNames.length > 0) {
                notes11 += `Thanks for submitting to ${formatList(
                  repoDataNames
                )}`
              } else {
                notes11 += `Thanks for submitting to ${
                  reposWithData.length
                } repositor${reposWithData.length > 1 ? "ies" : "y"}`
              }

              if (reposWithoutData.length === 0) notes11 += "."
            }

            if (reposWithoutData.length > 0) {
              if (reposWithData.length > 0) {
                notes11 += "; p"
              } else {
                notes11 += "P"
              }

              if (reposWithData.length === 0) {
                status11 = "red"
              }

              const repoWithoutDataNames = reposWithoutData
                .filter((r) => typeof r.repository_name === "string")
                .map((r) => r.repository_name)

              if (repoWithoutDataNames.length > 0) {
                notes11 += `lease let us know once you've submitted data to ${formatList(
                  repoWithoutDataNames
                )}.`
              } else {
                notes11 += `lease let us know once you've submitted data to the ${
                  reposWithoutData.length
                } remaining repositor${
                  reposWithoutData.length > 1 ? "ies" : "y"
                }.`
              }
            }
          }

          bucket[9] = {
            status: status11,
            step: "Submit Data and Metadata to a Repository",
            notes: notes11,
          }
          break
        default:
          break
      }
    }

    let output = []

    for (const [key, keyValue] of Object.entries(bucket)) {
      output.push(keyValue)
    }

    setTableData(output)
  }

  const getAppId = (e) => {
    e.preventDefault()

    setPayload(false)

    let regExp = /[a-zA-Z]/g
    let param

    if (regExp.test(value)) {
      param = "proj_num="
    } else {
      param = "appl_id="
    }

    axios
      .get(
        `https://k18san0v73.execute-api.us-east-1.amazonaws.com/prod/progresstracker?${param}${value}`
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
      {payload && (
        <form
          noValidate
          autoComplete="off"
          onSubmit={getAppId}
          style={{ marginBottom: "10px" }}
        >
          <TextField
            id="outlined-basic"
            label="App / Proj / CTN Number"
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
      )}
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
      {!payload ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <div
            className="p-[20px] flex overflow-auto"
            style={{ background: "#e6e6e6" }}
          >
            <div className="w-96 pr-[20px]">
              <h2 className="font-bold text-xl">Study Title</h2>
              <p className="text-l">{payload[0].study_name}</p>
            </div>
            <div className="w-96 pr-[20px]">
              <h2 className="font-bold text-xl">PI</h2>
              <div className="text-l">
                {payload[0].investigators_name?.map((name, i) => {
                  return <div key={i + name}>{name}</div>
                }) ?? ""}
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
            enablePagination={false}
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
