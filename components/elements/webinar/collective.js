import React from "react"
import WebinarItem from "./webinar-item"
import { filterByDate } from "utils/helper-functions"
import Divider from "@mui/material/Divider"

export default function CollectiveEvents(props) {
  const now = new Date()
  const events = filterByDate(
    (props.eventData ?? []).filter(
      (event) => event.categories?.[0] === "Green category"
    )
  )
  const usingSnapshot = !props.token
  const snapshotEventCount = events.length

  return (
    <div className="container">
      <section className={`pt-10 pb-10`}>
        <h1 className="text-3xl font-bold pb-4 text-purple">Past Events</h1>
        <Divider />
        <br></br>
        <br></br>
        {events.length !== 0 &&
          events.map((event, i) => {
            if (new Date(event.start.dateTime) <= now) {
              return (
                <WebinarItem
                  key={event.subject + i}
                  event={event}
                  past={true}
                  collective={true}
                />
              )
            }
          })}
        {usingSnapshot && (
          <p className="mt-4 rounded border border-magenta bg-magenta/10 px-4 py-3 text-sm text-gray-dark">
            Our full calendar is currently unavailable. This page is currently
            limited to the last {snapshotEventCount} Collective Board meeting
            {snapshotEventCount === 1 ? "" : "s"}. Please check back soon as we
            work to restore full calendar access.
          </p>
        )}
      </section>
    </div>
  )
}
