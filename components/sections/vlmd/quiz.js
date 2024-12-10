import React from "react"
import Markdown from "@/components/elements/markdown"
import questions from "./questions.json"

export function Quiz({ state, dispatch, handleSetSelected }) {
  const [currentQuestionNumber, setCurrentQuestionNumber] = React.useState(0)
  const currentRequiredQuestions =
    state["has-specific-study"] === "1"
      ? questions
      : questions.filter((q) => !q.enabledBySpecificStudy)
  const currentQuestion = currentRequiredQuestions[currentQuestionNumber]

  const canGoBack = currentQuestionNumber > 0
  const canGoForward =
    currentQuestionNumber < currentRequiredQuestions.length - 1 &&
    !isQuestionUnanswered(state, currentQuestion)
  const isFormClear = Object.values(state).every(
    (v) => v === null || (Array.isArray(v) && v.length === 0)
  )
  const isFormDone =
    currentQuestionNumber === currentRequiredQuestions.length - 1 &&
    !isQuestionUnanswered(state, currentQuestion)

  return (
    <div style={{ flex: "0 0 500px" }}>
      <div style={{ position: "sticky", top: 0 }}>
        <Question
          number={currentQuestionNumber + 1}
          question={currentQuestion}
          selected={state[currentQuestion.id]}
          setSelected={(value) => {
            handleSetSelected(currentQuestion.id, value)
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "space-between",
            color: "#782c5c",
            fontSize: "1.1em",
          }}
        >
          {canGoBack && (
            <button
              onClick={() => setCurrentQuestionNumber((cur) => cur - 1)}
              style={{ fontWeight: 600, textWrap: "nowrap" }}
            >
              ← Back
            </button>
          )}
          {canGoForward && (
            <button
              onClick={() => setCurrentQuestionNumber((cur) => cur + 1)}
              style={{ fontWeight: 600, textWrap: "nowrap" }}
            >
              Next →
            </button>
          )}
        </div>

        {isFormDone && (
          <p style={{ margin: "1rem 0" }}>
            Quiz complete! Please view your required and recommended resources.
          </p>
        )}

        {!isFormClear && (
          <button
            style={{
              marginTop: "2rem",
              color: "#782c5c",
              fontSize: "1.1em",
              fontWeight: 600,
            }}
            onClick={() => {
              dispatch({ type: "reset_form" })
              setCurrentQuestionNumber(0)
            }}
          >
            Reset Quiz
          </button>
        )}
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

const isQuestionUnanswered = (state, question) => {
  if (question.type === "single-choice") return state[question.id] === null
  if (question.type === "multi-choice") return state[question.id].length === 0
}
