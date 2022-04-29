import React, { useRef, useEffect } from "react";
import Divider from "@mui/material/Divider";
import reactStringReplace from "react-string-replace";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export default function PageTitle({ data, noPaddingBottom, glossary }) {
  // const Ref = useRef(this);

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

  let replacedText = data.optionaldescription;
  
  glossary.forEach((element, i) => {
    console.log(element);
    let regex =  new RegExp("("+element.gtd_item[0].term_name+")",'g');
    replacedText = reactStringReplace(
      replacedText,
      regex,
      (match) => (
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
      )
    );
  });

  return (
    <section className={`container pt-10 ${!noPaddingBottom && "pb-10"}`}>
      <h1 className="text-5xl font-black pb-4 text-purple">{data.title}</h1>
      <Divider />
      <p className="text-xl text-gray-dark pt-4">{replacedText}</p>
    </section>
  );
}
