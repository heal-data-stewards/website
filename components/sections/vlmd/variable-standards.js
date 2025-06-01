import React from "react"
import questions from "./questions.json"
import { StandardTile } from "./standard-tile"
import { Quiz } from "./quiz"
import { RequiredIcon } from "./required-icon"
import Link from "../../elements/link"
import { OpenInNew } from "@mui/icons-material"
import { Box } from "@mui/material"
import { toKebabCase } from "utils/kebab-case"

const Divider = () => (
  <div
    aria-hidden="true"
    style={{
      flex: "0 0 auto",
      backgroundColor: "rgb(76, 51, 89)",
      width: "3px",
      height: "100%",
    }}
  ></div>
)

const initialState = questions.reduce(
  (prev, { type, id }) => ({
    ...prev,
    [id]: type === "single-choice" || type === "combo-box" ? null : [],
  }),
  {}
)

function reducer(state, action) {
  if (action.type === "update_answer") {
    const { id, value } = action.payload

    // if the user went back to question 1 ("do you have a specific study in mind")
    // and set it to "no", make sure that the answers to all the now-hidden questions
    // are blanked out
    if (id === "has-specific-study" && value === "0") {
      return {
        ...state,
        [id]: value,
        ...questions
          .filter((q) => q.enabledBySpecificStudy)
          .reduce(
            (obj, q) => ({
              ...obj,
              [q.id]:
                q.type === "single-choice" || q.type === "combo-box"
                  ? null
                  : [],
            }),
            {}
          ),
      }
    }

    return { ...state, [id]: value }
  }
  if (action.type === "reset_form") {
    return initialState
  }
  return state
}

