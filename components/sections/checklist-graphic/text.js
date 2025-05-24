export function Text({ stepNumber, text }) {
  return (
    <div
      style={{
        gridArea: `t${stepNumber}`,
        fontSize: "1.3rem",
        color: "#4c2861",
        lineHeight: "1.2",
        fontWeight: "500",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 20px",
      }}
    >
      {text}
    </div>
  )
}
