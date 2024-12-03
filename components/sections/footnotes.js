import PropTypes from "prop-types"
import Markdown from "../elements/markdown"

const Footnotes = ({ data }) => {
  return (
    <div className="container pb-4 pt-4 text-gray-dark">
      {data.footnote.map((footnote, index) => (
        <div key={`footnote-${index}`}>
          <sup>{footnote.footnote_number}</sup>
          <Markdown footnote>{footnote.footnote_text}</Markdown>
        </div>
      ))}
    </div>
  )
}
Footnotes.propTypes = {
  data: PropTypes.shape({
    footnote: PropTypes.arrayOf(
      PropTypes.shape({
        footnote_number: PropTypes.number,
        footnote_text: PropTypes.string,
      })
    ),
  }),
}

export default Footnotes
