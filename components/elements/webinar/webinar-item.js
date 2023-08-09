import * as React from "react"
import PropTypes from "prop-types"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Image from "next/image"
import Markdown from "../../elements/markdown"

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

export default function WebinarItem({ event, past, collective }) {
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
            width={175}
            height={175}
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
            <a rel="noreferrer" href={`/events/${event.id}`}>
              {event.subject}
            </a>
          </Typography>
          <Typography sx={{ mb: 1.5, fontWeight: "bold", color: "#982568" }}>
            {event.categories[0] !== "Green category" &&
              event.categories[0] !== "Yellow category" &&
              (past ? "Recording Link: " : "Registration Link: ")}
            <BlueLink href={event.location.displayName} target="_blank">
              {event.location.displayName}
            </BlueLink>
          </Typography>
          <Markdown linkTarget="_blank">
            {event.bodyPreview.substring(0, 150) + " ..."}
          </Markdown>
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
          <a rel="noreferrer" href={`/events/${event.id}`}>
            Read More
          </a>
        </Button>
      </div>
    </div>
  )
}

WebinarItem.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any.isRequired,
  ]),
  bodyPreview: PropTypes.string,
}
