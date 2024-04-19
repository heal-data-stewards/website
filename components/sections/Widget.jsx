import { Button, Card, CardContent, CardHeader } from "@mui/material"
import { ChatTeardropDots, X } from "phosphor-react"
import { Popover } from "@headlessui/react"

export function Widget({ data }) {
  console.log(data)
  return (
    <Popover
      style={{ right: "-1rem", bottom: "106px", zIndex: 999 }}
      className="fixed flex flex-col items-end"
    >
      <Card
        component={Popover.Panel}
        sx={{
          transform: "translate(-2rem, -1rem)",
        }}
      >
        <CardHeader
          title={data.sendFeedbackText}
          action={
            <Popover.Button
              className="top-5 right-5 absolute text-zinc-400 hover:text-zinc-100"
              title="Close feedback form"
            >
              <X weight="bold" className="w-4 h-4" />
            </Popover.Button>
          }
        ></CardHeader>
        <CardContent
          sx={{
            justifyContent: "center",
          }}
          className="flex py-8 gap-2 w-full"
        >
          <Popover.Button
            as={Button}
            href={data.formLink}
            variant="contained"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 1rem",
            }}
          >
            {data.sendFeedbackButtonText}
          </Popover.Button>
        </CardContent>
      </Card>

      <Button
        component={Popover.Button}
        variant="contained"
        color="primary"
        sx={{
          transform: "rotate(-90deg) translateY(50px)",
          transition: "transform 250ms, background-color 250ms",
          height: "100px",
          display: "flex",
          alignItems: "flex-start",
          "&:hover": {
            transform: "rotate(-90deg) translateY(40px)",
          },
        }}
        className="bg-[#992568] p-3 h-10 text-white"
      >
        {data.buttonText}
      </Button>
    </Popover>
  )
}
