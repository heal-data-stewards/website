import { CloseButton } from "../../CloseButton"
import Button from "@mui/material/Button"

export function SendFeedback({ setFeedbackSent, feedback, title }) {
  return (
    <>
      <header>
        <CloseButton />
        <span className="text-l leading-6 mr-6">{title}</span>
      </header>

      <div className="flex py-8 gap-2 w-full">
        <Button
          onClick={() => setFeedbackSent()}
          type="button"
          variant="contained"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "0.5rem 1rem",
          }}
        >
          <span>{feedback}</span>
        </Button>
      </div>
    </>
  )
}
