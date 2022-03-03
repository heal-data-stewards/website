import React, { useState, useEffect } from "react"
import { useSession, getSession } from "next-auth/client"
import DataTable from "../elements/data-table"
import Router from "next/router"

export default function Directory() {
  const [session, loading] = useSession()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (session) {
      setLoggedIn(true)
    } else {
      Router.push("/account")
    }
  }, [session])

  return (
    <>
      {loggedIn && <DataTable />}
      {!loggedIn && (
        <div className="container">
          <p>Access Denied</p>
          <p>Please Log In</p>
        </div>
      )}
    </>
  )
}
