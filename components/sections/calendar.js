import React, { useState, useEffect } from "react"
import { useSession, getSession } from "next-auth/client"
import DataTable from "../elements/data-table"
import { hastToReact } from "react-markdown/src/ast-to-react"
import BasicCard from "../elements/card"

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
        <div className="container pt-10 pb-10">
          {/* Page header section */}
          <section>
            <h1 className="text-5xl font-black pb-8 text-gray-dark">{data.heading}</h1>
            <p className="text-xl text-gray">{data.subheading}</p>
          </section>
          {/* Events List */}
          <section>
            <BasicCard/>
            <BasicCard/>
            <BasicCard/>
          </section>
    </div>
    </>
  )
}
