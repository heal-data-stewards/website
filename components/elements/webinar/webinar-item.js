import * as React from "react"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import Image from "next/image"
import Markdown from "react-markdown"
import {
  makeEasternTime,
  checkDaylightSavings,
  makeEasternTimeWithDaylightSavings,
} from "utils/helper-functions"
import { renderImage } from "utils/helper-functions"
import styled from "styled-components"

const BlueLink = styled.a`
  color: #0044b3;
`

export default function WebinarItem({ event, past }) {
  let date = new Date(Date.parse(event.start.dateTime))
  let endDate = new Date(Date.parse(event.end.dateTime))
  let sTime = date.toLocaleTimeString()
  let eTime = endDate.toLocaleTimeString()
  let startTime = checkDaylightSavings(date)
    ? makeEasternTimeWithDaylightSavings(sTime)
    : makeEasternTime(sTime)
  let endTime = checkDaylightSavings(endDate)
    ? makeEasternTimeWithDaylightSavings(eTime)
    : makeEasternTime(eTime)

  return (
    <div className="basic-card-container">
      <div className="basic-card-content">
        <div className="event-img">
          <Image
            alt="Webinar"
            width={275}
            height={275}
            src={renderImage(event.categories[0])}
          />
        </div>
        <div className="card-blurb">
          <Typography
            sx={{ fontWeight: "bold", color: "#982568", fontSize: 14 }}
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
          <Typography sx={{ mb: 1.5, fontWeight: "bold", color: "#982568" }}>
            {past ? "Recording Link:" : "Registration Link"}{" "}
            <Link href={event.location.displayName} passHref>
              <BlueLink target="_blank">{event.location.displayName}</BlueLink>
            </Link>
          </Typography>
          {/* <Markdown>{event.bodyPreview + " ..."}</Markdown> */}
          <Markdown>{event.bodyPreview.substring(0, 130) + " ..."}</Markdown>
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
