import * as React from "react"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import Image from "next/image"
import Markdown from "react-markdown"
import { makeEasternTime } from "utils/helper-functions"

export default function WebinarItem({ data }) {
  // const dateTime = new Date(Date.parse(data.time))
  let date = new Date(Date.parse(data.start.dateTime))
  let endDate = new Date(Date.parse(data.end.dateTime))
  let sTime = date.toLocaleTimeString()
  let eTime = endDate.toLocaleTimeString()
  let startTime = makeEasternTime(sTime)
  let endTime = makeEasternTime(eTime)

  // const result = data.abstract.substring(100, 320)

  return (
    <div className="basic-card-container container">
      <div className="basic-card-content">
        <div className="event-img">
          <Image
            alt="Webinar"
            width={275}
            height={275}
            src={
              "https://heal-community-portal-api.s3.amazonaws.com/HEAL_Website_Page_Design_V2_19_2c8b626d66.png"
            }
          />
        </div>
        <div className="card-blurb">
          <Typography
            sx={{ fontWeight: "bold", color: "#982568", fontSize: 14 }}
            color="text.secondary"
            gutterBottom
          >
            {`${date.toDateString()} ${startTime} - ${endTime} ${
              data.originalEndTimeZone
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
            <Link href={data.RegistrationLink}>{data.title}</Link>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="">
            Webinar, Online
          </Typography>
          <div>
            <Markdown>{data.abstract + " ..."}</Markdown>
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
