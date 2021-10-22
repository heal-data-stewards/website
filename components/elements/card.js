import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function BasicCard({ event }) {
  const date = new Date(Date.parse(event.start.dateTime));
  return (
    <Card sx={{ minWidth: 275, margin: "0 0 20px 0" }}>
      <CardContent>
        <Typography
          sx={{ fontWeight: "bold", color: "#532565", fontSize: 14 }}
          color="text.secondary"
          gutterBottom
        >
          {date.toString().replace(/ *\([^)]*\) */g, "")}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: "bold",
            color: "#532565",
            textTransform: "capitalize",
            cursor: "pointer",
            "&:hover": {
              color: "#982568",
            },
          }}
        >
          <Link href={`/events/${event.id}`}>{event.subject}</Link>
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="">
          {event.location.displayName}
        </Typography>
        <Typography variant="body1">{event.bodyPreview}</Typography>
      </CardContent>
      <CardActions sx={{ background: "#fcf8fa" }}>
        <Button size="small">
          <Link href={`/events/${event.id}`}>Read More</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
