import NextImage from "../elements/image"
import { EmblaCarousel } from "../elements/carousel"

const FeatureColumnsGroup = ({ data }) => {
  return (
    <>
      <div
        className="container flex flex-col lg:flex-row lg:flex-wrap gap-12 align-top py-12 text-white"
        style={{
          background: "#441d4f",
          "box-shadow":
            "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
        }}
      >
        {data.features.map((feature) => (
          <div className="flex-1 text-lg" key={feature.id}>
            {/* <div className="w-10 h-10">
            <NextImage media={feature.icon} />
          </div> */}
            <h3 className="font-bold mt-4 mb-4">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
      <EmblaCarousel />
    </>
  )
}

export default FeatureColumnsGroup
