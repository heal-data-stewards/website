import React from "react"
import Divider from "@mui/material/Divider"

// Shown in place of the event listings when the Microsoft Graph credentials
// were missing or expired at build time and ALLOW_BUILD_WITHOUT_CALENDAR let
// the build continue without them.
export default function CalendarUnavailable({ title = "Events" }) {
  return (
    <div className="container pt-10 pb-10">
      <h1 className="text-3xl font-bold pb-4 text-purple">{title}</h1>
      <Divider />
      <p className="text-xl text-gray-dark pt-4">
        Calendar token expired or calendar not configured.
      </p>
      <p className="text-gray-dark pt-2">
        Event listings are temporarily unavailable. Please check back soon.
      </p>
    </div>
  )
}
