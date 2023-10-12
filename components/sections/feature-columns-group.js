// import NextImage from "../elements/image"
// import { EmblaCarousel } from "../elements/carousel"

// const FeatureColumnsGroup = ({ data }) => {
//   return (
//     <>
//       <div
//         className="container flex flex-col lg:flex-row lg:flex-wrap gap-12 align-top py-7 text-white"
//         style={{
//           background: "#441d4f",
//           boxShadow:
//             "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
//         }}
//       >
//         {data.features.map((feature) => (
//           <div className="flex-1 text-lg" key={feature.id}>
//             {/* <div className="w-10 h-10">
//             <NextImage media={feature.icon} />
//           </div> */}
//             <h3 className="font-bold mb-2">{feature.title}</h3>
//             <p
//               style={{
//                 fontSize: "16px",
//                 lineHeight: "24px",
//               }}
//             >
//               {feature.description}
//             </p>
//           </div>
//         ))}
//       </div>
//       <EmblaCarousel />
//     </>
//   )
// }

// export default FeatureColumnsGroup

import NextImage from "../elements/image"
import Typography from "@mui/material/Typography"

const FeatureColumnsGroup = ({ data }) => {
  return (
    <>
      <div
        className="container flex flex-col lg:flex-row lg:flex-wrap align-top text-white"
        style={
          {
            // boxShadow:
            //   "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
          }
        }
      >
        {data.features.map((feature) => (
          <div className="tag-wrap flex-1" key={feature.id}>
            <div
              style={{
                background: feature.color,
                minHeight: "100%",
                clipPath:
                  "polygon(94% 0%, 100% 50%, 94% 100%, 0% 100%, 5% 50%, 0% 0%)",
              }}
            >
              {/* <div className="w-10 h-10">
            <NextImage media={feature.icon} />
          </div> */}
              <div style={{ padding: "1.5rem 2.5rem" }}>
                <Typography variant="h3" style={{ color: "#fff" }}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  style={
                    {
                      // padding: "0 2.2rem 0",
                    }
                  }
                >
                  {feature.description}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default FeatureColumnsGroup
