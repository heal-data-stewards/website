import { getStrapiMedia } from "utils/media"
import Image from "next/image"
import PropTypes from "prop-types"
import { mediaPropTypes } from "utils/types"

const NextImage = ({ media, ...props }) => {
  const { url, alternativeText } = media

  const loader = ({ src }) => {
    return getStrapiMedia(src)
  }

  // The image has a fixed width and height
  if (props.width && props.height) {
    return (
      <Image
        priority={true}
        loader={loader}
        src={url}
        alt={alternativeText || ""}
        {...props}
      />
    )
  }
  if (props.fill) {
    return (
      <Image
        loader={loader}
        layout="fill"
        priority={true}
        objectFit="contain"
        src={url}
        alt={alternativeText || ""}
      />
    )
  }

  // The image is responsive
  return (
    <Image
      loader={loader}
      priority={true}
      layout="responsive"
      width={media.width}
      height={media.height}
      objectFit="contain"
      src={url}
      alt={alternativeText || ""}
    />
  )
}

Image.propTypes = {
  media: mediaPropTypes,
  className: PropTypes.string,
}

export default NextImage
