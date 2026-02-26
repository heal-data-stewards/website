import { cloneElement } from "react"

export function Empty({ icon, text, description, height = "h-56" }) {
  return (
    <div
      className={`${height} flex flex-col items-center justify-center text-center p-4`}
    >
      <span className="text-gray-300">
        {icon &&
          cloneElement(icon, {
            sx: {
              fontSize: 48,
              mb: 1,
              ...icon.props.sx,
            },
          })}
      </span>
      <p className="text-gray-500 font-medium">{text}</p>
      {description && (
        <p className="text-gray-400 text-sm mt-1 max-w-xs">{description}</p>
      )}
    </div>
  )
}
