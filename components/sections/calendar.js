import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import WebinarItem from "../elements/webinar/webinar-item"
import { filterByDate } from "utils/helper-functions"
import Divider from "@mui/material/Divider"
import { fetchEvents } from "utils/msft-graph-api"

export default function Calendar(props) {
  const [events, setEvents] = useState(filterByDate(props.eventData))
  const { data: session } = useSession()
  const [loggedIn, setLoggedIn] = useState(false)
  const [now, setNow] = useState(null)
  const [usingSnapshot, setUsingSnapshot] = useState(
    Boolean(props.eventData?.isSnapshot)
  )
  const snapshotEventCount = events.length

  useEffect(() => {
    setNow(new Date())
  }, [])

  useEffect(() => {
    if (session) {
      setLoggedIn(true)
      // eventData contains every event in the HEAL calendar, logged in users see every event
      async function fetchMyAPI() {
        let eventData2 = await fetchEvents(props.token)
        let sortedEvents = filterByDate(eventData2)
        setUsingSnapshot(Boolean(eventData2.isSnapshot))
        setEvents(sortedEvents)
      }
      fetchMyAPI()
    } else {
      // Events created in the HEAL Calendar with out a category label are collected in filteredEvents
      // These are the events avaiable to the public
      async function fetchMyAPI() {
        let eventData2 = await fetchEvents(props.token)
        const publicEvents = eventData2.filter((event) => {
          if (
            event.categories.length === 0 ||
            event.categories[0] === "Purple category" ||
            event.categories[0] === "Yellow category"
          ) {
            return event
          }
        })
        let sortedEvents = filterByDate(publicEvents)
        setUsingSnapshot(Boolean(eventData2.isSnapshot))
        setEvents(sortedEvents)
      }
      fetchMyAPI()
    }
  }, [props.token, session])

  return (
    <div className="container">
      {/* List of Events */}
      <section>
        {events.length !== 0 &&
          events
            .sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(a.start.dateTime) - new Date(b.start.dateTime)
            })
            .map((event, i) => {
              if (now && new Date(event.start.dateTime) >= now) {
                return (
                  <WebinarItem
                    key={event.subject + i}
                    event={event}
                    past={false}
                  />
                )
              }
            })}
      </section>
      <section className={`pt-10 pb-10`}>
        <h1 className="text-5xl font-bold pb-4 text-purple">Past Events</h1>
        <Divider />
        <br></br>
        <br></br>
        {events.length !== 0 &&
          events
            .sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(a.start.dateTime) - new Date(b.start.dateTime)
            })
            .reverse()
            .map((event, i) => {
              if (now && new Date(event.start.dateTime) <= now) {
                return (
                  <WebinarItem
                    key={event.subject + i}
                    event={event}
                    past={true}
                  />
                )
              }
            })}
      </section>
      {usingSnapshot && (
        <div className="mb-8 rounded border border-magenta bg-magenta/10 px-4 py-3 text-md text-gray-dark">
          Our full calendar is currently unavailable. This page is currently
          limited to the last {snapshotEventCount} HEAL event
          {snapshotEventCount === 1 ? "" : "s"}. Please check back soon as we
          work to restore full calendar access.
        </div>
      )}
    </div>
  )
}
