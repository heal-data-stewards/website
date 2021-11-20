import * as React from "react"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import Image from "next/image"
import Markdown from "react-markdown"

export default function WebinarItem({ data }) {
  const dateTime = new Date(Date.parse(data.time))
  console.log(data)

  const result = data.abstract.substring(0, 320)

  return (
    <div className="basic-card-container container">
      <div
        style={{
          minWidth: 275,
          background: "rgb(192 179 197 / 10%)",
          padding: "35px",
          borderRadius: "16px",
        }}
        className="basic-card-content"
      >
        <div className="event-img">
          <Image
            alt="alt"
            width={275}
            height={275}
            src={
              "https://heal-community-portal-api.s3.amazonaws.com/HEAL_Website_Page_Design_07_fe1327527c.png"
            }
          />
        </div>
        <div className="card-blurb">
          <Typography
            sx={{ fontWeight: "bold", color: "#532565", fontSize: 14 }}
            color="text.secondary"
            gutterBottom
          >
            {dateTime.toString().replace(/ *\([^)]*\) */g, "")}
          </Typography>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#532565",
              textTransform: "capitalize",
              cursor: "pointer",
              "&:hover": {
                color: "#982568",
              },
            }}
          >
            <Link href={data.RegistrationLink}>{data.title}</Link>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="">
            Webinar, Online
          </Typography>
          <div>
            <Markdown>{result + " ..."}</Markdown>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          padding: "0 25px 0 0",
          marginTop: "-16px",
        }}
      >
        <Button variant="contained" size="small">
          {/* <Link href={`/events/${event.id}`}>Read More</Link> */}
          <Link href={data.RegistrationLink}>Register Here</Link>
        </Button>
      </div>
    </div>
  )
}