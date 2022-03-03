import React, { useState, useEffect } from "react"
import { useSession, getSession } from "next-auth/client"
import ResourceCard from "./resource-card"

export default function ResourceCards(data) {
  const [session, loading] = useSession()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (session) {
      setLoggedIn(true)
    }
  }, [session])

  return (
    <>
      {loggedIn && (
        <div className="container">
          <section className="flex flex-wrap">
            {data.data.resource_card.map((card, i) => {
              return <ResourceCard key={i + "key"} data={card} />
            })}
          </section>
        </div>
      )}
    </>
  )
}
