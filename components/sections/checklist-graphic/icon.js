import Image from "next/image"

/**
 * @param {{ stepNumber: number, iconName: string, linePosition: "both" | "top" | "bottom" }}
 */
export function Icon({ stepNumber, iconName, linePosition }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        gridArea: `i${stepNumber}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Apply the line around the icon container according to whether it needs to be above or below */}
      <div
        style={{
          backgroundColor: "var(--line-color)",
          height: linePosition === "both" ? "100%" : "50%",
          position: "absolute",
          ...(linePosition === "top" && { top: "0px" }),
          ...(linePosition === "bottom" && { bottom: "0px" }),
          left: "calc(var(--icon-size) / 2 - var(--line-width) / 2)",
          right: "calc(var(--icon-size) / 2 - var(--line-width) / 2)",
        }}
      ></div>
      {/* The images have transparent backgrounds, put this in to hide the line element */}
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: "50%",
          width: "calc(var(--icon-size) - 8px)", // 8px padding since some of the icons aren't the same size
          height: "calc(var(--icon-size) - 8px)",
        }}
      ></div>
      <Image
        src={`/${iconName}.png`}
        alt="image for current step"
        layout="responsive"
        width={100}
        height={100}
      />
    </div>
  )
}
