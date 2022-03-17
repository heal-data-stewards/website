// import Markdown from "react-markdown"
// import { getButtonAppearance } from "utils/button"
// import ButtonLink from "../elements/button-link"
// import NextImage from "../elements/image"

const Resource = ({ data }) => {
  return (
    <main className="container flex flex-col md:flex-row items-center justify-between py-12">
      {/* Left column for content */}
      <div className="flex-1 sm:pr-8">
        {/* Hero section label */}
        {/* <p className="uppercase tracking-wide font-semibold">{data.title}</p> */}
        {/* Big title */}
        <a
          href={data.link}
          target="_blank"
          className="hover:text-magenta text-purple "
          rel="noreferrer"
        >
          <h1 className="title mt-2 sm:mt-0 mb-4 sm:mb-2">{data.title}</h1>
        </a>
        {/* Description paragraph */}
        <p className="text-xl mb-6">{data.blurb}</p>
      </div>
      <hr></hr>
    </main>
  )
}

export default Resource
