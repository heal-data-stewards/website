import React, { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp"
import MuiAccordion from "@mui/material/Accordion"
import MuiAccordionSummary from "@mui/material/AccordionSummary"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import Markdown from "../elements/markdown"
import Divider from "@mui/material/Divider"

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  background: "linear-gradient(315deg, transparent 17px, #e5e0e7 0)",
  marginBottom: "1rem",
}))

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{
          fontSize: "2rem",
          padding: "0.75rem 0.5rem 0.5rem 0",
          color: "#532565",
        }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  color: "#532565",
  fontWeight: "600",
  padding: "0.5rem 1rem",
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "0rem 2.6rem 1rem",
  // borderTop: "1px solid rgba(0, 0, 0, .125)",
  border: "none",
  color: "#532565",
}))

export default function Faqs({ data }) {
  const [faqs, setFaqs] = useState([])
  const [expanded, setExpanded] = useState()
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    // Split the array into separate objects by the tag property
    function groupByTag(arr, property) {
      return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) {
          memo[x[property]] = []
        }
        memo[x[property]].push(x)
        return memo
      }, {})
    }

    const separateObject = (obj) => {
      const res = []
      const keys = Object.keys(obj)
      keys.forEach((key) => {
        res.push({
          key: key,
          data: obj[key],
        })
      })
      return res
    }

    const group = groupByTag(data.question, "tag")
    const newState = separateObject(group)
    setFaqs(newState)
  }, [data.question])

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <div className="container pb-4">
      {faqs.map((faq, i) => {
        return (
          <div
            key={i + "obj"}
            style={{
              marginBottom: "2rem",
              background: "#fff",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.8rem",
                lineHeight: "1.25",
                fontWeight: "500",
                color: "#982568",
                paddingTop: "2rem",
              }}
            >
              {faq.key !== "null" ? faq.key : "FAQs"}
            </Typography>
            <Divider sx={{ backgroundColor: "#982568" }} />
            <br />
            {faq.data.map((question, i) => {
              return (
                <Accordion
                  expanded={expanded === "panel" + i + question.question}
                  onChange={handleChange("panel" + i + question.question)}
                  key={question.question + i}
                >
                  <AccordionSummary
                    aria-controls={"panel" + i + question.question}
                    id={"panel" + i + question.question}
                  >
                    <Typography
                      variant="h3"
                      sx={{ fontSize: "1.2rem", fontWeight: "500" }}
                    >
                      {question.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Markdown>{question.answerFAQ}</Markdown>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
