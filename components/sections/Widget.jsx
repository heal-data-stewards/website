import { Button } from "@mui/material"
import { ChatTeardropDots } from "phosphor-react"

import { Popover } from "@headlessui/react"
import { WidgetForm } from "./WidgetForm"

export function Widget({ data }) {
  return (
    <Popover
      style={{ right: "-1rem", bottom: "106px", zIndex: 999 }}
      className="fixed flex flex-col items-end"
    >
      <Popover.Panel>
        <WidgetForm data={data} />
      </Popover.Panel>

      <Button
        component={Popover.Button}
        variant="contained"
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
        {/* <ChatTeardropDots className="w-6 h-6" /> */}
        {data.buttonText}
        {/* <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
          <span className="pl-2"></span>
          {data.buttonText}
        </span> */}
      </Button>
    </Popover>
  )
}
