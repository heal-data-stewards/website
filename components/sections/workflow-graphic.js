import { Typography } from "@mui/material"
import Markdown from "../elements/markdown"
import Image from "next/image"

const WorkflowGraphic = ({ data }) => {
  return (
    <div
      style={{ backgroundColor: data.background_color, color: data.text_color }}
      className="w-full py-20 my-20 flex flex-col items-center gap-12"
    >
      <div className="container">
        {data.title && (
          <Typography variant="h2" color="primary" textAlign="center">
            {data.title}
          </Typography>
        )}
        {data.description && <Markdown>{data.description}</Markdown>}
      </div>

      <div className="flex gap-16 overflow-x-auto max-w-full p-4">
        {data.workflow_step.reduce((prev, step, index) => {
          const isLastStep = index === data.workflow_step.length - 1

          return [
            ...prev,
            <div
              key={step.id}
              className="max-w-[300px] min-w-[300px] rounded-lg p-4 flex-1"
              style={{
                backgroundColor: `oklch(from ${data.background_color} 93% C H)`,
              }}
            >
              <div className="h-[255px] relative">
                <Image
                  src={step.graphic.url}
                  layout="fill"
                  objectFit="contain"
                  alt={step.graphic.alternativeText}
                />
              </div>
              <Typography variant="h4">{step.title}</Typography>
              <Typography variant="body2">{step.description}</Typography>
            </div>,
            !isLastStep && (
              <Arrow
                key={`arrow-${index}`}
                className="self-center flex-shrink-0"
              />
            ),
          ]
        }, [])}
      </div>
    </div>
  )
}

const Arrow = (props) => (
  <svg
    width="75"
    height="68"
    viewBox="0 0 75 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.91 29.19C2.39987 29.19 0.365004 31.2249 0.365004 33.735C0.365004 36.2451 2.39987 38.28 4.91 38.28L4.91 33.735L4.91 29.19ZM73.2688 36.9488C75.0437 35.1739 75.0437 32.2961 73.2688 30.5212L44.3446 1.59698C42.5697 -0.177951 39.6919 -0.177951 37.917 1.59698C36.1421 3.37191 36.1421 6.24965 37.917 8.02458L63.6274 33.735L37.917 59.4454C36.1421 61.2203 36.1421 64.0981 37.917 65.873C39.6919 67.6479 42.5697 67.6479 44.3446 65.873L73.2688 36.9488ZM4.91 33.735L4.91 38.28L70.055 38.28L70.055 33.735L70.055 29.19L4.91 29.19L4.91 33.735Z"
      fill="#522662"
    />
  </svg>
)

export default WorkflowGraphic
