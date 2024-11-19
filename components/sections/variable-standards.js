import React from "react"
import questions from "../../data/vlmd/questions.json"
import Markdown from "../elements/markdown"

const VariableStandards = () => {
  const [focusArea, setFocusArea] = React.useState()

  return (
    <div className="container pb-4 mt-20">
      {/* {questions.map((q, i) => (
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
      ))} */}

      <pre>{JSON.stringify(focusArea, null, 2)}</pre>

      <Question
        number={1}
        question={questions[5]}
        selected={focusArea}
        setSelected={setFocusArea}
      />
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
    if (selected === undefined) {
      setSelected([value])
      return
    }

    if (!selected.includes(value)) {
      setSelected((prev) => [...prev, value])
    } else {
      setSelected((prev) => prev.filter((item) => item !== value))
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
              checked={selected !== undefined && selected.includes(value)}
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
