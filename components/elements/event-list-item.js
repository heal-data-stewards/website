import * as React from "react"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import Image from "next/image"
import Markdown from "react-markdown"
import { makeEasternTime } from "utils/helper-functions"

export default function BasicCard({ event }) {
  let date = new Date(Date.parse(event.start.dateTime))
  let endDate = new Date(Date.parse(event.end.dateTime))
  let sTime = date.toLocaleTimeString()
  let eTime = endDate.toLocaleTimeString()
  let startTime = makeEasternTime(sTime)
  let endTime = makeEasternTime(eTime)
  return (
    <div className="basic-card-container">
      <div
        style={{
          minWidth: 275,
          background: "rgb(192 179 197 / 10%)",
          padding: "35px",
        }}
        className="basic-card-content"
      >
        <div className="event-img">
          <Image
            alt="alt"
            width={275}
            height={275}
            src={
              "https://heal-community-portal-api.s3.amazonaws.com/HEAL_Website_Page_Design_V2_19_2c8b626d66.png"
            }
          />
        </div>
        <div className="card-blurb">
          <Typography
            sx={{ fontWeight: "bold", color: "#532565", fontSize: 14 }}
            color="text.secondary"
            gutterBottom
          >
            {`${date.toDateString()} ${startTime} - ${endTime} ${
              event.originalEndTimeZone
            }`}
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
            <Link href={`/events/${event.id}`}>{event.subject}</Link>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="">
            {event.location.displayName}
          </Typography>
          <Typography variant="body1">
            <Markdown>{event.bodyPreview + " ..."}</Markdown>
          </Typography>
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
          <Link href={`/events/${event.id}`}>Read More</Link>
        </Button>
      </div>
    </div>
  )
}
