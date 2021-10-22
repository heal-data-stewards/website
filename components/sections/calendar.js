import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import BasicCard from "../elements/card";

export default function Calendar({ data, eventData }) {
  const [events, setEvents] = useState([]);
  const [session, loading] = useSession();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (session) {
      setLoggedIn(true);
      // eventData contains every event in the HEAL calendar, logged in users see every event
      setEvents(eventData);
    } else {
      // Events created in the HEAL Calendar created with out a category label are collected in filteredEvents
      // These are the events avaiable to the public
      const filteredEvents = eventData.filter((event, i) => {
        return event.categories.length === 0;
      });
      setEvents(filteredEvents);
    }
  }, [session]);

  return (
    <>
      {loggedIn && (
        <div className="container">
          {/* Logged In Events List */}
          <section>
            {events.map((event, i) => {
              return <BasicCard key={event.subject + i} event={event} />;
            })}
          </section>
        </div>
      )}
      {!loggedIn && (
        <div className="container">
          {/* Public Events List */}
          <section>
            {events.length !== 0 &&
              events.map((event, i) => {
                return <BasicCard key={event.subject + i} event={event} />;
              })}
          </section>
        </div>
      )}
    </>
  );
}
