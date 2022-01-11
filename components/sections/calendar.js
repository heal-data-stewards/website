import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/client"
import BasicCard from "../elements/event-list-item"
import { filterByDate } from "utils/helper-functions"
import Divider from "@mui/material/Divider"
import { getAuthorizationToken2 } from "utils/msft-graph-api"

export default function Calendar(props) {
  const [events, setEvents] = useState(filterByDate(props.eventData))
  const [session, loading] = useSession()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (session) {
      setLoggedIn(true)
      // eventData contains every event in the HEAL calendar, logged in users see every event
      async function fetchMyAPI() {
        let eventData2 = await getAuthorizationToken2(props.token)
        let sortedEvents = filterByDate(eventData2)
        setEvents(sortedEvents)
      }
      fetchMyAPI()
    } else {
      // Events created in the HEAL Calendar with out a category label are collected in filteredEvents
      // These are the events avaiable to the public
      async function fetchMyAPI() {
        let eventData2 = await getAuthorizationToken2(props.token)
        const publicEvents = eventData2.filter((event) => {
          if (
            event.categories.length === 0 ||
            event.categories[0] === "Purple category"
          ) {
            return event
          }
        })
        let sortedEvents = filterByDate(publicEvents)
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
          events.map((event, i) => {
            if (new Date(event.start.dateTime) >= new Date()) {
              return <BasicCard key={event.subject + i} event={event} />
            }
          })}
      </section>
      <section className={`pt-10 pb-10`}>
        <h1 className="text-5xl font-black pb-4 text-purple">Past Events</h1>
        <Divider />
        <br></br>
        <br></br>
        {events.length !== 0 &&
          events.map((event, i) => {
            if (new Date(event.start.dateTime) <= new Date()) {
              return <BasicCard key={event.subject + i} event={event} />
            }
          })}
      </section>
    </div>
  )
}
