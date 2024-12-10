import React from "react"
import questions from "./questions.json"
import Markdown from "../../elements/markdown"
import { StandardTile } from "./standard-tile"
import { Quiz } from "./quiz"
import { RequiredIcon } from "./required-icon"

const initialState = questions.reduce(
  (prev, { type, id }) => ({
    ...prev,
    [id]: type === "single-choice" ? null : [],
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
              [q.id]: q.type === "single-choice" ? null : [],
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
  ].includes(state.funder)
    ? "1"
    : "0"

  const hasDataSharingReq =
    state["award-type-excepts"] === "1" ||
    (dataSharingFunder === "0" && state.funder !== null)

  console.log(
    "award-type-excepts",
    state["award-type-excepts"],
    "dataSharingFunder",
    dataSharingFunder,
    hasDataSharingReq
  )

  const standards = [
    {
      name: "CDASH",
      description:
        "A suite of standards used in clinical research for data exchange",
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
      name: "Data Coordinating Center (DCC) Standards",
      description:
        "Contact your Data Coordinating Center to determine if they require the use of any specific variable standards.",
      requiredOrRecommended: "required",
      isSelected: state["has-dcc"] !== "666" && state["has-dcc"] !== null,
    },
    {
      name: "DDI Codebook",
      description:
        "Based on the Data Documentation Initiative standard, the DDI Codebook enables basic descriptive content for variables, files, source material, and study level information. Supports discovery, preservation, and the informed use of data.",
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
      requiredOrRecommended: "required",
      isSelected:
        state["research-focus-area"] === "1" ||
        state["research-focus-area"] === "6",
    },
    {
      name: "HUPO PSI",
      description:
        "Proteomic Standard Initiative (PSI) provide a consensus annotation system to standardize the meaning, syntax and formalism of proteomics terms",
      requiredOrRecommended: "recommended",
      isSelected: state["data-type"].includes("Proteomic"),
    },
    {
      name: "ICD",
      description:
        "Clinical terms coded with ICD are the main basis for health recording and statistics on disease in primary, secondary and tertiary care, as well as on cause of death certificates",
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
      requiredOrRecommended: "recommended",
      isSelected: state["data-type"].includes("Genomic"),
    },
    {
      name: "NIH CDEs",
      description:
        "Structured human and machine-readable definitions of data elements that have been recommended or required by NIH Institutes and Centers and other organizations for use in research and for other purposes",
      requiredOrRecommended: "recommended",
      isSelected:
        state["research-focus-area"] === "2" ||
        state["research-focus-area"] === "3" ||
        state["research-focus-area"] === "4" ||
        state["research-focus-area"] === "5" ||
        state["research-focus-area"] === "7" ||
        state["data-type"].includes("Questionnaire/Survey/Assessment"),
    },
    {
      name: "NIH Funding Institute/Center Standards",
      description:
        "Review your IC's data sharing policies to determine if your IC requires the use of any specific variable standards.",
      requiredOrRecommended: "required",
      isSelected: dataSharingFunder === "1",
    },
    {
      name: "OMOP",
      description:
        "Observational Medical Outcomes Partnership (OMOP) Common Data Model (CDM) is an open community data standard, designed to standardize the structure and content of observational data and to enable efficient analyses that can produce reliable evidence. A central component of the OMOP CDM is the OHDSI standardized vocabularies.",
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
      requiredOrRecommended: "recommended",
      isSelected:
        state["study-stage"].includes("Basic Research") ||
        state["study-stage"].includes("Clinical Research"),
    },
    {
      name: "BIDS",
      description:
        "Brain imaging data structure. A simple and easy to adopt way of organizing neuroimaging and behavioral data.",
      requiredOrRecommended: "recommended",
      isSelected:
        state["data-type"].includes("Imaging") || state.funder === "NIMH",
    },
    {
      name: "DICOM",
      description:
        "Digital Imaging and COmmunications in Medicine. An international standard for medical images and related information",
      requiredOrRecommended: "recommended",
      isSelected: state["data-type"].includes("Imaging"),
    },
  ]

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
        />

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            flex: "0 0 auto",
            backgroundColor: "rgb(76, 51, 89)",
            width: "3px",
            height: "100%",
          }}
        ></div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Legend />
          {hasDataSharingReq && (
            <p style={{ fontStyle: "italic" }}>
              This is provided for estimation purposes only and is not a
              reflection of award specifics. You must consult the Terms and
              Conditions of your award and/or confer with your Program Officer
              to verify your award&apos;s exact requirements.
            </p>
          )}
          <div className="vlmd-standards-wrapper">
            {standards.map(
              ({ name, description, requiredOrRecommended, isSelected }) => (
                <StandardTile
                  active={isSelected}
                  description={description}
                  title={name}
                  requiredOrRecommended={requiredOrRecommended}
                  key={name}
                />
              )
            )}
          </div>
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
      <span
        style={{
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
            borderRadius: "50%",
            backgroundColor: "#782c5c",
          }}
        ></div>
        Recommended Resources
      </span>
      <span style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span style={{ color: "white", "--icon-fill-color": "#462c53" }}>
          <RequiredIcon />
        </span>
        Required Resources
      </span>
    </div>
  )
}

export default VariableStandards
