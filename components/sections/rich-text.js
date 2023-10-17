import PropTypes from "prop-types"
import Markdown from "../elements/markdown"

const RichText = ({ data }) => {
  return (
    <div className="container pb-12  text-gray-dark">
      <Markdown>{data.content}</Markdown>
    </div>
  )
}

RichText.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
  }),
}

export default RichText