const VariableStandards = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [openedStandard, setOpenedStandard] = React.useState(null)
  const tabRefs = React.useRef([])

  const handleSetSelected = (id, value) => {
    dispatch({
      type: "update_answer",
      payload: { id, value },
    })
  }

  const dataSharingFunder = [
    "NCI",
    "NHLBI",
    "NIA",
    "NIAAA",
    "NIBIB",
    "NIMH",
  ].includes(state.funder?.value)
    ? "1"
    : "0"

  const hasDataSharingReq =
    state["award-type-excepts"] === "1" ||
    (dataSharingFunder === "0" && state.funder !== null)

  const standards = [
    {
      name: "BIDS",
      description:
        "Brain imaging data structure. A simple and easy to adopt way of organizing neuroimaging and behavioral data.",
      link: "https://bids.neuroimaging.io/get_started.html",
      requiredOrRecommended: "recommended",
      isSelected:
        state["data-type"].includes("Imaging") ||
        state.funder?.value === "NIMH",
    },
    {
      name: "CDASH",
      description:
        "A suite of standards used in clinical research for data exchange",
      link: "https://www.cdisc.org/standards/foundational/cdash",
      requiredOrRecommended: "recommended",
      isSelected:
        state["study-stage"].includes("Pre-Research/Protocol Development") ||
        state["study-stage"].includes("Clinical Research") ||
        state["study-stage"].includes("Epidemiologic Research") ||
        state["data-type"].includes("Clinical/health"),
    },
    {
      name: "ChEBI",
      description:
        "Chemical Entities of Biological Interest (ChEBI) is a dictionary of molecular entities focused on ‘small’ chemical compounds",
      link: "http://www.ebi.ac.uk/chebi/",
      requiredOrRecommended: "recommended",
      isSelected:
        state["study-subject-type"].includes(
          "Molecule (e.g. chemical compounds, drugs, protein engineering, protein crystallization, etc)"
        ) ||
        state["study-subject-type"].includes(
          "Animal (including animal cell / tissue / tissue model)"
        ) ||
        state["data-type"].includes("Biochemical") ||
        state["data-type"].includes("Biophysical"),
    },
    {
      name: "DICOM",
      description:
        "Digital Imaging and COmmunications in Medicine. An international standard for medical images and related information",
      link: "https://www.dicomstandard.org/",
      requiredOrRecommended: "recommended",
      isSelected: state["data-type"].includes("Imaging"),
    },
    {
      name: "Data Coordinating Center (DCC) Standards",
      description:
        "Contact your Data Coordinating Center to determine if they require the use of any specific variable standards.",
      link: null,
      requiredOrRecommended: "required",
      isSelected:
        state["has-dcc"] !== "666" &&
        state["has-dcc"] !== "111" &&
        state["has-dcc"] !== null,
    },
    {
      name: "DDI Codebook",
      description:
        "Based on the Data Documentation Initiative standard, the DDI Codebook enables basic descriptive content for variables, files, source material, and study level information. Supports discovery, preservation, and the informed use of data.",
      link: "https://ddialliance.org/ddi-codebook",
      requiredOrRecommended: "recommended",
      isSelected:
        state["data-type"].includes("Interview/Focus Group") ||
        state["data-type"].includes("Questionnaire/Survey/Assessment") ||
        state["study-stage"].includes("Implementation Research") ||
        state["study-stage"].includes("Pre-Research/Protocol Development"),
    },
    {
      name: "HEAL CDEs",
      description:
        "Nine core pain domains and questionnaires to measure them, designed for studies examining acute pain and chronic pain in adults and pediatric populations",
      link: "https://heal.nih.gov/data/common-data-elements",
      requiredOrRecommended:
        state["award-type-excepts"] === "1" ? "recommended" : "required",
      isSelected:
        state["research-focus-area"] === "1" ||
        state["research-focus-area"] === "6",
    },
    {
      name: "HUPO PSI",
      description:
        "Proteomic Standard Initiative (PSI) provide a consensus annotation system to standardize the meaning, syntax and formalism of proteomics terms",
      link: "https://www.psidev.info/groups/controlled-vocabularies",
      requiredOrRecommended: "recommended",
      isSelected: state["data-type"].includes("Proteomic"),
    },
    {
      name: "ICD",
      description:
        "Clinical terms coded with ICD are the main basis for health recording and statistics on disease in primary, secondary and tertiary care, as well as on cause of death certificates",
      link: "http://www.who.int/classifications/icd/en/",
      requiredOrRecommended: "recommended",
      isSelected:
        state["study-stage"].includes("Clinical Research") ||
        state["study-stage"].includes("Epidemiologic Research") ||
        state["data-type"].includes("Clinical/health"),
    },
    {
      name: "LOINC",
      description:
        "Logical Observation Identifiers Names, and Codes (LOINC) is used for tests, observations and measurements",
      link: "https://loinc.org/",
      requiredOrRecommended: "recommended",
      isSelected:
        state["study-stage"].includes("Basic Research") ||
        state["study-stage"].includes("Pre-Clinical Research") ||
        state["study-stage"].includes("Epidemiologic Research") ||
        state["data-type"].includes("Biophysical"),
    },
    {
      name: "MGED",
      description:
        "Concepts, definitions, terms, and resources for standardized description of a microarray experiment in support of MAGE v.1",
      link: "https://bioportal.bioontology.org/ontologies/MO",
      requiredOrRecommended: "recommended",
      isSelected: state["data-type"].includes("Genomic"),
    },
    {
      name: "NIH CDEs",
      description:
        "Structured human and machine-readable definitions of data elements that have been recommended or required by NIH Institutes and Centers and other organizations for use in research and for other purposes",
      link: "https://cde.nlm.nih.gov/home",
      requiredOrRecommended: "recommended",
      isSelected:
        state["research-focus-area"] === "2" ||
        state["research-focus-area"] === "3" ||
        state["research-focus-area"] === "4" ||
        state["research-focus-area"] === "5" ||
        state["research-focus-area"] === "8" ||
        state["data-type"].includes("Questionnaire/Survey/Assessment"),
    },
    {
      name: "NIH Funding Institute / Center Standards",
      description:
        "Review your IC's data sharing policies to determine if your IC requires the use of any specific variable standards.",
      link: null,
      requiredOrRecommended:
        state["award-type-excepts"] === "1" ? "recommended" : "required",
      isSelected: dataSharingFunder === "1",
    },
    {
      name: "OMOP",
      description:
        "Observational Medical Outcomes Partnership (OMOP) Common Data Model (CDM) is an open community data standard, designed to standardize the structure and content of observational data and to enable efficient analyses that can produce reliable evidence. A central component of the OMOP CDM is the OHDSI standardized vocabularies.",
      link: "https://ohdsi.github.io/CommonDataModel/index.html",
      requiredOrRecommended: "recommended",
      isSelected:
        state["study-stage"].includes("Clinical Research") ||
        state["data-type"].includes("Clinical/health") ||
        state["study-subject-type"].includes(
          "Human (including human cell / tissue / tissue model)"
        ),
    },
    {
      name: "RxNorm",
      description:
        "Provides normalized names for clinical drugs and links its names to many drug vocabularies",
      link: "https://www.nlm.nih.gov/research/umls/rxnorm/",
      requiredOrRecommended: "recommended",
      isSelected:
        state["study-subject-type"].includes(
          "Molecule (e.g. chemical compounds, drugs, protein engineering, protein crystallization, etc)"
        ) ||
        state["data-type"].includes("Biochemical") ||
        state["study-stage"].includes("Post-market Research") ||
        state["study-stage"].includes("Business Development"),
    },
    {
      name: "SNOMED-CT",
      description:
        "One of a suite of designated standards for use in U.S. Federal Government systems for the electronic exchange of clinical health information and is also a required standard in interoperability specifications of the U.S. Healthcare Information Technology Standards Panel.",
      link: "https://www.nlm.nih.gov/research/umls/Snomed/snomed_main.html",
      requiredOrRecommended: "recommended",
      isSelected:
        state["study-stage"].includes("Basic Research") ||
        state["study-stage"].includes("Clinical Research"),
    },
  ]

  const getDefaultFocusTab = () => {
    const index = standards.findIndex(
      ({ name }) => name === openedStandard?.name
    )
    return index > 0 ? index : 0
  }
  const [focusedTabIndex, setFocusedTabIndex] = React.useState(
    getDefaultFocusTab()
  )

  const handleDownloadResouces = () => {
    const downloadText = standards
      .filter((s) => s.isSelected)
      .reduce(
        (text, curr) =>
          (text += `${curr.name} (${curr.requiredOrRecommended})${
            curr.link ? `:\n${curr.link}\n` : "\n"
          }\n`),
        ""
      )

    const blob = new Blob([downloadText], { type: "text/plain" })
    const elem = window.document.createElement("a")
    elem.href = window.URL.createObjectURL(blob)
    elem.download = "variable-standards-finder-resources.txt"
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }

  const focusTab = (tabIndex) => {
    const tabRef = tabRefs.current[tabIndex]
    if (tabRef) {
      tabRef.focus()
      setFocusedTabIndex(tabIndex)
    }
  }

  const handleKeyDown = (tabIndex, { key }) => {
    const { length } = tabRefs.current
    if (key === "ArrowDown") focusTab((tabIndex + 1) % length)
    else if (key === "ArrowUp") focusTab((tabIndex - 1 + length) % length)
    else if (key === "Home") focusTab(0)
    else if (key === "End") focusTab(length - 1)
  }

  return (
    <div
      style={{
        margin: "3rem 1rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1600px", display: "flex", gap: "2rem" }}>
        <Quiz
          state={state}
          dispatch={dispatch}
          handleSetSelected={handleSetSelected}
          handleDownloadResouces={handleDownloadResouces}
        />

        <Divider />

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          role="tablist"
          aria-labelledby="variable-standards"
        >
          <Legend />
          {hasDataSharingReq && (
            <p style={{ fontStyle: "italic" }}>
              This is provided for estimation purposes only and is not a
              reflection of award specifics. You must consult the Terms and
              Conditions of your award and/or confer with your Program Officer
              to verify your award&apos;s exact requirements.
            </p>
          )}
          <Box
            sx={{
              alignSelf: "flex-start",
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridAutoRows: "1fr",
            }}
          >
            {standards.map((standard, tabIndex) => (
              <StandardTile
                onClick={() => {
                  setOpenedStandard(standard)
                }}
                isOpened={standard.name === openedStandard?.name}
                active={standard.isSelected}
                title={standard.name}
                requiredOrRecommended={standard.requiredOrRecommended}
                key={standard.name}
                buttonRef={(el) => {
                  if (el !== null) tabRefs.current[tabIndex] = el
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "Home" ||
                    e.key === "End"
                  ) {
                    e.preventDefault()
                  }
                  handleKeyDown(tabIndex, e)
                }}
                tabIndex={focusedTabIndex === tabIndex ? undefined : -1}
                aria-controls={`tabpanel-${toKebabCase(standard.name)}`}
                id={`tab-${toKebabCase(standard.name)}`}
                aria-selected={
                  standard.name === openedStandard?.name ? "true" : "false"
                }
              />
            ))}
          </Box>
        </div>

        <Divider />

        <div
          style={{ flex: "1 1 400px" }}
          aria-labelledby="variable-standards"
          role="tabpanel"
          id={
            openedStandard !== null
              ? `tabpanel-${toKebabCase(openedStandard?.name)}`
              : undefined
          }
        >
          {openedStandard === null ? (
            <p style={{ fontStyle: "italic" }}>
              Please click on a standard to view more information.
            </p>
          ) : (
            <>
              <h2 style={{ fontSize: "1.3em", fontWeight: "600" }}>
                {openedStandard.name}
              </h2>
              {openedStandard.link && (
                <Link to={openedStandard.link}>
                  Visit website{" "}
                  <OpenInNew
                    sx={{ fontSize: "1em", transform: "translateY(-1px)" }}
                  />
                </Link>
              )}
              <p style={{ marginTop: "1rem" }}>{openedStandard.description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Legend() {
  return (
    <div
      style={{
        fontSize: "1.1em",
        fontWeight: 600,
        display: "flex",
        gap: "2rem",
      }}
    >
      <div
        style={{
          background: "#8d7894",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            flex: "0 0 auto",
            border: "3px solid white",
            borderRadius: "50%",
            backgroundColor: "#812c5c",
          }}
        ></div>
        Recommended Resources
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          background: "#984d7a",
          color: "white",
          padding: "8px 12px",
          borderRadius: "4px",
        }}
      >
        <span style={{ color: "white", "--icon-fill-color": "#492c52" }}>
          <RequiredIcon />
        </span>
        Required Resources
      </div>
    </div>
  )
}

export default VariableStandards
