import { styled } from "@mui/material"
import Image from "next/image"
import React from "react"
import { LightPurpleCloud, PurpleCloud } from "./cloud-graphics"
import Link from "next/link"

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
        fontSize: "1.3rem",
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

export default function ChecklistGraphic() {
  return (
    <div className="container" style={{ position: "relative" }}>
      <Heading>
        Your <span>HEAL</span> Data Sharing <span>Checklist</span>
      </Heading>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          isolation: "isolate",
        }}
      >
        <PurpleCloud style={{ zIndex: 1 }}>
          <Link href={"/resources/road-map"}>
            <a
              style={{
                fontSize: "1.5rem",
                textDecoration: "underline",
                textAlign: "center",
                textWrap: "",
              }}
            >
              Track your study&apos;s progress now
            </a>
          </Link>
        </PurpleCloud>
        <LightPurpleCloud
          style={{
            position: "absolute",
            top: "-30px",
            left: "-100px",
            zIndex: 0,
          }}
        />
      </div>
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
            className="checklist-horizontal-line"
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
  --line-color: #dcd2de;
  --line-width: 10px;
  --icon-size: 80px;
  --gutter-height: 40px;

  position: "absolute";
  display: grid;
  grid-template-columns:
    var(--icon-size) 1fr var(--icon-size)
    var(--icon-size) 1fr var(--icon-size)
    var(--icon-size) 1fr;
  grid-template-rows:
    var(--icon-size)
    auto var(--gutter-height)
    auto var(--gutter-height)
    auto var(--gutter-height)
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

  @media (max-width: 1260px) {
    --icon-size: 60px;
    --gutter-height: 20px;
    --line-width: 6px;

    grid-template-columns: auto var(--icon-size) minmax(auto, 400px) auto;
    grid-template-rows:
      var(--icon-size)
      repeat(10, auto var(--gutter-height))
      auto
      var(--icon-size);
    grid-template-areas:
      ". .    .   ."
      ". i1   t1  ."
      ". vl1  .   ."
      ". i2   t2  ."
      ". vl2  .   ."
      ". i3   t3  ."
      ". vl3  .   ."
      ". i4   t4  ."
      ". vl4  .   ."
      ". i5   t5  ."
      ". vl5  .   ."
      ". i6   t6  ."
      ". vl6  .   ."
      ". i7   t7  ."
      ". vl7  .   ."
      ". i8   t8  ."
      ". vl8  .   ."
      ". i9   t9  ."
      ". vl9  .   ."
      ". i10  t10 ."
      ". vl10 .   ."
      ". i11  t11 ."
      ". .    .   .";

    & .checklist-horizontal-line {
      display: none;
    }
    & .checklist-arc-line {
      display: none !important;
    }
  }
`

const Heading = styled("h2")`
  font-size: 2.5rem;
  font-weight: bold;
  color: #812d5c;
  max-width: 500px;
  margin: 2rem 0 0 0;

  & span:nth-child(1) {
    color: #432557;
  }

  & span:nth-child(2) {
    text-decoration: underline;
  }
`
