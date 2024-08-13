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
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
import { formatList } from "utils/format-list"
import styled from "styled-components"

const RedX = () => (
  <CancelIcon style={{ color: "#cf0000", width: "50px", height: "50px" }} />
)

const GreenCheck = () => (
  <CheckCircleIcon style={{ color: "green", width: "50px", height: "50px" }} />
)

const QuestionMark = () => (
  <HelpIcon style={{ color: "#f9bc00", width: "50px", height: "50px" }} />
)

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
            return <RedX />
          case "green":
            return <GreenCheck />
          case "yellow":
            return <QuestionMark />
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
      const value = cell.getValue()
      if (typeof value === "string") {
        return (
          <Markdown linkTarget="_blank" className="general-table">
            {cell.getValue()}
          </Markdown>
        )
      } else {
        return (
          <>
            <p style={{ marginBottom: "1rem" }}>
              Below is a table indicating submission status for repositories
              you&apos;ve indicated.
            </p>
            <SubTable>
              <thead>
                <tr>
                  <th>Repository</th>
                  <th>Data Submitted</th>
                  <th>Link Provided</th>
                  <th>Additional Information</th>
                </tr>
              </thead>
              <tbody>
                {value.map((row, i) => (
                  <tr key={i}>
                    <td>{row.repository}</td>
                    <td>
                      {row.dataSubmitted ? <GreenCheck /> : <QuestionMark />}
                    </td>
                    <td>{row.linkProvided ? <GreenCheck /> : <RedX />}</td>
                    <td>{row.additionalInformation}</td>
                  </tr>
                ))}
              </tbody>
            </SubTable>
          </>
        )
      }
    },
  },
]

