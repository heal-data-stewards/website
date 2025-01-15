import { Box } from "@mui/material"
import { RequiredIcon } from "./required-icon"

const CLIP_SIZE = 36

export function StandardTile({
  title,
  description,
  link,
  requiredOrRecommended,
  active,
}) {
  let colorStyles = {
    backgroundColor: "#e0dce3",
    color: "#333333",
    "--icon-border-color": "#462c53",
    "--icon-fill-color": "white",
  }
  if (active && requiredOrRecommended === "required") {
    colorStyles = {
      backgroundColor: "#782c5c",
      color: "white",
      "--icon-border-color": "white",
      "--icon-fill-color": "#462c53",
    }
  }
  if (active && requiredOrRecommended === "recommended") {
    colorStyles = {
      backgroundColor: "#462c53",
      color: "white",
      "--icon-border-color": "white",
      "--icon-fill-color": "#782c5c",
    }
  }

  return (
    <OptionalLink link={link}>
      <Box
        sx={{
          ...colorStyles,
          "--clip-size": `${CLIP_SIZE}px`,
          "--outline-size": "3px",
          "--outline-color": "#462c53",
          borderRadius: "4px",
          padding: "1rem 1.5rem 1rem 1rem",
          height: "100%",
          display: "flex",
          gap: "1.5rem",
          transition: "background 250ms, color 250ms",
          clipPath:
            "polygon(0px 0px, calc(100%  - var(--clip-size)) 0px, 100% var(--clip-size), 100% 100%, 0px 100%)",
          position: "relative",
          "a:hover > &": {
            outline: "var(--outline-size) solid var(--outline-color)",
            outlineOffset: "calc(-1 * var(--outline-size))",
            "&:after": {
              content: "''",
              position: "absolute",
              width: Math.sqrt(2 * Math.pow(CLIP_SIZE, 2)),
              height: "var(--outline-size)",
              background: "var(--outline-color)",
              top: 0,
              left: "calc(100% - var(--clip-size))",
              transformOrigin: "0% 0%",
              transform: "rotate(45deg)",
            },
          },
        }}
      >
        <Icon requiredOrRecommended={requiredOrRecommended} active={active} />
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h3 style={{ fontSize: "1.2em", fontWeight: 600 }}>{title}</h3>
          <div>{description}</div>
        </div>
      </Box>
    </OptionalLink>
  )
}

const OptionalLink = ({ link, children }) => {
  if (link !== null)
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )

  return children
}

function Icon({ requiredOrRecommended, active }) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        "--size": "32px",
        width: "var(--size)",
        height: "var(--size)",
        position: "relative",
      }}
    >
      {requiredOrRecommended === "required" && active ? (
        <RequiredIcon />
      ) : (
        <CircleIcon />
      )}
    </div>
  )
}

const CircleIcon = () => (
  <div
    style={{
      "--size": "22px",
      width: "var(--size)",
      height: "var(--size)",
      backgroundColor: "var(--icon-fill-color)",
      border: "3px solid var(--icon-border-color)",
      borderRadius: "50%",
      position: "relative",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
  ></div>
)
