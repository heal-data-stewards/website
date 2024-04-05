import Markdown from "../elements/markdown"

const PurpleBar = ({ data }) => {
  return (
    <div
      className="container pb-4 text-gray-dark"
      style={{
        background: "#e5e0e8",
        padding: "25px 5px 25px 32px",
        marginBottom: "25px",
      }}
    >
      <Markdown>{data.body}</Markdown>
    </div>
  )
}

export default PurpleBar
