import React from "react"
import questions from "../../data/vlmd/questions.json"
import Markdown from "../elements/markdown"
import { gridTemplateColumns } from "tailwindcss/defaultTheme"

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
    state["award-type-excepts"] === "0" || dataSharingFunder === "1"

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
  ]

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <div style={{ flex: "0 0 33%" }}>
        <button
          onClick={() => {
            dispatch({ type: "reset_form" })
          }}
        >
          Clear form
        </button>
        {questions.map((q, i) => (
          <>
            <Question
              number={i + 1}
              key={i}
              question={q}
              selected={state[q.id]}
              setSelected={(value) => {
                handleSetSelected(q.id, value)
              }}
              disabled={
                q.enabledBySpecificStudy && state["has-specific-study"] === "0"
              }
            />
            <hr />
          </>
        ))}

        <details>
          <summary>Click to view computed question variables</summary>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </details>
      </div>

      <div>
        {hasDataSharingReq && (
          <p className="mb-2">
            <em>
              This is provided for estimation purposes only and is not a
              reflection of award specifics. You consult the Terms Conditions of
              your award and/or confer with your Program Officer to verify your
              award&apos;s exact requirements.
            </em>
          </p>
        )}

        <div
          style={{
            position: "sticky",
            top: "1rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {standards.map(
            ({ name, description, requiredOrRecommended, isSelected }) => (
              <div
                key={name}
                style={{
                  background: isSelected ? "#ffdef2" : "#f4f4f4",
                  padding: "1rem",
                }}
              >
                <h2 style={{ fontWeight: "bold", fontSize: "1rem" }}>
                  {name} ({requiredOrRecommended})
                </h2>
                <p>{description}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

function Question({ number, question, selected, setSelected, disabled }) {
  return (
    <div
      className="py-4"
      style={disabled ? { opacity: 0.2, userSelect: "none" } : undefined}
    >
      <p>
        <Markdown>{`${number ? `${number}: ` : ""}${
          question.question
        }`}</Markdown>
      </p>
      <p>
        {question.notes !== null && (
          <em>
            <Markdown>{question.notes}</Markdown>
          </em>
        )}
      </p>

      {question.type === "single-choice" ? (
        <SingleChoice
          answers={question.answers}
          id={question.id}
          selected={selected}
          setSelected={setSelected}
          disabled={disabled}
        />
      ) : (
        <MultipleChoice
          answers={question.answers}
          id={question.id}
          selected={selected}
          setSelected={setSelected}
          disabled={disabled}
        />
      )}
    </div>
  )
}

function SingleChoice({ answers, id, selected, setSelected, disabled }) {
  return (
    <div className="flex flex-col">
      {answers.map((a) => {
        let answer, value
        if (typeof a === "string") {
          answer = a
          value = a
        } else {
          answer = a.answer
          value = a.value
        }

        return (
          <label key={value}>
            <input
              type="radio"
              name={id}
              value={value}
              className="mr-2"
              checked={selected === value.toString()}
              onChange={(e) => {
                setSelected(e.target.value)
              }}
              disabled={disabled}
            />
            {answer}
          </label>
        )
      })}
    </div>
  )
}

function MultipleChoice({ answers, id, selected, setSelected, disabled }) {
  const toggleChoice = (value) => {
    if (!selected.includes(value)) {
      setSelected([...selected, value])
    } else {
      setSelected(selected.filter((item) => item !== value))
    }
  }

  return (
    <div className="flex flex-col">
      {answers.map((a) => {
        let answer, value
        if (typeof a === "string") {
          answer = a
          value = a
        } else {
          answer = a.answer
          value = a.value
        }

        return (
          <label key={value}>
            <input
              type="checkbox"
              name={id}
              value={value}
              className="mr-2"
              checked={selected.includes(value)}
              onChange={(e) => {
                toggleChoice(e.target.value)
              }}
              disabled={disabled}
            />
            {answer}
          </label>
        )
      })}
    </div>
  )
}

export default VariableStandards
