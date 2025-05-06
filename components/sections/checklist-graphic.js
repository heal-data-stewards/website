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

function Icon({ stepNumber, iconName }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        gridArea: `i${stepNumber}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
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
        fontWeight: "600",
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

export default function ChecklistGraphic() {
  return (
    <div className="container">
      <ChecklistGrid>
        {steps.map(({ icon, text }, index) => (
          <React.Fragment key={icon}>
            <Icon stepNumber={index + 1} iconName={icon} />
            <Text stepNumber={index + 1} text={text} />
          </React.Fragment>
        ))}
      </ChecklistGrid>
    </div>
  )
}

const ChecklistGrid = styled("div")`
  display: grid;
  --icon-size: 80px;
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
    ".  .  . .  .  . .   .  "
    "i1 t1 . i5 t5 . .   .  "
    ".  .  . .  .  . .   .  "
    "i2 t2 . i6 t6 . i9  t9 "
    ".  .  . .  .  . .   .  "
    "i3 t3 . i7 t7 . i10 t10"
    ".  .  . .  .  . .   .  "
    "i4 t4 . i8 t8 . i11 t11"
    ".  .  . .  .  . .   .  ";
`
