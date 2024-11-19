import React from "react"
import questions from "../../data/vlmd/questions.json"
import Markdown from "../elements/markdown"

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

  React.useEffect(() => console.log(state), [state])

  return (
    <div className="container pb-4 mt-20">
      <pre>{JSON.stringify(state, null, 2)}</pre>

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
          />
          <hr />
        </>
      ))}
    </div>
  )
}

function Question({ number, question, selected, setSelected }) {
  return (
    <div className="py-4">
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
        />
      ) : (
        <MultipleChoice
          answers={question.answers}
          id={question.id}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </div>
  )
}

function SingleChoice({ answers, id, selected, setSelected }) {
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
            />
            {answer}
          </label>
        )
      })}
    </div>
  )
}

function MultipleChoice({ answers, id, selected, setSelected }) {
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
            />
            {answer}
          </label>
        )
      })}
    </div>
  )
}

export default VariableStandards
