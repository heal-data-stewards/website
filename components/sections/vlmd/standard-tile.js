import { Box } from "@mui/material"
import { RequiredIcon } from "./required-icon"

const CLIP_SIZE = 24

export function StandardTile({
  title,
  requiredOrRecommended,
  active,
  isOpened,
  onClick,
  onKeyDown,
  buttonRef,
  tabIndex,
  ariaControls,
  id,
}) {
  let colorStyles = {
    backgroundColor: "#e0dce3",
    color: "#333333",
    "--icon-border-color": "#462c53",
    "--icon-fill-color": "white",
  }
  if (active && requiredOrRecommended === "required") {
    colorStyles = {
      backgroundColor: "#984d7a",
      color: "white",
      "--icon-border-color": "white",
      "--icon-fill-color": "#492c52",
    }
  }
  if (active && requiredOrRecommended === "recommended") {
    colorStyles = {
      backgroundColor: "#8d7894",
      color: "white",
      "--icon-border-color": "white",
      "--icon-fill-color": "#812c5c",
    }
  }

  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={buttonRef}
      tabIndex={tabIndex}
      type="button"
      role="tab"
      aria-controls={ariaControls}
      aria-selected={isOpened}
      style={{
        border: "none",
        backgroundColor: "transparent",
        textAlign: "left",
        outlineOffset: "3px",
      }}
    >
      <Box
        sx={{
          ...colorStyles,
          "--clip-size": `${CLIP_SIZE}px`,
          "--outline-size": "3px",
          "--outline-color": "#53472c",
          borderRadius: "4px",
          padding: "1rem 1.5rem 1rem 1rem",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1.5rem",
          transition: "background 250ms, color 250ms",
          clipPath:
            "polygon(0px 0px, calc(100%  - var(--clip-size)) 0px, 100% var(--clip-size), 100% 100%, 0px 100%)",
          position: "relative",
          cursor: "pointer",
          ...(isOpened && {
            "&": {
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
          }),
        }}
      >
        <Icon requiredOrRecommended={requiredOrRecommended} active={active} />
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h3 style={{ fontSize: "1.2em", fontWeight: 600 }}>{title}</h3>
        </div>
      </Box>
    </button>
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
