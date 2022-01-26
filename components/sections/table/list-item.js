import * as React from "react"
import ListItem from "@mui/material/ListItem"
import Chip from "@mui/material/Chip"
import Image from "next/image"

export default function WorkingGroupListItem({
  name,
  organization,
  email,
  picture,
}) {
  return (
    <ListItem
      className="working-group-list-item"
      component="a"
      href={`mailto:${" " + email}`}
      target="_blank"
    >
      <div className="">
        <Image
          alt="alt"
          width={75}
          height={75}
          src={
            picture
              ? picture.url
              : "https://heal-community-portal-api.s3.amazonaws.com/blank_profile_picture_973460_1280_a29a12e75d.png"
          }
        />
      </div>
      <h2
        style={{
          color: "#982568",
          padding: "0 16px",
          textTransform: "capitalize",
          fontWeight: "600",
        }}
      >
        {name}
      </h2>
      <Chip label={organization} />
    </ListItem>
  )
}
