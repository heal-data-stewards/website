import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/client"
import BasicCard from "../../elements/event-list-item"
import { filterByDate } from "utils/helper-functions"
import Divider from "@mui/material/Divider"

export default function WebinarBody({ data, eventData }) {
  const [events, setEvents] = useState([])
  const [session, loading] = useSession()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (session) {
      setLoggedIn(true)
      // eventData contains every event in the HEAL calendar, logged in users see every event
      let sortedEvents = filterByDate(eventData)
      setEvents(sortedEvents)
    } else {
      // Events created in the HEAL Calendar created with out a category label are collected in filteredEvents
      // These are the events avaiable to the public
      const filteredEvents = eventData.filter((event) => {
        if (event.categories.length === 0) {
          return event
        } else {
          let check = ""
          event.categories.forEach((element) => {
            if (element === "Purple category") {
              check = true
            }
          })
          return check
        }
      })
      let sortedEvents = filterByDate(filteredEvents)
      setEvents(sortedEvents)
    }
  }, [session, eventData])

  return (
    <div className="container">
      {/* List of Events */}
      <section>
        <h1 className="text-3xl font-black pb-4 text-purple">
          Upcoming Events
        </h1>
        <Divider />
        <p className="text-xl text-gray pt-4">
          See the list below of events supported by the HEAL Stewards.
        </p>
        <br></br>
        <br></br>
        {events.length !== 0 &&
          events.map((event, i) => {
            if (new Date(event.start.dateTime) >= new Date()) {
              return <BasicCard key={event.subject + i} event={event} />
            }
          })}
      </section>
      <section className={`pt-10 pb-10`}>
        <h1 className="text-3xl font-black pb-4 text-purple">Past Events</h1>
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
