import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/client"
import BasicCard from "../elements/event-list-item"
import { filterByDate } from "utils/helper-functions"
import Divider from "@mui/material/Divider"
import { getAuthorizationToken } from "utils/msft-graph-api"

export default function Calendar({ data, eventData }) {
  const [events, setEvents] = useState([])
  const [session, loading] = useSession()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    async function fetchMyAPI() {
      let eventData2 = await getAuthorizationToken()
      console.log(eventData2)
      // dataSet(eventData2)
    }
    fetchMyAPI()
    if (session) {
      setLoggedIn(true)
      // eventData contains every event in the HEAL calendar, logged in users see every event
      let sortedEvents = filterByDate(eventData)
      setEvents(sortedEvents)
    } else {
      // Events created in the HEAL Calendar with out a category label are collected in filteredEvents
      // These are the events avaiable to the public
      const publicEvents = eventData.filter((event) => {
        if (event.categories.length === 0) {
          return event
        }
      })
      let sortedEvents = filterByDate(publicEvents)
      setEvents(sortedEvents)
    }
  }, [session, eventData])

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
