import PropTypes from "prop-types"
import Markdown from "react-markdown"

const RichText = ({ data }) => {
  return (
    <div className="prose-lg container pb-12 event-html text-gray text-xl">
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
