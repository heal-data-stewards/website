import { styled } from "@mui/material"
import Image from "next/image"
import React from "react"

const steps = [
  {
    icon: "ci-award",
    text: "Award Received",
  },
  {
    icon: "ci-clinical-trials",
    text: "Register Your Study on ClinicalTrials.gov (if appropriate)",
  },
  {
    icon: "ci-register",
    text: "Register Your Study With the HEAL Data Platform",
  },
  {
    icon: "ci-cedar",
    text: "Complete Your Study-Level Metadata Form",
  },
  {
    icon: "ci-db",
    text: "Report Your Repository Selection via the HEAL Data Platform",
  },
  {
    icon: "ci-cdes",
    text: "Use HEAL Common Data Elements to Collect Your Data",
  },
  {
    icon: "ci-vlmd",
    text: "Submit Variable-Level Metadata",
  },
  {
    icon: "ci-submit",
    text: "Submit Data and Metadata to a Repository",
  },
  {
    icon: "ci-report",
    text: "Submit Data Link to the HEAL Data Platform Team",
  },
  {
    icon: "ci-access",
    text: "Ensure Public Access to HEAL-funded Publications",
  },
  {
    icon: "ci-publication",
    text: "Report your Research Publication",
  },
]

/**
 * @param {{ stepNumber: number, iconName: string, linePosition: "both" | "top" | "bottom" }}
 */
function Icon({ stepNumber, iconName, linePosition }) {
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

function Text({ stepNumber, text }) {
  return (
    <div
      style={{
        gridArea: `t${stepNumber}`,
        fontSize: "1.5rem",
        color: "#a082b6",
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

/**
 * @param {{ arcNumber: number, position: "tl" | "tr" | "bl" | "br" }}
 * @help the position is the corner wrapped by the arc segment
 */
function ArcLine({ arcNumber, position }) {
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

export default function ChecklistGraphic() {
  return (
    <div
      className="container"
      style={{
        "--line-color": "#dcd2de",
        "--line-width": "10px",
        "--icon-size": "80px",
      }}
    >
      <ChecklistGrid>
        {steps.map(({ icon, text }, index) => (
          <React.Fragment key={icon}>
            <Icon
              stepNumber={index + 1}
              iconName={icon}
              linePosition={
                {
                  0: "bottom",
                  [steps.length - 1]: "top",
                }[index] ?? "both"
              }
            />
            <Text stepNumber={index + 1} text={text} />
          </React.Fragment>
        ))}

        {/* 10 vertical lines to connect pieces */}
        {new Array(10).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "var(--line-color)",
              gridArea: `vl${i + 1}`,
              margin: "0px auto",
              height: "100%",
              width: "var(--line-width)",
            }}
          ></div>
        ))}
        {/* 2 horizontal lines to connect pieces */}
        {new Array(2).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "var(--line-color)",
              gridArea: `hl${i + 1}`,
              margin: "auto 0px",
              width: "100%",
              height: "var(--line-width)",
            }}
          ></div>
        ))}

        <ArcLine arcNumber={1} position="tr" />
        <ArcLine arcNumber={2} position="tl" />
        <ArcLine arcNumber={3} position="br" />
        <ArcLine arcNumber={4} position="bl" />
        <ArcLine arcNumber={5} position="tr" />
        <ArcLine arcNumber={6} position="tl" />
        <ArcLine arcNumber={7} position="br" />
        <ArcLine arcNumber={8} position="bl" />
      </ChecklistGrid>
    </div>
  )
}

const ChecklistGrid = styled("div")`
  display: grid;
  grid-template-columns:
    var(--icon-size) 1fr var(--icon-size)
    var(--icon-size) 1fr var(--icon-size)
    var(--icon-size) 1fr;
  grid-template-rows:
    var(--icon-size)
    auto 40px
    auto 40px
    auto 40px
    auto
    var(--icon-size);
  grid-template-areas:
    ".   .   a3  a4  .   .   .    . "
    "i1  t1  vl4 i5  t5  a7  a8    . "
    "vl1 .   vl4 vl5 .   a7  a8   . "
    "i2  t2  vl4 i6  t6  vl8 i9   t9 "
    "vl2 .   vl4 vl6 .   vl8 vl9  .  "
    "i3  t3  vl4 i7  t7  vl8 i10  t10"
    "vl3 .   vl4 vl7 .   vl8 vl10 .  "
    "i4  t4  vl4 i8  t8  vl8 i11  t11"
    "a1  hl1 a2  a5  hl2 a6  .    .  ";
`
