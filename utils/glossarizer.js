import React from "react";
import reactStringReplace from "react-string-replace";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// Creates and returns react components from any string while wrapping any word that matches a glossary term with a tooltip defining the word

export function addToolTips(data, glossary) {
  let replacedText = data;

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  glossary.forEach((element, i) => {
    let regex = new RegExp("(" + element.gtd_item[0].term_name + ")", "g");
    replacedText = reactStringReplace(replacedText, regex, (match) => (
      <HtmlTooltip
        title={
          <>
            <Typography color="inherit">{match}</Typography>
            <em>{element.gtd_item[0].term_body}</em>
          </>
        }
      >
        <span className="text-purple">{match}</span>
      </HtmlTooltip>
    ));
  });
  return replacedText;
}
