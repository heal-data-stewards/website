import classNames from "classnames"
import NextImage from "../elements/image"
import Video from "../elements/video"
import CustomLink from "../elements/custom-link"
import React from "react"
import Typography from "@mui/material/Typography"

const FeatureRowsGroup = ({ data }) => {
  return (
    <div
      className="container flex flex-col gap-12 text-gray-dark"
      style={{ marginTop: "1.5rem" }}
    >
      {data.features.map((feature, index) => (
        <div
          className={classNames(
            // Common classes
            "flex flex-col justify-start md:justify-between md:items-center gap-10",
            {
              "lg:flex-row": index % 2 === 0,
              "lg:flex-row-reverse": index % 2 === 1,
            }
          )}
          key={feature.id}
          style={{ marginBottom: "10px" }}
        >
          {/* Text section */}
          <div className="w-full lg:w-6/12 lg:pr-6 text-lg">
            {/* <h3 className="title">{feature.title}</h3> */}
            <Typography variant="subtitle1">{feature.description}</Typography>

            {!feature.link == null && (
              <CustomLink link={feature.link}>
                <div className="text-blue-600 with-arrow hover:underline">
                  {feature.link.text}
                </div>
              </CustomLink>
            )}
          </div>
          {/* Media section */}
          <div className="w-full sm:9/12 lg:w-4/12 max-h-full">
            {/* Images */}
            {feature.media.mime.startsWith("image") && (
              <div
                className="w-full h-auto"
                style={{ height: "230px", position: "relative" }}
              >
                <NextImage
                  media={feature.media}
                  fill={true}
                  style={{ height: "200px" }}
                />
              </div>
            )}
            {/* Videos */}
            {feature.media.mime.startsWith("video") && (
              <Video
                media={feature.media}
                className="w-full h-auto"
                autoPlay
                controls={false}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeatureRowsGroup
