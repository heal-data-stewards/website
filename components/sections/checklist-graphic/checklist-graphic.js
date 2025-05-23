import { styled } from "@mui/material"
import React from "react"
import { CloudsGroup } from "./cloud-graphics"
import { Icon } from "./icon"
import { Text } from "./text"
import { ArcLine, HorizontalLine, VerticalLine } from "./lines"

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

export default function ChecklistGraphic() {
  return (
    <div className="container" style={{ position: "relative" }}>
      <Heading>
        Your <span>HEAL</span> Data Sharing <span>Checklist</span>
      </Heading>

      <CloudsGroup
        text="Track your study's progress now"
        href="/resources/road-map"
      />

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
          <VerticalLine key={i} lineNumber={i} />
        ))}
        {/* 2 horizontal lines to connect pieces */}
        {new Array(2).fill(0).map((_, i) => (
          <HorizontalLine key={i} lineNumber={i} />
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
    --line-width: 8px;
    --icon-size: 70px;
    --gutter-height: 30px;

    grid-template-columns:
      var(--icon-size) 1fr var(--icon-size) var(--icon-size)
      1fr;
    grid-template-rows:
      var(--icon-size)
      repeat(5, auto var(--gutter-height))
      auto
      var(--icon-size);

    grid-template-areas:
      ".   .   a3  a4  .  "
      "i1  t1  vl6 i7  t7 "
      "vl1 .   vl6 vl7 .  "
      "i2  t2  vl6 i8  t8 "
      "vl2 .   vl6 vl8 .  "
      "i3  t3  vl6 i9  t9 "
      "vl3 .   vl6 vl9 .  "
      "i4  t4  vl6 i10 t10"
      "vl4 .   vl6 vl10 . "
      "i5  t5  vl6 i11 t11"
      "vl5 .   vl6 .   .  "
      "i6  t6  vl6 .   .  "
      "a1  hl1 a2  .   .  ";

    /* nth-of-type doesn't select the nth of the class, it's the nth of the tag (div) */
    /* Find a better way to do this */
    & .checklist-horizontal-line:nth-of-type(34) {
      display: none;
    }
    & .checklist-arc-line:nth-of-type(39),
    & .checklist-arc-line:nth-of-type(40),
    & .checklist-arc-line:nth-of-type(41),
    & .checklist-arc-line:nth-of-type(42) {
      display: none !important;
    }

    & .clouds-group {
      scale: 0.6;
    }
  }

  @media (max-width: 768px) {
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
  color: #ab3176;
  max-width: 500px;
  margin: 2rem 0 0 0;

  & span:nth-child(1) {
    color: #432557;
  }

  & span:nth-child(2) {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: -40px;
  }
`
