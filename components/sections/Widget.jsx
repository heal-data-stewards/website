import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@material-ui/core"
import { Close as CloseIcon } from "@mui/icons-material"
import { Popover } from "@headlessui/react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  feedbackButton: {
    transform: "rotate(-90deg) translateY(40px)",
    transition: "transform 250ms, background-color 250ms",
    height: "100px",
    display: "flex",
    alignItems: "flex-start",
    "&:hover": {
      transform: "rotate(-90deg) translateY(20px)",
    },
    color: "white",
  },
  feedbackPopup: {
    transform: "translate(-2rem, -1rem)",
  },
}))

export function Widget({ data }) {
  const classes = useStyles()
  return (
    <Popover
      style={{ right: "-1rem", bottom: "106px" }}
      className="fixed flex flex-col items-end"
    >
      <Card component={Popover.Panel} className={classes.feedbackPopup}>
        <CardHeader
          title={data.sendFeedbackText}
          action={
            <Popover.Button
              className="top-5 right-5 absolute text-zinc-400 hover:text-zinc-100"
              title="Close feedback form"
            >
              <CloseIcon />
            </Popover.Button>
          }
        />

        <Divider />

        <CardContent sx={{ justifyContent: "center" }}>
          <Popover.Button
            as={Button}
            href={data.formLink}
            color="primary"
            variant="contained"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 1rem",
              color: "white",
            }}
          >
            {data.sendFeedbackButtonText}
          </Popover.Button>
        </CardContent>
      </Card>

      <Button
        className={classes.feedbackButton}
        component={Popover.Button}
        variant="contained"
        color="primary"
      >
        {data.buttonText}
      </Button>
    </Popover>
  )
}
