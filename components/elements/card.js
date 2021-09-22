import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard() {
  return (
    <Card sx={{ minWidth: 275,margin: "0 0 20px 0", bgcolor: 'primary.dark' }}>
      <CardContent>
        <Typography sx={{fontWeight: "bold", color: "#532565", fontSize: 14 }} color="text.secondary" gutterBottom>
        Wed, 22 - Thu, 23 Sep 2021 • 03:00 AM
        </Typography>
        <Typography variant="h4" component="div" sx={{fontWeight: "bold",color: "#532565",textTransform: "capitalize", cursor: "pointer",'&:hover': {
      color: '#982568',
    }}}>
          Event example title
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="">
          Online
        </Typography>
        <Typography variant="body1">
          Well meaning and kindly.
        </Typography>
      </CardContent>
      <CardActions sx={{ background: "#fcf8fa" }}>
        <Button size="small">Read More</Button>
      </CardActions>
    </Card>
  );
}