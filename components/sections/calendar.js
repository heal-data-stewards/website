import React, { useState, useEffect } from "react"
import { useSession, getSession } from "next-auth/client"
import DataTable from "../elements/data-table"
import { hastToReact } from "react-markdown/src/ast-to-react"
import BasicCard from "../elements/card"
import Divider from "@mui/material/Divider"

export default function Calendar({ data }) {
  // const [session, loading] = useSession()
  // const [loggedIn, setLoggedIn] = useState(false)

  // useEffect(() => {
  //   if (session) {
  //     setLoggedIn(true)
  //   }
  // }, [session])
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
        <section >
          <BasicCard />
          <BasicCard />
          <BasicCard />
        </section>
      </div>
    </>
  )
}
