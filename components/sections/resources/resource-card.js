import * as React from "react";
import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

export default function ResourceCard({ data }) {
  return (
    <Card square sx={{ width: "300px", marginRight: 5 }} className="mb-10">
      <CardActions className="bg-magenta-light2 text-purple">
        <Typography variant="h6" component="div">
          {data.title}
        </Typography>
        <div style={{ "margin-left": "auto" }}>
          <Button size="small" color="primary" href={data.link}>
            {/* {data.title}{" "} */}
            <DoubleArrowIcon
              style={{ fontSize: "small", marginBottom: "3px" }}
            />
          </Button>
        </div>
      </CardActions>
      <CardActionArea href={data.link}>
        <CardMedia
          component="img"
          image={data.img.url}
          alt={data.img.name}
          sx={{
            height: 100,
          }}
        />
        {/* <CardContent>
          <Typography variant="body2" color="text.secondary">
            {data.blurb}
          </Typography>
        </CardContent> */}
      </CardActionArea>
    </Card>
  );
}
