import React from "react"
import Divider from '@mui/material/Divider';

export default function PageTitle({ data }) {
  console.log(data)
  return (
      <section className="container pt-10 pb-10">
        <h1 className="text-5xl font-black pb-4 text-purple">{data.title}</h1>
        <Divider />
        <p className="text-xl text-gray pt-4">
          {data.optionaldescription}
        </p>
      </section>
  )
}