export default function AppSearch({ data }) {
  const [value, setValue] = React.useState("")
  const [payload, setPayload] = React.useState(false)
  const [selectedHdpId, setSelectedHdpId] = React.useState("")
  const [sentParam, setStoreSentParam] = React.useState()
  const [showSupport, setShowSupport] = React.useState(false)

  const router = useRouter()
  const params = router.query

  const tableData = React.useMemo(() => {
    if (!payload) return false
    const study = payload.find(({ hdp_id }) => hdp_id === selectedHdpId)
    return study !== undefined ? createData(study) : false
  }, [payload, selectedHdpId])

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
            setSelectedHdpId(response.data[0].hdp_id)
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

  function createData(data) {
    const steps = []

    if ("appl_id" in data) {
      const step = "Award Received"
      steps.push({
        status: data.appl_id ? "green" : "red",
        step,
        notes: data.appl_id
          ? "Congratulations! Thanks for being a HEAL-affiliated researcher!"
          : "",
      })
    }

    if ("clinical_trials_study_ID" in data) {
      const step = "Register Your Study on ClinicalTrials.gov (if appropriate)"
      steps.push({
        status: data.clinical_trials_study_ID ? "green" : "yellow",
        step,
        notes: data.clinical_trials_study_ID
          ? "Thank you for registering your study on ClinicalTrials.gov!"
          : "We do not have a record of an NCT ID for your study. If your study is not a clinical trial, please skip this step! If your study IS a clinical trial, please register your study on ClinicalTrials.gov as soon as possible. If you have not yet registered your study on the HEAL Data Platform, you can enter your NCT ID at registration. If you have already registered your study, please send the NCT ID to [heal-support@datacommons.io](mailto:heal-support@datacommons.io) so we can update your study record.",
      })
    }

    if ("time_of_registration" in data) {
      const step = "Register Your Study With the HEAL Data Platform"
      steps.push({
        status: data.time_of_registration ? "green" : "red",
        step,
        notes: data.time_of_registration
          ? "Thank you for registering your study on the HEAL Platform!"
          : "Please register your study on the HEAL Platform as soon as possible. For registration instructions, [click here](https://heal.github.io/platform-documentation/study-registration/). If you cannot find your study on the platform, please reach out to [heal-support@datacommons.io](mailto:heal-support@datacommons.io).",
      })
    }

    if ("overall_percent_complete" in data) {
      const step = "Complete Your Study-Level Metadata Form"
      const status =
        Number(data.overall_percent_complete) >= 50 ? "green" : "red"
      steps.push({
        status,
        step,
        notes:
          status == "green"
            ? `Thank you for submitting your study-level metadata currently at ${data.overall_percent_complete}% complete! You are another step closer to making your data more FAIR (findable, accessible, interoperable, reusable). `
            : "Please complete your study-level metadata form as soon as possible. For information and instructions on how to complete the form, [click here](https://heal.github.io/platform-documentation/slmd_submission/).",
      })
    }

    if ("repository_metadata" in data) {
      const step = "Select a Repository"
      const repoNames = data.repository_metadata
        .filter((r) => typeof r.repository_name === "string")
        .map((r) => r.repository_name)
      const status = repoNames.length > 0 ? "green" : "red"
      const notes =
        status == "green"
          ? `Thank you for reporting your selection${
              repoNames.length > 1 ? "s" : ""
            } to the HEAL Platform! Your repositor${
              repoNames.length > 1 ? "ies" : "y"
            }: ${formatList(repoNames)}`
          : "Have you selected a HEAL-compliant repostiory for sharing your data yet? If not, please review the HEAL data repository selection guide for guidance in selecting an appropriate repository, and reach out to us for additional assistance at any time. If you have already selected a repository, please report your selection to the Platform team at [heal-support@datacommons.io](mailto:heal-support@datacommons.io)."
      steps.push({ status, step, notes })
    }

    if ("repository_metadata" in data) {
      const step =
        "Submit Data and Metadata to a Repository / Submit Data Link to Platform"

      const notes = []
      for (const repo of data.repository_metadata) {
        const hasDataLink =
          typeof repo.repository_study_link === "string" &&
          repo.repository_study_link.length > 0
        notes.push({
          repository: repo.repository_name,
          dataSubmitted: hasDataLink,
          linkProvided: hasDataLink,
          additionalInformation: hasDataLink
            ? "Thank you!"
            : `If you've submitted data to ${repo.repository_name}, please submit the corresponding link to the platform.`,
        })
      }

      const status = notes.every(({ dataSubmitted }) => dataSubmitted)
        ? "green"
        : notes.every(({ dataSubmitted }) => !dataSubmitted)
        ? "red"
        : "yellow"

      steps.push({ status, step, notes })
    }

    return steps
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
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              "& .MuiInputBase-root": { mb: 0 },
            }}
          >
            <TextField
              id="outlined-basic"
              label="App / Proj / CTN Number"
              variant="outlined"
              onChange={handleTextFieldChange}
              value={value}
              sx={{ "& .MuiInputBase-root": { borderRadius: "4px 0 0 4px" } }}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{ borderRadius: "0 4px 4px 0 !important" }}
            >
              Check Status
            </Button>
          </Box>
          {payload.length <= 1 ? (
            <span>HEAL Data Plan ID: {selectedHdpId}</span>
          ) : (
            <FormControl
              sx={{ width: "200px", "& .MuiInputBase-root": { mb: 0 } }}
            >
              <InputLabel id="hdp-id-label">HEAL Data Plan ID</InputLabel>
              <Select
                labelId="hdp-id-label"
                id="hdp-id"
                label="HEAL Data Plan ID"
                value={selectedHdpId}
                onChange={(e) => {
                  setSelectedHdpId(e.target.value)
                }}
              >
                {payload.map(({ hdp_id }) => (
                  <MenuItem key={hdp_id} value={hdp_id}>
                    {hdp_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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

      <p style={{ fontSize: "1.075rem", margin: "4rem 0 1rem 0" }}>
        We cannot confirm all checklist steps automatically. Below are a list of
        the extra steps that must be checked manually.
      </p>
      <SecondaryTable>
        <thead>
          <tr>
            <th>Checklist Step</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Use HEAL Common Data Elements to Collect Your Data</td>
            <td>
              We cannot currently confirm whether or not you are using CDEs to
              collect your study data. All pain clinical studies are required to
              use these CDEs, and to use the variable names and the standardized
              codings provided by the HEAL CDE team. Additionally, all studies
              using CDEs will be required to report which questionnaires are
              being used to the HEAL CDE team at heal_cde@hsc.utah.edu. Please
              review the CDEs section of the Checklist for HEAL-Compliant Data
              for more information.
            </td>
          </tr>
          <tr>
            <td>Submit Variable-Level Metadata</td>
            <td>
              Please submit your variable-level metadata (VLMD) or, data
              dictionary, to the HEAL Stewards via email at
              HEALStewards@renci.org. Note that we can accept data dictionaries
              at any point in your study, even if incomplete! Data dictionaries
              inherently should not contain sensitive information such as
              personal health information (PHI) or personally identifiable
              information (PII). Data dictionaries will be shared publicly via
              the HEAL Data Platform and HEAL Semantic Search tool.
            </td>
          </tr>
          <tr>
            <td>Ensure Public Access to HEAL-funded publications</td>
            <td>
              We cannot confirm whether or not your research publicatons are
              publicly accessible. NIH HEAL Initiative funded investigators are
              required to make any publications associated with their study
              publicly accessible immediately upon publication.
            </td>
          </tr>
          <tr>
            <td>Report Your Research Publication</td>
            <td>
              We cannot confirm whether or not you have reported your research
              publications. Remember to report your research publication to
              HEALquestion@od.nih.gov upon publication in a journal! Award
              recipients and their collaborators are required to acknowledge NIH
              HEAL Initiative support by referencing in the acknowledgement
              sections of any relevant publication: This research was supported
              by the National Institutes of Health through the NIH HEAL
              Initiative (/) under award number [include specific
              grant/contract/award number; with NIH grant number(s) in this
              format: R01GM987654].
            </td>
          </tr>
        </tbody>
      </SecondaryTable>
    </div>
  )
}

const SubTable = styled.table`
  table-layout: fixed;

  & th {
    vertical-align: top;
    font-weight: 600;
    width: fit-content;
  }

  & th:nth-of-type(2),
  & th:nth-of-type(3) {
    width: 160px;
  }

  & td:nth-of-type(2),
  & td:nth-of-type(3) {
    text-align: center;
  }

  & td,
  & th {
    padding: 0.25rem;
  }
`

const SecondaryTable = styled.table`
  margin: 1rem 0 2rem 0;
  font-size: 1.075rem;
  line-height: 1.546;

  & thead > tr,
  & tbody > tr:not(:last-of-type) {
    border-bottom: 1px solid rgb(220, 220, 220);
  }

  & th {
    text-align: left;
    vertical-align: bottom;
  }

  & td,
  & th {
    padding: 1rem;
  }
`
