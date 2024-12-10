import { RequiredIcon } from "./required-icon"

export function StandardTile({
  title,
  description,
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
    <div
      style={{
        ...colorStyles,
        borderRadius: "4px",
        padding: "1rem 1.5rem 1rem 1rem",
        display: "flex",
        gap: "1.5rem",
        transition: "all 250ms",
        "--clip-size": "36px",
        clipPath:
          "polygon(0px 0px, calc(100%  - var(--clip-size)) 0px, 100% var(--clip-size), 100% 100%, 0px 100%)",
      }}
    >
      <Icon requiredOrRecommended={requiredOrRecommended} active={active} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "1.2em", fontWeight: 600 }}>{title}</h3>
        <div>{description}</div>
      </div>
    </div>
  )
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
