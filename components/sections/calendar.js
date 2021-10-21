import React, { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/client";
import DataTable from "../elements/data-table";
import { hastToReact } from "react-markdown/src/ast-to-react";
import BasicCard from "../elements/card";

export default function Calendar({ data, eventData }) {
  // const [events, setEvents] = useState([{}]);
  // const [session, loading] = useSession()
  // const [loggedIn, setLoggedIn] = useState(false)



  return (
    <>
      {/* {loggedIn && <DataTable />} */}
      {/* {!loggedIn && (
        <div className="container">
          <br></br>
          <br></br>
          <p>Access Denied</p>
          <p>Please Log In</p>
        </div>
      )}       */}
      <div className="container pt-10">
        {/* Events List */}
        <section>
          {eventData.map((event,i) => {
            return <BasicCard key={event.subject+i} event={event} />;
          })}
        </section>
      </div>
    </>
  );
}
