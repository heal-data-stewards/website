import { ChatTeardropDots } from "phosphor-react"

import { Popover } from "@headlessui/react"
import { WidgetForm } from "./WidgetForm"

export function Widget({ data }) {
  return (
    <Popover
      style={{ right: "0", marginRight: "20px", bottom: "20px", zIndex: 100 }}
      className="fixed flex flex-col items-end"
    >
      <Popover.Panel>
        <WidgetForm data={data} />
      </Popover.Panel>

      <Popover.Button className="bg-[#992568] rounded-full px-3 h-12 text-white flex items-center group">
        <ChatTeardropDots className="w-6 h-6" />

        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
          <span className="pl-2"></span>
          {data.buttonText}
        </span>
      </Popover.Button>
    </Popover>
  )
}
