/**
 * @param {{ arcNumber: number, position: "tl" | "tr" | "bl" | "br" }}
 * @help the position is the corner wrapped by the arc segment
 */
export function ArcLine({ arcNumber, position }) {
  const positionVals = {
    ...(position === "tl" && {
      top: "0px",
      left: "0px",
      borderBottomRightRadius: "100%",
    }),
    ...(position === "tr" && {
      top: "0px",
      right: "0px",
      borderBottomLeftRadius: "100%",
    }),
    ...(position === "bl" && {
      bottom: "0px",
      left: "0px",
      borderTopRightRadius: "100%",
    }),
    ...(position === "br" && {
      bottom: "0px",
      right: "0px",
      borderTopLeftRadius: "100%",
    }),
  }

  return (
    <div
      className="checklist-arc-line"
      style={{
        gridArea: `a${arcNumber}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          width: "var(--icon-size)",
          height: "var(--icon-size)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            backgroundColor: "var(--line-color)",
            width: "calc((100% + var(--line-width)) / 2)",
            height: "calc((100% + var(--line-width)) / 2)",
            ...positionVals,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              position: "absolute",
              width: "calc(100% - var(--line-width)",
              height: "calc(100% - var(--line-width)",
              ...positionVals,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export function VerticalLine({ lineNumber }) {
  return (
    <div
      style={{
        backgroundColor: "var(--line-color)",
        gridArea: `vl${lineNumber + 1}`,
        margin: "0px auto",
        height: "100%",
        width: "var(--line-width)",
      }}
    ></div>
  )
}

export function HorizontalLine({ lineNumber }) {
  return (
    <div
      className="checklist-horizontal-line"
      style={{
        backgroundColor: "var(--line-color)",
        gridArea: `hl${lineNumber + 1}`,
        margin: "auto 0px",
        width: "100%",
        height: "var(--line-width)",
      }}
    ></div>
  )
}
