import * as React from "react"
import Typography from "@mui/material/Typography"
// import Link from "next/link";
import Image from "next/image"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import Markdown from "../../elements/markdown"

export default function PublicWorkingGroupListItem({
  name,
  organization,
  //   email,
  picture,
  bio,
  linkedin,
}) {
  return (
    <div className="basic-card-container public-members-card">
      <div className="members-basic-card-content">
        <div className="members-event-img">
          <Image
            alt="Collective board member picture"
            width={100}
            height={100}
            src={picture.url}
          />
        </div>
        <div className="members-card-blurb">
          <Typography
            sx={{ fontWeight: "bold", color: "#532565", fontSize: 28 }}
            color="text.secondary"
          >
            {name}
          </Typography>
          <Typography
            gutterBottom
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#532565",
            }}
          >
            {organization}
          </Typography>
          <div className="public-member-bio">
            <Markdown>{bio}</Markdown>
          </div>
        </div>
      </div>
      {linkedin && (
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            padding: "0 25px 0 0",
            marginTop: "-18px",
            color: "#532565",
          }}
        >
          <a
            target="_blank"
            href={linkedin}
            style={{ zIndex: 2 }}
            rel="noreferrer"
          >
            <LinkedInIcon
              sx={{
                fontSize: 40,
                cursor: "pointer",
                "&:hover": {
                  color: "#982568",
                },
              }}
            />
          </a>
        </div>
      )}
    </div>
  )
}
