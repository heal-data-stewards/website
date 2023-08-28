import { CloseButton } from "../../CloseButton";
import Button from "@mui/material/Button";

export function FeedbackSent({ setRestartFeedback, title, buttonText }) {
  return (
    <>
      <header>
      <span className="text-l mt-2">{title}</span>
        <CloseButton />
      </header>

      <div className="flex flex-col items-center py-10 w-[304px]">
        <Button
          onClick={() => setRestartFeedback(false)}
          type="button"
          variant="contained"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "0.5rem 1rem",
          }}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
}
