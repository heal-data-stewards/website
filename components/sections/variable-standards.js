import React from "react"
import questions from "../../data/vlmd/questions.json"
import Markdown from "../elements/markdown"

const VariableStandards = () => {
  const [focusArea, setFocusArea] = React.useState()

  return (
    <div className="container pb-4 mt-20">
      {questions.map((q, i) => (
        <>
          <Question
            number={i + 1}
            key={i}
            question={q}
            selected={focusArea}
            onChange={setFocusArea}
          />
          <hr />
        </>
      ))}
    </div>
  )
}

function Question({ number, question, selected, onChange }) {
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
          onChange={onChange}
        />
      ) : null}
    </div>
  )
}

function SingleChoice({ answers, id, selected, onChange }) {
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
                onChange(e.target.value)
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
