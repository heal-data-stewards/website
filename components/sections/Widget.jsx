import { ChatTeardropDots } from "phosphor-react"

import { Popover } from "@headlessui/react"
import { WidgetForm } from "./WidgetForm"

export function Widget({ data }) {
  return (
    <Popover
      style={{ right: "-20px", bottom: "106px", zIndex: 100 }}
      className="fixed flex flex-col items-end"
    >
      <Popover.Panel>
        <WidgetForm data={data} />
      </Popover.Panel>

      <Popover.Button
        style={{ transform: "rotate(-90deg)" }}
        className="bg-[#992568] px-3 h-10 text-white flex items-center group"
      >
        {/* <ChatTeardropDots className="w-6 h-6" /> */}
        {data.buttonText}
        {/* <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
          <span className="pl-2"></span>
          {data.buttonText}
        </span> */}
      </Popover.Button>
    </Popover>
  )
}
