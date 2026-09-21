import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import WebinarItem from "./webinar-item"
import { filterByDate } from "utils/helper-functions"
import Divider from "@mui/material/Divider"
import { fetchEvents } from "utils/msft-graph-api"

export default function WebinarBody(props) {
  const [events, setEvents] = useState(filterByDate(props.eventData))
  const { data: session } = useSession()
  const [loggedIn, setLoggedIn] = useState(false)
  const [usingSnapshot, setUsingSnapshot] = useState(
    Boolean(props.eventData?.isSnapshot)
  )

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
            event.categories[0] === "Purple category"
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
  }, [session, props.token])

  return (
    <div className="container">
      {/* List of Events */}
      <section>
        <h1 className="text-3xl font-bold pb-4 text-purple">Upcoming Events</h1>
        <Divider />
        {usingSnapshot && (
          <p className="mt-4 rounded border border-magenta bg-magenta/10 px-4 py-3 text-sm text-gray-dark">
            Live calendar data is temporarily unavailable. Showing the last 15
            HEAL events instead.
          </p>
        )}
        <p className="text-xl text-gray-dark pt-4">
          See the list below of events supported by the HEAL Stewards.
        </p>
        <br></br>
        <br></br>
        {events.length !== 0 &&
          events
            .sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(a.start.dateTime) - new Date(b.start.dateTime)
            })
            .map((event, i) => {
              if (new Date(event.start.dateTime) >= new Date()) {
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
        <h1 className="text-3xl font-bold pb-4 text-purple">Past Events</h1>
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
              if (new Date(event.start.dateTime) <= new Date()) {
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
    </div>
  )
}
