import React from "react"
import Divider from "@mui/material/Divider"
import { addToolTips } from "utils/glossarizer"
import Typography from "@mui/material/Typography"

export default function PageTitle({ data, noPaddingBottom, glossary }) {
  return (
    <section className={`container pt-10 ${!noPaddingBottom && "pb-10"}`}>
      <Typography variant="h1" className="pb-2">
        {data.title}
      </Typography>
      <Divider />
      {data.optionaldescription && (
        <Typography variant="body1" className="text-xl text-gray-dark pt-4">
          {addToolTips(data.optionaldescription, glossary)}
        </Typography>
      )}
    </section>
  )
}
