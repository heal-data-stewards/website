import React, { useState, useEffect } from "react"
import { useSession, getSession } from "next-auth/client"
import DataTable from "../elements/data-table"

export default function Calendar({ data }) {
  const [session, loading] = useSession()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (session) {
      setLoggedIn(true)
    }
  }, [session])

  return (
    <>
      {loggedIn && <DataTable />}
      {!loggedIn && (
        <div className="container">
          <br></br>
          <br></br>
          <p>Access Denied</p>
          <p>Please Log In</p>
        </div>
      )}
    </>
  )
}
